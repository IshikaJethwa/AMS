using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using shreeji.Models; // Assuming the Visitors model is in a "Models" namespace
using shreeji.Service;

namespace shreeji.Controllers
{
    public class VisitorController : ApiController
    {
        private readonly VisitorService _visitorService;

        public VisitorController()
        {
            // Initialize your actual VisitorService here
            _visitorService = new VisitorService(); // Replace with your actual service instantiation
        }

        // GET: api/visitors
        public IHttpActionResult Get()
        {
            try
            {
                var visitors = _visitorService.GetAllVisitors();
                return Ok(visitors);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // GET: api/visitors/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                var visitor = _visitorService.GetVisitorById(id);

                if (visitor == null)
                    return NotFound();

                return Ok(visitor);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST: api/visitors
        public IHttpActionResult Post([FromBody] Visitors visitor)
        {
            try
            {
                _visitorService.AddVisitor(visitor);
                return CreatedAtRoute("DefaultApi", new { id = visitor.VisitorID }, visitor);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // PUT: api/visitors/5
        public IHttpActionResult Put(int id, [FromBody] Visitors visitor)
        {
            try
            {
                var existingVisitor = _visitorService.GetVisitorById(id);

                if (existingVisitor == null)
                    return NotFound();

                _visitorService.UpdateVisitor(id,visitor);
                return StatusCode(HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE: api/visitors/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var existingVisitor = _visitorService.GetVisitorById(id);

                if (existingVisitor == null)
                    return NotFound();

                _visitorService.DeleteVisitor(id);
                return StatusCode(HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
