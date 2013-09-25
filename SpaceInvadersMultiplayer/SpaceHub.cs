using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SpaceInvadersMultiplayer.DbModels;
using SpaceInvadersMultiplayer.Models;

namespace SpaceInvadersMultiplayer
{
    public class SpaceHub : Hub
    {
        public void SendShip(PlayerShip obj, int roomId)
        {
            SpaceInvadersEntities ctx = new SpaceInvadersEntities();
            var room = ctx.GameRooms.FirstOrDefault(r => r.Id == roomId);
            bool shouldStartGame = false;

            if (room != null)
            {
                if (room.Player1Id == null || room.Player1Id.Length == 0)
                {
                    room.Player1Id = obj.id;
                }
                else
                {
                    room.Player2Id = obj.id;
                    shouldStartGame = true;
                }

                ctx.SaveChanges();
            }

            if (shouldStartGame)
            {
                // Start game
                Clients.All.startGame();
            }

            // Call the broadcastMessage method to update clients.
            //Clients.All.toAllRegisterShip(obj);
            Clients.Others.toAllRegisterShip(obj);

            if (!shouldStartGame)
            {
                Clients.Caller.makeMainPlayer();
            }
        }

        public void RefreshShip(object obj)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.refreshShipPosition(obj);
        }

        public void RefreshInvaders(object obj, int roomId, string playerId)
        {
            SpaceInvadersEntities ctx = new SpaceInvadersEntities();
            var room = ctx.GameRooms.FirstOrDefault(r => r.Id == roomId);

            if (room != null)
            {
                if (room.Player1Id == playerId)
                {
                    // Call the broadcastMessage method to update clients.
                    Clients.Others.refreshInvadersPosition(obj);
                }
            }
            
        }

        public void FireBullet(object obj)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.fireBulletAll(obj);
        }

        public void JoinGame(int gameId)
        {
            SpaceInvadersEntities ctx = new SpaceInvadersEntities();
            var game = ctx.GameRooms.FirstOrDefault(g => g.Id == gameId);

            // Call the broadcastMessage method to update clients.
            Clients.All.joinGameAll(game);
        }
    }
}