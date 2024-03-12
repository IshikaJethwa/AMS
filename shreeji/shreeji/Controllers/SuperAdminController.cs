using shreeji.Models;
using shreeji.Service;
using System;
using System.Collections.Generic;
using System.Web.Http;

public class SuperAdminController : ApiController
{
    private readonly AdminService _adminService;


    public SuperAdminController()
    {
        // Initialize your services or other dependencies here
        _adminService = new AdminService();
    }

    [HttpGet]
    [Route("api/SuperAdmin/Admin")]
    public IEnumerable<Admin> GetAdmins()
    {

        // Use connection for querying admins
        return _adminService.GetAllAdmins();

    }

    [HttpGet]
    [Route("api/SuperAdmin/Admin/{id}")]
    public IHttpActionResult GetAdmin(int id)
    {


        var admin = _adminService.GetAdminById(id);

        if (admin == null)
        {
            return NotFound();
        }

        return Ok(admin);

    }

    [HttpPost]
    [Route("api/SuperAdmin/Admin")]
    public IHttpActionResult PostAdmin([FromBody] Admin admin)
    {
        try
        {
            _adminService.AddAdmin(admin);
            return Ok("Added");
        }
        catch (InvalidOperationException ex)
        {
            // Handle the duplicate entry error
            return BadRequest("Error: Duplicate entry. The username is already taken.");
        }
        catch (Exception ex)
        {
            // Handle other exceptions if needed
            return InternalServerError(ex);
        }
    }

    [HttpPut]
    [Route("api/SuperAdmin/Admin/{id}")]
    public IHttpActionResult PutAdmin(int id , [FromBody] Admin admin)
    {

        _adminService.UpdateAdmin(id ,admin);


        return Ok("updated");
    }

    [HttpDelete]
    [Route("api/SuperAdmin/Admin/{id}")]
    public IHttpActionResult DeleteAdmin(int id)
    {

        var admin = _adminService.GetAdminById(id);

        if (admin == null)
        {
            return NotFound();
        }

        _adminService.DeleteAdmin(id);

        return Ok("Deleted");

    }

    [HttpPut]
    [Route("api/SuperAdmin/Admin/ChangePassword/{id}")]
    public IHttpActionResult ChangePassword(int id, [FromBody] ChangePasswordRequest request)
    {
       

        // Call the ChangePassword method from AdminService
        bool passwordChanged = _adminService.ChangePassword(id, request.CurrentPassword, request.NewPassword);

        if (passwordChanged)
        {
            return Ok("Password changed successfully");
        }
        else
        {
            return BadRequest("Incorrect current password");
        }
    }

}
