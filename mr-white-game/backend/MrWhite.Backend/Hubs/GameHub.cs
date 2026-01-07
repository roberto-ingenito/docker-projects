using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using MrWhite.Backend.Entity;
using MrWhite.Backend.Services;

namespace MrWhite.Backend.Hubs;

public class GameHub(GameService gameService, WordService wordService) : Hub
{
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        string connectionId = Context.ConnectionId;

        // 1. Troviamo in che stanza era l'utente
        if (gameService.Users.TryRemove(connectionId, out string? roomCode))
        {
            // 2. Recuperiamo la stanza
            if (gameService.Rooms.TryGetValue(roomCode, out var gameRoom))
            {
                // 3. Rimuoviamo il giocatore dalla stanza
                gameRoom.Players.TryRemove(connectionId, out Player? removedPlayer);

                // 4. Se la stanza è vuota, la eliminiamo dal server
                if (gameRoom.Players.IsEmpty)
                {
                    gameService.Rooms.TryRemove(roomCode, out _);
                }
                else
                {
                    // Notifichiamo gli altri che l'utente è uscito
                    await Clients.Group(roomCode).SendAsync("UserLeft", connectionId);

                    if (removedPlayer != null && removedPlayer.IsHost)
                    {
                        Player newHost = gameRoom.Players.First().Value;
                        newHost.IsHost = true;

                        await Clients.Group(roomCode).SendAsync("HostChanged", newHost.ConnectionId);
                    }
                }
            }
        }
        await base.OnDisconnectedAsync(exception);
    }

    public override Task OnConnectedAsync()
    {
        Clients.Caller.SendAsync("Connected", Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public async Task JoinRoom(string roomCode, string userName)
    {
        Player player = new() { ConnectionId = Context.ConnectionId, Name = userName };

        // controlla se la stanza esiste
        if (!gameService.Rooms.TryGetValue(roomCode, out var gameRoom))
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "no-room-found");
            return;
        }

        // controlla se è già iniziata la partita
        if (gameRoom.GamePhase != GamePhase.Lobby && gameRoom.GamePhase != GamePhase.EndGame)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "game-already-started");
            return;
        }

        // controlla se l'utente è già in un'altra partita
        if (!gameService.Users.TryAdd(Context.ConnectionId, roomCode))
        {
            gameService.Users.TryGetValue(Context.ConnectionId, out var otherGameRoomCode);

            await Clients.Caller.SendAsync("ReceiveMessage", "already-in-a-game", otherGameRoomCode ?? "N/A");
            return;
        }

        // aggiunge il nuovo giocatore alla partita
        gameRoom.Players.TryAdd(Context.ConnectionId, player);

        await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);
        await Clients.OthersInGroup(roomCode).SendAsync("UserJoined", player);
        await Clients.Caller.SendAsync("JoinedGameRoom", gameRoom);
    }

    public async Task CreateRoom(string userName)
    {
        bool userAlreadyExists = gameService.Users.TryGetValue(Context.ConnectionId, out var existingRoomCode);
        if (userAlreadyExists)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "already-in-a-game", existingRoomCode);
            return;
        }

        char[] charset = "0123456789".ToCharArray();
        string roomCode;
        bool roomCreated;

        Player hostPlayer = new()
        {
            ConnectionId = Context.ConnectionId,
            Name = userName,
            IsHost = true,
        };
        GameRoom gameRoom = new() { RoomCode = "", Players = [] };
        gameRoom.Players.TryAdd(Context.ConnectionId, hostPlayer); // aggiunge il giocatore alla stanza appena creata

        // trova un codice valido per la nuova stanza
        do
        {
            roomCode = new(RandomNumberGenerator.GetItems(charset, 4));
            gameRoom.RoomCode = roomCode;

            roomCreated = gameService.Rooms.TryAdd(roomCode, gameRoom);
        } while (!roomCreated);

        gameService.Users.TryAdd(Context.ConnectionId, roomCode);

        await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);

        await Clients.Caller.SendAsync("RoomCreated", gameRoom);
    }

    public async Task StartGame(string roomCode, List<string> categories)
    {
        var gameRoom = await Check(roomCode);

        if (gameRoom == null)
            return;

        // controlla se la partita è già iniziata
        if (gameRoom.GamePhase != GamePhase.Lobby && gameRoom.GamePhase != GamePhase.EndGame)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "game-already-started");
            return;
        }

        // Parola da indovinare
        gameRoom.Word = wordService.GetRandomWord(categories);

        // Pulisce i voti fatti nella partita precedente
        gameRoom.Voting.Clear();

        // Assegnazione Ruoli
        var players = gameRoom.Players.Values.ToList();
        int randomIndex = Random.Shared.Next(players.Count);

        for (int i = 0; i < players.Count; i++)
        {
            players[i].Role = (i == randomIndex) ? PlayerRole.MrWhite : PlayerRole.Civilian;
            players[i].IsAlive = true;
        }

        gameRoom.GamePhase = GamePhase.RoleAssignment;

        await Clients.Group(roomCode).SendAsync("GamePhaseChanged", gameRoom.GamePhase);
        await Clients.Group(roomCode).SendAsync("ReceiveRole", gameRoom);
    }

    public async Task StartTalking(string roomCode)
    {
        var gameRoom = await Check(roomCode);

        if (gameRoom == null)
            return;

        // controlla se la partita è in fase di RoleAssignment
        if (gameRoom.GamePhase != GamePhase.RoleAssignment)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "game-phase-must-be-RoleAssignment");
            return;
        }

        gameRoom.GamePhase = GamePhase.Talking;

        await Clients.Group(roomCode).SendAsync("GamePhaseChanged", gameRoom.GamePhase);
    }

    public async Task StartVoting(string roomCode)
    {
        var gameRoom = await Check(roomCode);

        if (gameRoom == null)
            return;

        // controlla se la partita è in fase di talking oppure di revelation
        if (gameRoom.GamePhase != GamePhase.Talking && gameRoom.GamePhase != GamePhase.Revelation)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "game-phase-must-be-Talking-or-Revelation");
            return;
        }

        // RESET dei voti quando inizia la fase di votazione
        gameRoom.Voting.Clear();

        gameRoom.GamePhase = GamePhase.Voting;

        await Clients.Group(roomCode).SendAsync("GamePhaseChanged", gameRoom.GamePhase);
    }

    public async Task Vote(string roomCode, string votedConnectionId)
    {
        var gameRoom = await Check(roomCode: roomCode, isHostOperation: false);

        if (gameRoom == null)
            return;

        // controlla se la partita è in fase di RoleAssignment
        if (gameRoom.GamePhase != GamePhase.Voting)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "game-phase-must-be-Voting");
            return;
        }

        // controlla se sei ancora in vita
        if (!gameRoom.Players[Context.ConnectionId].IsAlive)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "you-are-dead");
            return;
        }

        // controlla se hai già votato
        if (gameRoom.Voting.ContainsKey(Context.ConnectionId))
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "you-have-already-voted");
            return;
        }

        // Controlla se il bersaglio del voto esiste ed è vivo
        if (!gameRoom.Players.TryGetValue(votedConnectionId, out var targetPlayer) || !targetPlayer.IsAlive)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "cannot-vote-dead-or-nonexistent-player");
            return;
        }

        // registra il voto
        gameRoom.Voting.TryAdd(Context.ConnectionId, votedConnectionId);

        // Notifica che un voto è stato aggiunto (per aggiornare i contatori)
        await Clients.Group(roomCode).SendAsync("PlayerVoted", new { voter = Context.ConnectionId, voted = votedConnectionId });
    }

    public async Task StartRevelation(string roomCode)
    {
        var gameRoom = await Check(roomCode);
        if (gameRoom == null)
            return;

        if (gameRoom.GamePhase != GamePhase.Voting)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "game-phase-must-be-Voting");
            return;
        }

        // Controlla che tutti i giocatori in vita abbiano votato
        int aliveCount = gameRoom.Players.Count(p => p.Value.IsAlive);
        if (gameRoom.Voting.Count < aliveCount)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "not-everyone-has-voted");
            return;
        }

        // Calcolo del più votato
        string mostVotedId = gameRoom.Voting.Values.GroupBy(id => id).OrderByDescending(g => g.Count()).Select(g => g.Key).First();

        if (gameRoom.Players.TryGetValue(mostVotedId, out var eliminatedPlayer))
        {
            eliminatedPlayer.IsAlive = false;

            // Notifica eliminazione
            await Clients.Group(roomCode).SendAsync("PlayerEliminated", eliminatedPlayer.ConnectionId);

            // CONTROLLO VITTORIA
            if (eliminatedPlayer.Role == PlayerRole.MrWhite)
            {
                gameRoom.GamePhase = GamePhase.EndGame;
                await Clients.Group(roomCode).SendAsync("WinnerIs", PlayerRole.Civilian);
            }
            else if (gameRoom.Players.Count(p => p.Value.IsAlive) <= 2)
            {
                gameRoom.GamePhase = GamePhase.EndGame;
                await Clients.Group(roomCode).SendAsync("WinnerIs", PlayerRole.MrWhite);
            }
            else
            {
                // Il gioco continua -> Fase Revelation
                // Qui mostriamo chi è morto, l'host dovrà poi premere "Nuova Votazione" (StartVoting)
                gameRoom.GamePhase = GamePhase.Revelation;
                await Clients.Group(roomCode).SendAsync("GamePhaseChanged", gameRoom.GamePhase);
            }
        }
    }

    private async Task<GameRoom?> Check(string roomCode, bool isHostOperation = true)
    {
        // controlla se la stanza esiste
        if (!gameService.Rooms.TryGetValue(roomCode, out var gameRoom))
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "room-not-exists");
            return null;
        }

        // controlla se l'utente è un giocatore di questa stanza
        if (!gameRoom.Players.TryGetValue(Context.ConnectionId, out var player))
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "user-not-exists");
            return null;
        }

        // controlla se il giocatore è l'host della partita
        if (isHostOperation && !player.IsHost)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "you-are-not-the-host");
            return null;
        }

        // controlla se ci sono abbastanza giocatori
        if (gameRoom.Players.Count < 3)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", "there-are-less-then-three-players");
            return null;
        }

        return gameRoom;
    }
}
