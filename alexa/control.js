"use strict";
const _1 = require("./");
const lights_1 = require("../hue/lights");
function controlLights(bridge, command) {
    if (command.Scene) {
        const name = command.Scene.toLowerCase().replace(" seen", " scene").replace(" scene", "");
        return bridge.getScenes().then((scenes) => {
            const scene = scenes.filter((s) => s.name.toLowerCase() === name)[0];
            if (scene) {
                bridge.activateScene(scene.id);
            }
            else
                return _1.say("Scene not found. Ask me for a list of scenes!");
            if (name.indexOf("mood") > -1)
                return _1.say(["Setting the mood", "Good luck tonight"][Math.round(Math.random())]);
            return _1.sayResult(true);
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
            return bridge.setGroupLightState(0, state).then(() => _1.sayResult(true));
        }
        return bridge.getGroups().then((groups) => {
            const group = groups.filter((g) => g.name.toLowerCase() === groupName)[0];
            if (group) {
                bridge.setGroupLightState(group.id, state);
                return _1.sayResult(true);
            }
            return _1.say("Does not compute. There is no group named '" + lights + "'");
        });
    }
    return new Promise((resolve) => {
        resolve(_1.say("Why you make no sense. Please try again."));
    });
}
exports.controlLights = controlLights;
