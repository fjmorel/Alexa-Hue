"use strict";
const _1 = require("./");
function listScenes(api) {
    return api.getScenes().then(function (scenes) {
        return _1.sayWithCard("Scenes", scenes.map(g => g.name));
    });
}
exports.listScenes = listScenes;
function listGroups(api) {
    return api.getGroups().then(function (groups) {
        return _1.sayWithCard("Light Groups", groups.map(g => g.name));
    });
}
exports.listGroups = listGroups;
function listLights(api) {
    return api.getLights().then(function (response) {
        return _1.sayWithCard("Lights", response.lights.map(g => g.name));
    });
}
exports.listLights = listLights;
