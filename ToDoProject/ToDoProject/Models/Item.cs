using System.ComponentModel.DataAnnotations;

namespace ToDoProject.Models
{
    public class Item
    {
        public int ItemId { get; set; }
        public int UserId { get; set; }

        [Required]
        public string? ItemName { get; set; }

        [Required]
        public string? Description { get; set; }

        public string? Priority { get; set; }
        public string? Type { get; set; }


        public DateTime Created { get; set; }
        = DateTime.Now;
        public DateTime Updated { get; set; }
        = DateTime.Now;
    }
}
