var light = document.getElementById('lamp__light');
var redButton = document.getElementById('redButton');
var increaseButton = document.getElementById('increaseButton');
var decreaseButton = document.getElementById('decreaseButton');
var switcher = document.getElementById('checkbox');
var MIN_BRIGHTNESS = 0.2;
var MAX_BRIGHTNESS = 1;
var STEP = 0.1;
var lightBrightness = 0.3;
var Mode;
(function (Mode) {
    Mode[Mode["WhiteLight"] = 0] = "WhiteLight";
    Mode[Mode["YellowLight"] = 1] = "YellowLight";
    Mode[Mode["Disabled"] = 2] = "Disabled";
})(Mode || (Mode = {}));
var currentMode = Mode.WhiteLight;
increaseButton.addEventListener('click', increaseBrightness);
decreaseButton.addEventListener('click', decreaseBrightness);
redButton.addEventListener('click', redButtonToggle);
switcher.addEventListener('change', toggleSwitcher);
function toggleSwitcher() {
    if (this.checked) {
        light.style.backgroundImage = 'linear-gradient(white, rgba(255, 255, 255, 0))';
        light.style.visibility = "visible";
        currentMode = Mode.WhiteLight;
        redButton.addEventListener('click', redButtonToggle);
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
    }
    else {
        light.style.visibility = "hidden";
        redButton.removeEventListener('click', redButtonToggle);
        increaseButton.removeEventListener('click', increaseBrightness);
        decreaseButton.removeEventListener('click', decreaseBrightness);
    }
}
function redButtonToggle() {
    switch (currentMode) {
        case Mode.WhiteLight:
            light.style.backgroundImage = 'linear-gradient(yellow, rgba(255, 255, 0, 0))';
            currentMode = Mode.YellowLight;
            break;
        case Mode.YellowLight:
            light.style.visibility = 'hidden';
            currentMode = Mode.Disabled;
            break;
        case Mode.Disabled:
            light.style.backgroundImage = 'linear-gradient(white, rgba(255, 255, 255, 0))';
            light.style.visibility = 'visible';
            currentMode = Mode.WhiteLight;
            break;
    }
}
function increaseBrightness() {
    if (currentMode !== Mode.Disabled) {
        if (Number(lightBrightness) < MAX_BRIGHTNESS) {
            increaseButton.addEventListener('click', increaseBrightness);
            decreaseButton.addEventListener('click', decreaseBrightness);
            light.style.opacity = (lightBrightness + STEP).toFixed(1);
            lightBrightness = parseFloat(light.style.opacity);
        }
        else {
            increaseButton.removeEventListener('click', increaseBrightness);
        }
    }
}
function decreaseBrightness() {
    if (currentMode !== Mode.Disabled) {
        if (Number(lightBrightness) > MIN_BRIGHTNESS) {
            increaseButton.addEventListener('click', increaseBrightness);
            decreaseButton.addEventListener('click', decreaseBrightness);
            light.style.opacity = String((lightBrightness - STEP).toFixed(1));
            lightBrightness = parseFloat(light.style.opacity);
        }
        else {
            decreaseButton.removeEventListener('click', decreaseBrightness);
        }
    }
}
