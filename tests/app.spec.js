const { test, expect } = require("@playwright/test");

const testUser = {
  name: "Test",
  apellido: "User",
  documento: "1234567890",
  telefono: "3001234567",
  email: `test-${Date.now()}@vallejobs.com`,
  password: "Test123!",
};

let token;
let userId;
let categoriaId;
let ofertaId;
let postulacionId;
let adminToken;

test.describe("API Vallejobs — Tests completos", () => {
  // ─── HEALTH ────────────────────────────────────────────
  test("GET / — Bienvenida", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("Bienvenido");
  });

  // ─── REGISTRO ──────────────────────────────────────────
  test.describe("Registro de usuario", () => {
    test("POST /Usuarios/registrar — Crear usuario exitosamente", async ({
      request,
    }) => {
      const res = await request.post("/Usuarios/registrar", { data: testUser });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.email).toBe(testUser.email);
      expect(body.password).toBeUndefined();
      userId = body.id;
    });

    test("POST /Usuarios/registrar — Email duplicado da error", async ({
      request,
    }) => {
      const res = await request.post("/Usuarios/registrar", { data: testUser });
      expect(res.status()).toBe(500);
    });

    test("POST /Usuarios/registrar — Campos faltantes dan error", async ({
      request,
    }) => {
      const res = await request.post("/Usuarios/registrar", {
        data: { name: "Incompleto" },
      });
      expect(res.status()).toBe(500);
    });
  });

  // ─── LOGIN ─────────────────────────────────────────────
  test.describe("Login", () => {
    test("POST /Usuarios/login — Login exitoso devuelve token y usuario", async ({
      request,
    }) => {
      const res = await request.post("/Usuarios/login", {
        data: { email: testUser.email, password: testUser.password },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.token).toBeDefined();
      expect(body.user.email).toBe(testUser.email);
      expect(body.user.password).toBeUndefined();
      token = body.token;
    });

    test("POST /Usuarios/login — Credenciales inválidas", async ({
      request,
    }) => {
      const res = await request.post("/Usuarios/login", {
        data: { email: testUser.email, password: "wrong" },
      });
      expect(res.status()).toBe(401);
    });

    test("POST /Usuarios/login — Usuario no existe", async ({ request }) => {
      const res = await request.post("/Usuarios/login", {
        data: { email: "noexiste@test.com", password: "x" },
      });
      expect(res.status()).toBe(401);
    });
  });

  // ─── ADMIN LOGIN ───────────────────────────────────────
  test.describe("Login como admin", () => {
    test("POST /Usuarios/login — Admin login", async ({ request }) => {
      const res = await request.post("/Usuarios/login", {
        data: { email: "admin@vallejobs.com", password: "Admin123!" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      adminToken = body.token;
    });
  });

  // ─── PERFIL ────────────────────────────────────────────
  test.describe("Perfil de usuario", () => {
    test("GET /Usuarios/perfil — Sin token da 401", async ({ request }) => {
      const res = await request.get("/Usuarios/perfil");
      expect(res.status()).toBe(401);
    });

    test("GET /Usuarios/perfil — Con token devuelve perfil", async ({
      request,
    }) => {
      const res = await request.get("/Usuarios/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.email).toBe(testUser.email);
      expect(body.password).toBeUndefined();
    });
  });

  // ─── USUARIOS CRUD (admin) ─────────────────────────────
  test.describe("CRUD de usuarios (admin)", () => {
    test("GET /Usuarios/obtener — Listar usuarios requiere auth", async ({
      request,
    }) => {
      const res = await request.get("/Usuarios/obtener");
      expect(res.status()).toBe(401);
    });

    test("GET /Usuarios/obtener — Lista usuarios con token", async ({
      request,
    }) => {
      const res = await request.get("/Usuarios/obtener", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
    });

    test("GET /Usuarios/obtener/:id — Obtener usuario por ID", async ({
      request,
    }) => {
      const res = await request.get(`/Usuarios/obtener/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.email).toBe(testUser.email);
    });

    test("GET /Usuarios/obtener/999999 — ID inexistente", async ({
      request,
    }) => {
      const res = await request.get("/Usuarios/obtener/999999", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(404);
    });
  });

  // ─── CATEGORIAS (admin) ────────────────────────────────
  test.describe("CRUD de categorías", () => {
    test("GET /Categoria/obtener — Obtener todas (público)", async ({
      request,
    }) => {
      const res = await request.get("/Categoria/obtener");
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
    });

    test("POST /Categoria/registrar — Usuario normal NO puede crear", async ({
      request,
    }) => {
      const res = await request.post("/Categoria/registrar", {
        data: { nombre: "TestCat", descripcion: "Test" },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(403);
    });

    test("POST /Categoria/registrar — Admin SÍ puede crear", async ({
      request,
    }) => {
      const res = await request.post("/Categoria/registrar", {
        data: {
          nombre: `TestCat-${Date.now()}`,
          descripcion: "Categoría de prueba",
        },
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.nombre).toContain("TestCat");
      categoriaId = body.id;
    });

    test("PUT /Categoria/actualizar/:id — Admin puede editar", async ({
      request,
    }) => {
      const res = await request.put(`/Categoria/actualizar/${categoriaId}`, {
        data: { nombre: "TestCat-Editada", descripcion: "Editada" },
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.nombre).toBe("TestCat-Editada");
    });

    test("PUT /Categoria/actualizar/:id — Usuario normal NO puede editar", async ({
      request,
    }) => {
      const res = await request.put(`/Categoria/actualizar/${categoriaId}`, {
        data: { nombre: "NoDebePoder" },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(403);
    });

    test("DELETE /Categoria/eliminar/:id — Admin puede eliminar", async ({
      request,
    }) => {
      const res = await request.delete(`/Categoria/eliminar/${categoriaId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status()).toBe(200);
    });

    test("DELETE /Categoria/eliminar/:id — Usuario normal NO puede eliminar", async ({
      request,
    }) => {
      const res = await request.delete("/Categoria/eliminar/1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(403);
    });
  });

  // ─── OFERTAS DE TRABAJO ────────────────────────────────
  test.describe("CRUD de ofertas de trabajo", () => {
    test("POST /Trabajos/registrar — Sin token da 401", async ({ request }) => {
      const res = await request.post("/Trabajos/registrar", {
        data: {
          titulo: "Test",
          localizacion: "City",
          horario: "Tiempo completo",
        },
      });
      expect(res.status()).toBe(401);
    });

    test("POST /Trabajos/registrar — Crear oferta exitosamente", async ({
      request,
    }) => {
      const res = await request.post("/Trabajos/registrar", {
        data: {
          titulo: "Desarrollador de prueba",
          localizacion: "Valledupar",
          horario: "Tiempo completo",
          salario: 3000000,
          descripcion: "Puesto de prueba",
          requerimientos: ["React", "Node.js"],
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.titulo).toBe("Desarrollador de prueba");
      expect(body.userId).toBe(userId);
      ofertaId = body.id;
    });

    test("GET /Trabajos/obtener — Listar ofertas (público)", async ({
      request,
    }) => {
      const res = await request.get("/Trabajos/obtener");
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
    });

    test("GET /Trabajos/obtener/:id — Obtener oferta por ID", async ({
      request,
    }) => {
      const res = await request.get(`/Trabajos/obtener/${ofertaId}`);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.titulo).toBe("Desarrollador de prueba");
    });

    test("GET /Trabajos/obtener/999999 — Oferta inexistente da 404", async ({
      request,
    }) => {
      const res = await request.get("/Trabajos/obtener/999999");
      expect(res.status()).toBe(404);
    });

    test("GET /Trabajos/mis-ofertas — Sin token da 401", async ({
      request,
    }) => {
      const res = await request.get("/Trabajos/mis-ofertas");
      expect(res.status()).toBe(401);
    });

    test("GET /Trabajos/mis-ofertas — Lista ofertas del usuario", async ({
      request,
    }) => {
      const res = await request.get("/Trabajos/mis-ofertas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.length).toBeGreaterThanOrEqual(1);
    });

    test("PUT /Trabajos/actualizar/:id — Actualizar oferta", async ({
      request,
    }) => {
      const res = await request.put(`/Trabajos/actualizar/${ofertaId}`, {
        data: { titulo: "Desarrollador Actualizado", salario: 4000000 },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.titulo).toBe("Desarrollador Actualizado");
    });

    test("GET /Trabajos/categoria/:categoria — Filtrar por categoría", async ({
      request,
    }) => {
      const res = await request.get("/Trabajos/categoria/Tecnología");
      expect(res.status()).toBe(200);
      expect(Array.isArray(await res.json())).toBe(true);
    });

    test("GET /Trabajos/categoria/Inexistente — Categoría sin ofertas", async ({
      request,
    }) => {
      const res = await request.get("/Trabajos/categoria/NoExisteXYZ");
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.length).toBe(0);
    });

    test("DELETE /Trabajos/eliminar/:id — Eliminar oferta", async ({
      request,
    }) => {
      const res = await request.delete(`/Trabajos/eliminar/${ofertaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
    });
  });

  // ─── POSTULACIONES ─────────────────────────────────────
  test.describe("Postulaciones", () => {
    let jobForPostulacion;

    test.beforeAll(async ({ request }) => {
      const res = await request.post("/Trabajos/registrar", {
        data: {
          titulo: "Postúlate aquí",
          localizacion: "City",
          horario: "Tiempo completo",
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      jobForPostulacion = (await res.json()).id;
    });

    test("POST /Postulaciones/postular — Sin token da 401", async ({
      request,
    }) => {
      const res = await request.post("/Postulaciones/postular", {
        data: { ofertaId: jobForPostulacion },
      });
      expect(res.status()).toBe(401);
    });

    test("POST /Postulaciones/postular — Postularse exitosamente", async ({
      request,
    }) => {
      const res = await request.post("/Postulaciones/postular", {
        data: { ofertaId: jobForPostulacion },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.message).toContain("exitosa");
      expect(body.postulacion).toBeDefined();
      postulacionId = body.postulacion.id;
    });

    test("POST /Postulaciones/postular — Postulación duplicada da error", async ({
      request,
    }) => {
      const res = await request.post("/Postulaciones/postular", {
        data: { ofertaId: jobForPostulacion },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(400);
    });

    test("GET /Postulaciones/mis-postulaciones — Lista postulaciones del usuario", async ({
      request,
    }) => {
      const res = await request.get("/Postulaciones/mis-postulaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.length).toBeGreaterThanOrEqual(1);
      expect(body[0].oferta).toBeDefined();
    });

    test("PUT /Postulaciones/:id/estado — Aceptar postulación (owner)", async ({
      request,
    }) => {
      const res = await request.put(`/Postulaciones/${postulacionId}/estado`, {
        data: { estado: "aceptado" },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      expect((await res.json()).estado).toBe("aceptado");
    });

    test("PUT /Postulaciones/:id/estado — Rechazar postulación", async ({
      request,
    }) => {
      const res = await request.put(`/Postulaciones/${postulacionId}/estado`, {
        data: { estado: "rechazado" },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
    });

    test("GET /Postulaciones/oferta/:ofertaId — Ver postulantes de oferta propia", async ({
      request,
    }) => {
      const res = await request.get(
        `/Postulaciones/oferta/${jobForPostulacion}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      expect(res.status()).toBe(200);
      expect(Array.isArray(await res.json())).toBe(true);
    });
  });

  // ─── LOGOUT ────────────────────────────────────────────
  test.describe("Logout", () => {
    test("POST /Usuarios/logout — Cerrar sesión", async ({ request }) => {
      const res = await request.post("/Usuarios/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(200);
      expect((await res.json()).message).toContain("cerrada");
    });
  });
});
