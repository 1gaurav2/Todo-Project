using Microsoft.EntityFrameworkCore;

namespace ToDoProject.Models
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options):base(options)
        {
            
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
