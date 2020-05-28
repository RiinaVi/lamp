const {Machine, interpret, assign} = require('xstate');

//watchify stateMachine.js  -o bundle.js

const whiteLight = {
    on: {
        TOGGLE: {
            target: 'yellowLight',
        },
        DISABLE: 'disabled',
        INCREASE_BRIGHTNESS: {
            actions: ['increaseBrightness'],
            cond: 'isLessThanMax'
        },
        DECREASE_BRIGHTNESS: {
            actions: ['decreaseBrightness'],
            cond: 'isMoreThanMin'
        }
    }
}

const yellowLight = {
    on: {
        TOGGLE: 'noLight',
        DISABLE: 'disabled',
        INCREASE_BRIGHTNESS: {
            actions: ['increaseBrightness'],
            cond: 'isLessThanMax'
        },
        DECREASE_BRIGHTNESS: {
            actions: ['decreaseBrightness'],
            cond: 'isMoreThanMin'
        }
    }
}
const noLight = {
    on: {
        TOGGLE: 'whiteLight',
        DISABLE: 'disabled',
    }
}

const disabled = {
    entry: ['discardBrightness'],
    on: {
        ENABLE: 'whiteLight'
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
        brightness: INITIAL_BRIGHTNESS
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
        discardBrightness: assign(() =>
            ({brightness: INITIAL_BRIGHTNESS})
        ),
    },
    guards: {
        isLessThanMax: context => context.brightness < MAX_BRIGHTNESS,
        isMoreThanMin: context => context.brightness > MIN_BRIGHTNESS
    }
});

const service = interpret(lightBulbMachine).start();

module.exports = service;

