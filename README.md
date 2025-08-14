# Plataforma Académica 📚

Este proyecto es una plataforma de gestión académica desarrollada con **Angular**, **json-server** y **PrimeNG**. Está diseñada para academias o instituciones que dictan cursos libres y cuenta con paneles diferenciados para **administradores**, **profesores** y **alumnos**.

## 🧩 Características principales

- CRUD de profesores, alumnos y cursos.
- Asignación de profesores a cursos.
- Matrícula de alumnos en cursos.
- Manejo de estados con **RxJS**, **Signals** y **Stores personalizados**.
- Integración con **json-server** como backend simulado.
- Sistema de autenticación en desarrollo con `json-server-auth`.(próximamente)

## 🚦 Rutas del proyecto

| Rol           | Ruta base         | Funcionalidad                                                           |
| ------------- | ----------------- | ----------------------------------------------------------------------- |
| Admin         | `/admin`          | Panel de control, gestión de profesores, alumnos y cursos               |
| Profesor      | `/profesor`       | Visualización de cursos asignados, lista de alumnos y registro de notas |
| Alumno        | `/alumno`         | Visualización de cursos inscritos y notas                               |
| Autenticación | `/login` (futuro) | Inicio de sesión según rol (admin, profesor, alumno)                    |

## 🔧 Tecnologías utilizadas

- Angular 17+ con Standalone Components
- PrimeNG
- RxJS + Angular Signals
- json-server + json-server-auth
- TypeScript

## 📦 Estructura del proyecto

```
src/
├── app/
│   ├── core/                # Servicios globales
│   ├── shared/              # Componentes reutilizables
│   ├── admin/               # Panel administrador
│   ├── teacher/             # Panel profesor
│   ├── student/             # Panel alumno
│   └── auth/                # Módulo de autenticación (próximamente)
└── environments/            # Configuración de entornos
```

## 📷 Funcionalidades visuales

- **Validaciones reactivas** en formularios
- **Spinners, loaders y skeletons** al cargar datos
- **Toasts** de éxito o error con `MessageService` de PrimeNG
- **Modales reutilizables** para crear y editar

## 📸 Gestión de imágenes (próximanente)

- Las imágenes de profesores se almacenarán en cloudinary
- Al editar un profesor, se actualiza su imagen si corresponde.

## 📌 Estado actual

- [x] Módulo de administrador funcional (profesores, cursos)
- [x] Asignación de cursos
- [ ] Vista de alumno
- [ ] Sistema de autenticación completo (login por rol)
- [ ] Registro de alumnos y profesores desde el frontend
- [ ] Dashboard con estadísticas
- [ ] Validaciones avanzadas y mejora de experiencia de usuario

## 🧠 Aprendizajes

Este proyecto incorpora prácticas modernas como:

- Signals para manejo de estado local y global
- Rxjs para manejos asíncronos de APIs
- Separación por stores con `BehaviorSubject` y `computed`
- Formularios reactivos con validaciones asincrónicas
- Optimización del rendimiento y manejo eficiente del DOM

## 🧠 Decisiones Técnicas y Ruta de Aprendizaje

Este proyecto es una aplicación progresiva de buenas prácticas en Angular. A continuación, destaco algunos enfoques implementados y cómo han ido evolucionando:

---

### 🔁 Manejo de Estado y Comunicación

#### Layout (vista principal)

- Se utiliza **RxJS con BehaviorSubject** para controlar el estado de apertura y cierre del sidebar y los menús principales de navegación.
- Esto permite una **comunicación reactiva y desacoplada** entre componentes, especialmente entre el layout y las vistas hijas.

---

### 📝 Formularios Reactivos y Validaciones

- Se ha implementado un sistema de formularios reactivos, utilizando:
  - `FormGroup`, `FormControl` y `FormBuilder` para estructurar los formularios.
  - **Validaciones síncronas** (`Validators.required`, `Validators.email`, etc.).
  - **Validaciones condicionales y personalizadas**.
  - **Mensajes de error dinámicos y accesibles** para el usuario.
- El sistema de **creación y edición de profesores** se maneja mediante **formularios dinámicos dentro de un modal**, con validaciones y control de estados.

---

### 👨‍🏫 Vista Teachers

- Se implementa el **consumo de APIs** con operadores de RxJS como:
  - `forkJoin` para obtener datos paralelos como profesores y asignaciones.
  - `switchMap` y `tap` para flujos reactivos y procesamiento de datos.
- Todo el manejo de datos se realiza de forma **reactiva y sincrónica** con `HttpClient`.

---

### ⚙️ Manejo de Estado con Signals

- Se ha comenzado a aplicar **Angular Signals**
  - En `TeachersStore` ya se usan señales como `computed`, `effect`, `signal` para derivar y controlar el estado reactivo.
  - Se usa **Signal Store Patterns** para mejorar legibilidad y trazabilidad para todas las demás vistas diferentes a la vista profesores.

## 📦 Backend

Durante la etapa inicial del desarrollo, y mientras el backend real se encuentra en construcción, se implementó un backend simulado utilizando `json-server` y `json-server-auth`.

Este enfoque me permitió:

- Realizar llamadas a API y probar flujos completos de la aplicación sin depender de la infraestructura final.
- Utilizar un archivo `db.json` como base de datos mock para almacenar y gestionar la información temporalmente.
- Disponer de endpoints funcionales simulados para `/teachers`, `/students`, `/courses`, `/assignments`, etc.

## 🧑‍💻 Autora

**Katherina Marilu** – Frontend Developer & Mathematician
