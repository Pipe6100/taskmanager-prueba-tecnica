using Microsoft.EntityFrameworkCore;
using TaskManager.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
//  Configuración de servicios (DI container)
// ==========================================

// Controllers (MVC)
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Entity Framework Core con SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// ==========================================
//  Configuración del pipeline HTTP
// ==========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();