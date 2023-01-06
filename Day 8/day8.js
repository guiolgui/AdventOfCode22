const tools = require('../General/tools');


function main() {
    tools.readFileSync('./input')
    // tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let tTrees = dataToTrees(data);
            step1(tTrees);
        })
        .catch((err) => {
            console.error(err);
        });
}

main();

function dataToTrees(data){
    let tLines = data.split('\n');
    let tTrees = [];
    let row=0;
    for(let line of tLines){
        let trees = line.trim().split('');
        tTrees[row] = [];
        for(let tree of trees){
            tTrees[row].push(parseInt(tree));
        }
        row++;
    }
    // console.table(tTrees);
    return tTrees;
}

function step1(tTrees){
    // console.table(tTrees);
    let totalVisible = 0;
    console.log('La taille de la grid est de', tTrees[0].length, 'sur', tTrees.length);
    totalVisible += tTrees[0].length * 2 + tTrees.length * 2 - 4;
    let scenicScore = 0;
    
    for (let row = 1; row < tTrees[0].length-1;row++){
        let col = 1;
        for (col; col<tTrees.length-1;col++){
            let result = isVisible(tTrees, row, col);
            if (result[0]){
                // console.log('Il est visible.');
                totalVisible++;
            }
            if (result[1] > scenicScore){
                scenicScore = result[1];
                // console.log('Arbre',col,row,'a le nouveau highscore en scenic view de:',scenicScore);
            }
        }
    }

    console.log('Nombre d\'arbres visible:',totalVisible);
    console.log('Scenic score max:',scenicScore);
}

function isVisible(tTrees,row,col){
    let checkNb = 0;
    let bVisible = false;
    let u = 0, l = 0,d = 0, r=0;
    const valTrees = tTrees[row][col];
    // console.log('Arbre', row, col, 'valeur:', valTrees);
    let atLeastOneHigher = false;
    //recherche à gauche (décrement col)
    checkNb = col - 1;
    while (checkNb >= 0){
        u++;
        if (tTrees[row][checkNb] >= valTrees){
            atLeastOneHigher = true;
            break;
        }
        checkNb--;
    }
    if (!atLeastOneHigher) {
        // console.log('Visible par la gauche');
        bVisible = true;
    }
    atLeastOneHigher = false;

    //recherche en haut (decrement row)
    checkNb = row - 1;
    while (checkNb >= 0) {
        l++;
        if (tTrees[checkNb][col] >= valTrees) {
            atLeastOneHigher = true;
            break;
        }
        checkNb--;
    }
    if (!atLeastOneHigher) {
        // console.log('Visible par le haut');
        bVisible = true;
    }
    atLeastOneHigher = false;

    //recherche à droite (increment col)
    checkNb = col + 1;
    while (checkNb < tTrees[0].length) {
        r++;
        if (tTrees[row][checkNb] >= valTrees) {
            atLeastOneHigher = true;
            break;
        }
        checkNb++;
    }
    if (!atLeastOneHigher) {
        // console.log('Visible par la droite');
        bVisible = true;
    }
    atLeastOneHigher = false;

    //recherche en bas (increment row)
    checkNb = row + 1;
    // if (row == 1 && col == 3) {
    //     console.log(row,col);
    //     console.log(checkNb);
    // }
    while (checkNb < tTrees.length) {
        d++;
        // if(row == 1 && col == 3){
        //     console.log(tTrees[checkNb][col]);
        // }
        if (tTrees[checkNb][col] >= valTrees) {
            atLeastOneHigher = true;
            break;
        }
        checkNb++;
    }
    if (!atLeastOneHigher) {
        // console.log('Visible par le bas');
        bVisible = true;
    }

    return [bVisible,(u*l*d*r)];
}