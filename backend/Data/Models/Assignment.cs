using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data.Models
{
    [Table("Assignments")]
    [Index(nameof(Hours))]
    [Index(nameof(Charge))]
    public class Assignment
    {
        [Key, Required]
        public int AssignmentId { get; set; }

        [Required, Column(TypeName = ("datetime2"))]
        public DateTime AssignDate { get; set; }

        [Required, ForeignKey(nameof(Project))]
        public int ProjectId { get; set; }

        [Required, ForeignKey(nameof(Employee))]
        public int EmployeeId { get; set; }

        [Required]
        public int AssignJobId { get; set; }

        [Required, Column(TypeName = "decimal(5,2)")]
        public decimal AssignHourCharge { get; set; }

        [Required, Column(TypeName = "decimal(5,2)")]
        public decimal Hours { get; set; }

        [Required, Column(TypeName = "decimal(5,2)")]
        public decimal Charge { get; set; }
    }
}
