using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SpaceInvaders.Services.Controllers
{
    public class ShipsController : ApiController
    {
        // GET api/<controller>
        [ActionName("register")]
        public string Get()
        {
            return Guid.NewGuid().ToString();
        }

    }
}