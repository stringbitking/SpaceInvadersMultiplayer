using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpaceInvadersMultiplayer.DbModels
{
    public enum RoomStatus
    {
        Waiting = 0,
        Active = 1,
        Finished = 2,
        Empty = 3
    }

    public class GameRoom
    {
        public int Id { get; set; }
        public RoomStatus Status { get; set; }
        public string Player1Id { get; set; }
        public string Player2Id { get; set; }
        public virtual ICollection<Invader> Invaders { get; set; }

        public GameRoom()
        {
            this.Invaders = new HashSet<Invader>();
        }
    }
}