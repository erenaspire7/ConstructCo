using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data.Models
{
    [Table("Projects")]
    [Index(nameof(Name))]
    [Index(nameof(Value))]
    [Index(nameof(Balance))]
    public class Project
    {
        [Key, Required]
        public int ProjectId { get; set; }

        [Required, Column(TypeName = "varchar(50)")]
        public string Name { get; set; } = null!;

        [Required, Column(TypeName = "decimal(10,2)")]
        public decimal Value { get; set; }

        [Required, Column(TypeName = "decimal(10,2)")]
        public decimal Balance { get; set; }

        [Required, ForeignKey(nameof(Employee))]
        public int EmployeeId { get; set; }

        public ICollection<Assignment>? Assignments { get; set; } = null!;

        public Employee? Employee { get; set; } = null!;
    }
}
