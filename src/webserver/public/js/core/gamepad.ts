
type KeyMap = {
    [key: number]: string;
};

const keyMap: KeyMap = {
    0: "X",
    1: "Circle",
    2: "Square",
    3: "Triangle",
    4: "Left bumper",
    5: "Right bumper",
    6: "Left trigger",
    7: "Right trigger",
    8: "Share",
    9: "Options",
    10: "Left stick",
    11: "Right stick",
    12: "Up",
    13: "Down",
    14: "Left",
    15: "Right",
    16: "Home",
    17: "Touchpad",
};

let previousIndexes: number[] = [];

const controllerInputLoop = () => {

    const gamepad = navigator.getGamepads()[0] || null;

    if (!gamepad) {
        window.requestAnimationFrame(controllerInputLoop);
        return;
    }

    const input = gamepad.buttons.map((b) => b.pressed);

    const indexes = input.map((b, i) => b ? i : -1).filter((i) => i !== -1);

    if (indexes.length > 0) {
        const gamepadKeyDown = new CustomEvent("gamepadkeydown", {
            detail: {
                indexes,
                names: indexes.map((i) => keyMap[i]),
                sensitivities: indexes.map((i) => gamepad.buttons[i].value),
            }
        });

        previousIndexes = indexes;

        window.dispatchEvent(gamepadKeyDown);

    } else if (indexes.length === 0 && previousIndexes.length > 0) {

        const gamepadKeyUp = new CustomEvent("gamepadkeyup", {
            detail: {
                index: previousIndexes[0],
                name: keyMap[previousIndexes[0]],
            }
        });

        previousIndexes = [];

        window.dispatchEvent(gamepadKeyUp);
    }

    const axes = gamepad.axes;
    const deadzone = 0.01;
    const x = Math.abs(axes[0]) > deadzone ? axes[0] : 0;
    const y = Math.abs(axes[1]) > deadzone ? axes[1] : 0;

    if (x !== 0 || y !== 0) {

        const gamepadJoystick = new CustomEvent("gamepadjoystick", {
            detail: {
                x,
                y,
                type: "left",
            }
        });

        window.dispatchEvent(gamepadJoystick);
    } else if (axes.length > 2) {
        const x = Math.abs(axes[2]) > deadzone ? axes[2] : 0;
        const y = Math.abs(axes[3]) > deadzone ? axes[3] : 0;

        if (x !== 0 || y !== 0) {

            const gamepadJoystick = new CustomEvent("gamepadjoystick", {
                detail: {
                    x,
                    y,
                    type: "right",
                }
            });

            window.dispatchEvent(gamepadJoystick);
        }
    }

    window.requestAnimationFrame(controllerInputLoop);
}

controllerInputLoop();

