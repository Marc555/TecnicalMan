# TecnicalMan

TecnicalMan es una solución de gestión para empresas disponible como aplicación Android y WebApp. Permite gestionar clientes, tareas, presupuestos, albaranes y facturas, tanto online como offline, con sincronización en red.

---

## Funcionalitats

- Login obligatorio en todas las plataformas para acceder al sistema.
- Recuperación de contraseña mediante correo electrónico.
- CRUD de clientes, que pueden ser personas, comunidades o gestorías.
- CRUD de tareas.
- Calendario de tareas para visualización diaria.
- CRUD de presupuestos.
- CRUD de albaranes.
- CRUD de facturas.
- Generación de PDFs para presupuestos, albaranes y facturas.
- Soporte offline en la app móvil: persistencia local y visualización de tareas del día.

---

## Arquitectura

### Tecnologías utilizadas

#### Backend

- **Lenguajes:** Java 21
- **Frameworks:** Spring Boot, Spring Security, Spring Data JPA
- **Seguridad:** JWT, BCrypt
- **Base de datos:** MySQL
- **Otros:** Lombok, iText PDF, Swagger (OpenAPI)

#### Frontend Web

- **Lenguajes:** JavaScript, TypeScript
- **Frameworks y librerías:** React, Vite, Axios, Tailwind CSS
- **Gestión de rutas y estado:** React Router, useState, useEffect, Context

#### Aplicación Android

- **Lenguajes:** Kotlin, Java
- **Frameworks y librerías:** Jetpack Compose, Room, Retrofit, DataStore, Navigation Compose
- **Arquitectura:** MVVM
- **Gestión de estado:** StateFlow

---

### Estructura del proyecto

```bash
TecnicalMan/
│
├── backend/        # Spring Boot
│   └── src/main/java/es/tecnicalman/tecnicalman/
│       ├── controller/   # REST Controllers
│       ├── model/        # Entidades JPA
│       ├── repository/   # Spring Data JPA
│       ├── service/      # Lógica de negocio
│       └── security/     # JWT, filtros, configuración
│
├── frontend/       # React + Vite
│   └── src/
│       ├── page/         # Vistas principales
│       ├── axios/        # Conexión con la API
│       ├── components/   # Componentes reutilizables
│
└── androidApp/     # App Android (Jetpack Compose)
    ├── MainActivity.kt
    ├── viewmodel/
    ├── model/
    ├── repository/
    ├── api/
    └── utils/
```

---

## Millores

- Mejoras de la sincronización offline/online en la app móvil.
- Optimización de la descarga y generación de PDFs.
- Actualización de dependencias y frameworks a versiones recientes.
- Mejoras de seguridad en la autenticación y almacenamiento de tokens.
- Optimización de búsquedas y filtrados en la web.
- Nuevos tests automatizados en backend y frontend.
- Mejoras de usabilidad y accesibilidad en la UI web y móvil.

---

## Características destacadas

### Backend

- API REST protegida con JWT.
- **Endpoints principales:**
    - `/api/auth` (login, validación, recuperación de contraseña)
    - `/api/clientes`, `/api/facturas`, `/api/albarans`, `/api/presupuestos`, `/api/tareas`
- Contraseñas encriptadas con BCrypt.
- Documentación interactiva con Swagger: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### Frontend Web

- Navegación protegida por login.
- CRUD completo de todas las entidades.
- Generación y descarga de PDFs.
- Búsqueda y filtrado de datos.
- Diseño moderno con Tailwind CSS.

### App Android

- Login con JWT, persistencia de token con DataStore.
- CRUD de tareas, clientes, presupuestos, albaranes y facturas.
- Visualización de calendario con tareas diarias.
- Descarga de PDFs al almacenamiento externo privado.
- Soporte completo offline con sincronización cuando hay red disponible.
- UI moderna con Jetpack Compose y Material 3.

---

## Instalación

### Backend

```bash
cd backend
./gradlew bootRun
```
Configura previamente tu base de datos en `application.properties`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Android

1. Abre el proyecto en Android Studio.
2. Asegúrate de tener un dispositivo/emulador con Android 8.0 o superior.
3. Ejecuta la aplicación.

#### Permisos requeridos (Android)

- `INTERNET`: Acceso a la API.
- `ACCESS_NETWORK_STATE`: Detección de conectividad.
- Permisos de almacenamiento para guardar los PDFs.

---

## Notas adicionales

- Asegúrate de tener habilitado Lombok en tu IDE para el backend.
- La sincronización en la app móvil gestiona automáticamente el modo offline/online.
- Spring Boot DevTools puede usarse para recarga automática en desarrollo.
