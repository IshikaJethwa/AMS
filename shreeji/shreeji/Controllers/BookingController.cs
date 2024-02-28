//using shreeji.Connection;
//using shreeji.Models;
//using shreeji.Service;
//using System.Collections.Generic;
//using System.Net;
//using System.Web.Http;

//namespace shreeji.Controllers
//{
//    public class BookingController : ApiController
//    {
//        private readonly BookingService _bookingService;

//        public BookingController()
//        {
//            _bookingService = new BookingService(Connections.connection);
//        }

//        [HttpGet]
//        [Route("api/Booking")]
//        public IEnumerable<Booking> GetBookings()
//        {
//            return _bookingService.GetAllBookings();
//        }

//        [HttpGet]
//        [Route("api/Booking/{id}")]
//        public IHttpActionResult GetBooking(int id)
//        {
//            var booking = _bookingService.GetBookingById(id);

//            if (booking == null)
//            {
//                return NotFound();
//            }

//            return Ok(booking);
//        }

//        [HttpPost]
//        [Route("api/Booking")]
//        public IHttpActionResult PostBooking([FromBody] Booking booking)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            _bookingService.AddBooking(booking);

//            return CreatedAtRoute("DefaultApi", new { controller = "Booking", id = booking.BookingID }, booking);
//        }

//        [HttpPut]
//        [Route("api/Booking/{id}")]
//        public IHttpActionResult PutBooking(int id, [FromBody] Booking booking)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            if (id != booking.BookingID)
//            {
//                return BadRequest();
//            }

//            _bookingService.UpdateBooking(booking);

//            return StatusCode(HttpStatusCode.NoContent);
//        }

//        [HttpDelete]
//        [Route("api/Booking/{id}")]
//        public IHttpActionResult DeleteBooking(int id)
//        {
//            var booking = _bookingService.GetBookingById(id);

//            if (booking == null)
//            {
//                return NotFound();
//            }

//            _bookingService.DeleteBooking(id);

//            return Ok(booking);
//        }
//    }
//}
