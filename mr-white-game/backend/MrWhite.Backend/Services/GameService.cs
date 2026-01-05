using System.Collections.Concurrent;
using MrWhite.Backend.Entity;

namespace MrWhite.Backend.Services;

public class GameService
{
    // key: room code
    // value: GameRoom object
    public ConcurrentDictionary<string, GameRoom> Rooms { get; } = new();

    // key: ConnectionId
    // value: room code
    public ConcurrentDictionary<string, string> Users { get; } = new();
}
