using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Fb_Information> Fb_Informations { get; set; }
        public DbSet<TestDataResult> DatabaseTestApp { get; set; }
    }
}