const service = require ('./stateMachine');

const light = document.getElementById('lamp__light');
const redButton = document.getElementById('redButton');
const increaseButton = document.getElementById('increaseButton');
const decreaseButton = document.getElementById('decreaseButton');
const switcher = document.getElementById('checkbox');

const GRADIENT = {
    WHITE: 'linear-gradient(white, rgba(255, 255, 255, 0))',
    YELLOW: 'linear-gradient(yellow, rgba(255, 255, 0, 0))',
    NONE: 'none'
}

increaseButton.onclick = increaseBrightness;
decreaseButton.onclick = decreaseBrightness;
redButton.onclick = redButtonToggle;
switcher.onchange = toggleSwitcher;


function toggleSwitcher() {
    if (this.checked) {
        light.style.backgroundImage = GRADIENT.WHITE;
        service.send('ENABLE');
        light.style.opacity = service.state.context.brightness;
    } else {
        light.style.backgroundImage = GRADIENT.NONE;
        service.send('DISABLE');
    }
}

function increaseBrightness() {
    if (service.state.value === 'disabled') return;
    service.send('INCREASE_BRIGHTNESS');
    light.style.opacity = service.state.context.brightness;
}

function decreaseBrightness() {
    if (service.state.value === 'disabled') return;
    service.send('DECREASE_BRIGHTNESS');
    light.style.opacity = service.state.context.brightness
}

function redButtonToggle() {
    switch (service.state.value) {
        case 'whiteLight':
            light.style.backgroundImage = GRADIENT.YELLOW;
            service.send('TOGGLE');
            break;
        case 'yellowLight':
            light.style.backgroundImage = GRADIENT.NONE;
            service.send('TOGGLE');
            break;
        case 'noLight':
            light.style.backgroundImage = GRADIENT.WHITE;
            service.send('TOGGLE');
            break;
    }
}

