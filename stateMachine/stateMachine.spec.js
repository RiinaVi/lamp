const {service, GRADIENT} = require('./stateMachine');

describe('State machine', () => {
    it.each
        `      action       |      nextState     |   previousState
            ${'TOGGLE'}     |   ${'noLight'}     |  ${'yellowLight'}
            ${'TOGGLE'}     |   ${'whiteLight'}  |  ${'noLight'}
            ${'TOGGLE'}     |   ${'yellowLight'} |  ${'whiteLight'}
            ${'TOGGLE'}     |   ${'yellowLight'} |  ${service.machine.initialStateValue}
    `('changes mode from $previousState to $nextState after sending $action',
        ({nextState, action, previousState}) => {
            service.state.value = previousState;
            service.send(action);
            expect(service.state.value).toEqual(nextState);
        });
    it.each
        `      action                |     nextBrightness     |  previousBrightness
            ${'INCREASE_BRIGHTNESS'} |       ${0.4}           |  ${0.3}
            ${'INCREASE_BRIGHTNESS'} |       ${1}             |  ${1}
            ${'DECREASE_BRIGHTNESS'} |       ${0.2}           |  ${0.3}
            ${'DECREASE_BRIGHTNESS'} |       ${0.2}           |  ${0.2}
            ${'DISABLE'}             |       ${0.5}           |  ${0.5}
            ${'ENABLE'}              |       ${0.3}           |  ${0.4}
    `('changes brightness from $previousBrightness to $nextBrightness after sending $action',
        ({nextBrightness, action, previousBrightness}) => {
            service.state.context.brightness = previousBrightness;
            service.send(action);
            expect(service.state.context.brightness).toEqual(nextBrightness);
        });
    it.each
        `      action        |     nextColor      |  previousColor
            ${'TOGGLE'}      |   ${GRADIENT[1]}   |  ${GRADIENT[0]}
            ${'TOGGLE'}      |   ${GRADIENT[2]}   |  ${GRADIENT[1]}
            ${'TOGGLE'}      |   ${GRADIENT[0]}   |  ${GRADIENT[2]}
            ${'DISABLE'}     |   ${GRADIENT[2]}   |  ${GRADIENT[0]}
            ${'ENABLE'}      |   ${GRADIENT[0]}   |  ${GRADIENT[2]}
    `('changes light color from $previousColor to $nextColor after sending $action',
        ({nextColor, action, previousColor}) => {
            service.state.context.lightColor = previousColor;
            service.send(action);
            expect(service.state.context.lightColor).toEqual(nextColor);
        });
})