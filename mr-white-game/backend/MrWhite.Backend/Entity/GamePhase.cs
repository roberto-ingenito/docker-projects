namespace MrWhite.Backend.Entity;

public enum GamePhase
{
    Lobby, // I giocatori stanno entrando nella stanza. Poi l'host avvia la partita
    RoleAssignment, // Ai giocatori viene assegnato un ruolo (Civilian o Mr.White). Poi l'host avvia il round.
    Talking, // I giocatori, a turno, dicono la parola indizio. Poi l'host avvia la votazione.
    Voting, // I giocatori votano chi eliminare. Poi l'host conferma la votazione

    // Si rivela se il giocatore eliminato fosse o meno Mr.White:
    // se è stato eliminato un civile, il gioco passa di nuovo alla fase di votazione
    // finchè non rimangono solo due giocatori (in questso caso, il gioco termina e vince Mr.White)
    // Poi l'host conferma di voler continuare (votazione o end-game)
    Revelation,

    EndGame,
}
