🚀 TaskManager — Prueba Técnica Full Stack

Aplicación web para la gestión de tareas por proyecto, desarrollada como prueba técnica para el rol de Desarrollador Full Stack Semi-Senior.

🧱 Stack Tecnológico
Backend: ASP.NET Core 9 + Entity Framework Core 9
Frontend: React 18 + Vite + TypeScript
Estilos: Tailwind CSS 3
Base de datos: SQL Server / LocalDB
🏗️ Arquitectura

El proyecto está organizado como un monorepo:

.
├── src/                            # Backend (.NET)
│   ├── TaskManager.Domain/         # Entidades y enums
│   ├── TaskManager.Application/    # Servicios, DTOs, interfaces, validaciones
│   ├── TaskManager.Infrastructure/ # EF Core, repositorios, migraciones
│   └── TaskManager.Api/            # Controllers, middleware
├── client/                         # Frontend (React + Vite)
│   └── src/
├── db/
│   └── init.sql                    # Script alternativo BD
└── TaskManager.sln

Se implementa Clean Architecture:

Domain ← Application ← Infrastructure ← Api

✔ Bajo acoplamiento
✔ Alta mantenibilidad
✔ Testeable

⚡ Ejecución rápida (TL;DR)
git clone https://github.com/[TU-USUARIO]/[TU-REPO].git
cd [TU-REPO]

# Backend
dotnet restore
dotnet ef database update --project src/TaskManager.Infrastructure --startup-project src/TaskManager.Api
dotnet run --project src/TaskManager.Api

# Frontend (otra terminal)
cd client
npm install
npm run dev
🧰 Instalación paso a paso
🔧 Requisitos
Herramienta	Versión
.NET SDK	9.0+
Node.js	20.x LTS
SQL Server	2019+ o LocalDB
Git	Última
1. Clonar repositorio
git clone https://github.com/[TU-USUARIO]/[TU-REPO].git
cd [TU-REPO]

⚠️ No usar .git en el cd.

2. Configuración de base de datos

Editar:

src/TaskManager.Api/appsettings.json

Usar esta configuración (RECOMENDADO):

"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
🔎 Alternativas válidas
Server=localhost\\SQLEXPRESS;
Server=localhost;
❌ NO usar
Server=DESKTOP-XXXXX
3. Ejecutar backend
dotnet restore
dotnet ef database update --project src/TaskManager.Infrastructure --startup-project src/TaskManager.Api
dotnet run --project src/TaskManager.Api
✔️ Esto hace automáticamente
Crea la base de datos
Ejecuta migraciones
Inserta datos de prueba (3 proyectos / 6 tareas)
📍 Backend disponible en
API → http://localhost:5269
Swagger → http://localhost:5269/swagger
4. Ejecutar frontend
cd client
npm install
npm run dev
⚠️ Configuración recomendada

Crear archivo:

client/.env
VITE_API_URL=http://localhost:5269
📍 Frontend

http://localhost:5173

⚠️ Solución de problemas
Problema	Causa	Solución
No conecta BD	Server incorrecto	Usar (localdb)\MSSQLLocalDB
dotnet ef falla	No instalado	dotnet tool install --global dotnet-ef
Swagger no abre	Backend detenido	Ejecutar dotnet run
Frontend vacío	API URL incorrecta	Revisar .env
Error CORS	Backend config	Revisar CORS
🧩 Funcionalidades
Backend
CRUD de Proyectos y Tareas
Filtros + búsqueda + paginación
Cambio rápido de estado (PATCH)
Validaciones con FluentValidation
Manejo de errores (RFC 7807)
Swagger
Frontend
Listado de proyectos
Gestión de tareas
Filtros y búsqueda
Modales CRUD
Indicadores visuales
Manejo de estados (loading/error)
UI responsive
🛠️ Decisiones técnicas
Backend
Clean Architecture
Repository Pattern + Unit of Work
Enum como string
Middleware global de errores
Validación desacoplada
AsNoTracking() para performance
Eliminación en cascada
Paginación desde backend
Frontend
TypeScript (tipado fuerte)
Vite (rápido y moderno)
Tailwind CSS 3
Custom hooks (useTasks, useProjects)
Componentes reutilizables
Actualización optimista
Configuración por .env
🧪 Endpoints

Swagger:
http://localhost:5269/swagger

Método	Endpoint
GET	/api/projects
POST	/api/projects
GET	/api/tasks
POST	/api/tasks
PATCH	/api/tasks/{id}/status
DELETE	/api/tasks/{id}
📝 Notas finales
Enfoque en claridad y buenas prácticas
No incluye (por alcance):
Autenticación
Tests
Docker
Commits bajo estándar Conventional Commits
👨‍💻 Autor

[Juan Felipe Loaiza Facundo]
Abril 2026