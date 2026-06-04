# Vallejobs — Frontend

Cliente React para la plataforma de empleos Vallejobs. Consume la API REST del backend y proporciona una interfaz moderna para gestión de empleos y perfiles.

---

## Tecnologías

- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP:** Axios
- **Iconos:** FontAwesome 7, react-icons 5
- **Build:** react-scripts 5 (Create React App)

---

## Requisitos

- Node.js 18+
- Backend de Vallejobs corriendo en `http://localhost:5000`
- pnpm

---

## Instalación

```bash
cd Frontend
pnpm install
```

---

## Ejecución

```bash
pnpm start
```

La aplicación inicia en `http://localhost:3000`.

Para build de producción:

```bash
pnpm run build
```

---

## Estructura

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Componentes React
│   │   ├── Navbar.jsx         # Barra de navegación con búsqueda
│   │   ├── Login.jsx          # Inicio de sesión
│   │   ├── registro.jsx       # Registro de usuario
│   │   ├── MainContent.jsx    # Grid de ofertas
│   │   ├── JobModal.jsx       # Modal con detalle de oferta
│   │   ├── Sidebar.jsx        # Categorías
│   │   ├── CreateJob.jsx      # Publicar oferta
│   │   ├── EditJob.jsx        # Editar oferta
│   │   ├── UserProfile.jsx    # Perfil de usuario (propio o por ID)
│   │   ├── EditProfile.jsx    # Editar perfil con foto/CV
│   │   ├── JobApplicants.jsx  # Postulantes de una oferta
│   │   └── ProtectedRoute.jsx # Ruta protegida (requiere auth)
│   ├── pages/
│   │   ├── home.jsx           # Página principal
│   │   ├── dashboard.jsx      # Panel de control
│   │   └── UserList.jsx       # Lista de usuarios
│   ├── services/
│   │   └── authService.js     # Token, logout, helpers
│   ├── styles/                # Archivos CSS
│   │   ├── index.css          # Variables globales y reset
│   │   ├── Navbar.css
│   │   ├── MainContent.css
│   │   ├── Sidebar.css
│   │   ├── Home.css
│   │   ├── Login.css
│   │   ├── registro.css
│   │   ├── CreateJob.css
│   │   ├── EditProfile.css
│   │   ├── UserProfile.css
│   │   ├── Dashboard.css
│   │   ├── JobApplicants.css
│   │   ├── JobModal.css
│   │   └── App.css
│   ├── App.jsx             # Router principal
│   ├── index.js            # Entry point
│   └── index.css           # Variables CSS globales
└── package.json
```

---

## Rutas

| Ruta                 | Componente    | Auth | Descripción                  |
| -------------------- | ------------- | ---- | ---------------------------- |
| `/`                  | Home          | No   | Página principal con ofertas |
| `/Home`              | Home          | No   | Alias de `/`                 |
| `/login`             | Login         | No   | Inicio de sesión             |
| `/registro`          | Registro      | No   | Crear cuenta                 |
| `/dashboard`         | Dashboard     | Sí   | Panel de control             |
| `/CreateJob`         | CreateJob     | Sí   | Publicar oferta              |
| `/EditJob/:id`       | EditJob       | Sí   | Editar oferta                |
| `/UserProfile`       | UserProfile   | Sí   | Perfil propio                |
| `/UserProfile/:id`   | UserProfile   | Sí   | Perfil de otro usuario       |
| `/EditProfile`       | EditProfile   | Sí   | Editar perfil                |
| `/JobApplicants/:id` | JobApplicants | Sí   | Postulantes de una oferta    |
| `/UserList`          | UserList      | Sí   | Lista de usuarios            |

---

## Funcionalidades

- **Autenticación:** Login/registro con JWT, ruta protegida
- **Navegación:** Navbar con logo, barra de búsqueda y menú de perfil
- **Ofertas:** Grid de tarjetas, modal con detalle, filtro por categoría, búsqueda por texto
- **Dashboard:** Estadísticas, gestión de ofertas (crear, editar, eliminar, activar/desactivar)
- **Postulaciones:** Postularse a ofertas, ver postulantes con foto, aceptar/rechazar
- **Perfil:** Vista pública (`/UserProfile/:id`) con foto, datos, calificaciones
- **Edición de perfil:** Subir foto de perfil y CV con vista previa
- **Diseño:** Variables CSS, diseño responsive, colores consistentes

---

## Notas

- La API base está configurada en `http://localhost:5000` (hardcodeada en los componentes)
- Las imágenes se muestran desde `http://localhost:5000/uploads/{path}`
- El ESLint config (`react-app`) fue removido de `package.json` porque el paquete `eslint-config-react-app` no estaba instalado y bloqueaba el build
