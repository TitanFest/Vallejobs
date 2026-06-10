const { test, expect } = require('@playwright/test');

const TEST_EMAIL = `e2e-${Date.now()}@test.com`;
const TEST_PASS = 'Test1234!';
const TEST_NAME = 'Test E2E';

test.describe('Vallejobs — Tests de interfaz completa', () => {

  test.describe('Página principal', () => {
    test('Carga con logo, sidebar y buscador', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.logo')).toContainText('VALLEJOBS');
      await expect(page.locator('.sidebar')).toBeVisible();
      await expect(page.locator('.search-bar')).toBeVisible();
    });

    test('Muestra la cuadrícula de empleos', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.main-content')).toBeVisible();
    });

    test('Muestra botones de registro y login (no autenticado)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.register-btn')).toBeVisible();
      await expect(page.locator('.login-btn')).toBeVisible();
    });
  });

  test.describe('Registro de usuario', () => {
    test('Muestra el formulario de registro', async ({ page }) => {
      await page.goto('/registro');
      await expect(page.locator('h2')).toContainText('Registro');
    });

    test('Registra un nuevo usuario correctamente', async ({ page }) => {
      await page.goto('/registro');
      const inputs = page.locator('.registro-container input');
      await inputs.nth(0).fill(TEST_NAME);           // name
      await inputs.nth(1).fill('Playwright');          // apellido
      await inputs.nth(2).fill('987654321');           // documento
      await inputs.nth(3).fill('3009876543');          // telefono
      await inputs.nth(4).fill(TEST_EMAIL);            // email
      await inputs.nth(5).fill(TEST_PASS);             // password
      await inputs.nth(6).fill(TEST_PASS);             // confirmPassword
      await page.click('.registro-container button[type="submit"]');
      await expect(page.locator('.registro-container')).toContainText(/exitosamente/i, { timeout: 10000 });
    });

    test('Muestra error si las contraseñas no coinciden', async ({ page }) => {
      await page.goto('/registro');
      const inputs = page.locator('.registro-container input');
      await inputs.nth(0).fill('Nombre');
      await inputs.nth(1).fill('Apellido');
      await inputs.nth(2).fill('123456789');
      await inputs.nth(3).fill('3000000000');
      await inputs.nth(4).fill('test@example.com');
      await inputs.nth(5).fill('Pass123!');
      await inputs.nth(6).fill('Diferente');
      await page.click('.registro-container button[type="submit"]');
      await expect(page.locator('.registro-container')).toContainText(/coinciden/i);
    });
  });

  test.describe('Inicio de sesión', () => {
    test('Muestra el formulario de login', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('h2')).toContainText('Inicio de sesión');
    });

    test('Inicia sesión correctamente y redirige al dashboard', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill(TEST_PASS);
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });
      await expect(page.locator('.dashboard-container')).toBeVisible();
    });

    test('Muestra error con credenciales inválidas', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill('wrongpassword');
      await page.locator('.login-btn').click();
      await expect(page.locator('.error-message')).toBeVisible();
    });
  });

  test.describe('Dashboard', () => {
    test('Muestra tarjetas de estadísticas y nombre del usuario', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill(TEST_PASS);
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });

      await expect(page.locator('.dashboard-cards')).toBeVisible();
      const cards = page.locator('.dashboard-card');
      expect(await cards.count()).toBeGreaterThanOrEqual(4);
      await expect(page.locator('.dashboard-header h1')).toContainText(TEST_NAME);
    });

    test('Tabs de postulaciones y ofertas funcionan', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill(TEST_PASS);
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });

      await page.locator('.dashboard-tab:has-text("Mis ofertas")').click();
      await expect(page.locator('.dashboard-tab.active')).toContainText('Mis ofertas');
      await page.locator('.dashboard-tab:has-text("Mis postulaciones")').click();
      await expect(page.locator('.dashboard-tab.active')).toContainText('Mis postulaciones');
    });

    test('Botón publicar empleo redirige a CreateJob', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill(TEST_PASS);
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });

      await page.locator('.dashboard-new-job-btn').click();
      await page.waitForURL('**/CreateJob');
    });
  });

  test.describe('Navegación autenticado', () => {
    test('Menú de perfil se abre, cierra y tiene opciones', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill(TEST_PASS);
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });

      await page.locator('.profile-btn').click();
      await expect(page.locator('.profile-dropdown')).toBeVisible();
      await expect(page.locator('.profile-dropdown')).toContainText('Mi perfil');
      await expect(page.locator('.profile-dropdown')).toContainText('Dashboard');
      await expect(page.locator('.profile-dropdown')).toContainText('Cerrar sesión');
      await page.locator('.profile-btn').click();
      await expect(page.locator('.profile-dropdown')).not.toBeVisible();
    });
  });

  test.describe('Cierre de sesión', () => {
    test('Cierra sesión y redirige al inicio', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill(TEST_PASS);
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });

      await page.locator('.profile-btn').click();
      await page.locator('.logout-btn').click();
      await page.waitForURL('**/');
      await expect(page.locator('.login-btn')).toBeVisible();
    });
  });

  test.describe('Rutas protegidas', () => {
    test('Redirige a /Login desde dashboard si no hay sesión', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForURL('**/Login', { timeout: 15000 });
    });

    test('Redirige a /Login desde CreateJob si no hay sesión', async ({ page }) => {
      await page.goto('/CreateJob');
      await page.waitForURL('**/Login', { timeout: 15000 });
    });

    test('Redirige a /Login desde EditProfile si no hay sesión', async ({ page }) => {
      await page.goto('/EditProfile');
      await page.waitForURL('**/Login', { timeout: 15000 });
    });
  });

  test.describe('Administración (admin)', () => {
    test('Admin puede ver enlace a Categorías y navegar', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill('admin@vallejobs.com');
      await page.locator('.password-container input').fill('Admin123!');
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });

      await page.locator('.profile-btn').click();
      await expect(page.locator('.profile-dropdown')).toContainText('Categorías');
      await page.locator('text=Categorías').click();
      await page.waitForURL('**/AdminCategories');
      await expect(page.locator('h1')).toContainText('Gestionar Categorías');
    });
  });

  test.describe('Búsqueda y filtros', () => {
    test('Buscador redirige con query param', async ({ page }) => {
      await page.goto('/');
      await page.locator('.search-bar input').fill('JavaScript');
      await page.locator('.search-btn').click();
      await page.waitForURL('**/?search=JavaScript');
    });

    test('Clic en categoría la activa y "Todos" la desactiva', async ({ page }) => {
      await page.goto('/');
      const categoryBtn = page.locator('.sidebar-btn').nth(1);
      await categoryBtn.click();
      await expect(categoryBtn).toHaveClass(/active/);
      await page.locator('.sidebar-btn').first().click();
      await expect(page.locator('.sidebar-btn').first()).toHaveClass(/active/);
    });
  });

  test.describe('Modal de empleo', () => {
    test('Abrir y cerrar modal al hacer clic en tarjeta', async ({ page }) => {
      await page.goto('/');
      const firstCard = page.locator('.job-card').first();
      await expect(firstCard).toBeVisible({ timeout: 10000 });
      await firstCard.click();
      await expect(page.locator('.modal-overlay')).toBeVisible();
      await expect(page.locator('.modal-header h2')).toBeVisible();
      await page.locator('.close-button').click();
      await expect(page.locator('.modal-overlay')).not.toBeVisible();
    });
  });

  test.describe('Perfil de usuario', () => {
    test('Muestra perfil del usuario autenticado', async ({ page }) => {
      await page.goto('/login');
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.locator('.password-container input').fill(TEST_PASS);
      await page.locator('.login-btn').click();
      await page.waitForURL('**/dashboard', { timeout: 15000 });
      await page.goto('/UserProfile');
      await expect(page.locator('.profile-container')).toBeVisible({ timeout: 10000 });
    });
  });
});
