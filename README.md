# TecnicalMan

TecnicalMan es una aplicación de gestión para empresas, desarrollada con **Spring Boot** en el backend y **React** en el frontend. Permite la gestión de clientes, facturas, albaranes, presupuestos y tareas.

---

## Estructura del Proyecto

```
TecnicalMan/
│
├── backend/      # Backend Java Spring Boot
│   ├── src/
│   │   └── main/java/es/tecnicalman/tecnicalman/
│   │       ├── controller/   # Controladores REST
│   │       ├── model/        # Entidades JPA
│   │       ├── repository/   # Repositorios Spring Data JPA
│   │       ├── service/      # Lógica de negocio
│   │       └── security/     # Seguridad y JWT
│   ├── build.gradle
│   └── ...
│
└── frontend/     # Frontend React + Vite
    ├── src/
    │   ├── page/         # Vistas principales (clientes, facturas, etc.)
    │   ├── axios/        # Llamadas a la API
    │   ├── components/   # Componentes reutilizables
    │   └── ...
    ├── package.json
    └── ...
```

---

## Backend

- **Tecnologías:** Java 21, Spring Boot, Spring Data JPA, Spring Security, JWT, MySQL, Lombok, iText PDF.
- **Punto de entrada:** [`TecnicalmanApplication.java`](backend/src/main/java/es/tecnicalman/tecnicalman/TecnicalmanApplication.java)
- **Estructura principal:**
  - `controller/`: Controladores REST para recursos como Cliente, Factura, Albaran, Presupuesto, Tarea, etc.
  - `model/`: Entidades JPA (por ejemplo, Cliente, Factura, LineaFactura, etc.).
  - `repository/`: Interfaces de acceso a datos (extienden JpaRepository).
  - `service/`: Lógica de negocio y servicios.
  - `security/`: Configuración de seguridad, JWT, filtros y utilidades.

### Endpoints REST principales

- `/api/clientes`
- `/api/facturas`
- `/api/albarans`
- `/api/presupuestos`
- `/api/tareas`
- `/api/auth` (login, validación, recuperación de contraseña)

### Seguridad

- **Spring Security** con JWT.
- Endpoints bajo `/api/auth` son públicos, el resto requieren autenticación.
- Contraseñas cifradas con BCrypt.

### Documentación de la API con Swagger

La documentación interactiva de la API está disponible gracias a **Swagger** (OpenAPI).  
Para acceder a la documentación, una vez levantada la aplicación, visita:

```
http://localhost:8080/swagger-ui/index.html
```

#### Instalación de Swagger

Asegúrate de tener en tu `build.gradle`:

```gradle
// filepath: backend/build.gradle
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0'
```

Y en tu clase principal o configuración:

```java
// filepath: backend/src/main/java/es/tecnicalman/tecnicalman/TecnicalmanApplication.java
// No requiere configuración adicional, springdoc lo detecta automáticamente.
```

---

## Frontend

- **Tecnologías:** React, Vite, Axios, Tailwind CSS.
- **Estructura principal:**
  - `page/`: Páginas para cada entidad (Clientes, Facturas, Albaranes, Presupuestos, etc.).
  - `axios/`: Módulos para consumir la API REST del backend.
  - `components/`: Componentes reutilizables (TopBar, formularios, tablas, etc.).

### Funcionalidades

- CRUD de clientes, facturas, albaranes, presupuestos y tareas.
- Generación y descarga de PDFs.
- Autenticación de usuarios.
- Búsqueda y filtrado.

---

## Instalación y Ejecución

### Backend

1. Configura tu base de datos MySQL y ajusta las credenciales en `application.properties`.
2. Instala dependencias e inicia el servidor:
   ```sh
   cd backend
   ./gradlew bootRun
   ```
3. Accede a la documentación Swagger en [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### Frontend

1. Instala las dependencias:
   ```sh
   cd frontend
   npm install
   ```
2. Inicia la aplicación:
   ```sh
   npm run dev
   ```

---

## Notas

- El backend expone una API RESTful consumida por el frontend.
- El proyecto utiliza Lombok, asegúrate de tenerlo habilitado en tu IDE.
- Para desarrollo, puedes usar Spring Boot DevTools para recarga automática.
- Swagger genera la documentación automáticamente a partir de los controladores REST.

---

**Autor:**  
TecnicalMan Team
