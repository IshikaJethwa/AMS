using EmployeeService;
using shreeji.Models;
using System.Web.Http;

namespace shreeji.Controllers
{
    public class LoginController : ApiController
    {
        [HttpPost]
        public bool isLogin([FromBody] Login objrole)
        {
           
            return BLValidateUSer.isLogin(objrole.role, objrole.username, objrole.password);
        }
        [HttpPost]
        [Route("api/getUser")]
        public dynamic GetList([FromBody] Login objrole)
        {
            return BLValidateUSer.GetList(objrole.role, objrole.username, objrole.password);
        }
    }
}
