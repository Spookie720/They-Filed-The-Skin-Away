//===========================
// Game Start Messages
//===========================
alert("Welcome to 'They Filed the Skin Away'");
console.log("Welcome to 'They Filed the Skin Away'");

//===========================
// Imports
//===========================
import { delayText, fakeSave, creatureResponse } from "./utilities.js";
import { ObservationCell } from "./Rooms/observationCell.js";

//===========================
// Default Game State
//===========================
const DEFAULT_STATE = {
    currentScene: "ObservationCell",
    inventory: [],
    creature: {
        name: null,
        trust: 3, // trust scale 0 = hostile, 10 = bonded
    },
    logsCollected: [],
    choices: {},
    flags: {
        hasAccessCard: false,
        unlockedRoom: false,
        lifeSupportDisabled: false,
        helpedCreatureInTank: false,
        namedCreature: false,
    },
};

// Load existing save if available
export let gameState =
    JSON.parse(localStorage.getItem("saveFile")) || structuredClone(DEFAULT_STATE);

//===========================
// Scene Management
//===========================
export const scenes = {
    ObservationCell: ObservationCell,
    TankRoom: {
        description: "A dim room with a large tank in the center. The creature stirs inside.",
        choices: [
            { text: "Examine the tank", action: "examineTank" },
            { text: "Try to communicate with the creature", nextScene: "CreatureCommunication" },
            { text: "Return to Observation Cell", nextScene: "ObservationCell" }
        ],
        onEnter: async function () {
            console.log("You enter the Tank Room...");
            console.log(creatureResponse(gameState.creature.trust));
        }
    },
    CreatureCommunication: {
        description: "You attempt to communicate. The creature responds with clicks and soft chattering.",
        choices: [
            { text: "Offer food", action: () => {
                console.log("You offer a biotech nutrient capsule...");
                gameState.creature.trust += 2;
            }},
            { text: "Step back quietly", action: () => {
                console.log("You give the creature space. It observes you cautiously.");
                gameState.creature.trust += 1;
            }},
            { text: "Return to Tank Room", nextScene: "TankRoom" }
        ],
        onEnter: async function () {
            console.log(creatureResponse(gameState.creature.trust));
        }
    }
};

//===========================
// DOM Rendering Helpers
//===========================
function clearUI() {
    document.getElementById("scene").textContent = "";
    document.getElementById("choices").textContent = "";
}

export async function renderScene(sceneName) {
    const scene = scenes[sceneName];
    if (!scene) {
        console.error("Scene not found:", sceneName);
        return;
    }

    clearUI();

    const sceneDiv = document.getElementById("scene");
    await typewriterTo(sceneDiv, scene.description);

    const choicesDiv = document.getElementById("choices");
    scene.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice.text;
        btn.addEventListener("click", async () => {
            if (choice.action) {
                if (typeof choice.action === "string") {
                    action[choice.action]();
                } else if (typeof choice.action === "function") {
                    await choice.action();
                }
            }
            if (choice.nextScene) {
                await gotoScene(choice.nextScene);
            }
        });
        choicesDiv.appendChild(btn);
    });

    if (scene.onEnter) {
        await scene.onEnter();
    }
}

export async function gotoScene(name) {
    gameState.currentScene = name;
    await renderScene(name);
    await fakeSave("saveFile", gameState);
}

//===========================
// Actions Registry
//===========================
export const action = {
    examineTable: () => {
        console.log("The table hums faintly. It feels alive under your touch.");
    },
    examineTank: () => {
        console.log("The tank bubbles ominously. The creature shifts inside...");
    },
};

//===========================
// Inventory & Logs
//===========================
function updateInventoryUI() {
    const invDiv = document.getElementById("inventory");
    invDiv.textContent = "Inventory: " + (gameState.inventory.join(", ") || "None");
}

function updateLogsUI() {
    const logsDiv = document.getElementById("logs");
    logsDiv.textContent = "Logs: " + (gameState.logsCollected.join(", ") || "None");
}

//===========================
// Typewriter effect (DOM)
//===========================
async function typewriterTo(element, text, delay = 40) {
    element.textContent = "";
    for (let char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

//===========================
// Bootstrap the Game
//===========================
window.addEventListener("DOMContentLoaded", async () => {
    updateInventoryUI();
    updateLogsUI();
    await renderScene(gameState.currentScene);
});
