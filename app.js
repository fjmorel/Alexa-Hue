/// <reference path="typings/index.d.ts" />
"use strict";
//Lets require/import the HTTP module
const http = require('http');
const lights_1 = require('./hue/lights');
const Hue = require("./hue/bridge");
const Alexa = require('./alexa');
//Lets define a port we want to listen to
const PORT = 4567;
let bridge = Hue.getBridge();
//Create a server
let server = http.createServer(handleRequest);
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
//We need a function which handles requests and send response
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
        bridge.then(function (api) {
            return processCommand(intent, options, api);
        }).then(function (result) {
            response.end(JSON.stringify(result));
        });
    });
}
function processCommand(intent, command, bridge) {
    if (intent === "ListScenes") {
        return bridge.getScenes().then(function (scenes) {
            return Alexa.sayWithCard("Scenes", scenes.map(g => g.name));
        });
    }
    else if (intent === "ListGroups") {
        return bridge.getGroups().then(function (groups) {
            return Alexa.sayWithCard("Light Groups", groups.map(g => g.name));
        });
    }
    else if (intent === "ListLights") {
        return bridge.getLights().then(function (response) {
            return Alexa.sayWithCard("Lights", response.lights.map(g => g.name));
        });
    }
    else if (intent === "ControlLights") {
        if (command.Scene) {
            let name = command.Scene.toLowerCase().replace(' seen', ' scene').replace(" scene", "");
            //TODO get scene id from name
            return bridge.getScenes().then(scenes => {
                let scene = scenes.filter(scene => scene.name.toLowerCase() === name)[0];
                if (scene)
                    bridge.activateScene(scene.id);
                else
                    return Alexa.say("Scene not found. You can ask me for a list of scenes.");
                if (name.indexOf("mood") > -1)
                    return Alexa.say("Setting the mood.");
                return Alexa.say("As you wish.");
            });
        }
        let state = lights_1.buildLightState(command);
        let lights = command.Lights;
        //TODO ask for light if none specified or default to all always
        if (lights)
            lights = lights.replace('like', 'light');
        if (lights === "light" || lights === "lights" || !lights)
            lights = "all lights";
        if (lights.indexOf("lights") > -1) {
            let groupName = lights.replace(" lights", "");
            console.log(groupName);
            console.log(state.payload());
            if (groupName === "all") {
                return bridge.setGroupLightState(0, state).then(() => Alexa.say("As you wish"));
            }
            return bridge.getGroups().then(groups => {
                let group = groups.filter(group => group.name.toLowerCase() === groupName)[0];
                if (group) {
                    bridge.setGroupLightState(group.id, state);
                    return Alexa.say("As you wish");
                }
                return Alexa.say("Does not compute. There is no group named '" + lights + "'");
            });
        }
    }
    return new Promise(function (resolve) {
        resolve(Alexa.say("Why you make no sense."));
    });
}
