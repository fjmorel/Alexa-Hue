"use strict";
const fs = require('fs');
const hue = require('node-hue-api');
const configFilename = "hue/alexa_hue_user";
function readUsername() {
    try {
        return fs.readFileSync(configFilename).toString();
    }
    catch (ex) {
        console.log("Failed to read Bridge username from file");
        return "";
    }
}
function register(IP) {
    return new hue.HueApi().registerUser(IP).then(newUser => {
        console.log("Created Hue user: " + JSON.stringify(newUser));
        fs.writeFile(configFilename, newUser);
        return newUser;
    });
}
function getBridge() {
    return hue.nupnpSearch().then(function (bridges) {
        if (!bridges || !bridges[0]) {
            throw "No bridge found";
        }
        const ip = bridges[0].ipaddress;
        const user = readUsername();
        let promise;
        if (!user)
            promise = register(ip);
        else
            promise = Promise.resolve(user);
        return promise.then(user => { return new hue.HueApi(ip, user); });
    });
}
exports.getBridge = getBridge;
