const { cp } = require('fs');
const tools = require('../General/tools');

const charEmpty = '.';
const charRock = '#';
const charSand = 'o';

function main() {
    tools.readFileSync('./input')
    // tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let tPaths = data.split('\r\n');
            let oCave_s1 = initCave(tPaths);
            console.time('step1');
            step1(oCave_s1);
            console.timeEnd('step1');
            displayCave(oCave_s1,true);

            let oCave_s2 = initCave(tPaths);
            console.time('step2');
            step2(oCave_s2);
            console.timeEnd('step2');
            displayCave(oCave_s2, true);
        })
        .catch((err) => {
            console.error(err);
        });
}
main();

function step1(oCave){
    let i = 0;
    do {
        // console.log('Tombée n°',i);
        let bStuck = fallSand(oCave, '500,0',1);
        // console.log('Le sable tombe à l\'infini ? =>', bStuck);
        if (bStuck){
            break;
        }
    } while (++i<5000);
    console.log('Le sable a pu tomber',i,'fois');
}

function step2(oCave) {
    //rajout du sol à Y MAX - 2
    oCave.minX = 330;
    oCave.maxX = 690;
    oCave.maxY += 2;
    console.log('On étend la cave à =>', oCave.minX, '=>', oCave.maxX);
    for (let i = oCave.minX; i <= oCave.maxX;i++){
        oCave[i+','+oCave.maxY] = charRock;
    }

    let i = 0;
    do {
        // console.log('Tombée n°',i);
        let bStuck = fallSand(oCave, '500,0', 2);
        // console.log('Le sable tombe à l\'infini ? =>', bStuck);
        if (bStuck) {
            break;
        }
        // if(i%1000 == 0){
        //     console.log('Tombée n°', i);
        // }
    } while (++i < 100000);
    console.log('Le sable a pu tomber', i, 'fois');

}

function fallSand(ogCave,startingPoint,step){
    let currentPoint = startingPoint;
    let bCanFall = true;
    let bStuck = false;
    do {
        //check case en dessous
        let x = parseInt(currentPoint.split(',')[0]);
        let y = parseInt(currentPoint.split(',')[1]);
        // console.log('currentPoint',currentPoint);

        //check outofbound
        if (step == 1){
            if ((x - 1) < ogCave.minX || (x + 1) > ogCave.maxX || (y + 1) > ogCave.maxY) {
                console.log('Out of bound', currentPoint);
                bStuck = true;
                bCanFall = false;
                continue;
            }
        } else {
            //ne pas checker le premier tour
            if (ogCave[startingPoint] == charSand){
                console.log('Starting point', currentPoint);
                bStuck = true;
                bCanFall = false;
                continue;
            }
            if ((y + 1) > ogCave.maxY) {
                console.log('Fatal ERRROR', currentPoint);
                bStuck = true;
                bCanFall = false;
                continue;
            }
        }

        let newCoord;

        //check bas
        newCoord = x + ',' + (y + 1);
        if (ogCave[newCoord] == undefined) { // <=> cellToCheck == undefine
            currentPoint = newCoord;
            continue;
        }
        //check bas gauche
        newCoord = (x - 1) + ',' + (y + 1); 
        if (ogCave[newCoord] == undefined) {
            currentPoint = newCoord;
            continue;
        }
        //check bas droite
        newCoord = (x + 1) + ',' + (y + 1);
        if (ogCave[newCoord] == undefined) {
            currentPoint = newCoord;
            continue;
        }
        bCanFall = false;
    } while (bCanFall);
    if(!bStuck){
        // console.log('Nouveau sable à',currentPoint);
        ogCave[currentPoint] = charSand;
    }
    return bStuck;
}

function initCave(tCave){
    let oCave = {};
    let cpt = 0;
    for (let caveLine of tCave){
        cpt++;
        let coords = caveLine.split(' -> ');
        for (let i = 1; i < coords.length; i++) {
            let c1 = coords[i-1].split(',');
            let c2 = coords[i].split(',');

            // if (cpt == 8) {
            //     console.log('De',c1,'à',c2);
            // }
            let diffX = c2[0] - c1[0];
            let diffY = c2[1] - c1[1];
            let sign = 1;
            if (diffX < 0 || diffY < 0) {
                sign = -1;
            }
            diffX = Math.abs(diffX) + 1;
            diffY = Math.abs(diffY) + 1;
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
                // oCave[x + ',' + y] = '#';
                oCave[x + ',' + y] = charRock;

                // if (cpt == 8) {
                //     console.log('diffX', diffX, 'diffY', diffY);
                //     console.log(x + ',' + y);
                // }
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

function displayCave(oCave,writeFile){
    writeFile = writeFile || false;
    let contentFile = '';
    console.log(oCave.minX, oCave.maxX, oCave.minY, oCave.maxY);

    //header coord
    let headerCoord=[[],[],[]];
    let cpt = oCave.minX;
    do {
        // console.log(cpt.toString().substring(0,1));
        // console.log(cpt.toString().substring(1,2));
        // console.log(cpt.toString().substring(2,3));
        headerCoord[0].push(cpt.toString().substring(0, 1));
        headerCoord[1].push(cpt.toString().substring(1, 2));
        headerCoord[2].push(cpt.toString().substring(2, 3));
        // headerCoord[1].push(cpt.toString()[1]);
        // headerCoord[2].push(cpt.toString()[2]);
    } while (++cpt <= oCave.maxX);
    contentFile += '\t' + headerCoord[0].join('') + '\n' 
                 + '\t' + headerCoord[1].join('') + '\n' 
                 + '\t' + headerCoord[2].join('') + '\n';
    // console.log(headerCoord[0].join(''));
    // console.log(headerCoord[1].join(''));
    // console.log(headerCoord[2].join(''));

    for (let y = oCave.minY; y <= oCave.maxY;y++){
        let line = (y - oCave.minY) + '\t';
        for (let x = oCave.minX; x <= oCave.maxX;x++){
            // let c = oCave[x+','+y] || '.';
            let c = oCave[x+','+y] || charEmpty;
            line += c;
        }
        // console.log(line);
        contentFile += line + '\n';
    }

    if(writeFile){
        tools.writeFileSync('./output', contentFile);
    } else {
        console.log(contentFile);
    }
}