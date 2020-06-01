const {Machine, interpret, assign} = require('xstate');

//watchify stateMachine.js  -o bundle.js


const GRADIENT = [
    'linear-gradient(white, rgba(255, 255, 255, 0))',
    'linear-gradient(yellow, rgba(255, 255, 0, 0))',
    'none'
]

const whiteLight = {
    on: {
        TOGGLE: {
            target: 'yellowLight',
            actions: 'toggleLightColor',
            cond: 'isNotDisabled'
        },
        DISABLE: {
            target: 'disabled',
            actions: 'disableLight'
        },
        INCREASE_BRIGHTNESS: {
            actions: ['increaseBrightness'],
            cond: {
                type: 'isLessThanMax',
                isNotDisabled: true
            }
        },
        DECREASE_BRIGHTNESS: {
            actions: ['decreaseBrightness'],
            cond: {
                type: 'isMoreThanMin',
                isNotDisabled: true
            }
        }
    }
}

const yellowLight = {
    on: {
        TOGGLE: {
            target: 'noLight',
            actions: 'toggleLightColor',
            cond: 'isNotDisabled'
        },
        DISABLE: {
            target: 'disabled',
            actions: 'disableLight'
        },
        INCREASE_BRIGHTNESS: {
            actions: ['increaseBrightness'],
            cond: {
                type: 'isLessThanMax',
                isNotDisabled: true
            }
        },
        DECREASE_BRIGHTNESS: {
            actions: ['decreaseBrightness'],
            cond: {
                type: 'isMoreThanMin',
                isNotDisabled: true
            }
        }
    }
}
const noLight = {
    on: {
        TOGGLE: {
            target: 'whiteLight',
            actions: 'toggleLightColor',
            cond: 'isNotDisabled'
        },
        DISABLE: {
            target: 'disabled',
            actions: 'disableLight'
        },
    }
}

const disabled = {
    on: {
        ENABLE: {
            target: 'whiteLight',
            actions: 'enableLight'
        }
    }
}


const states = {whiteLight, yellowLight, noLight, disabled};
const initial = 'whiteLight';
const MIN_BRIGHTNESS = 0.2;
const MAX_BRIGHTNESS = 1;
const STEP = 0.1;
const INITIAL_BRIGHTNESS = 0.3;

const config = {
    id: 'lightBulb',
    initial,
    states,
    context: {
        brightness: INITIAL_BRIGHTNESS,
        lightColor: GRADIENT[0]
    },
    strict: true
};

const lightBulbMachine = Machine(config, {
    actions: {
        increaseBrightness: assign(context => ({
            brightness: Number(((context.brightness) + STEP).toFixed(1))
        })),
        decreaseBrightness: assign(context => ({
            brightness: Number(((context.brightness) - STEP).toFixed(1))
        })),
        toggleLightColor: assign(context => ({
            lightColor: GRADIENT[GRADIENT.indexOf(context.lightColor) + 1] || GRADIENT[0]
        })),
        disableLight: assign(() =>
            ({lightColor: GRADIENT[2]})
        ),
        enableLight: assign(() =>
            ({brightness: INITIAL_BRIGHTNESS, lightColor: GRADIENT[0]})
        ),
    },
    guards: {
        isNotDisabled: (context, event, {state}) => state !== 'disabled',
        isLessThanMax: context => context.brightness < MAX_BRIGHTNESS,
        isMoreThanMin: context => context.brightness > MIN_BRIGHTNESS
    }
});

const service = interpret(lightBulbMachine).start();
module.exports = {service, GRADIENT};

