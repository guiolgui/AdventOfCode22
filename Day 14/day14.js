const { cp } = require('fs');
const tools = require('../General/tools');

function main() {
    // tools.readFileSync('./input')
    tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let tPaths = data.split('\r\n');
            let oCave = initCave(tPaths);
            displayCave(oCave);
            console.time('step1');
            step1();
            console.timeEnd('step1');

            console.time('step2');
            step2();
            console.timeEnd('step2');
        })
        .catch((err) => {
            console.error(err);
        });
}
main();

function step1(){
}
function step2(){
}

function initCave(tCave){
    let oCave = {};
    for (let caveLine of tCave){
        let coords = caveLine.split(' -> ');
        for (let i = 1; i < coords.length; i++) {
            let c1 = coords[i-1].split(',');
            let c2 = coords[i].split(',');
            // console.log('De',c1,'à',c2);
            let diffX = c2[0] - c1[0];
            let diffY = c2[1] - c1[1];
            let sign = 1;
            if (diffX < 0 || diffY < 0) {
                sign = -1;
                diffX = Math.abs(diffX) + 1;
                diffY = Math.abs(diffY) + 1;
            }
            do {
                if (diffX > 0) {
                    diffX--;
                }
                if (diffY > 0) {
                    diffY--;
                }
                // console.log('diffX', diffX, 'diffY', diffY);
                let x = parseInt(c1[0]) + diffX * sign;
                let y = parseInt(c1[1]) + diffY * sign;
                oCave[x + ',' + y] = '#';
            } while ((diffX + diffY) > 0);
            //changement de x
            /* if (c1[0] !== c2[0]) {
                let diff = c2[0] - c1[0];
                let sign = 1;
                if(diff < 0){
                    sign = -1;
                    diff = Math.abs(diff);
                }
                // console.log('Chgt de X avec une diff de ',diff);
                do {
                    let x = parseInt(c1[0]) + (diff-- * sign);
                    let y = parseInt(c1[1]);
                    oCave[x + ',' + y] = '#';
                } while (diff >= 0);
            } else { //changement de y
                let diff = c2[1] - c1[1];
                let sign = 1;
                if (diff < 0) {
                    sign = -1;
                    diff = Math.abs(diff);
                }
                do {
                    let x = parseInt(c1[0]);
                    let y = parseInt(c1[1]) + (diff-- * sign);
                    oCave[x + ',' + y] = '#';
                } while (diff >= 0);
            } */
        }
        // console.log(Object.entries(oCave).length)
    }
    //get min-max de X
    let tSorted = Object.keys(oCave).sort(
        (a, b) => {
            return a.split(',')[0] - b.split(',')[0];
        }
    );
    oCave.minX = parseInt(tSorted[0].split(',')[0]);
    oCave.maxX = parseInt(tSorted[tSorted.length - 1].split(',')[0]);
    //get min-max de Y
    tSorted = Object.keys(oCave).sort(
        (a, b) => {
            return b.split(',')[1] - a.split(',')[1];
        }
    );
    oCave.minY = 0;
    oCave.maxY = parseInt(tSorted[0].split(',')[1]);
    return oCave;
}

function displayCave(oCave){
    for (let y = oCave.minY; y <= oCave.maxY;y++){
        let line = '';
        for (let x = oCave.minX; x <= oCave.maxX;x++){
            let c = oCave[x+','+y] || '.';
            line += c;
        }
        console.log(line);
    }
}