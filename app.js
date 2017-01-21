"use strict";
const http = require("http");
const bridge_1 = require("./hue/bridge");
const Alexa = require("./alexa");
const bridge = bridge_1.getBridge();
const PORT = 4567;
http.createServer(handleRequest).listen(PORT, () => {
    console.log("Server listening on: http://localhost:%s/lights", PORT);
});
function handleRequest(request, response) {
    try {
        if (!request.url || request.url.indexOf("/lights") < 0)
            throw new Error("Invalid URL");
        const body = [];
        request.on("error", (err) => {
            console.error(err);
        }).on("data", (chunk) => {
            body.push(chunk);
        }).on("end", processRequest.bind({}, body, response));
    }
    catch (ex) {
        console.error(ex.message);
        response.end(JSON.stringify(Alexa.sayResult(false)));
    }
}
function processRequest(body, response) {
    response.writeHead(200, { "Content-Type": "application/json;charset=UTF-8" });
    try {
        const obj = JSON.parse(Buffer.concat(body).toString());
        const stayOn = !obj.session.new;
        const request = obj.request;
        switch (request.type) {
            case "LaunchRequest":
                response.end(JSON.stringify(Alexa.say("You can ask me to set the lights to a color or specific scene. For example, set the lights to blue. How may I be of assistance?", true)));
                break;
            case "SessionEndedRequest":
                response.end(JSON.stringify(Alexa.say("Goodbye")));
                break;
            default:
                bridge.then((hueApi) => {
                    switch (request.intent.name) {
                        case "ListScenes":
                            return Alexa.listScenes(hueApi);
                        case "ListGroups":
                            return Alexa.listGroups(hueApi);
                        case "ListLights":
                            return Alexa.listLights(hueApi);
                        case "ControlLights":
                            return Alexa.controlLights(hueApi, Alexa.getSlotValues(request.intent.slots));
                        default:
                            return new Promise((resolve) => { resolve(Alexa.say("Why you make no sense.")); });
                    }
                }).then((result) => {
                    result.response.shouldEndSession = !stayOn;
                    response.end(JSON.stringify(result));
                });
        }
    }
    catch (ex) {
        response.end(JSON.stringify(Alexa.sayResult(false)));
    }
}
