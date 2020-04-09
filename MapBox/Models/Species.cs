namespace MapBox.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Species
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Column(TypeName = "numeric")]
        public decimal Latitude { get; set; }

        [Column(TypeName = "numeric")]
        public decimal Longitude { get; set; }

        public string LGA { get; set; }

        public int? Year { get; set; }

        public int? Month { get; set; }

        public int? Day { get; set; }
    }
}
