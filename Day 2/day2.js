// const fs = require('fs');
const tools = require('../General/tools');

const oResults = {
    "X": 1,
    "Y": 2,
    "Z": 3,
    "A": 1,
    "B": 2,
    "C": 3
};

function main(){
    tools.readFileSync('./input')
    .then( (data) => {
        console.log('file readed !');
        let tPlan = data.split('\n');
        step1(tPlan);
        step2(tPlan);
    })
    .catch((err) => {
        console.error(err);
    });
}

function step1(tPlan) {
    let totalScore = 0;
    for (let plan of tPlan) {
        let tMove = plan.split(' ');
        if (tMove.length < 2) {
            continue;
        }
        let valCoup = oResults[tMove[1]];
        let valManche = 0;
        switch (oResults[tMove[1]] - oResults[tMove[0]]) {
            case 0:
                //draw
                valManche = 3;
                break;
            case 1:
            case -2:
                //win
                valManche = 6;
                break;
            case -1:
            case 2:
                //loose
                valManche = 0;
                break;
        }
        totalScore += valCoup + valManche;
        if (isNaN(totalScore)) {
            console.log('plan:', plan);
            console.log('tMove:', tMove, tMove.length);
            console.log('WHY');
            break;
        }
    }
    console.log('Le score total est de :', totalScore);
}

function step2(tPlan) {
    let totalScore = 0;
    for (let plan of tPlan) {
        let tMove = plan.split(' ');
        if (tMove.length < 2) {
            continue;
        }
        let valCoup = 0;
        let valManche = 0;
        switch (tMove[1]){
            case 'X':
                //need to loose
                valManche = 0;
                valCoup = oResults[tMove[0]] - 1;
                if (valCoup < 1) {
                    valCoup = 3;
                }
                break;
            case 'Y':
                //need to draw
                valManche = 3;
                valCoup = oResults[tMove[0]];
                break;
            case 'Z':
                //new to win
                valManche = 6;
                valCoup = oResults[tMove[0]] + 1;
                if (valCoup > 3){
                    valCoup = 1;
                }
                break;
        }
        totalScore += valCoup + valManche;
        if (isNaN(totalScore)) {
            console.log('plan:', plan);
            console.log('tMove:', tMove, tMove.length);
            console.log('values:',valCoup, valManche);
            console.log('WHY');
            break;
        }
    }
    console.log('Le score total est de :', totalScore);
}

main();