const light = document.getElementById('light');
const redButton = document.getElementById('redButton');
const increaseButton = document.getElementById('increaseButton');
const decreaseButton = document.getElementById('decreaseButton');
const switcher = document.getElementById('checkbox');
const MIN_BRIGHTNESS = 0.2;
const MAX_BRIGHTNESS = 1;
const STEP = 0.1;
let lightBrightness = 0.3;

enum Mode {
    WhiteLight,
    YellowLight,
    Disabled
}

let currentMode = Mode.WhiteLight;

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
    } else {
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
    if (Number(lightBrightness) < MAX_BRIGHTNESS) {
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
        light.style.opacity = (lightBrightness + STEP).toFixed(1);
        lightBrightness = parseFloat(light.style.opacity);
    } else {
        increaseButton.removeEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
    }
}

function decreaseBrightness() {
    if (Number(lightBrightness) > MIN_BRIGHTNESS) {
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
        light.style.opacity = String((lightBrightness - STEP).toFixed(1));
        lightBrightness = parseFloat(light.style.opacity);
    } else {
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.removeEventListener('click', decreaseBrightness);
    }
}

