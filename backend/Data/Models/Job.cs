using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data.Models
{
    [Table("Jobs")]
    [Index(nameof(Description))]
    [Index(nameof(HourCharge))]
    public class Job
    {
        [Key, Required]
        public int JobId { get; set; }

        [Required, Column(TypeName = "varchar(100)")]
        public string Description { get; set; } = null!;

        [Required, Column(TypeName = "decimal(5,2)")]
        public decimal HourCharge { get; set; }

        [Required, Column(TypeName = ("datetime2"))]
        public DateTime LastUpdated { get; set; }

        public ICollection<Employee>? Employees { get; set; } = null!;
    }
}
