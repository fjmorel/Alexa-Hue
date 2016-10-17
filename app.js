"use strict";
const http = require('http');
const bridge_1 = require("./hue/bridge");
const Alexa = require('./alexa');
let bridge = bridge_1.getBridge();
const PORT = 4567;
http.createServer(handleRequest).listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});
function handleRequest(request, response) {
    var body = [];
    request.on("error", (err) => {
        console.error(err);
    }).on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        let command = JSON.parse(Buffer.concat(body).toString()).request.intent;
        let intent = command.name;
        let options = Alexa.getSlotValues(command.slots);
        response.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
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
    });
}
