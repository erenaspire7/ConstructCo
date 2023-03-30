using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data.Models
{
    [Table("Employees")]
    [Index(nameof(FirstName))]
    [Index(nameof(LastName))]
    [Index(nameof(Initials))]
    public class Employee
    {
        [Key, Required]
        public int EmployeeId { get; set; }

        [Required, Column(TypeName = "varchar(50)")]
        public string FirstName { get; set; } = null!;

        [Required, Column(TypeName = "varchar(50)")]
        public string LastName { get; set; } = null!;

        [Required, Column(TypeName = "varchar(10)")]
        public string Initials { get; set; } = null!;

        [Required, Column(TypeName = ("datetime2"))]
        public DateTime HireDate { get; set; }

        [Required, ForeignKey(nameof(Job))]
        public int JobId { get; set; }

        [Required]
        public int YearsOfService { get; set; }

        public ICollection<Assignment>? Assignments { get; set; } = null!;

        public ICollection<Project>? Projects { get; set; } = null!;

        public Job? Job { get; set; } = null!;
    }
}
