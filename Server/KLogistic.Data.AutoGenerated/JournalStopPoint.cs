namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("JournalStopPoints")]
    public partial class JournalStopPoint
    {
        [Key, Column("JournalStopPointId")]
        public long Id { get; set; }

        public long JournalId { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        [Column(TypeName = "xml")]
        public string ExtendedData { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        public virtual Journal Journal { get; set; }
    }
}
