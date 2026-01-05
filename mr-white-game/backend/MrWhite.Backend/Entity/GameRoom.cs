using System.Collections.Concurrent;

namespace MrWhite.Backend.Entity;

public class GameRoom
{
    public required string RoomCode { get; set; }

    // key: ConnectionId
    // value: Player object
    public ConcurrentDictionary<string, Player> Players { get; set; } = [];

    // key: ConnectionId
    // value: voted ConnectionId
    public ConcurrentDictionary<string, string> Voting { get; set; } = [];

    public GamePhase GamePhase { get; set; } = GamePhase.Lobby;
    public string Word { get; set; } = null!;
}
