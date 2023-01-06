const tools = require('../General/tools');

function main() {
    tools.readFileSync('./input')
    // tools.readFileSync('./test_input')
    // tools.readFileSync('./test_input2')
        .then((data) => {
            console.log('file readed !');
            let tMoves = data.split('\r\n');
            // console.table(tMoves);
            step1(tMoves,1);
            step1(tMoves,9);
        })
        .catch((err) => {
            console.error(err);
        });
}

function step1(tMoves,iNbNots){
    let oVisitByTail = {};
    let headCell = [0,0];
    //let tailCell = [0,0];
    
    let knots = [];
    for (let i = 0; i < iNbNots; i++) {
        knots[i] = [0,0];        
    }

    oVisitByTail["0;0"] = true;
    
    for (const move of tMoves) {
        let mvDirection = move.split(' ')[0];
        let mvNb = move.split(' ')[1];
        // console.log(move);
        do {
            switch (mvDirection) {
                case 'U':
                    headCell[0]++;
                    break;
                case 'R':
                    headCell[1]++;
                    break;
                case 'D':
                    headCell[0]--;
                    break;
                case 'L':
                    headCell[1]--;
                    break;
            }
            // let log = 'From [' + tailCell[1] + ';' + tailCell[0] + '] to [';
            //si pas adjacent, il faut donc bouger la queue
            // if (!isAdjacent(headCell[0], headCell[1], tailCell[0], tailCell[1])){

            for (let i = 0; i < iNbNots; i++) {
                if(i == 0){
                    knots[0] = moveTail(headCell[0], headCell[1], knots[0][0], knots[0][1]);
                } else {
                    knots[i] = moveTail(knots[i-1][0], knots[i-1][1], knots[i][0], knots[i][1]);
                }
            }
            // log += tailCell[1] + ';' + tailCell[0] + '].';
            // console.log(log);
            // }
            let key = knots[iNbNots - 1][1] + ';' + knots[iNbNots - 1][0];
            oVisitByTail[key] = true;
            mvNb--;
        } while (mvNb > 0);
    }
    // console.log(oVisitByTail);
    console.log(Object.keys(oVisitByTail).length);
}
/**
 * 
 * @param {integer} x1 Coordonnées x du point A
 * @param {integer} y1 Coordonnées y du point A
 * @param {integer} x2 Coordonnées x du point B
 * @param {integer} y2 Coordonnées y du point B
 */
function isAdjacent(x1,y1,x2,y2){
    let bAdjacent = false;

    // console.log(Math.abs((Math.abs(x1 - x2) + Math.abs(y1 - y2))));
    if ((Math.abs(x1-x2) < 2 && Math.abs(y1-y2) < 2)){
        bAdjacent = true;
    }

    return bAdjacent;
}
/**
 * 
 * @param {integer} xHead Coordonnées x de la tête
 * @param {integer} yHead Coordonnées y de la tête
 * @param {integer} xTail Coordonnées x de la queue
 * @param {integer} yTail Coordonnées y de la queue
 * @returns {[xTailNew,yTailNew]} Nouvelles coordonnées de la queue
 */
function moveTail(xHead, yHead, xTail, yTail) {
    // console.log(yHead, xHead, yTail, xTail);
    let xTailNew = xTail;
    let yTailNew = yTail;
    if (!isAdjacent(xHead, yHead, xTail, yTail)){
        if (yHead !== yTail) {
            let res = (yHead - yTail) / 2;
            if (res > 0) res = Math.ceil(res);
            if (res < 0) res = Math.floor(res);
            yTailNew += res;
        }
        if (xHead !== xTail) {
            let res = (xHead - xTail) / 2;
            if (res > 0) res = Math.ceil(res);
            if (res < 0) res = Math.floor(res);
            xTailNew += res;
        }
        //si même colonne
        // if (xHead == xTail) {
        //     if (yHead > yTail) {
        //         yTailNew++;
        //     } else {
        //         yTailNew--;
        //     }
        // // même ligne
        // } else if (yHead == xHead) {
        //     if (xHead > xTail) {
        //         xTailNew++;
        //     } else {
        //         xTailNew--;
        //     }
        // //ni même colonne ni même ligne
        // } else{

        // }
    }
    return [xTailNew, yTailNew];
}
main();