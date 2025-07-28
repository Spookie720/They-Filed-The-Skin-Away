alert("Welcome to 'They Filed the Skin Away'");
console.log("Welcome to 'They Filed the Skin Away'");
// Game State holds everything that changes druring play
const gameState = {
    currentScene: 'observationCell',
    inventory: [],
    petTrust: 5, // trust scale 0 = hostile, 10 = bonded
    logsCollected: [],
    choices:{},
    flags:{
        hasAccessCard: false,
        unlockedRoom: false,
        lifeSupportdisabled: false,
        helpedCreatureInTank: false,
    }
};