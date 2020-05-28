const controlButtons = document.getElementsByClassName('control__button');
const light = document.getElementById('lamp__light');
const redButton = document.getElementById('redButton');
const increaseButton = document.getElementById('increaseButton');
const decreaseButton = document.getElementById('decreaseButton');
const switcher = document.getElementById('checkbox');
const MIN_BRIGHTNESS = 0.2;
const MAX_BRIGHTNESS = 1;
const STEP = 0.1;
let lightBrightness = 0.3;

const STATES = {
    whiteLight: 'whiteLight',
    yellowLight: 'yellowLight',
    noLight: 'noLight',
    disabled: 'disabled'
}

const GRADIENT = {
    WHITE: 'linear-gradient(white, rgba(255, 255, 255, 0))',
    YELLOW: 'linear-gradient(yellow, rgba(255, 255, 0, 0))',
    NONE: 'none'
}

function lightBulb() {
    let state = STATES.whiteLight;

    return {
        state() {
            return state;
        },
        toggle(){
            switch (state) {
                case STATES.whiteLight:
                    light.style.backgroundImage = GRADIENT.YELLOW;
                    state = STATES.yellowLight;
                    break;
                case STATES.yellowLight:
                    light.style.backgroundImage = GRADIENT.NONE;
                    state = STATES.noLight;
                    break;
                case STATES.noLight:
                    state = STATES.whiteLight;
                    light.style.backgroundImage = GRADIENT.WHITE;
                    break;
            }
        },
        switchOff(){
            state = STATES.disabled;
        },
        switchOn(){
            state = STATES.whiteLight;
        }
    }
}

const bulb = lightBulb();


increaseButton.onclick = increaseBrightness;
decreaseButton.onclick = decreaseBrightness;
redButton.onclick = redButtonToggle;
switcher.onchange = toggleSwitcher;


function toggleSwitcher() {
    if (this.checked) {
        light.style.backgroundImage = GRADIENT.WHITE;
        bulb.switchOn();
        for (let controlButton of controlButtons) {
            controlButton.disabled = false;
        }
    } else {
        bulb.switchOff();
        light.style.backgroundImage = GRADIENT.NONE;
        for (let controlButton of controlButtons) {
            controlButton.disabled = true;
        }
    }
}

function increaseBrightness() {
    if(bulb.state() !== STATES.disabled) {
        if (Number(lightBrightness) < MAX_BRIGHTNESS) {
            light.style.opacity = (lightBrightness + STEP).toFixed(1);
            lightBrightness = parseFloat(light.style.opacity);
            increaseButton.disabled = false;
            decreaseButton.disabled = false;
        } else {
            increaseButton.disabled = true;
        }
    }
}

function decreaseBrightness() {
    if(bulb.state() !== STATES.disabled) {
        if (Number(lightBrightness) > MIN_BRIGHTNESS) {
            light.style.opacity = String((lightBrightness - STEP).toFixed(1));
            lightBrightness = parseFloat(light.style.opacity);
            increaseButton.disabled = false;
            decreaseButton.disabled = false;
        } else {
            decreaseButton.disabled = true;
        }
    }
}

function redButtonToggle() {
    bulb.toggle()
}


