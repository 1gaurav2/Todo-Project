using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoProject.Models;

namespace ToDoProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDBContext _dbContext;

        public UserController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(User user)
        {
            if (ModelState.IsValid)
            {
                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "User registered successfully" });
            }
            return BadRequest(ModelState);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await _dbContext.Users
                .Where(u => u.Email == email && u.Password == password)
                .FirstOrDefaultAsync();

            if (user != null)
            {
                return Ok(new { message = "Login successful", user });
            }
            return Unauthorized(new { message = "Invalid credentials" });
        }

    }
}
