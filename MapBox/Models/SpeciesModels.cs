namespace MapBox.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class SpeciesModels : DbContext
    {
        public SpeciesModels()
            : base("name=SpeciesModels")
        {
        }

        public virtual DbSet<Species> Species { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Species>()
                .Property(e => e.Name)
                .IsUnicode(false);

            modelBuilder.Entity<Species>()
                .Property(e => e.Latitude)
                .HasPrecision(10, 8);

            modelBuilder.Entity<Species>()
                .Property(e => e.Longitude)
                .HasPrecision(11, 8);

            modelBuilder.Entity<Species>()
                .Property(e => e.LGA)
                .IsUnicode(false);
        }
    }
}
