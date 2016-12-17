"use strict";
const _1 = require("./");
const lights_1 = require("../hue/lights");
function controlLights(bridge, command) {
    if (command.Scene) {
        const name = command.Scene.toLowerCase().replace(" seen", " scene").replace(" scene", "");
        return bridge.getScenes().then((scenes) => {
            const scene = scenes.filter((scene) => scene.name.toLowerCase() === name)[0];
            if (scene) {
                bridge.activateScene(scene.id);
            }
            else
                return _1.say("Scene not found. Ask me for a list of scenes!");
            if (name.indexOf("mood") > -1)
                return _1.say(["Setting the mood", "Good luck tonight"][Math.round(Math.random())]);
            return _1.say(_1.getSuccessResponse());
        });
    }
    const state = lights_1.buildLightState(command);
    let lights = command.Lights;
    if (lights)
        lights = lights.replace("like", "light");
    if (lights === "light" || lights === "lights" || !lights)
        lights = "all lights";
    if (lights.indexOf("lights") > -1) {
        const groupName = lights.replace(" lights", "");
        if (groupName === "all") {
            return bridge.setGroupLightState(0, state).then(() => _1.say(_1.getSuccessResponse()));
        }
        return bridge.getGroups().then((groups) => {
            const group = groups.filter((group) => group.name.toLowerCase() === groupName)[0];
            if (group) {
                bridge.setGroupLightState(group.id, state);
                return _1.say(_1.getSuccessResponse());
            }
            return _1.say("Does not compute. There is no group named '" + lights + "'");
        });
    }
    return new Promise((resolve) => {
        resolve(_1.say("Unable to understand command. Please try again."));
    });
}
exports.controlLights = controlLights;
