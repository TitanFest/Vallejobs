"""
OWASP ZAP Security Test Suite for Vallejobs
=============================================
Pruebas automatizadas de seguridad utilizando la API REST de OWASP ZAP.

Requisitos:
  pip install requests

Uso:
  1. Inicia OWASP ZAP en modo daemon:
     zap.bat -daemon -port 8080 -host 127.0.0.1 -config api.disablekey=true

  2. python zap-security-test.py
"""

import json
import time
import webbrowser
from datetime import datetime
from pathlib import Path

import requests

# ============================================================
# CONFIGURACION
# ============================================================

ZAP_HOST = "127.0.0.1"
ZAP_PORT = "8080"
ZAP_API_KEY = ""  # Cambiar si configuraste API key

TARGET_BACKEND = "http://localhost:5000"
TARGET_FRONTEND = "http://localhost:3000"

REPORT_DIR = Path(__file__).parent / "reports"
REPORT_DIR.mkdir(exist_ok=True)

TEST_EMAIL = f"zaptest{int(time.time())}@vallejobs.com"
TEST_PASS = "TestZAP2024!"

REGISTER_ENDPOINTS = [
    ("POST", "/Usuarios/registrar", {
        "name": "Test ZAP",
        "apellido": "Seguridad",
        "documento": "1234567890",
        "telefono": "3001234567",
        "email": TEST_EMAIL,
        "password": TEST_PASS,
    }),
]

PUBLIC_ENDPOINTS = [
    ("GET", "/", None),
    ("GET", "/Trabajos/obtener", None),
    ("GET", "/Categoria/obtener", None),
]

AUTHENTICATED_ENDPOINTS = [
    ("GET", "/Usuarios/perfil", None),
    ("POST", "/Usuarios/logout", None),
    ("GET", "/Usuarios/obtener", None),
    ("GET", "/Trabajos/mis-ofertas", None),
    ("POST", "/Trabajos/registrar", {
        "titulo": "Test Seguridad ZAP",
        "descripcion": "Puesto de prueba para scan de seguridad",
        "localizacion": "Cali, Valle",
        "horario": "Lunes a Viernes 8am-5pm",
        "salario": 3000000,
        "requerimientos": "Pruebas automaticas",
    }),
    ("GET", "/Postulaciones/mis-postulaciones", None),
]

FUZZ_ENDPOINTS = [
    ("GET", "/Trabajos/obtener/1", None),
    ("GET", "/Trabajos/categoria/Tecnologia", None),
    ("GET", "/Categoria/obtener/1", None),
]

# ============================================================
# CLIENTE API ZAP (wrapper directo sin dependencia zapv2)
# ============================================================

class ZAPClient:
    """Cliente para la API REST de OWASP ZAP usando requests directas."""

    def __init__(self, host="127.0.0.1", port="8080", apikey=""):
        self.base = f"http://{host}:{port}"
        self.apikey = apikey
        self._session = requests.Session()
        self._session.verify = False
        if apikey:
            self._session.headers["X-ZAP-API-Key"] = apikey

    def _req(self, endpoint, params=None, method="GET", data=None):
        url = f"{self.base}/{endpoint}"
        if params is None:
            params = {}
        if self.apikey and "apikey" not in params:
            params["apikey"] = self.apikey
        resp = self._session.request(method, url, params=params, data=data, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def _other(self, endpoint, params=None, method="GET", data=None):
        url = f"{self.base}/{endpoint}"
        if params is None:
            params = {}
        if self.apikey and "apikey" not in params:
            params["apikey"] = self.apikey
        resp = self._session.request(method, url, params=params, data=data, timeout=30)
        resp.raise_for_status()
        return resp.text

    @property
    def version(self):
        return self._req("JSON/core/view/version/")["version"]

    # -- Spider --
    def spider_scan(self, url, maxchildren=5, recurse=True, context=None):
        params = {"url": url, "maxChildren": str(maxchildren), "recurse": str(recurse).lower()}
        if context:
            params["contextName"] = context
        return self._req("JSON/spider/action/scan/", params)["scan"]

    def spider_status(self, scan_id):
        return int(self._req("JSON/spider/view/status/", {"scanId": str(scan_id)})["status"])

    def spider_results(self, scan_id):
        return self._req("JSON/spider/view/results/", {"scanId": str(scan_id)})["results"]

    # -- Active Scan --
    def ascan_scan(self, url, recurse=True, inscopeonly=True):
        params = {"url": url, "recurse": str(recurse).lower(), "inScopeOnly": str(inscopeonly).lower()}
        return self._req("JSON/ascan/action/scan/", params)["scan"]

    def ascan_status(self, scan_id):
        return int(self._req("JSON/ascan/view/status/", {"scanId": str(scan_id)})["status"])

    # -- Alerts --
    def alerts(self, risk=None, url=None):
        params = {}
        if risk:
            params["risk"] = risk
        if url:
            params["baseurl"] = url
        result = self._req("JSON/alert/view/alerts/", params)
        return result.get("alerts", [])

    def alerts_count(self):
        return len(self.alerts())

    # -- Send request through ZAP --
    def send_request(self, request_str, follow_redirects=True):
        params = {"request": request_str, "followRedirects": str(follow_redirects).lower()}
        raw = self._req("JSON/core/action/sendRequest/", params)
        # ZAP devuelve {"sendRequest": "{...json string...}"}
        first_key = list(raw.keys())[0]
        return json.loads(raw[first_key])

    # -- Context --
    def include_in_context(self, context_name, regex):
        params = {"contextName": context_name, "regex": regex}
        return self._req("JSON/context/action/includeInContext/", params)

    # -- Reports --
    def generate_report(self, title, template, report_dir, report_file):
        params = {
            "title": title,
            "template": template,
            "reportDir": report_dir,
            "reportFileName": report_file,
            "display": "false",
        }
        return self._req("JSON/reports/action/generate/", params)

    # -- Proxy - send a URL through ZAP --
    def urlopen(self, url, headers=None):
        proxy = {"http": f"http://{ZAP_HOST}:{ZAP_PORT}", "https": f"http://{ZAP_HOST}:{ZAP_PORT}"}
        hdrs = headers or {}
        return requests.get(url, proxies=proxy, headers=hdrs, verify=False, timeout=15).text


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def print_banner():
    print("=" * 65)
    print("  OWASP ZAP - Security Test Suite para Vallejobs")
    print("=" * 65)
    print(f"  Backend:  {TARGET_BACKEND}")
    print(f"  Frontend: {TARGET_FRONTEND}")
    print(f"  ZAP API:  http://{ZAP_HOST}:{ZAP_PORT}")
    print(f"  Reportes: {REPORT_DIR}")
    print("=" * 65)


def connect_to_zap():
    print("\n[+] Conectando con OWASP ZAP...")
    zap = ZAPClient(ZAP_HOST, ZAP_PORT, ZAP_API_KEY)
    for attempt in range(10):
        try:
            v = zap.version
            print(f"    ZAP Version: {v}")
            print(f"    Conexion establecida directamente via API REST")
            return zap
        except Exception as e:
            if attempt < 9:
                print(f"    Intento {attempt + 1}/10 - ZAP aun no responde: {e}")
                time.sleep(3)
            else:
                print(f"    ERROR: No se pudo conectar con ZAP tras 10 intentos.")
                print(f"    Asegurate de que ZAP este corriendo en modo daemon:")
                print(f"      zap.bat -daemon -port {ZAP_PORT} -host {ZAP_HOST} -config api.disablekey=true")
                exit(1)


def authenticate(zap, email=TEST_EMAIL, password=TEST_PASS):
    print(f"\n[+] Autenticando como {email}...")
    login_url = f"{TARGET_BACKEND}/Usuarios/login"
    body = json.dumps({"email": email, "password": password})
    request_str = (
        f"POST {login_url} HTTP/1.1\r\n"
        f"Host: localhost:5000\r\n"
        f"Content-Type: application/json\r\n"
        f"Content-Length: {len(body)}\r\n"
        f"Connection: close\r\n\r\n"
        f"{body}"
    )
    try:
        result = zap.send_request(request_str, follow_redirects=True)
        resp_body = result.get("responseBody", "")
        data = json.loads(resp_body)
        token = data.get("token", "")
        if token:
            print("    Token JWT obtenido correctamente")
            return token
        print(f"    WARN: No se encontro token. Respuesta: {resp_body[:200]}")
        return None
    except Exception as e:
        print(f"    ERROR en autenticacion: {e}")
        return None


def get_auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def send_requests(zap, endpoints, token=None, tag="public"):
    headers = {}
    if token:
        headers = get_auth_header(token)

    print(f"\n[+] Enviando solicitudes ({tag})...")

    for method, path, data in endpoints:
        url = f"{TARGET_BACKEND}{path}"
        try:
            if method == "GET":
                zap.urlopen(url, headers=headers)
                print(f"    GET  {path}")
            else:
                body = json.dumps(data) if data else ""
                req = (
                    f"{method} {url} HTTP/1.1\r\n"
                    f"Host: localhost:5000\r\n"
                    f"Content-Type: application/json\r\n"
                    f"Content-Length: {len(body)}\r\n"
                    f"Authorization: {headers.get('Authorization', '')}\r\n"
                    f"Connection: close\r\n\r\n"
                    f"{body}"
                )
                zap.send_request(req, follow_redirects=True)
                print(f"    {method} {path}")
        except Exception as e:
            print(f"    ERROR en {method} {path}: {e}")

    print(f"    Envio de solicitudes ({tag}) completado.")


def spider_target(zap, url):
    print(f"\n[+] Spider en: {url}")
    try:
        scan_id = zap.spider_scan(url, maxchildren=5, recurse=True)
        print(f"    Spider ID: {scan_id}")
        while True:
            status = zap.spider_status(scan_id)
            print(f"    Progreso: {status}%", end="\r")
            if status >= 100:
                break
            time.sleep(2)
        urls = zap.spider_results(scan_id)
        print(f"\n    URLs encontradas: {len(urls)}")
    except Exception as e:
        print(f"    ERROR en spider: {e}")


def active_scan(zap):
    print(f"\n[+] Iniciando escaneo activo...")
    try:
        scan_id = zap.ascan_scan(TARGET_BACKEND, recurse=True, inscopeonly=True)
        print(f"    Active Scan ID: {scan_id}")
        while True:
            status = zap.ascan_status(scan_id)
            print(f"    Progreso: {status}%", end="\r")
            if status >= 100:
                break
            time.sleep(5)
        print(f"\n    Escaneo activo completado!")
    except Exception as e:
        print(f"    ERROR en escaneo activo: {e}")


def show_alerts_summary(zap):
    print(f"\n[+] Resumen de alertas:")
    all_alerts = zap.alerts()
    high = [a for a in all_alerts if a.get("risk") == "High"]
    medium = [a for a in all_alerts if a.get("risk") == "Medium"]
    low = [a for a in all_alerts if a.get("risk") == "Low"]
    total = len(all_alerts)

    print(f"    Total alertas:   {total}")
    print(f"    Alto riesgo:     {len(high)}")
    print(f"    Medio riesgo:    {len(medium)}")
    print(f"    Bajo riesgo:     {len(low)}")
    print()

    if high:
        print("    ALERTAS DE ALTO RIESGO:")
        for a in high:
            print(f"      - {a.get('alert', 'N/A')}")
            print(f"        URL: {a.get('url', 'N/A')}")
            print(f"        Solucion: {a.get('solution', 'N/A')}")
            print()

    if medium:
        print("    ALERTAS DE RIESGO MEDIO (primeras 10):")
        for a in medium[:10]:
            print(f"      - {a.get('alert', 'N/A')}  [{a.get('url', '')}]")
        if len(medium) > 10:
            print(f"      ... y {len(medium) - 10} mas")


def generate_report(zap):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    print(f"\n[+] Generando reportes...")

    formats = [
        ("HTML", "traditional-html", f"vallejobs-report-{timestamp}.html"),
        ("XML", "traditional-xml", f"vallejobs-report-{timestamp}.xml"),
        ("JSON", "traditional-json", f"vallejobs-report-{timestamp}.json"),
        ("Markdown", "traditional-md", f"vallejobs-report-{timestamp}.md"),
    ]

    html_report = None
    for fmt, template, filename in formats:
        try:
            zap.generate_report(
                title="Vallejobs Security Scan",
                template=template,
                report_dir=str(REPORT_DIR),
                report_file=filename.replace(f".{filename.split('.')[-1]}", ""),
            )
            print(f"    [{fmt}] Reporte: {REPORT_DIR / filename}")
            if fmt == "HTML":
                html_report = str(REPORT_DIR / filename)
        except Exception as e:
            print(f"    [{fmt}] WARN: {e}")

    return html_report


def main():
    print_banner()

    zap = connect_to_zap()

    # Primero registrar un usuario de prueba
    send_requests(zap, REGISTER_ENDPOINTS, token=None, tag="registro")

    # Luego autenticarse con ese usuario
    token = authenticate(zap, TEST_EMAIL, TEST_PASS)

    # Enviar trafico a traves de ZAP
    send_requests(zap, PUBLIC_ENDPOINTS, token=None, tag="publicos")
    if token:
        send_requests(zap, AUTHENTICATED_ENDPOINTS, token=token, tag="autenticados")
    send_requests(zap, FUZZ_ENDPOINTS, token=token, tag="fuzzing")

    try:
        zap.urlopen(TARGET_FRONTEND)
        print(f"\n[+] Frontend abierto: {TARGET_FRONTEND}")
    except Exception:
        pass

    # Spider
    print("\n" + "=" * 65)
    print("  FASE 1: Spider / Rastreo")
    print("=" * 65)
    spider_target(zap, TARGET_BACKEND)
    spider_target(zap, TARGET_FRONTEND)

    # Active Scan
    print("\n" + "=" * 65)
    print("  FASE 2: Escaneo Activo de Vulnerabilidades")
    print("=" * 65)
    active_scan(zap)

    # Resultados
    print("\n" + "=" * 65)
    print("  RESULTADOS")
    print("=" * 65)
    show_alerts_summary(zap)

    # Reportes
    print("\n" + "=" * 65)
    print("  REPORTES")
    print("=" * 65)
    report_path = generate_report(zap)

    print("\n" + "=" * 65)
    print("  PRUEBAS COMPLETADAS")
    print("=" * 65)
    if report_path:
        print(f"\n  Reporte HTML: {report_path}")
        try:
            webbrowser.open(f"file://{report_path}")
        except Exception:
            pass
    print()


if __name__ == "__main__":
    main()
