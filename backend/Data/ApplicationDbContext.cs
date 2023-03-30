using Microsoft.EntityFrameworkCore;
using backend.Data.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(): base()
        {
        }

        public ApplicationDbContext(DbContextOptions options) : base(options) 
        { 
        }

        public DbSet<Employee> Employees => Set<Employee>();

        public DbSet<Job> Jobs => Set<Job>();

        public DbSet<Assignment> Assignments => Set<Assignment>();

        public DbSet<Project> Projects => Set<Project>();

    }
}
