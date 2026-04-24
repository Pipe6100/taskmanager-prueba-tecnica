# TaskManager — Prueba Técnica Full Stack

Aplicación web de gestión de tareas por proyecto.

**Stack:** ASP.NET Core 9 · React + Vite + TypeScript · Tailwind CSS · SQL Server + EF Core

## Estado

🚧 En construcción. Las instrucciones completas de ejecución se documentarán al finalizar el desarrollo.

## Arquitectura (resumen)

El backend sigue **Clean Architecture** simplificada con 4 proyectos:

- `TaskManager.Domain` → Entidades y enums (sin dependencias externas)
- `TaskManager.Application` → DTOs, servicios, interfaces, validators
- `TaskManager.Infrastructure` → DbContext, migraciones, implementaciones de repositorio
- `TaskManager.Api` → Controllers, middleware, configuración HTTP