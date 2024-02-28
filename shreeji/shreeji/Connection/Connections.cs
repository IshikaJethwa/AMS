using System.Configuration;

namespace shreeji.Connection
{
    public static class Connections
    {
        public static string connection = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
    }

}