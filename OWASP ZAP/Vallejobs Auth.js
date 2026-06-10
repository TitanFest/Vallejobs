// Authentication script for Vallejobs
// Handles JWT-based authentication for ZAP

var CredentialVars = Java.type("org.zaproxy.zap.model.CredentialVars");

function authenticate(helper, paramsValues, credentials) {
    var url = "http://localhost:5000/Usuarios/login";
    var email = credentials.getParam("email");
    var password = credentials.getParam("password");

    var postData = JSON.stringify({
        email: email,
        password: password
    });

    var headers = [
        "Content-Type: application/json"
    ];

    var msg = helper.prepareMessage();
    msg.setRequestHeader("POST " + url + " HTTP/1.1\r\n" +
        "Host: localhost:5000\r\n" +
        "Content-Length: " + postData.length + "\r\n" +
        "Content-Type: application/json\r\n" +
        "Connection: close\r\n\r\n");
    msg.setRequestBody(postData);
    msg.getRequestHeader().setContentLength(msg.getRequestBody().length);

    var response = helper.sendMessage(msg, true);
    var body = msg.getResponseBody().toString();

    if (response && body) {
        var json = JSON.parse(body);
        if (json.token) {
            // Store the token for use in subsequent requests
            var headersMap = {};
            headersMap["Authorization"] = "Bearer " + json.token;
            helper.setUserAuthCredentials(headersMap);
            return msg;
        }
    }
    throw new Error("Authentication failed for user: " + email);
}

function getRequiredParamsNames() {
    return [];
}

function getOptionalParamsNames() {
    return [];
}

function getCredentialsParamNames() {
    return ["email", "password"];
}
