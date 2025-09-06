
//===========================
//Game Start Messages
//===========================
alert("Welcome to 'They Filed the Skin Away'");
console.log("Welcome to 'They Filed the Skin Away'");

//===========================
// Async Utility Functions
//===========================
export async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function typewriterTo(element, text, delay = 40) {
    element.textContent = ""
    for (let char of text){
        element.textContent += char;
        await wait(delay);
    }
}

export async function fakeSave(gameState) {
    console.log("Saveing to local Storage....");
    await wait(800)//simulates delay
    localStorage.setItem("saveFile",JSON.stringify(gameState));
    console.log("Game Save.");
    
}
//================================
//Default Game State
//================================
// Game State holds everything that changes druring play
const gameState = {
    currentScene: 'observationCell',
    inventory: [],
    creature:{
        name: null,
        trust: 3, // trust scale 0 = hostile, 10 = bonded
    },
    logsCollected: [],// audio/data logs the player can read or listen to
    choices:{},
    flags:{
        hasAccessCard: false,
        unlockedRoom: false,
        lifeSupportdisabled: false,
        helpedCreatureInTank: false,
        namedCreature: false,
    },
};

//load existing save if avaible 
export let gameState = JSON.parse(localStorage.getItem(saveFile)) || structuredClone(DEFAULT_STATE);

//================================
// Scene Management
//================================
export const scenes = {};

// Import your scenes (example: ObservationCell in it's own file)
import{ ObservationCell } from './Rooms/observationCell.js';

// Register scenes
scenes.ObservationCell = ObservationCell
scenes.TankRoom = {/*placeholder for now */};
scenes.CreatureCommunication = {/* Placehilder for now */};

//================================
// DOM Rendering Helpers
//================================
function clearUI() {
    document.getElementById("secene"). textContent = "";
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
        btn.addEventListener("click", () => {
            if (choice.nextScene) {
                gotoScene(choice.nextScene);
            }
            if (choice.action) {
                if (typeof choice.action === "string") {
                    action[choice.action]();
                } else if (typeof choice.action === "function") {
                    choice.action();
                }
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
await fakeSave(gameState)//auto save on every scene change
}

//=================================
// Actions Registry
//=================================
export const action = { 
    examTable: () => {
        // TODO: Implement examTable action logic here
        console.log("The table hums faintly. It feels alive under your touch.");
    },
    examineTank: () => {
        console.log("The tank bubbles ominously. The creature shifts inside...");
    },
    // Add more reusable actions here
};

//=================================
//Inventory and logs
//=================================
function updateInventoryUI() {
    const invDiv = document.getElementById("inventory");
    invDiv.textContent = "logs" + (gameState.logsCollected.join(",")|| "none");
}

//==================================
//BootStrap the Game
//==================================
window.addEventListener("DOMContentLoaded", () => {
    updateInventoryUI();
    updateLogsUI();
    renderScene(gameState.currentScene);
});