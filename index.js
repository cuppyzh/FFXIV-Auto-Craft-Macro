const robot = require('robotjs')
const prompt = require('prompt-sync')();

//

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class Macro {
    constructor(locationX, locationY, duration) {
        this._locationX = locationX
        this._locationY = locationY
        this._duration = duration
    }
}

let synthLocationX = 0
let synthLocationY = 0
let synthColor = ""

Main()

async function Main() {

    let mouse = robot.getMousePos()
    let macros = new Array()

    // Introduction
    console.log('Macro is starting....')
    console.log('-------------------')
    console.log('1. You need to set up your macro craft first, can be created here: https://ffxivteamcraft.com/simulator -- please takes note the amount of time the macro will run')
    console.log('2. Drag the button to your hotbar')
    console.log('3. Note! during the macro run you cannot do anything in your PC\n\n')
    console.log('If you ready press any key to start caliberating, otherwise press CTRL+C or close the app')
    console.log('-------------------')
    console.log('\n\n')
    prompt('Are you ready? ')

    console.log('\n')
    // Ask how many button will be used
    let numberOfButton = prompt('Insert amount of how many macro button will be used: ')
    //console.log(`Number for button: ${numberOfButton}`)

    // Ask how many times the macros supposed to be run
    let numberOfCycle = prompt('amount of item to Craft: ')
    console.log(`Number for button: ${numberOfCycle}`)

    console.log('\n\n\n')

    // Caliberate Synth Button
    console.log('Open you synthesis window, locate using the Pointer where \'the synthesis button will appear\', aim for the yellow color for the button...')
    prompt('press any key, then count down commence in 10 second')
    await delay(2000)
    await Counter(10)

    mouse = robot.getMousePos()
    synthColor = robot.getPixelColor(mouse.x, mouse.y)
    synthLocationX = mouse.x
    synthLocationY = mouse.y
    console.log('Synth Button color: ', synthColor, '. X: ', synthLocationX, 'Y: ', synthLocationY)

    // Caliberate Macros
    for (let itterator = 1; itterator <= numberOfButton; itterator++) {
        console.log(`\nMacro ${itterator} will be captured, aim for the ffxiv macro button..`)
        prompt('press any key, then count down commence in 5 second')
        await delay(2000)
        await Counter(10)

        mouse = robot.getMousePos()
        let durationOfMacro = prompt('Insert how long this macro will take: ')

        let newMacro = new Macro(mouse.x, mouse.y, durationOfMacro)
        console.log('X: ', newMacro._locationX, 'Y: ', newMacro._locationY)
        macros.push(newMacro);
    }

    // Macro Logic
    console.log("\n\n\nYour setup is ready, press any key to continue.. otherwise press CTRL+C or close the app.. you can close the app anytime when the macro is running")
    prompt('Are you ready? ')
    console.log('Macro sequence will start in 10 second, do nothing !')
    await Counter(10)

    console.log('\n\n\n\n\n')

    let itteratorCycle = 1;
    do {
        console.log(`Cycle: ${itteratorCycle}`)
        
        robot.moveMouse(synthLocationX, synthLocationY)
        robot.mouseClick()
        await delay(2000)

        for(let itterator = 0; itterator < macros.length; itterator++){
            console.log(`\tmoved for macro ${itterator}`,'X: ', macros[itterator]._locationX, 'Y: ', macros[itterator]._locationY)
            robot.moveMouse(macros[itterator]._locationX, macros[itterator]._locationY)
            robot.mouseClick()
            await delay((macros[itterator]._duration)*1000)
            await delay(1000)
        }

        console.log('..resting..')
        await delay(5000)

        itteratorCycle++

        console.log('\n\n')

    } while (itteratorCycle <= numberOfCycle)

    console.log('Done---!')
}

async function Counter(timer) {
    let counter = timer
    do {
        console.log("..", counter)
        await delay(1000)

        counter -= 1
    } while (counter >= 1)
}