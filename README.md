# TaskManager — Prueba Técnica Full Stack

Aplicación web de gestión de tareas por proyecto, desarrollada como prueba técnica para el rol de Desarrollador Full Stack Semi-Senior.

**Stack:** ASP.NET Core 9 · React 18 + Vite + TypeScript · Tailwind CSS 3 · SQL Server · EF Core 9

---

## 🏗️ Arquitectura

El proyecto está organizado como un monorepo con dos partes principales:

```
.
├── src/                            # Backend (.NET solution)
│   ├── TaskManager.Domain/         # Entidades y enums (núcleo puro, sin dependencias externas)
│   ├── TaskManager.Application/    # DTOs, servicios, interfaces, validators
│   ├── TaskManager.Infrastructure/ # DbContext, repositorios, migraciones (EF Core)
│   └── TaskManager.Api/            # Controllers, middleware, configuración HTTP
├── client/                         # Frontend (React + Vite)
│   └── src/
│       ├── api/                    # Cliente Axios y servicios HTTP
│       ├── components/             # Componentes UI base reutilizables
│       ├── features/               # Componentes específicos por dominio
│       ├── hooks/                  # Custom hooks (useProjects, useTasks, useProject)
│       ├── pages/                  # Páginas que React Router renderiza
│       ├── lib/                    # Utilidades y helpers
│       └── types/                  # Interfaces TypeScript
├── db/
│   └── init.sql                    # Script SQL alternativo (auto-generado de las migraciones)
└── TaskManager.sln                 # Solución .NET
```

El backend sigue **Clean Architecture** simplificada: las dependencias apuntan hacia adentro (Domain ← Application ← Infrastructure ← Api). Esto permite que la lógica de negocio sea testeable y desacoplada de detalles técnicos como Entity Framework o ASP.NET Core.

---

## 🚀 Cómo correr el proyecto localmente

### Requisitos previos

| Herramienta | Versión utilizada | Notas |
|---|---|---|
| .NET SDK | **9.0** | Funciona con cualquier 9.x |
| Node.js | **20.x LTS** o superior | |
| SQL Server | **2019+** o LocalDB | Cualquier instancia local |
| Git | última | |

### 1. Clonar el repositorio

```bash
git clone https://github.com/[TU-USUARIO]/[TU-REPO].git
cd [TU-REPO]
```

### 2. Configurar la base de datos

Edita `src/TaskManager.Api/appsettings.json` y ajusta el `Server` de la connection string al nombre de tu instancia de SQL Server:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_INSTANCIA;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

Ejemplos comunes de `Server`: `localhost`, `.`, `localhost\SQLEXPRESS`, `.\SQLEXPRESS`.

### 3. Levantar el backend

Desde la raíz del proyecto:

```bash
dotnet restore
dotnet ef database update --project src/TaskManager.Infrastructure --startup-project src/TaskManager.Api
dotnet run --project src/TaskManager.Api
```

El comando `database update` crea la base `TaskManagerDb` con su esquema y carga **datos de prueba (3 proyectos y 6 tareas)** automáticamente.

> **Alternativa sin EF CLI**: ejecutar el script `db/init.sql` directamente en SQL Server Management Studio o Azure Data Studio.

La API queda escuchando en `http://localhost:5269` y la documentación Swagger en `http://localhost:5269/swagger`.

### 4. Levantar el frontend

En **otra terminal**:

```bash
cd client
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## 🧩 Funcionalidades

### Backend
- CRUD completo de **Proyectos** y **Tareas**.
- Endpoint con **filtros y búsqueda** combinables: `?projectId=&status=&search=&page=&pageSize=`.
- Endpoint dedicado para **cambio rápido de estado** (`PATCH /api/tasks/{id}/status`).
- Validaciones con **FluentValidation** en español.
- Manejo global de excepciones con **ProblemDetails (RFC 7807)**.
- **Paginación** con metadatos completos (`hasNext`, `totalPages`, etc.).
- Documentación interactiva con **Swagger**.
- **CORS** configurado para el origen del frontend.

### Frontend
- Listado de proyectos con cards y conteo de tareas.
- Detalle de proyecto con listado de tareas paginado.
- Filtros por estado y búsqueda por texto.
- Cambio rápido de estado de tareas vía dropdown.
- Modales de crear/editar/confirmar borrado.
- Validaciones cliente espejadas con las del backend.
- Estados de carga (spinners) y manejo de errores con reintentos.
- Diseño responsivo con Tailwind CSS.
- Indicador visual de **tareas vencidas**.

---

## 🛠️ Decisiones técnicas

### Backend

**Clean Architecture en 4 proyectos.** Separar Domain, Application, Infrastructure y Api hace que la lógica de negocio no dependa de EF Core ni de ASP.NET. Esto permitiría reemplazar cualquiera de esas piezas sin tocar el dominio.

**Repository Pattern + Unit of Work.** Aunque EF Core ya implementa el patrón internamente, sumamos repositorios para que la capa Application no conozca EF Core directamente. Los servicios reciben interfaces (`IProjectRepository`, `ITaskRepository`, `IUnitOfWork`) y son testeables con mocks.

**Enum persistido como string.** El campo `Status` se guarda como texto (`'Pending'`, `'InProgress'`, `'Completed'`) en vez de número, gracias a `HasConversion<string>()`. La BD queda legible y reordenar el enum en código no rompe los datos existentes.

**Excepciones tipadas + middleware global.** En lugar de `try/catch` en cada controller, lanzo `NotFoundException` o `ValidationException` desde los servicios. Un middleware central las traduce al status HTTP apropiado, manteniendo los controllers delgados.

**Validación automática vía filtro.** Un `IAsyncActionFilter` resuelve el validator de FluentValidation por reflection y lo ejecuta antes de llegar al controller.

**FluentValidation sobre Data Annotations.** Permite reglas más expresivas (ej: "fecha límite no puede ser anterior a hoy"), no contamina los DTOs y es testeable como cualquier clase.

**`AsNoTracking()` para queries de lectura.** EF Core trackea entidades por defecto. Para los GET, esto es overhead innecesario; lo desactivamos para mejorar performance.

**Cascada en la FK Project → Tasks.** Borrar un proyecto elimina sus tareas. Es semánticamente correcto: una tarea no tiene sentido sin proyecto.

**Paginación incluida desde el inicio.** El listado de tareas siempre responde como `PagedResult<T>`, con metadatos para que el frontend no calcule nada.

### Frontend

**TypeScript en lugar de JavaScript.** Errores en compilación, autocompletado y un contrato fuerte con la API. Los tipos del frontend reflejan los DTOs del backend.

**Vite como bundler.** Es el requerimiento de la prueba; además es 10x más rápido que CRA en dev y produce builds optimizados sin configuración manual.

**Tailwind CSS 3.** v4 cambió mucho la forma de configurar; v3 sigue siendo la versión más estable y documentada de la industria.

**Custom hooks para estado de servidor.** `useProjects` y `useTasks` encapsulan loading, error, paginación, filtros y operaciones CRUD. Las páginas quedan declarativas: solo orquestan UI y delegan datos a los hooks.

**Componentes UI base reutilizables.** `Button`, `Input`, `Modal`, `ConfirmDialog`, `Spinner`, `ErrorAlert`, `Pagination` viven en `components/ui`. Las features (`features/projects`, `features/tasks`) los componen.

**Actualización optimista.** Después de crear/editar/borrar, el estado local se actualiza inmediatamente sin esperar otro round-trip.

**Variable de entorno para la URL del API.** `VITE_API_URL` permite cambiar el backend sin recompilar.

---

## 🧪 Endpoints disponibles

Con el backend corriendo, navega a `http://localhost:5269/swagger`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects` | Listar todos los proyectos |
| GET | `/api/projects/{id}` | Obtener un proyecto |
| POST | `/api/projects` | Crear proyecto |
| PUT | `/api/projects/{id}` | Actualizar proyecto |
| DELETE | `/api/projects/{id}` | Eliminar proyecto (cascada en tareas) |
| GET | `/api/tasks` | Listar tareas con filtros y paginación |
| GET | `/api/tasks/{id}` | Obtener una tarea |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/{id}` | Actualizar tarea completa |
| PATCH | `/api/tasks/{id}/status` | Cambiar solo el estado |
| DELETE | `/api/tasks/{id}` | Eliminar tarea |

---

## 📝 Notas finales

- El proyecto se diseñó priorizando **claridad y mantenibilidad** sobre cantidad de features.
- Quedan oportunidades de mejora intencionalmente fuera del alcance: autenticación con JWT, paginación en proyectos, soft delete, tests automatizados, y dockerización. Estos puntos se mencionan como "aspectos abiertos" en el enunciado de la prueba.
- El historial de commits sigue la convención **Conventional Commits** y refleja el desarrollo progresivo en fases.

---

**Autor:** [Juan Felipe Loaiza Facundo]
**Fecha:** Abril 2026