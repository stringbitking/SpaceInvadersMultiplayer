using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SpaceInvaders.Services
{
    public class SpaceHub : Hub
    {
        public void SendShip(object obj)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.toAllRegisterShip(obj);
        }

        public void RefreshShip(object obj)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.refreshShipPosition(obj);
        }

        public void FireBullet(object obj)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.fireBulletAll(obj);
        }
    }
}