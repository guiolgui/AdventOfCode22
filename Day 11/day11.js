const tools = require('../General/tools');

let divideWorry = 3;
let allDivisor = 1;

function main() {
    tools.readFileSync('./input')
    // tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let tMonkeys = dataToMonkeys(data.split('\r\n'));
            console.time('step1');
            step(tMonkeys,20);
            console.timeEnd('step1');
            
            tMonkeys = dataToMonkeys(data.split('\r\n'));
            divideWorry = 1;
            console.time('step2');
            step(tMonkeys,10000);
            console.timeEnd('step2');
        })
        .catch((err) => {
            console.error(err);
        });
}

function dataToMonkeys(tLines){
    const nbLines = 7;
    let nbMonkeys = tLines.length / 7;
    let tMonkeys = [];
    for (let i = 0; i < nbMonkeys; i++) {
        let items = tLines[i*nbLines + 1].split('Starting items: ')[1].split(', ');
        items = items.map( (element) => { return BigInt(element)});
        let operation = tLines[i*nbLines + 2].split('Operation: new = ')[1];
        let testDivideBy = parseInt(tLines[i*nbLines + 3].split('Test: divisible by ')[1]);
        let trueThrow = parseInt(tLines[i*nbLines + 4].split('If true: throw to monkey ')[1]);
        let falseThrow = parseInt(tLines[i*nbLines + 5].split('If false: throw to monkey ')[1]);
        tMonkeys[i] = new Monkey(items,operation,testDivideBy,trueThrow,falseThrow);

        allDivisor *= testDivideBy;
    }
    return tMonkeys;
}


function step(tMonkeys,nbSteps){
    let cnt = 0;
    console.log('///////');
    do {
        for (const monkey of tMonkeys) {            
            let bItemToProcess = true;
            do {
                let res;
                res = monkey.inspectNextItem();  
                if(res[0] !== -1){
                    tMonkeys[res[0]].addItem(res[1]);
                } else{
                    bItemToProcess = false;
                }
            } while (bItemToProcess);
        }
        // console.log('-------------------------------')
        // console.log('== After round ' + ++cnt + ' ==')

        // for ([key,obj] of Object.entries(tMonkeys)) {
        //     console.log('Monkey',key,'items',obj.items);
        // }
        nbSteps--;
    } while (nbSteps > 0);

    for ([key,obj] of Object.entries(tMonkeys)) {
        console.log('Monkey',key,'inspected items',obj.inpectedTimes,'times.');
    }

    tMonkeys.sort((a,b) => {
        if(a.inpectedTimes > b.inpectedTimes) return -1;

        return 1;
    });

    console.log('The level of monkey business is',tMonkeys[0].inpectedTimes * tMonkeys[1].inpectedTimes );
}


class Monkey{
    constructor(tItems,operation,testDivideBy,trueThrow,falseThrow){
        this.items = tItems || [];
        this.operation = operation;
        this.testDivideBy = BigInt(testDivideBy);
        this.trueThrow = trueThrow;
        this.falseThrow = falseThrow;
        this.bLog = false;
        this.inpectedTimes = 0;
    }

    inspectNextItem(){
        this.log('--------------------------');
        if(this.items.length == 0){
            this.log('No items to inspect.');
            return [-1,-1];
        }
        this.inpectedTimes++;
        let worryItemValue = BigInt(this.items.shift());
        this.log('Monkey inspects an item with a worry level of ' + worryItemValue + '.');
        worryItemValue = compute(this.operation.replaceAll('old',worryItemValue));
        this.log('Worry level changes to ' + worryItemValue + '.');
        // worryItemValue = Math.floor(worryItemValue/divideWorry);
        worryItemValue = BigInt(worryItemValue/BigInt(divideWorry));
        this.log('Monkey gets bored with item. Worry level is divided by ' + divideWorry + ' to ' + worryItemValue + '.');
        if(divideWorry == 1){
            worryItemValue = worryItemValue % BigInt(allDivisor);
        }
        // if(Math.abs(worryItemValue % this.testDivideBy) == 0){
        if(worryItemValue % BigInt(this.testDivideBy) == 0){
            this.log('Current worry level is divisible by ' + this.testDivideBy + '. Item is throw to Monkey ' + this.trueThrow + '.');
            return [this.trueThrow,worryItemValue];
        } else {
            this.log('Current worry level is not divisible by ' + this.testDivideBy + '. Item is throw to Monkey ' + this.falseThrow + '.');
            return [this.falseThrow,worryItemValue];
        }
    }

    log(sLog){
        if(!this.bLog){
            return;
        }
        console.log(sLog);
    }

    addItem(valItem){
        this.items.push(valItem);
    }
}

function compute(fn) {
    return new Function('return ' + fn)();
  }

main();