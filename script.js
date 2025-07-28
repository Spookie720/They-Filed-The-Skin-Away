alert("Welcome to 'They Filed the Skin Away'");
console.log("Welcome to 'They Filed the Skin Away'");
// Game State holds everything that changes druring play
const gameState = {
    currentScene: 'observationCell',
    inventory: [],
    creature:{
        name: null,
        trust: 3, // trust scale 0 = hostile, 10 = bonded
    }
    logsCollected: [],// audio/data logs the player can read or listen to
    choices:{},
    flags:{
        hasAccessCard: false,
        unlockedRoom: false,
        lifeSupportdisabled: false,
        helpedCreatureInTank: false,
        namedCreature: false,
    }
};

const scenes = {
    ObservationCell: {
        description: "You wake up in am a dimly lit metal cell and your lying falt on a table made of both metal and a glowing translucent membran that hums. There also a door made out of the same material as the table but you can fiantly see something stirring behind it....",
        choices:[
            { text: "Examine the table", action: "examineTable" },
            { text: "Examine the wired door", nextScene:"TankRoom" },
            { text: "Call out ", nextScene:"ObservationCell" },
        ],
        onEnter: function() {
            console.log("You are in the Observation Cell. The atmosphere is tense and you can feel the hum of the table beneath you.");
            // Add any additional setup for this scene here
        }
    },
    TankRoom: {
        description:"the room is dimly lit, with a large tank bubbling in the center. The tank is filled with a strange, glowing liquid and you can see a creature moving inside it. The Creature is half skinned and has mechanical parts to be painfuly grafted the organic part look like a mix of a orangutan and a cyclops. The tank are covered in strange symbols and there is a faint humming sound.",
        choices:[
            { text: "Examine the tank", action: "examineTank" },
            { text: "Try to communicate with the creature", nextScene:"CreatureCommunication" },
            { text: "Look for a way out", nextScene:"ObservationCell" },
            { text: "take the datapad", action: function(){
                gameState.inventory.push("datapad");
                gameState.flags.helpedCreatureInTank = true;
                console.log("You take the datapad from the tank, it feels warm to the touch  almost like it is alive. You can see that it has a strange interface but for somereason you can understand it. the datapad seems to contain a security override for the tank and a way to release the creature inside.");
            }
        },
        { text: "return to the Observation Cell", nextScene:"ObservationCell" },
        ],
        onEnter: function() {
            if (!gameState.flags.helpedCreatureInTank) {
                console.log("the creature watches eerily still you exit the room as it floats in the tank of bioluminecnt liquid. You can see its mechanical parts glinting in the dim light, and it seems to be studying you with its single eye.");
            } else {
                console.log("the creature in the tank looks at you with a mix of fear and curiosity. It seems to be trying to communicate, but you can't understand it . As It clicks and chatters in an unknown language as the tank slowly drains the liquid spilling onto the floor.");
            }
        }
    }
};