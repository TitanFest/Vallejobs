# Vallejobs Security Scan

ZAP by [Checkmarx](https://checkmarx.com/).

## Sumario de Alertas

| Nivel de riesgo | Número de Alertas |
| --------------- | ----------------- |
| Alto            | 0                 |
| Medio           | 4                 |
| Bajo            | 4                 |
| Informativo     | 3                 |

## Insights

| Level       | Razón       | Site                  | Descripción                                                      | Statistic |
| ----------- | ----------- | --------------------- | ---------------------------------------------------------------- | --------- |
| Bajo        | Advertencia |                       | ZAP errors logged - see the zap.log file for details             | 1         |
| Bajo        | Advertencia |                       | ZAP warnings logged - see the zap.log file for details           | 5         |
| Información | Informativo | http://localhost:3000 | Percentage of responses with status code 2xx                     | 81 %      |
| Información | Informativo | http://localhost:3000 | Percentage of responses with status code 4xx                     | 18 %      |
| Información | Informativo | http://localhost:3000 | Percentage of endpoints with content type application/javascript | 12 %      |
| Información | Informativo | http://localhost:3000 | Percentage of endpoints with content type application/json       | 12 %      |
| Información | Informativo | http://localhost:3000 | Percentage of endpoints with content type image/png              | 12 %      |
| Información | Informativo | http://localhost:3000 | Percentage of endpoints with content type image/x-icon           | 12 %      |
| Información | Informativo | http://localhost:3000 | Percentage of endpoints with content type text/html              | 37 %      |
| Información | Informativo | http://localhost:3000 | Percentage of endpoints with content type text/plain             | 12 %      |
| Información | Informativo | http://localhost:3000 | Percentage of endpoints with method GET                          | 100 %     |
| Información | Informativo | http://localhost:3000 | Count of total endpoints                                         | 8         |
| Información | Informativo | http://localhost:5000 | Percentage of responses with status code 2xx                     | 56 %      |
| Información | Informativo | http://localhost:5000 | Percentage of responses with status code 4xx                     | 43 %      |
| Información | Informativo | http://localhost:5000 | Percentage of endpoints with content type application/json       | 43 %      |
| Información | Informativo | http://localhost:5000 | Percentage of endpoints with content type text/html              | 56 %      |
| Información | Informativo | http://localhost:5000 | Percentage of endpoints with method GET                          | 87 %      |
| Información | Informativo | http://localhost:5000 | Percentage of endpoints with method POST                         | 12 %      |
| Información | Informativo | http://localhost:5000 | Count of total endpoints                                         | 16        |
| Información | Informativo | http://localhost:5000 | Percentage of slow responses                                     | 51 %      |

## Alertas

| Nombre                                                                                                    | Nivel de riesgo | Número de Instancias |
| --------------------------------------------------------------------------------------------------------- | --------------- | -------------------- |
| CSP: Failure to Define Directive with No Fallback                                                         | Medio           | Systemic             |
| Cabecera Content Security Policy (CSP) no configurada                                                     | Medio           | 4                    |
| Configuración Incorrecta Cross-Domain                                                                     | Medio           | Systemic             |
| Falta de cabecera Anti-Clickjacking                                                                       | Medio           | 4                    |
| Divulgación de Marcas de Tiempo - Unix                                                                    | Bajo            | 1                    |
| El servidor divulga información mediante un campo(s) de encabezado de respuesta HTTP ''''X-Powered-By'''' | Bajo            | Systemic             |
| Falta encabezado X-Content-Type-Options                                                                   | Bajo            | Systemic             |
| Revelación de IP privada                                                                                  | Bajo            | 1                    |
| Aplicación Web Moderna                                                                                    | Informativo     | 2                    |
| Divulgación de información - Comentarios sospechosos                                                      | Informativo     | 16                   |
| Petición de Autenticación Identificada                                                                    | Informativo     | 2                    |

## Detalles de la Alerta

### [ CSP: Failure to Define Directive with No Fallback ](https://www.zaproxy.org/docs/alerts/10055/)

##### Medio (Alta)

### Descripción

The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.

- URL: http://localhost:3000/sitemap.xml
  - Nombre del Nodo: `http://localhost:3000/sitemap.xml`
  - Método: `GET`
  - Parámetros: `Content-Security-Policy`
  - Ataque: ``
  - Evidencia: `default-src 'none'`
  - Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`
- URL: http://localhost:3000/static/js
  - Nombre del Nodo: `http://localhost:3000/static/js`
  - Método: `GET`
  - Parámetros: `Content-Security-Policy`
  - Ataque: ``
  - Evidencia: `default-src 'none'`
  - Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`
- URL: http://localhost:5000/Categoria
  - Nombre del Nodo: `http://localhost:5000/Categoria`
  - Método: `GET`
  - Parámetros: `Content-Security-Policy`
  - Ataque: ``
  - Evidencia: `default-src 'none'`
  - Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`
- URL: http://localhost:5000/Trabajos
  - Nombre del Nodo: `http://localhost:5000/Trabajos`
  - Método: `GET`
  - Parámetros: `Content-Security-Policy`
  - Ataque: ``
  - Evidencia: `default-src 'none'`
  - Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`
- URL: http://localhost:5000/Usuarios
  - Nombre del Nodo: `http://localhost:5000/Usuarios`
  - Método: `GET`
  - Parámetros: `Content-Security-Policy`
  - Ataque: ``
  - Evidencia: `default-src 'none'`
  - Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`
- URL: http://localhost:5000/robots.txt
  - Nombre del Nodo: `http://localhost:5000/robots.txt`
  - Método: `GET`
  - Parámetros: `Content-Security-Policy`
  - Ataque: ``
  - Evidencia: `default-src 'none'`
  - Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`
- URL: http://localhost:5000/sitemap.xml
  - Nombre del Nodo: `http://localhost:5000/sitemap.xml`
  - Método: `GET`
  - Parámetros: `Content-Security-Policy`
  - Ataque: ``
  - Evidencia: `default-src 'none'`
  - Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`

Instancia: Systemic

### Solución

Asegúrese de que su servidor web, servidor de aplicación, balanceador de carga, etc. está configurado apropiadamente para establecer la cabecera de Política de Seguridad de Contenido.

### Referencia

- [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
- [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
- [ https://content-security-policy.com/ ](https://content-security-policy.com/)
- [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
- [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)

#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)

#### WASC Id: 15

#### ID de la Fuente: 3

### [ Cabecera Content Security Policy (CSP) no configurada ](https://www.zaproxy.org/docs/alerts/10038/)

##### Medio (Alta)

### Descripción

La Política de seguridad de contenido (CSP) es una capa adicional de seguridad que ayuda a detectar y mitigar ciertos tipos de ataques, incluidos Cross Site Scripting (XSS) y ataques de inyección de datos. Estos ataques se utilizan para todo, desde el robo de datos hasta la desfiguración del sitio o la distribución de malware. CSP proporciona un conjunto de encabezados HTTP estándar que permiten a los propietarios de sitios web declarar fuentes de contenido aprobadas que los navegadores deberían poder cargar en esa página; los tipos cubiertos son JavaScript, CSS, marcos HTML, fuentes, imágenes y objetos incrustados como applets de Java, ActiveX, archivos de audio y video.

- URL: http://localhost:3000
  - Nombre del Nodo: `http://localhost:3000`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``
- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``
- URL: http://localhost:5000
  - Nombre del Nodo: `http://localhost:5000`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``
- URL: http://localhost:5000/
  - Nombre del Nodo: `http://localhost:5000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``

Instancia: 4

### Solución

Asegúrese de que su servidor web, servidor de aplicaciones, balanceador de carga, etc. esté configurado para establecer la cabecera Content-Security-Policy.

### Referencia

- [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [ https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
- [ https://w3c.github.io/webappsec-csp/ ](https://w3c.github.io/webappsec-csp/)
- [ https://web.dev/articles/csp ](https://web.dev/articles/csp)
- [ https://caniuse.com/#feat=contentsecuritypolicy ](https://caniuse.com/#feat=contentsecuritypolicy)
- [ https://content-security-policy.com/ ](https://content-security-policy.com/)

#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)

#### WASC Id: 15

#### ID de la Fuente: 3

### [ Configuración Incorrecta Cross-Domain ](https://www.zaproxy.org/docs/alerts/10098/)

##### Medio (Media)

### Descripción

La carga de datos del navegador web puede ser posible, debido a una mala configuración de Cross Origin Resource Sharing (CORS) en el servidor web.

- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `Access-Control-Allow-Origin: *`
  - Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
- URL: http://localhost:3000/favicon.ico
  - Nombre del Nodo: `http://localhost:3000/favicon.ico`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `Access-Control-Allow-Origin: *`
  - Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
- URL: http://localhost:3000/logo192.png
  - Nombre del Nodo: `http://localhost:3000/logo192.png`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `Access-Control-Allow-Origin: *`
  - Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
- URL: http://localhost:3000/robots.txt
  - Nombre del Nodo: `http://localhost:3000/robots.txt`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `Access-Control-Allow-Origin: *`
  - Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
- URL: http://localhost:3000/sitemap.xml
  - Nombre del Nodo: `http://localhost:3000/sitemap.xml`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `Access-Control-Allow-Origin: *`
  - Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`

Instancia: Systemic

### Solución

Asegúrese de que los datos confidenciales no estén disponibles de forma no autenticada (por ejemplo, mediante listas blancas de direcciones IP).
Configure el encabezado HTTP "Access-Control-Allow-Origin" a un conjunto más restrictivo de dominios, o elimine todos los encabezados CORS por completo, para permitir que el navegador web aplique la Política del Mismo Origen (SOP) de una manera más restrictiva.

### Referencia

- [ https://vulncat.fortify.com/en/detail?category=HTML5&subcategory=Overly%20Permissive%20CORS%20Policy ](https://vulncat.fortify.com/en/detail?category=HTML5&subcategory=Overly%20Permissive%20CORS%20Policy)

#### CWE Id: [ 264 ](https://cwe.mitre.org/data/definitions/264.html)

#### WASC Id: 14

#### ID de la Fuente: 3

### [ Falta de cabecera Anti-Clickjacking ](https://www.zaproxy.org/docs/alerts/10020/)

##### Medio (Media)

### Descripción

La respuesta no protege contra ataques de "ClickJacking". Debes incluir Content-Security-Policy con la directiva "frame-ancestors" o X-Frame-Options.

- URL: http://localhost:3000
  - Nombre del Nodo: `http://localhost:3000`
  - Método: `GET`
  - Parámetros: `x-frame-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``
- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: `x-frame-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``
- URL: http://localhost:5000
  - Nombre del Nodo: `http://localhost:5000`
  - Método: `GET`
  - Parámetros: `x-frame-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``
- URL: http://localhost:5000/
  - Nombre del Nodo: `http://localhost:5000/`
  - Método: `GET`
  - Parámetros: `x-frame-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: ``

Instancia: 4

### Solución

Los navegadores web modernos admiten las cabeceras HTTP Content-Security-Policy y X-Frame-Options. Asegúrese de que una de ellas está configurada en todas las páginas web devueltas por su sitio/aplicación.
Si espera que la página esté enmarcada solo por páginas en su servidor (por ejemplo, si forma parte de un FRAMESET), utilice SAMEORIGIN; de lo contrario, si no espera que la página esté enmarcada, utilice DENY. Alternativamente, considere implementar la directiva "frame-ancestors" de la Política de Seguridad de Contenidos.

### Referencia

- [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)

#### CWE Id: [ 1021 ](https://cwe.mitre.org/data/definitions/1021.html)

#### WASC Id: 15

#### ID de la Fuente: 3

### [ Divulgación de Marcas de Tiempo - Unix ](https://www.zaproxy.org/docs/alerts/10096/)

##### Bajo (Baja)

### Descripción

Una marca de tiempo fue revelada por la aplicación/servidor web. - Unix

- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `1836589329`
  - Otra información: `1836589329, que se evalúa como: 2028-03-13 14:42:09.`

Instancia: 1

### Solución

Confirmar que los datos encontrados de información sobre la marca de tiempo no son sensibles, ni se pueden usar en patrones explotables de divulgación.

### Referencia

- [ https://cwe.mitre.org/data/definitions/200.html ](https://cwe.mitre.org/data/definitions/200.html)

#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)

#### WASC Id: 13

#### ID de la Fuente: 3

### [ El servidor divulga información mediante un campo(s) de encabezado de respuesta HTTP ''''X-Powered-By'''' ](https://www.zaproxy.org/docs/alerts/10037/)

##### Bajo (Media)

### Descripción

El servidor de la web/aplicación está divulgando información mediante uno o más encabezados de respuesta HTTP ''''X-Powered-By''''. El acceso a tal información podría facilitarle a los atacantes la identificación de otros marcos/componentes de los que su aplicación web depende y las vulnerabilidades a las que pueden estar sujetos tales componentes.

- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:3000/favicon.ico
  - Nombre del Nodo: `http://localhost:3000/favicon.ico`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:3000/logo192.png
  - Nombre del Nodo: `http://localhost:3000/logo192.png`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:3000/robots.txt
  - Nombre del Nodo: `http://localhost:3000/robots.txt`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:3000/sitemap.xml
  - Nombre del Nodo: `http://localhost:3000/sitemap.xml`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:5000/
  - Nombre del Nodo: `http://localhost:5000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:5000/Categoria/obtener
  - Nombre del Nodo: `http://localhost:5000/Categoria/obtener`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:5000/Trabajos/obtener
  - Nombre del Nodo: `http://localhost:5000/Trabajos/obtener`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:5000/Usuarios/login
  - Nombre del Nodo: `http://localhost:5000/Usuarios/login ()({email,password})`
  - Método: `POST`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``
- URL: http://localhost:5000/Usuarios/registrar
  - Nombre del Nodo: `http://localhost:5000/Usuarios/registrar ()({name,apellido,documento,telefono,email,password})`
  - Método: `POST`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `X-Powered-By: Express`
  - Otra información: ``

Instancia: Systemic

### Solución

Asegúrese de que su servidor web, servidor de aplicaciones, balanceador de carga, etc. está configurado para suprimir las cabeceras "X-Powered-By".

### Referencia

- [ https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework ](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework)
- [ https://www.troyhunt.com/shhh-dont-let-your-response-headers/ ](https://www.troyhunt.com/shhh-dont-let-your-response-headers/)

#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)

#### WASC Id: 13

#### ID de la Fuente: 3

### [ Falta encabezado X-Content-Type-Options ](https://www.zaproxy.org/docs/alerts/10021/)

##### Bajo (Media)

### Descripción

La cabecera Anti-MIME-Sniffing X-Content-Type-Options no se ha establecido en 'nosniff'. Esto permite que las versiones anteriores de Internet Explorer y Chrome realicen MIME-sniffing en el cuerpo de la respuesta, lo que puede provocar que el cuerpo dé la respuesta se interprete y se muestre como un tipo de contenido distinto del tipo de contenido declarado. Las versiones actuales (principios de 2014) y heredadas de Firefox utilizarán el tipo de contenido declarado (si se establece uno), en lugar de realizar MIME-sniffing.

- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:3000/favicon.ico
  - Nombre del Nodo: `http://localhost:3000/favicon.ico`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:3000/logo192.png
  - Nombre del Nodo: `http://localhost:3000/logo192.png`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:3000/manifest.json
  - Nombre del Nodo: `http://localhost:3000/manifest.json`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:3000/robots.txt
  - Nombre del Nodo: `http://localhost:3000/robots.txt`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:5000/
  - Nombre del Nodo: `http://localhost:5000/`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:5000/Categoria/obtener
  - Nombre del Nodo: `http://localhost:5000/Categoria/obtener`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:5000/Trabajos/categoria/Tecnologia
  - Nombre del Nodo: `http://localhost:5000/Trabajos/categoria/Tecnologia`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:5000/Trabajos/obtener
  - Nombre del Nodo: `http://localhost:5000/Trabajos/obtener`
  - Método: `GET`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
- URL: http://localhost:5000/Usuarios/registrar
  - Nombre del Nodo: `http://localhost:5000/Usuarios/registrar ()({name,apellido,documento,telefono,email,password})`
  - Método: `POST`
  - Parámetros: `x-content-type-options`
  - Ataque: ``
  - Evidencia: ``
  - Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`

Instancia: Systemic

### Solución

Asegúrese de que la aplicación/servidor web establece el encabezado Content-Type adecuadamente, y que establece el encabezado X-Content-Type-Options a 'nosniff' para todas las páginas web.
Si es posible, asegúrese de que el usuario final utiliza un navegador web moderno y compatible con los estándares que no realiza MIME-sniffing en absoluto, o que puede ser dirigido por la aplicación web/servidor web para que no realice MIME-sniffing.

### Referencia

- [ https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85) ](<https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85)>)
- [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)

#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)

#### WASC Id: 15

#### ID de la Fuente: 3

### [ Revelación de IP privada ](https://www.zaproxy.org/docs/alerts/2/)

##### Bajo (Media)

### Descripción

Se ha encontrado una IP privada (como 10.x.x.x, 172.x.x.x, 192.168.x.x) o un nombre de host privado de Amazon EC2 (por ejemplo, ip-10-0-56-78) en el cuerpo de la respuesta HTTP. Esta información podría ser útil para futuros ataques dirigidos a sistemas internos.

- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `10.8.1.1`
  - Otra información: `10.8.1.1
10.8.1.1
10.1.9.34
`

Instancia: 1

### Solución

Eliminar la dirección IP privada del cuerpo de la respuesta HTTP. Para los comentarios, utilice comentarios JSP/ASP/PHP en lugar de comentarios HTML/JavaScript que pueden ser vistos por los navegadores de los clientes.

### Referencia

- [ https://datatracker.ietf.org/doc/html/rfc1918 ](https://datatracker.ietf.org/doc/html/rfc1918)

#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)

#### WASC Id: 13

#### ID de la Fuente: 3

### [ Aplicación Web Moderna ](https://www.zaproxy.org/docs/alerts/10109/)

##### Informativo (Media)

### Descripción

La aplicación parece ser una aplicación web moderna. Si necesita explorarla automáticamente, el Ajax Spider puede ser más eficaz que el estándar.

- URL: http://localhost:3000
  - Nombre del Nodo: `http://localhost:3000`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `<script defer src="/static/js/bundle.js"></script>`
  - Otra información: `No se han encontrado enlaces aunque sí scripts, lo que indica que se trata de una aplicación web moderna.`
- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `<script defer src="/static/js/bundle.js"></script>`
  - Otra información: `No se han encontrado enlaces aunque sí scripts, lo que indica que se trata de una aplicación web moderna.`

Instancia: 2

### Solución

Se trata de una alerta informativa, por lo que no es necesario realizar ningún cambio.

### Referencia

#### ID de la Fuente: 3

### [ Divulgación de información - Comentarios sospechosos ](https://www.zaproxy.org/docs/alerts/10027/)

##### Informativo (Media)

### Descripción

The response appears to contain suspicious comments which may help an attacker.

- URL: http://localhost:3000
  - Nombre del Nodo: `http://localhost:3000`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `r can be referenced from the HTML.

    `

  - Otra información: `The following pattern was used: \bFROM\b and was detected in likely comment: "<!--
  Notice the use of  in the tags above.
  It will be replaced with the URL of the `public` folder during the buil", see evidence field for the suspicious comment/snippet.`

- URL: http://localhost:3000
  - Nombre del Nodo: `http://localhost:3000`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `stalled on a
  user's mobile device or `
  - Otra información: `The following pattern was used: \bUSER\b and was detected in likely comment: "<!--
  manifest.json provides metadata used when your web app is installed on a
  user's mobile device or desktop. See", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `r can be referenced from the HTML.

    `

  - Otra información: `The following pattern was used: \bFROM\b and was detected in likely comment: "<!--
  Notice the use of  in the tags above.
  It will be replaced with the URL of the `public` folder during the buil", see evidence field for the suspicious comment/snippet.`

- URL: http://localhost:3000/
  - Nombre del Nodo: `http://localhost:3000/`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `stalled on a
  user's mobile device or `
  - Otra información: `The following pattern was used: \bUSER\b and was detected in likely comment: "<!--
  manifest.json provides metadata used when your web app is installed on a
  user's mobile device or desktop. See", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: ` * Extracts exports from a webpack module ob`
  - Otra información: `The following pattern was used: \bFROM\b and was detected 257 times, the first in likely comment: "/\*\*
- Extracts exports from a webpack module object.
- @param {string} moduleId A Webpack module ID.
- @returns {\*} An export", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `is not updated if`select.multiple` is`
  - Otra información: `The following pattern was used: \bSELECT\b and was detected 17 times, the first in likely comment: "// Note: `option.selected`is not updated if`select.multiple` is", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `/ but it triggers a bug in IE11 and Edge 14`
  - Otra información: `The following pattern was used: \bBUG\b and was detected 20 times, the first in likely comment: "// but it triggers a bug in IE11 and Edge 14/15.", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `/\*\*
  - The query() method is intende`
  - Otra información: `The following pattern was used: \bQUERY\b and was detected 6 times, the first in likely comment: "/\*\*
  - The query() method is intended for document requests, in which we want to
  - call an optional action and potentially ", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `// FIXME: This feels gross. `
  - Otra información: `The following pattern was used: \bFIXME\b and was detected 2 times, the first in likely comment: "// FIXME: This feels gross.  How can we cleanup the lines between", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `// TODO: This could be clea`
  - Otra información: `The following pattern was used: \bTODO\b and was detected 228 times, the first in likely comment: "// TODO: This could be cleaned up.  push/replace should probably just take", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `// We will warn the user (as this is likely `
  - Otra información: `The following pattern was used: \bUSER\b and was detected 74 times, the first in likely comment: "// We will warn the user (as this is likely a mistake) and assume they cannot be refreshed.", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `d,
    - easier-to-debug exception with a cl`
  - Otra información: `The following pattern was used: \bDEBUG\b and was detected 12 times, the first in likely comment: "/\*
    - The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
    - and Temporal.\* types. See https://g", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `f using params["*"] later because it will be `
  - Otra información: `The following pattern was used: \bLATER\b and was detected 38 times, the first in likely comment: "// instead of using params["*"] later because it will be decoded then", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `l
- for situations where you don't want to s`
- Otra información: `The following pattern was used: \bWHERE\b and was detected 71 times, the first in likely comment: "/\*\*
- Hash history stores the location in window.location.hash. This makes it ideal
- for situations where you don't want to s", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `oes not allow empty username,`
  - Otra información: `The following pattern was used: \bUSERNAME\b and was detected 4 times, the first in likely comment: "// Since HTTP basic authentication does not allow empty username,", see evidence field for the suspicious comment/snippet.`
- URL: http://localhost:3000/static/js/bundle.js
  - Nombre del Nodo: `http://localhost:3000/static/js/bundle.js`
  - Método: `GET`
  - Parámetros: ``
  - Ataque: ``
  - Evidencia: `s it will result in bugs.`
  - Otra información: `The following pattern was used: \bBUGS\b and was detected 9 times, the first in likely comment: "// case we should log a warning as it will result in bugs.", see evidence field for the suspicious comment/snippet.`

Instancia: 16

### Solución

Eliminar todos los comentarios que muestren información que pueda ayudar a un atacante y solucionar el problema al que se refieren.

### Referencia

#### CWE Id: [ 615 ](https://cwe.mitre.org/data/definitions/615.html)

#### WASC Id: 13

#### ID de la Fuente: 3

### [ Petición de Autenticación Identificada ](https://www.zaproxy.org/docs/alerts/10111/)

##### Informativo (Alta)

### Descripción

La petición en cuestión se ha identificado como una petición de autenticación. El campo "Otra información" contiene un conjunto de líneas key=vvalue que identifican cualquier campo relevante. Si la solicitud está en un contexto que tiene un método de autenticación configurado como "Detección automática", esta regla cambiará la autenticación para que coincida con la petición identificada.

- URL: http://localhost:5000/Usuarios/registrar
  - Nombre del Nodo: `http://localhost:5000/Usuarios/registrar ()({name,apellido,documento,telefono,email,password})`
  - Método: `POST`
  - Parámetros: `email`
  - Ataque: ``
  - Evidencia: `password`
  - Otra información: `userParam=email
userValue=zaptest1781063083@vallejobs.com
passwordParam=password`
- URL: http://localhost:5000/Usuarios/login
  - Nombre del Nodo: `http://localhost:5000/Usuarios/login ()({email,password})`
  - Método: `POST`
  - Parámetros: `email`
  - Ataque: ``
  - Evidencia: `password`
  - Otra información: `userParam=email
userValue=usuario@vallejobs.com
passwordParam=password`

Instancia: 2

### Solución

Se trata de una alerta informativa y no de una vulnerabilidad, por lo que no hay nada que corregir.

### Referencia

- [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/)

#### ID de la Fuente: 3
