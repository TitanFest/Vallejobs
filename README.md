# Vallejobs — Backend

API REST para la plataforma de empleos Vallejobs. Construida con Node.js, Express, Sequelize y MySQL.

---

## Tecnologías

- **Runtime:** Node.js
- **Framework:** Express 4
- **ORM:** Sequelize 6
- **Base de datos:** MySQL 8.0 (vía mysql2)
- **Autenticación:** JWT (jsonwebtoken + bcrypt)
- **Archivos:** Multer (disk storage)
- **Desarrollo:** Nodemon

---

## Requisitos

- Node.js 18+
- MySQL 8.0 corriendo en puerto 3306
- pnpm

---

## Instalación

```bash
cd Backend
pnpm install
```

### Configurar variables de entorno

Editar `Backend/.env`:

```
DB_NAME="vallejobs"
DB_USER="root"
DB_PASSWORD="tu_contraseña"
DB_HOST="localhost"
DB_PORT="3306"
JWT_SECRET="tu_clave_secreta"
```

### Crear base de datos

```sql
CREATE DATABASE vallejobs;
```

Las tablas se crean automáticamente al iniciar el servidor vía `sequelize.sync({ alter: true })`.

---

## Ejecución

```bash
nodemon server.js
```

El servidor inicia en `http://localhost:5000`.

---

## Estructura

```
Backend/
├── controllers/       # Lógica de negocio
│   ├── userController.js
│   ├── OfertasController.js
│   └── postulacionesController.js
├── middlewares/
│   └── authMiddleware.js    # Verifica JWT
├── models/                  # Modelos Sequelize
│   ├── User.js
│   ├── OfertasTrabajo.js
│   ├── Postulacion.js
│   ├── Categoria.js
│   └── associations.js      # Relaciones entre modelos
├── routes/
│   ├── users.js
│   ├── ofertas.js
│   ├── postulaciones.js
│   └── categoria.js
├── uploads/                 # Fotos de perfil y CVs (se crea solo)
├── .env
├── database.js              # Conexión Sequelize
├── server.js                # Entry point
└── package.json
```

---

## API

### Usuarios

| Método | Ruta                    | Auth | Descripción                    |
| ------ | ----------------------- | ---- | ------------------------------ |
| POST   | `/Usuarios/registrar`   | No   | Crear cuenta                   |
| POST   | `/Usuarios/login`       | No   | Iniciar sesión → devuelve JWT  |
| GET    | `/Usuarios/perfil`      | Sí   | Perfil del usuario autenticado |
| PUT    | `/Usuarios/actualizar`  | Sí   | Actualizar perfil + foto/CV    |
| GET    | `/Usuarios/obtener`     | Sí   | Listar todos los usuarios      |
| GET    | `/Usuarios/obtener/:id` | Sí   | Obtener usuario por ID         |
| POST   | `/Usuarios/logout`      | No   | Cerrar sesión                  |

### Ofertas de Trabajo

| Método | Ruta                             | Auth | Descripción                     |
| ------ | -------------------------------- | ---- | ------------------------------- |
| GET    | `/Trabajos/obtener`              | No   | Listar ofertas activas          |
| GET    | `/Trabajos/obtener/:id`          | Sí   | Oferta por ID                   |
| GET    | `/Trabajos/categoria/:categoria` | No   | Filtrar por categoría           |
| POST   | `/Trabajos/registrar`            | Sí   | Crear oferta                    |
| PUT    | `/Trabajos/actualizar/:id`       | Sí   | Actualizar oferta               |
| PUT    | `/Trabajos/estado/:id`           | Sí   | Activar/desactivar              |
| DELETE | `/Trabajos/eliminar/:id`         | Sí   | Eliminar oferta                 |
| GET    | `/Trabajos/mis-ofertas`          | Sí   | Ofertas del usuario autenticado |

### Postulaciones

| Método | Ruta                               | Auth | Descripción                      |
| ------ | ---------------------------------- | ---- | -------------------------------- |
| POST   | `/Postulaciones/registrar`         | Sí   | Postularse a una oferta          |
| GET    | `/Postulaciones/mis-postulaciones` | Sí   | Postulaciones del usuario        |
| GET    | `/Postulaciones/oferta/:id`        | Sí   | Postulantes (dueño de la oferta) |
| PUT    | `/Postulaciones/:id/estado`        | Sí   | Aceptar/rechazar postulante      |

### Categorías

| Método | Ruta         | Auth | Descripción       |
| ------ | ------------ | ---- | ----------------- |
| GET    | `/Categoria` | No   | Listar categorías |

---

## Archivos subidos

- Fotos y CVs se guardan en `uploads/`
- Se sirven estáticamente en `http://localhost:5000/uploads/{archivo}`
- El directorio `uploads/` se crea automáticamente al iniciar el servidor
- Los nombres de archivo siguen el patrón: `{tipo}-{userId}-{timestamp}{ext}`

---

## Notas

- El password se excluye automáticamente de las respuestas de `GET /perfil`, `GET /obtener` y `GET /obtener/:id`
