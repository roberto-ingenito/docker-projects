namespace MrWhite.Backend.Entity;

public class Player
{
    public required string ConnectionId { get; set; } // ID univoco di SignalR
    public required string Name { get; set; }
    public PlayerRole Role { get; set; } = PlayerRole.Civilian;
    public bool IsAlive { get; set; } = true;
    public bool IsHost { get; set; } = false;
}
