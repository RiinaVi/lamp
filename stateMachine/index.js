const service = require('./stateMachine');

const light = document.getElementById('lamp__light');
const redButton = document.getElementById('redButton');
const increaseButton = document.getElementById('increaseButton');
const decreaseButton = document.getElementById('decreaseButton');
const switcher = document.getElementById('checkbox');


increaseButton.onclick = increaseBrightness;
decreaseButton.onclick = decreaseBrightness;
redButton.onclick = redButtonToggle;
switcher.onchange = toggleSwitcher;


function toggleSwitcher() {
    service.send(this.checked ? 'ENABLE' : 'DISABLE');
    light.style.opacity = service.state.context.brightness;
    light.style.backgroundImage = service.state.context.lightColor;
}

function increaseBrightness() {
    service.send('INCREASE_BRIGHTNESS');
    light.style.opacity = service.state.context.brightness;
}

function decreaseBrightness() {
    service.send('DECREASE_BRIGHTNESS');
    light.style.opacity = service.state.context.brightness
}

function redButtonToggle() {
    service.send('TOGGLE');
    light.style.backgroundImage = service.state.context.lightColor;
}

