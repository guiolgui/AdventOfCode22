const tools = require('../General/tools');

function main() {
    tools.readFileSync('./input')
    // tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let oMaze = initMaze(data.split('\r\n'));
            console.log(oMaze.currentCells);
            //oMaze.display();
            console.time('step1');
            step1(oMaze);
            console.timeEnd('step1');
            // oMaze.display();
            console.log('Ending Value:',oMaze.paths[oMaze.endingCell.split(';')[0]][oMaze.endingCell.split(';')[1]]);
            console.log('test for all starting points');
            let minPath = -1;
            console.time('step2');
            let tMaze = initMaze(data.split('\r\n')).clone();
            console.log('Nombre de point de départ:', tMaze.length);
            let cnt = 0;
            for (oMaze of tMaze){
                // console.log(oMaze.currentCells);
                step1(oMaze);
                let endingValue = oMaze.paths[oMaze.endingCell.split(';')[0]][oMaze.endingCell.split(';')[1]];
                // console.log('Ending Value:', endingValue);
                if (endingValue !== -1 && (minPath == -1 || minPath > endingValue)){
                    minPath = endingValue;
                }
                // if (cnt++ >= 2){
                //     break;
                // }
            }
            console.timeEnd('step2');
            console.log('Le plus petit chemin trouvé est donc',minPath);
        })
        .catch((err) => {
            console.error(err);
        });
}

function initMaze(tRawMaze){
    let len = tRawMaze[0].length;
    let hei = tRawMaze.length;
    let cells = [];
    let startCell;
    let endingCell;

    for(let rawMaze of tRawMaze){
        cells.push(rawMaze.split(''));
        let s = rawMaze.split('').indexOf('S');
        if(s !== -1){
            startCell = (cells.length-1) + ';' + s;
        }
        let e = rawMaze.split('').indexOf('E');
        if(e !== -1){
            endingCell = (cells.length-1) + ';' + e; 
        }
    }


    return new Maze(len,hei,cells,startCell,endingCell);
}

class Maze{
    constructor(length,height,cells,currentCell,endingCell){
        this.length = length || 0;
        this.height = height || 0;
        this.cells = cells || [];
        // this.paths = [];
        this.initPath();
        // this.startCell = currentCell;
        this.currentCells = [currentCell];
        // this.currentElevation = 0;
        this.endingCell = endingCell;
        this.paths[currentCell.split(';')[0]][currentCell.split(';')[1]] = 0;


        this.cells[currentCell.split(';')[0]][currentCell.split(';')[1]] = 'a';
        this.cells[this.endingCell.split(';')[0]][this.endingCell.split(';')[1]] = 'z';
    }

    display(){
        console.log('----------------');
        for(let h = 0;h<this.height;h++){
            let line = '';
            for(let l = 0;l<this.length;l++){
                line += this.cells[h][l];
            }
            console.log(line);
        }
        console.log('----------------');
        for(let h = 0;h<this.height;h++){
            let line = '';
            for(let l = 0;l<this.length;l++){
                line += this.paths[h][l] + '\t';
            }
            console.log(line);
        }
    }

    initPath(){
        // this.paths = [..this.cells];
        this.paths = this.cells.map(function(arr) {
            return arr.slice().map((elem) => {return -1;});
        });
    }

    nextStep(){
        if(this.currentCells.length == 0){
            // console.error('?');
            return false;
        }
        let nextCells = [];
        for(let currentCell of this.currentCells){
            let row = parseInt(currentCell.split(';')[0]);
            let col =  parseInt(currentCell.split(';')[1]);
            let currentCellValue = this.cells[currentCell.split(';')[0]][currentCell.split(';')[1]];
            let currentElevation = currentCellValue.charCodeAt();
            let costCurrentCell = this.paths[currentCell.split(';')[0]][currentCell.split(';')[1]];
            let adjCells = this.getAdjacentCells(row,col);
            // console.log(currentCellValue,currentElevation,adjCells,costCurrentCell);
            for(let adjCell of adjCells){
                try {
                    let adjCellValue = this.cells[adjCell.split(';')[0]][adjCell.split(';')[1]];
                let adjCellElevation = adjCellValue.charCodeAt();
                if(currentElevation >= adjCellElevation || (currentElevation+1) == adjCellElevation){
                    //on peut se déplacer dans cette case
                    //on regarde donc le cout, et s'il est non calculé ou supérieur, on le remplace
                    let costAdjCurrentCell = this.paths[adjCell.split(';')[0]][adjCell.split(';')[1]];
                    if(costAdjCurrentCell == -1 || costAdjCurrentCell > (costCurrentCell+1)){
                        this.paths[adjCell.split(';')[0]][adjCell.split(';')[1]] = costCurrentCell+1;
                        nextCells.push(adjCell);
                    }
                }
                } catch (error) {
                    console.log('Error',adjCell);
                    return false;
                }
            }
        }
        this.currentCells = nextCells;
        return true;
    }

    getAdjacentCells(row,col){
        let adjCells = [];
        // //haut
        // if(row > 0){
        //     adjCells.push([row-1][col]);
        // }
        // //droite
        // if(col < this.length){
        //     adjCells.push([row][col+1]);
        // }
        // //bas
        // if(row < this.height){
        //     adjCells.push([row+1][col]);
        // }
        // //gauche
        // if(col > 0){
        //     adjCells.push([row][col-1]);
        // }
        //haut
        if(row > 0){
            adjCells.push((row-1) + ';' + col);
        }
        //droite
        if(col < this.length - 1){
            adjCells.push(row+ ';' +(col+1));
        }
        //bas
        if(row < this.height - 1){
            adjCells.push((row+1)+ ';' +col);
        }
        //gauche
        if(col > 0){
            adjCells.push(row+ ';' +(col-1));
        }

        return adjCells;
    }

    //for all possibly starting point, clone maze
    clone(){
        let tMaze = [];
        for(let i=0;i<this.height;i++){
            // console.log(this.cells[i]);
            let tStartingPoints = this.cells[i].reduce(
                (accumulator,currentValue,currentIndex) => {
                    if (currentValue == 'a'){
                        accumulator.push(currentIndex);
                    }
                    return accumulator;
                }, []
            );
            for (let startingPoint of tStartingPoints){
                let startCell = i + ';' + startingPoint;
                // console.log('Point de départ possible:',startCell);
                tMaze.push(new Maze(this.length, this.height, this.cells, startCell, this.endingCell));
            }
        }
        return tMaze;
    }
}

function step1(oMaze){

    let max = oMaze.length * oMaze.height;
    let i = 0;
    do {
        if(!oMaze.nextStep()){
            break;
        }
        if(i++ >= max){
            console.log('Max reached');
            break;
        }
    } while (oMaze.paths[oMaze.endingCell.split(';')[0]][oMaze.endingCell.split(';')[1]] == -1);  
}

main();