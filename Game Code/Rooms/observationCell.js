import { action, gameState, gotoScene } from "../script.js";
import { delayText } from "../utilities.js";

const scenes = {
    ObservationCell: {
        description: "You wake in a chamber that hums faintly, as though the walls themselves breathe. Veins of dim blue light pulse beneath the surface, fading in and out like a heartbeat. The floor is slick with a thin film of something viscous, and the air tastes faintly of metal and rot. A single pane of glass curves outward, watching you as much as you watch it. You are lying flat on a table made of both metal and a glowing translucent membrane that hums. A door made of the same material shows something stirring behind it....",
        choices: [
            {
                text: "Examine the table",
                action: async () => {
                    if (!gameState.logsCollected.includes("SubjectType7")) {
                        await delayText(`You find a half-corrupted datapad. It reads: 'Observation Log Redacted
Subject exhibits autonomic function despite lack of visible sustenance. Reflexive responses absent. When exposed to auditory triggers, subject remains still — though ocular activity suggests heightened awareness. Recommend prolonged confinement. Do not engage directly.`);
                        gameState.logsCollected.push("SubjectType7");
                    } else {
                        await delayText("The same datapad flickers faintly on the table.");
                    }
                }
            },

            // ---Flavor text choices ---
            {
                text: "Examine the glass pane",
                action: async () => {
                    const glassText = [
                        "Your rellection lingers a beat tooo long when you move.", "The glass bulges outwaredraching for you as though something on the other saide were pressing back."
                    ];
                    const randomLine = glassText[Math.floor(Math.random()) * glassText.length];
                    await delayText(randomLine);
                }
            },
            {
                text: "Examine the drain grate",
                action: async () => {
                    const drainText = [
                        "Black liquid swirls faintly.... but dosen't flow anywhere. just spits black goo.",
                        "Something down there gurgles, wet, low, and hungry."
                    ];
                    const randomLine = drainText[Math.floor(Math.random()) * drainText.length];
                    await delayText(randomLine);
                }
            },
            {
                text: "Listen to the ceiling speaker",
                action: async () => {
                    const speakerText = [
                        "A faint static hiss, also most like wispering",
                        "the noise pauses whenever you hold your breath."
                    ];
                    const randomLine = speakerText[Math.floor(Math.floor()) * speakerText.length];
                    await delayText(randomLine);
                }
            },

            { text: "Examine the wired door", nextScene: "TankRoom" },
            { text: "Call out", nextScene: "ObservationCell" }
        ],
        onEnter: async function () {
            await delayText("You are in the Observation Cell. The atmosphere is tense and you can feel the hum of the table beneath you.");

            if (gameState.flags.memoryClueFound) {
                await delayText("A flash of memory comes to you from the Ash Forest... something here seems different now.");
                // maybe unlock extra choice here
            }
        }
    },
    // --- Escape logic based on creature choice ---
    text: "look for a way out",
    action: async () => {
        if (gameState.flags.helpedCreatureInTank) {
            await delayText("The tank's collapse must have damaged nearby systems.you notice a vent grate hanging loosenear the floor.");
            await delayText("it leads inot darkness but the hum of machinery below sound almost.... welcoming.");
            gotoScene("longHallway");//easy escape path
        } else {
            await delayText("the door's contorl panel is dead and the wall hum louder when you touch them.");
            await delayText("beneath the drain grate, faimt wores pulse and diping with neon light maybe you short the door manually....");
            gotoScene("ObservationCellPuzzle");//harder puzzle scene(still need to make )
        }
    },


    TankRoom: {
        description: "The room breathes with a low, rhythmic hum. A faint chemical sting clings to the air, sharp enough to make your eyes water. In the center, a massive tank bubbles softly, each ripple catching the dim light and bending it like warped glass. Inside drifts a creature that seems assembled rather than born—skin peeled back in uneven patches to reveal the machinery beneath. A single clouded eye rolls lazily in the fluid, occasionally twitching as if in restless sleep. Its proportions hint at something once simian—broad-shouldered, long limbed like an orangutan but stretched wrong, as though someone rebuilt it from memory and got the anatomy slightly off. Strange sigils are carved into the glass, glowing faintly when you draw near. The hum shifts pitch, almost acknowledging your presence.",
        choices: [
            { text: "Examine the tank", action: async () => await delayText("The tank bubbles ominously. The creature shifts inside...") },
            { text: "Try to communicate with the creature", nextScene: "CreatureCommunication" },
            {
                text: "Look for a way out", action: async () => {
                    if (gameState.flags.helpedCreatureInTank) {
                        await delayText("The creature presses a lever with its mechanical arm, opening the door for you...");
                        gotoScene("LongHallway");
                    } else {
                        await delayText("The door is locked. You notice a faint control panel that might be overridden...");
                        gotoScene("ObservationCellPuzzle");
                    }
                }
            },
            {
                text: "Take the datapad", action: async () => {
                    gameState.inventory.push("datapad");
                    gameState.flags.helpedCreatureInTank = true;
                    await delayText("You take the datapad from the tank. It feels warm to the touch, almost alive. The warmth seems to pulse faintly, syncing with your heartbeat. Somehow, you can understand its strange interface—the symbols shift and reorder themselves until they make sense. It contains a security override for the tank, a simple command to release the creature inside. The air changes when you notice it—the hum in the walls deepens, and the fluid inside the tank stirs. You can't tell if the creature senses your choice… or if something else does.");

                    const name = prompt("The creature watches you with its single eye. What do you want to name it?");
                    gameState.creature.name = name || "Unnamed Creature";
                    gameState.creature.trust = 3;

                    await delayText(`You named the creature: ${gameState.creature.name}. The datapad pulses with energy as you hold it. The creature clicks softly, responding to its name.`);
                }
            },
            { text: "Return to the Observation Cell", nextScene: "ObservationCell" }
        ],
        onEnter: async function () {
            if (!gameState.flags.helpedCreatureInTank) {
                await delayText("The creature watches eerily still as you exit the room, floating in the bioluminescent liquid. Its mechanical parts glint in the dim light.");
            } else {
                await delayText("The creature looks at you with a mix of fear and curiosity. It clicks and chatters in an unknown language as the tank slowly drains, liquid spilling onto the floor.");
            }
        }
    },

    CreatureCommunication: {
        description: async function () {
            if (gameState.flags.helpedCreatureInTank) {
                return `${gameState.creature.name} looks at you with hesitant curiosity. It clicks and chatters in an unknown language as the tank drains. Its mechanical parts whir softly, and it blinks its one big eye at you — slowly, a sign of trust.`;
            }
        },
        choices: [
            { text: "Return to the Tank Room", nextScene: "TankRoom" },
        ],
        onEnter: async function () {
            if (gameState.flags.helpedCreatureInTank) {
                gameState.creature.trust += 1;
                await delayText(`Trust level with ${gameState.creature.name} increased to ${gameState.creature.trust}. The creature seems more comfortable around you, its mechanical parts whirring softly as it moves closer.`);
            }
        }
    }
};

export default scenes;
