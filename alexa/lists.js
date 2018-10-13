"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
function listScenes(api) {
    return api.getScenes().then((scenes) => {
        return _1.sayWithCard("Scenes", scenes.map((s) => s.name));
    });
}
exports.listScenes = listScenes;
function listGroups(api) {
    return api.getGroups().then((groups) => {
        return _1.sayWithCard("Light Groups", groups.map((g) => g.name));
    });
}
exports.listGroups = listGroups;
function listLights(api) {
    return api.getLights().then((response) => {
        return _1.sayWithCard("Lights", response.lights.map((l) => l.name));
    });
}
exports.listLights = listLights;
