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
        light.style.visibility = "visible";
        for (let btn of controlButtons){
            btn.disabled = false;
        }
    } else {
        light.style.visibility = "hidden";
        for (let btn of controlButtons){
            btn.disabled = true;
        }
    }
});

function redButtonToggle() {
    switch (lampMode) {
        case 0:
            light.style.borderBottomColor = 'yellow';
            break;
        case 1:
            light.style.visibility = 'hidden';
            break;
        case 2:
            light.style.borderBottomColor = 'white';
            light.style.visibility = 'visible'
            break;
    }
    lampMode = (lampMode + 1) % 3;
}

function increaseBrightness() {
    console.log(lightBrightness)
    if (Number(lightBrightness) < MAX_BRIGHTNESS-0.2) {
        increaseButton.disabled = false;
        decreaseButton.disabled = false;
        light.style.opacity = String(parseFloat(lightBrightness) + 0.1);
        lightBrightness = light.style.opacity;
    } else {
        increaseButton.disabled = true;
        decreaseButton.disabled = false;
    }
}

function decreaseBrightness() {
    console.log(lightBrightness)
    if (Number(lightBrightness) > MIN_BRIGHTNESS) {
        decreaseButton.disabled = false;
        increaseButton.disabled = false;
        light.style.opacity = String(parseFloat(lightBrightness) - 0.1);
        lightBrightness = light.style.opacity;
    } else {
        decreaseButton.disabled = true;
        increaseButton.disabled = false;
    }
}