const tools = require('../General/tools');

function main() {
    // tools.readFileSync('./input')
    tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let tInstructions = data.split('\r\n');
            // step1(tInstructions, 20,40);
            step2(tInstructions,40);
        })
        .catch((err) => {
            console.error(err);
        });
}

function step1(tInstructions,firstCycle,step){

    let cycleNr = 0;
    let xVal = 1;
    let oCycle = {};
    for (const instr of tInstructions) {
        let cmd = instr.split(' ');
        if(cmd[0] == 'noop'){
            cycleNr += 1;
            oCycle[cycleNr] = xVal;
        } else{
            //addx {val}
            cycleNr += 1;
            oCycle[cycleNr] = xVal;
            cycleNr += 1;
            oCycle[cycleNr] = xVal;
            xVal += parseInt(cmd[1]);
        }
    }
    cycleNr += 1;
    oCycle[cycleNr] = xVal;

    //affichage de toutes les steps
    let nbStep = Math.floor(Object.keys(oCycle).length / step);
    let bCycleFound = true;
    let currentCycle = firstCycle;
    let totalSignalStrength = 0;
    do {
        let valCycle = oCycle[currentCycle];
        if(valCycle){
            let signalStrength = currentCycle * valCycle;
            totalSignalStrength += signalStrength;
            console.log('Cycle', currentCycle, ':', valCycle, ' signal strength:',signalStrength);
        } else {
            console.log('Cycle', currentCycle,'non trouvé.');
            bCycleFound = false;
        }
        currentCycle += step;
    } while (bCycleFound);
    console.log('signal total:',totalSignalStrength);
}

function step2(tInstructions,step) {

    let cycleNr = 0;
    let xVal = 1;
    let oCycle = {};
    let stringPixel = '';
    for (const instr of tInstructions) {
        let cmd = instr.split(' ');
        if (cmd[0] == 'noop') {
            cycleNr += 1;
            oCycle[cycleNr] = xVal;
            stringPixel = drawPixel(stringPixel, cycleNr % step,xVal);
        } else {
            //addx {val}
            cycleNr += 1;
            oCycle[cycleNr] = xVal;
            stringPixel = drawPixel(stringPixel, cycleNr % step, xVal);
            cycleNr += 1;
            oCycle[cycleNr] = xVal;
            stringPixel = drawPixel(stringPixel, cycleNr % step, xVal);
            xVal += parseInt(cmd[1]);
        }
    }
    cycleNr += 1;
    oCycle[cycleNr] = xVal;
    stringPixel = drawPixel(stringPixel, cycleNr % step, xVal);

    for(let i=0;i<240;i=i+step){
        let subs = stringPixel.substring(i, i + step - 1);
        console.log(subs);
        continue;
        //divide in 8 parts
        let partSize = step / 8;
        // console.log(partSize,step);
        let pixelLine = '';
        for(let j=0;j<8;j++){
            // console.log(j * partSize, ((j + 1) * partSize) - 1);
            pixelLine += '\t' + subs.substring(j * partSize, (j+1) * partSize );
        }
        console.log(pixelLine);
    }
}

function drawPixel(stringPixel, cycleNr, xVal){
    // if (xVal == cycleNr || (xVal - 1) == cycleNr || (xVal + 1) == cycleNr){
    //     stringPixel += '█';
    // } else {
    //     stringPixel += '░';
    // }
    if (xVal == cycleNr || (xVal - 1) == cycleNr || (xVal + 1) == cycleNr) {
        stringPixel += '#';
    } else {
        stringPixel += '.';
    }
    return stringPixel;
}

main();