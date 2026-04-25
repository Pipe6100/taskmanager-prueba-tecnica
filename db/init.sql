IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260424221955_InitialCreate'
)
BEGIN
    CREATE TABLE [Projects] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Description] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Projects] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260424221955_InitialCreate'
)
BEGIN
    CREATE TABLE [Tasks] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(1000) NULL,
        [Status] nvarchar(20) NOT NULL,
        [DueDate] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [ProjectId] int NOT NULL,
        CONSTRAINT [PK_Tasks] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Tasks_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260424221955_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'Description', N'Name') AND [object_id] = OBJECT_ID(N'[Projects]'))
        SET IDENTITY_INSERT [Projects] ON;
    EXEC(N'INSERT INTO [Projects] ([Id], [CreatedAt], [Description], [Name])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', N''Migrar el sitio institucional a una arquitectura moderna'', N''Rediseño del sitio web''),
    (2, ''2026-01-01T00:00:00.0000000Z'', N''MVP para el equipo comercial'', N''App móvil de ventas''),
    (3, ''2026-01-01T00:00:00.0000000Z'', N''Eliminar reportes manuales mensuales del área financiera'', N''Automatización de reportes'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'Description', N'Name') AND [object_id] = OBJECT_ID(N'[Projects]'))
        SET IDENTITY_INSERT [Projects] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260424221955_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'Description', N'DueDate', N'ProjectId', N'Status', N'Title') AND [object_id] = OBJECT_ID(N'[Tasks]'))
        SET IDENTITY_INSERT [Tasks] ON;
    EXEC(N'INSERT INTO [Tasks] ([Id], [CreatedAt], [Description], [DueDate], [ProjectId], [Status], [Title])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', N''Coordinar con el equipo de marketing'', ''2026-01-06T00:00:00.0000000Z'', 1, N''Completed'', N''Definir paleta de colores''),
    (2, ''2026-01-01T00:00:00.0000000Z'', NULL, ''2026-01-16T00:00:00.0000000Z'', 1, N''InProgress'', N''Maquetar la landing page''),
    (3, ''2026-01-01T00:00:00.0000000Z'', N''Usar EmailJS o similar'', ''2026-01-21T00:00:00.0000000Z'', 1, N''Pending'', N''Integrar formulario de contacto''),
    (4, ''2026-01-01T00:00:00.0000000Z'', N''Comparativa técnica con pros y contras'', ''2026-01-04T00:00:00.0000000Z'', 2, N''Completed'', N''Investigar React Native vs Flutter''),
    (5, ''2026-01-01T00:00:00.0000000Z'', NULL, ''2026-01-11T00:00:00.0000000Z'', 2, N''InProgress'', N''Diseñar flujo de autenticación''),
    (6, ''2026-01-01T00:00:00.0000000Z'', N''Hacer inventario de todos los reportes manuales existentes'', NULL, 3, N''Pending'', N''Listar reportes actuales'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'Description', N'DueDate', N'ProjectId', N'Status', N'Title') AND [object_id] = OBJECT_ID(N'[Tasks]'))
        SET IDENTITY_INSERT [Tasks] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260424221955_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Tasks_ProjectId] ON [Tasks] ([ProjectId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260424221955_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Tasks_Status] ON [Tasks] ([Status]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260424221955_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260424221955_InitialCreate', N'9.0.0');
END;

COMMIT;
GO

