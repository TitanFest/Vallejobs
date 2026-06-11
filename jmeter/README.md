# Pruebas de rendimiento con JMeter

## Requisitos

- [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi) 5.6+ (descargar, descomprimir, ejecutar `bin/jmeter`)
- Backend corriendo en `http://localhost:5000`

## Escenarios incluidos

| Escenario             | Descripción                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Carga general**     | 10 usuarios virtuales, 10 iteraciones cada uno. Simula: health check, registro, login, perfil, listar ofertas, listar categorías, búsqueda por categoría |
| **Flujo autenticado** | 2 usuarios autenticados concurrentes: login, crear oferta de trabajo                                                                                     |

## Datos de prueba

`usuarios.csv` contiene 10 usuarios ficticios. Las contraseñas coinciden con el hash que espera el backend.

> ⚠️ La primera ejecución registra a los 10 usuarios. Ejecuciones posteriores fallarán en el registro (email duplicado), pero el resto del flujo funciona porque los usuarios ya existen.

## Cómo ejecutar

### Opción 1: CLI (sin interfaz gráfica)

```bash
# Desde el directorio Backend/jmeter/
jmeter -n -t vallejobs-test-plan.jmx -l resultados.jtl
```

### Opción 2: CLI con reporte HTML

```bash
jmeter -n -t vallejobs-test-plan.jmx -l resultados.jtl -e -o reporte/
```

Esto genera un dashboard HTML en `reporte/index.html`

### Opción 3: Interfaz gráfica

1. Abrir JMeter
2. `File → Open` → seleccionar `vallejobs-test-plan.jmx`
3. Click en el botón **Start** (play verde)

## Personalizar carga

Editar las **Variables Definidas por el Usuario** en el plan de prueba:

| Variable  | Default | Descripción                    |
| --------- | ------- | ------------------------------ |
| `THREADS` | 10      | Usuarios concurrentes          |
| `RAMP_UP` | 5       | Segundos para alcanzar THREADS |
| `LOOPS`   | 10      | Iteraciones por usuario        |

También se pueden pasar por línea de comandos:

```bash
jmeter -JTHREADS=50 -JRAMP_UP=10 -JLOOPS=5 -n -t vallejobs-test-plan.jmx -l resultados.jtl
```

## Endpoints probados

| Método | Ruta                           | Auth           | Descripción                    |
| ------ | ------------------------------ | -------------- | ------------------------------ |
| GET    | `/`                            | No             | Health check                   |
| POST   | `/Usuarios/registrar`          | No             | Registro de usuario            |
| POST   | `/Usuarios/login`              | No             | Inicio de sesión               |
| GET    | `/Usuarios/perfil`             | Bearer         | Perfil del usuario autenticado |
| GET    | `/Trabajos/obtener`            | No             | Listar ofertas de trabajo      |
| GET    | `/Categoria/obtener`           | No             | Listar categorías              |
| GET    | `/Trabajos/categoria/{nombre}` | No             | Filtrar ofertas por categoría  |
| POST   | `/Categoria/registrar`         | Bearer (admin) | Crear categoría                |
| POST   | `/Trabajos/registrar`          | Bearer         | Crear oferta de trabajo        |

## Estructura de archivos

```
jmeter/
├── vallejobs-test-plan.jmx   # Plan de prueba de JMeter
├── usuarios.csv               # Datos de usuarios de prueba
└── README.md                  # Este archivo
```
