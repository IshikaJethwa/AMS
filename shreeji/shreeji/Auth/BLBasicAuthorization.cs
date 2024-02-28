using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace EmployeeService.Auth
{
    
    public class BLBasicAuthorization : AuthorizeAttribute
    {
        /// <summary>
        /// Handles unauthorized requests by checking if the user is authenticated.
        /// If authenticated, calls the base implementation; otherwise, returns a Forbidden response.
        /// </summary>
        /// <param name="actionContext">The context for the HTTP action.</param>
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            // Check if the user is authenticated
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                // Call the base implementation for unauthorized requests when the user is authenticated
                base.HandleUnauthorizedRequest(actionContext);
            }
            else
            {
                // Set Forbidden response when the user is not authenticated
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Forbidden);
            }
        }
    }
}