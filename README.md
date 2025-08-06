# Dashboard School 📚

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
| Profesor      | `/teacher`        | Visualización de cursos asignados, lista de alumnos y registro de notas |
| Alumno        | `/student`        | Visualización de cursos inscritos y notas                               |
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
- Al eliminar, se remueve la imagen también desde Firebase.

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

Este proyecto también representa mi ruta de aprendizaje y aplicación progresiva de buenas prácticas en Angular. A continuación, destaco algunos enfoques implementados y cómo han ido evolucionando:

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

- Se ha comenzado a aplicar **Angular Signals** de manera progresiva:
  - En `TeachersStore` ya se usan señales como `computed`, `effect`, `signal` para derivar y controlar el estado reactivo.
  - Se está migrando hacia un manejo más claro y mantenible usando **Signal Store Patterns** para mejorar legibilidad y trazabilidad.
- Para `CoursesStore` y otras futuras stores se planea una implementación más sólida basada en señales desde el inicio.

## 🚀 Cómo iniciar el proyecto

1. Clona el repositorio

```bash
git clone https://github.com/MariCornelio/dashboard-school.git
cd dashboard-school
```

2. Instala las dependencias

```bash
npm install
```

3. Inicia el servidor de desarrollo de Angular

```bash
ng serve
```

## 📦 Backend

Este proyecto usa un backend simulado con `json-server` y `json-server-auth`.

- Archivo base de datos: `db.json`
- Endpoints simulados para `/teachers`, `/students`, `/courses`, `/assignments`, etc.

La estructura de datos se encuentra en el repositorio:

🔗 **Repositorio del backend:**  
[https://github.com/MariCornelio/dashboard-school-mock-server](https://github.com/MariCornelio/dashboard-school-mock-server)

🌐 **Backend publicado en Render:**  
[https://dashboard-school-mock-server.onrender.com/](https://dashboard-school-mock-server.onrender.com/)

## 🧑‍💻 Autora

**Katherina Marilu** – Frontend Developer

---

¡Gracias por visitar este proyecto! ⭐ Si te sirvió como inspiración o guía, no olvides dejar tu feedback.
