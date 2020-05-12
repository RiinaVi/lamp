const light = document.getElementById('light');
const redButton = document.getElementById('redButton');
const increaseButton = document.getElementById('increaseButton');
const decreaseButton = document.getElementById('decreaseButton');
const switcher = document.getElementById('checkbox');
const controlButtons = document.getElementsByClassName('controlButton');
const MIN_BRIGHTNESS = 0.2;
const MAX_BRIGHTNESS = 1;
let lightBrightness = 0.3;
let lampMode = 0;

increaseButton.addEventListener('click', increaseBrightness);
decreaseButton.addEventListener('click', decreaseBrightness);
redButton.addEventListener('click', redButtonToggle);

switcher.addEventListener('change', function () {
    if (this.checked && lampMode !== 2) {
        for (let btn of controlButtons) {
            btn.style.cursor = 'pointer'
        }
        light.style.visibility = "visible";
        redButton.addEventListener('click', redButtonToggle);
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
    } else if (this.checked && lampMode === 2) {
        for (let btn of controlButtons) {
            btn.style.cursor = 'pointer'
        }
        redButton.addEventListener('click', redButtonToggle);
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
    } else {
        light.style.visibility = "hidden";
        for (let btn of controlButtons) {
            btn.style.cursor = 'not-allowed'
        }
        redButton.removeEventListener('click', redButtonToggle);
        increaseButton.removeEventListener('click', increaseBrightness);
        decreaseButton.removeEventListener('click', decreaseBrightness);
    }
});

function redButtonToggle() {
    switch (lampMode) {
        case 0:
            light.style.backgroundImage = 'linear-gradient(yellow, transparent)'
            console.log(light.style.backgroundImage)
            break;
        case 1:
            light.style.visibility = 'hidden';
            break;
        case 2:
            light.style.backgroundImage = 'linear-gradient(white, transparent)'
            light.style.visibility = 'visible'
            break;
    }
    lampMode = (lampMode + 1) % 3;
}

function increaseBrightness() {
    console.log(lightBrightness)
    if (Number(lightBrightness) < MAX_BRIGHTNESS - 0.05) {
        decreaseButton.style.cursor = 'pointer'
        increaseButton.style.cursor = 'pointer'
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
        light.style.opacity = String(parseFloat(lightBrightness) + 0.1);
        lightBrightness = light.style.opacity;
    } else {
        increaseButton.removeEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);
        decreaseButton.style.cursor = 'pointer'
        increaseButton.style.cursor = 'not-allowed'
    }
}

function decreaseBrightness() {
    console.log(lightBrightness)
    if (Number(lightBrightness) > MIN_BRIGHTNESS+0.05) {
        decreaseButton.style.cursor = 'pointer'
        increaseButton.style.cursor = 'pointer'
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.addEventListener('click', decreaseBrightness);

        light.style.opacity = String(parseFloat(lightBrightness) - 0.1);
        lightBrightness = light.style.opacity;
    } else {
        decreaseButton.style.cursor = 'not-allowed'
        increaseButton.addEventListener('click', increaseBrightness);
        decreaseButton.removeEventListener('click', decreaseBrightness);
    }
}

