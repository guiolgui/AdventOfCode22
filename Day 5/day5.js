const tools = require('../General/tools');

function main() {
    // tools.readFileSync('./test_input')
    tools.readFileSync('./input')
        .then((data) => {
            console.log('file readed !');
            let tMoves = data.split('\n');
            step1(tMoves);
            step2(tMoves);
        })
        .catch((err) => {
            console.error(err);
        });
}

main();

function step1(tMoves){
    let columns = tMoves[0].length / 4;
    console.log('Il y a',columns,'colonnes de caisses.');
    let oColumns = {};
    for(let i = 0;i<columns;i++){
        oColumns[("c"+(i+1))] = [];
    }
    for(let crates of tMoves){
        for (let i = 0; i < columns; i++){
            if (crates.substring(i * 4, (i * 4)+3).includes('[')){
                oColumns[("c" + (i + 1))].push(crates.substring(i * 4, (i * 4) + 3));
            }
        }
        if (!crates.includes('[')){
            //on a finit la lecture des crates
            break;
        }
    }
    // console.log('départ:',oColumns);
    //traitement des mouvements
    const regex = /move (?<nbMove>.*) from (?<colSrc>.*) to (?<colDest>.*)/;
    for (let crates of tMoves) {
        if (!crates.includes('move')) {
            //on a finit la lecture des crates
            continue;
        }
        let m = crates.match(regex);
        let colSrc = 'c' + m.groups.colSrc;
        let colDest = 'c' + m.groups.colDest;
        // console.log('move:', m.groups.nbMove, 'from', colSrc, 'to', colDest);
        for(let i=0;i<parseInt(m.groups.nbMove);i++){
            oColumns[colDest].unshift(oColumns[colSrc].shift());
        }
        // console.log('step:', oColumns);
    }
    // console.log('fin:', oColumns);
    //input final
    let final = '';
    for (let column of Object.values(oColumns)){
        final += column[0].substring(1,2);
    }
    console.log('Step 1:',final);
}

function step2(tMoves) {
    let columns = tMoves[0].length / 4;
    console.log('Il y a', columns, 'colonnes de caisses.');
    let oColumns = {};
    for (let i = 0; i < columns; i++) {
        oColumns[("c" + (i + 1))] = [];
    }
    for (let crates of tMoves) {
        for (let i = 0; i < columns; i++) {
            if (crates.substring(i * 4, (i * 4) + 3).includes('[')) {
                oColumns[("c" + (i + 1))].push(crates.substring(i * 4, (i * 4) + 3));
            }
        }
        if (!crates.includes('[')) {
            //on a finit la lecture des crates
            break;
        }
    }
    // console.log('départ:', oColumns);
    //traitement des mouvements
    const regex = /move (?<nbMove>.*) from (?<colSrc>.*) to (?<colDest>.*)/;
    for (let crates of tMoves) {
        if (!crates.includes('move')) {
            //on a finit la lecture des crates
            continue;
        }
        let m = crates.match(regex);
        let colSrc = 'c' + m.groups.colSrc;
        let colDest = 'c' + m.groups.colDest;
        // console.log('move:', m.groups.nbMove, 'from', colSrc, 'to', colDest);
        oColumns[colDest].unshift(...oColumns[colSrc].splice(0, m.groups.nbMove));
     /*    for (let i = 0; i < parseInt(m.groups.nbMove); i++) {
    } */
        // console.log('step:', oColumns);
    }
    // console.log('fin:', oColumns);
    //input final
    let final = '';
    for (let column of Object.values(oColumns)) {
        final += column[0].substring(1, 2);
    }
    console.log('Step 2:',final);
}