TaskManager — Prueba Técnica Full Stack

Aplicación web para la gestión de tareas por proyecto, desarrollada como prueba técnica para el rol de Desarrollador Full Stack Semi-Senior.

Stack: ASP.NET Core 9 · React 18 + Vite + TypeScript · Tailwind CSS 3 · SQL Server · EF Core 9

🏗️ Arquitectura

El proyecto está organizado como un monorepo:

.
├── src/                            # Backend (.NET solution)
│   ├── TaskManager.Domain/         # Entidades y enums (núcleo del dominio)
│   ├── TaskManager.Application/    # DTOs, servicios, interfaces, validaciones
│   ├── TaskManager.Infrastructure/ # DbContext, repositorios, migraciones (EF Core)
│   └── TaskManager.Api/            # Controllers, middleware, configuración HTTP
├── client/                         # Frontend (React + Vite)
│   └── src/
│       ├── api/                    # Cliente Axios y servicios HTTP
│       ├── components/             # Componentes UI reutilizables
│       ├── features/               # Componentes por dominio
│       ├── hooks/                  # Custom hooks
│       ├── pages/                  # Páginas (React Router)
│       ├── lib/                    # Utilidades
│       └── types/                  # Tipos TypeScript
├── db/
│   └── init.sql                    # Script SQL alternativo
└── TaskManager.sln

El backend implementa Clean Architecture (Domain ← Application ← Infrastructure ← Api), garantizando bajo acoplamiento y alta mantenibilidad.

🚀 Ejecución local (paso a paso)
🔧 Requisitos previos
Herramienta	Versión
.NET SDK	9.0+
Node.js	20.x LTS
SQL Server	2019+ o LocalDB
Git	Última
1. Clonar el repositorio
git clone https://github.com/Pipe6100/taskmanager-prueba-tecnica.git
cd taskmanager-prueba-tecnica

⚠️ El cd usa el nombre de la carpeta creada (sin .git).

2. Configurar la base de datos

Editar:

src/TaskManager.Api/appsettings.json

Usar una cadena portable:

"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
📝 Alternativa
Server=localhost\\SQLEXPRESS;

❌ No usar nombres de equipo (ej: DESKTOP-XXXXX).

3. Levantar el backend

Desde la raíz:

dotnet restore
dotnet ef database update --project src/TaskManager.Infrastructure --startup-project src/TaskManager.Api
dotnet run --project src/TaskManager.Api
✔️ Esto hace automáticamente:
Crea la BD TaskManagerDb
Aplica migraciones
Inserta datos de prueba (3 proyectos, 6 tareas)
🔁 Alternativa (sin EF CLI)

Ejecutar:

db/init.sql

en SQL Server Management Studio o Azure Data Studio.

📍 Backend
API: http://localhost:5269
Swagger: http://localhost:5269/swagger
4. Levantar el frontend

En otra terminal:

cd client
npm install
npm run dev
⚠️ Configuración recomendada

Crear archivo:

client/.env

con:

VITE_API_URL=http://localhost:5269
📍 Frontend
http://localhost:5173
⚠️ Solución de problemas comunes
Error	Causa	Solución
No conecta a BD	Instancia incorrecta	Usar (localdb)\MSSQLLocalDB
dotnet ef no funciona	No instalado	dotnet tool install --global dotnet-ef
Swagger no carga	Backend detenido	Ejecutar dotnet run
Frontend sin datos	API URL incorrecta	Revisar .env
Error CORS	Configuración backend	Verificar CORS
🧩 Funcionalidades
Backend
CRUD de Proyectos y Tareas
Filtros + búsqueda + paginación
Cambio rápido de estado (PATCH)
Validaciones con FluentValidation
Manejo de errores (ProblemDetails)
Swagger
Frontend
Listado de proyectos
Gestión de tareas por proyecto
Filtros y búsqueda
Modales CRUD
Estados de carga y errores
Diseño responsive
Indicador de tareas vencidas
🛠️ Decisiones técnicas
Backend
Clean Architecture
Repository Pattern + Unit of Work
Enum como string (legibilidad BD)
Middleware global de excepciones
Validación desacoplada
AsNoTracking() para performance
Eliminación en cascada
Paginación desde backend
Frontend
TypeScript (tipado fuerte)
Vite (alto rendimiento)
Tailwind CSS 3
Custom hooks para estado
Componentes reutilizables
Actualización optimista
Variable de entorno (VITE_API_URL)
🧪 Endpoints

Acceder en:
http://localhost:5269/swagger

Método	Endpoint	Descripción
GET	/api/projects	Listar proyectos
GET	/api/projects/{id}	Obtener proyecto
POST	/api/projects	Crear
PUT	/api/projects/{id}	Actualizar
DELETE	/api/projects/{id}	Eliminar
GET	/api/tasks	Listar tareas
GET	/api/tasks/{id}	Obtener tarea
POST	/api/tasks	Crear
PUT	/api/tasks/{id}	Actualizar
PATCH	/api/tasks/{id}/status	Cambiar estado
DELETE	/api/tasks/{id}	Eliminar
📝 Notas finales
Enfoque en claridad, mantenibilidad y buenas prácticas
No incluye (por alcance): autenticación, tests, docker
Commits bajo estándar Conventional Commits
👨‍💻 Autor

Juan Felipe Loaiza Facundo
Abril 2026