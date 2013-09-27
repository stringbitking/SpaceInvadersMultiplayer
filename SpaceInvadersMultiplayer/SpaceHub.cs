using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SpaceInvadersMultiplayer.DbModels;
using SpaceInvadersMultiplayer.Models;
using System.Threading.Tasks;

namespace SpaceInvadersMultiplayer
{
    public class SpaceHub : Hub
    {
        public async Task JoinRoom(string roomName)
        {
            await Groups.Add(Context.ConnectionId, roomName);
            Clients.Group(roomName).addChatMessage(Context.User.Identity.Name + " joined.");
        }

        public void JoinGameRoom(int roomId)
        {
            var taskResult = JoinRoom("room" + roomId);
            taskResult.Wait();
        }

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
                    room.Status = RoomStatus.Waiting;
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
                room.Status = RoomStatus.Active;
                ctx.SaveChanges();
                Clients.Group("room" + roomId).startGame();
            }

            // Call the broadcastMessage method to update clients.
            //Clients.Others.toAllRegisterShip(obj);
            Clients.Group("room" + roomId, Context.ConnectionId).toAllRegisterShip(obj);

            if (!shouldStartGame)
            {
                Clients.Caller.makeMainPlayer();
            }
        }

        public void RefreshShip(object obj, int roomId)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Group("room" + roomId, Context.ConnectionId).refreshShipPosition(obj);
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
                    Clients.Group("room" + roomId, Context.ConnectionId).refreshInvadersPosition(obj);
                }
            }
            
        }

        public void FireBullet(object obj, int roomId)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Group("room" + roomId, Context.ConnectionId).fireBulletAll(obj);
        }

        public void FireProjectile(object obj, int roomId)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Group("room" + roomId, Context.ConnectionId).fireProjectileAll(obj);
        }
    }
}