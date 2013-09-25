using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpaceInvadersMultiplayer.DbModels
{
    public class Invader
    {
        public string Id { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public virtual GameRoom Room { get; set; }
    }
}