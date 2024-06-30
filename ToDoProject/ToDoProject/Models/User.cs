using System.ComponentModel.DataAnnotations;

namespace ToDoProject.Models
{
    public class User
    {
        public int UserId { get; set; }

        [Required]
        public string? UserName { get; set; }

        [Required]
        public string? Password { get; set; }

        public string? Email { get; set; }

        public DateTime Created { get; set; }
        = DateTime.Now;
        public DateTime Updated { get; set; }
        = DateTime.Now;

        public int MobileNo { get; set; }
    }
}
