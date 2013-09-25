using SpaceInvadersMultiplayer.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpaceInvadersMultiplayer.Controllers
{
    public class GamesController : Controller
    {
        SpaceInvadersEntities ctx = new SpaceInvadersEntities();

        //
        // GET: /Games/
        public ActionResult Index()
        {
            var games = ctx.Games.ToList();
            return View(games);
        }

        //
        // GET: /Games/Details/gameId
        [ActionName("Details")]
        public ActionResult GetGameDetails(int id)
        {
            int emptyGamesCount = ctx.GameRooms.Where(g => g.Status == RoomStatus.Empty).Count();
            if (emptyGamesCount == 0)
            {
                ctx.GameRooms.Add(new GameRoom()
                {
                    Status = RoomStatus.Empty,
                });
                ctx.SaveChanges();
            }
            
            var openGames = ctx.GameRooms.Where(g => g.Status == RoomStatus.Waiting ||
                                                     g.Status == RoomStatus.Empty);

            return View(openGames);
        }

        //
        // GET: /Games/SpaceInvaders
        [ActionName("SpaceInvaders")]
        public ActionResult GetSpaceInvaders(int id)
        {
            var gameRoom = ctx.GameRooms.FirstOrDefault(r => r.Id == id);

            return View(gameRoom);
        }
	}
}