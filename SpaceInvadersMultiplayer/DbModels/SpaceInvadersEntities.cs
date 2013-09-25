using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace SpaceInvadersMultiplayer.DbModels
{
    public class SpaceInvadersEntities: DbContext
    {
        public SpaceInvadersEntities()
            : base("DefaultConnection")
        {
            
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<GameRoom> GameRooms { get; set; }
        public DbSet<Invader> Invaders { get; set; }
    }
}