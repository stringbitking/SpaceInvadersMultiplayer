using System.Web;
using System.Web.Mvc;

namespace SpaceInvadersMultiplayer
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
