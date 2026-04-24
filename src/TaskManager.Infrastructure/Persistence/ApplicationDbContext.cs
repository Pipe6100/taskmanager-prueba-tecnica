using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskStatusEnum = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---- Configuración de Project ----
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(p => p.Description)
                .HasMaxLength(500);

            entity.Property(p => p.CreatedAt)
                .IsRequired();

            entity.HasMany(p => p.Tasks)
                .WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---- Configuración de TaskItem ----
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(t => t.Description)
                .HasMaxLength(1000);

            entity.Property(t => t.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(t => t.CreatedAt)
                .IsRequired();

            entity.HasIndex(t => t.ProjectId);
            entity.HasIndex(t => t.Status);
        });

        // ---- Datos Seed ----
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // IMPORTANTE: las fechas del seed deben ser fijas (no DateTime.UtcNow),
        // de lo contrario EF generaría una migración nueva en cada build.
        var seedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = 1,
                Name = "Rediseño del sitio web",
                Description = "Migrar el sitio institucional a una arquitectura moderna",
                CreatedAt = seedDate
            },
            new Project
            {
                Id = 2,
                Name = "App móvil de ventas",
                Description = "MVP para el equipo comercial",
                CreatedAt = seedDate
            },
            new Project
            {
                Id = 3,
                Name = "Automatización de reportes",
                Description = "Eliminar reportes manuales mensuales del área financiera",
                CreatedAt = seedDate
            }
        );

        modelBuilder.Entity<TaskItem>().HasData(
            // Proyecto 1: Rediseño del sitio web
            new TaskItem
            {
                Id = 1,
                ProjectId = 1,
                Title = "Definir paleta de colores",
                Description = "Coordinar con el equipo de marketing",
                Status = TaskStatusEnum.Completed,
                DueDate = seedDate.AddDays(5),
                CreatedAt = seedDate
            },
            new TaskItem
            {
                Id = 2,
                ProjectId = 1,
                Title = "Maquetar la landing page",
                Description = null,
                Status = TaskStatusEnum.InProgress,
                DueDate = seedDate.AddDays(15),
                CreatedAt = seedDate
            },
            new TaskItem
            {
                Id = 3,
                ProjectId = 1,
                Title = "Integrar formulario de contacto",
                Description = "Usar EmailJS o similar",
                Status = TaskStatusEnum.Pending,
                DueDate = seedDate.AddDays(20),
                CreatedAt = seedDate
            },

            // Proyecto 2: App móvil de ventas
            new TaskItem
            {
                Id = 4,
                ProjectId = 2,
                Title = "Investigar React Native vs Flutter",
                Description = "Comparativa técnica con pros y contras",
                Status = TaskStatusEnum.Completed,
                DueDate = seedDate.AddDays(3),
                CreatedAt = seedDate
            },
            new TaskItem
            {
                Id = 5,
                ProjectId = 2,
                Title = "Diseñar flujo de autenticación",
                Description = null,
                Status = TaskStatusEnum.InProgress,
                DueDate = seedDate.AddDays(10),
                CreatedAt = seedDate
            },

            // Proyecto 3: Automatización de reportes
            new TaskItem
            {
                Id = 6,
                ProjectId = 3,
                Title = "Listar reportes actuales",
                Description = "Hacer inventario de todos los reportes manuales existentes",
                Status = TaskStatusEnum.Pending,
                DueDate = null,
                CreatedAt = seedDate
            }
        );
    }
}