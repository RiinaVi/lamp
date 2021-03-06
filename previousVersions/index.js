const light = document.getElementById('light');
const redButton = document.getElementById('redButton');
const increaseButton = document.getElementById('increaseButton');
const decreaseButton = document.getElementById('decreaseButton');
const switcher = document.getElementById('checkbox');
const MIN_BRIGHTNESS = 0.2;
const MAX_BRIGHTNESS = 1;
let lightBrightness = 0.3;
let lampMode = 0;

increaseButton.addEventListener('click', increaseBrightness);
decreaseButton.addEventListener('click', decreaseBrightness);
redButton.addEventListener('click', redButtonToggle);
switcher.addEventListener('change', toggleSwitcher);


function toggleSwitcher() {
    if (this.checked) {
        light.style.backgroundImage = 'linear-gradient(white, rgba(255, 255, 255, 0))';
        light.style.visibility = "visible";
        lampMode = 0;
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
    switch (lampMode) {
        case 0:
            light.style.backgroundImage = 'linear-gradient(yellow, rgba(255, 255, 0, 0))'
            break;
        case 1:
            light.style.visibility = 'hidden';
            break;
        case 2:
            light.style.backgroundImage = 'linear-gradient(white, rgba(255, 255, 255, 0))'
            light.style.visibility = 'visible'
            break;
    }
    lampMode = (lampMode + 1) % 3;
}

function increaseBrightness() {
    if (Number(lightBrightness) < MAX_BRIGHTNESS) {
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
        light.style.opacity = String((parseFloat(lightBrightness) + 0.1).toFixed(1));
        lightBrightness = light.style.opacity;
    } else {
        increaseButton.removeEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
    }
}

function decreaseBrightness() {
    if (Number(lightBrightness) > MIN_BRIGHTNESS) {
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
        light.style.opacity = String((parseFloat(lightBrightness) - 0.1).toFixed(1));
        lightBrightness = light.style.opacity;
    } else {
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.removeEventListener('click', decreaseBrightness);
    }
}

