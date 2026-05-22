using Microsoft.AspNetCore.SignalR;

namespace WarehouseApi.Hubs;

public class WarehouseHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}
