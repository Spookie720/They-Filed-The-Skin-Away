//Delay text (async/await friendly)
export async function delayText(message, delay = 50){
    for (let = 0; i < message.length; i++) {
        await new Promise(resovle => setTimeout(resovle, delay));
        if (process.stdout) {
            process.stdout.write(message[i]);
        } else {
            console.log(message[i]);
        }
        // process.stdout is for Node; in  browser you'd instead append to DOM
    }
}

// Fake save to server (just localStorage with async wait)
export async function fakeSave(key, data) {
    await new Promise(resolve => setTimeout(resolve, 1000));//fake network lag
    localStorage.setItem(key, JSON.stringify(data));
    return true;
}

// Creature trust base respons 
export function creatureResponse(trustlevel) {
    if (trustlevel < 3){
        return "The creature eyes you warily, keeping its distance.";
    } else if (trustlevel < 7) {
        return "The creature seems curious, approaching cautiously making soft clicking sounds.";
    } else {
        return "The creature trusts you and nuzzles against your hand.";
    }
}