"use strict";
const http = require('http');
const bridge_1 = require("./hue/bridge");
const Alexa = require('./alexa');
const bridge = bridge_1.getBridge();
const PORT = 4567;
http.createServer(handleRequest).listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s/lights", PORT);
});
function handleRequest(request, response) {
    try {
        if (!request.url || request.url.indexOf("/lights") < 0)
            throw new Error("Invalid URL");
        var body = [];
        request.on("error", (err) => {
            console.error(err);
        }).on('data', function (chunk) {
            body.push(chunk);
        }).on('end', processRequest.bind({}, body, response));
    }
    catch (ex) {
        console.log(new Date());
        console.error(ex);
        response.end(JSON.stringify(Alexa.say("Invalid request")));
    }
}
function processRequest(body, response) {
    response.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
    try {
        const command = JSON.parse(Buffer.concat(body).toString()).request.intent;
        const intent = command.name;
        const options = Alexa.getSlotValues(command.slots);
        bridge.then(function (hueApi) {
            if (intent === "ListScenes")
                return Alexa.listScenes(hueApi);
            else if (intent === "ListGroups")
                return Alexa.listGroups(hueApi);
            else if (intent === "ListLights")
                return Alexa.listLights(hueApi);
            else if (intent === "ControlLights")
                return Alexa.controlLights(hueApi, options);
            return new Promise(function (resolve) {
                resolve(Alexa.say("Why you make no sense."));
            });
        }).then(function (result) {
            response.end(JSON.stringify(result));
        });
    }
    catch (ex) {
        response.end(JSON.stringify(Alexa.say("Could not understand request")));
    }
}
