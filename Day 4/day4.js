const tools = require('../General/tools');

function main() {
    tools.readFileSync('./input')
        .then((data) => {
            console.log('file readed !');
            let tPairs = data.split('\n');
            // console.log('last item:',tPairs[tPairs.length-1],'.');
            // tPairs.pop(); //remove last empty item
            // console.log('last item:', tPairs[tPairs.length - 1], '.');
            step1(tPairs);
            step2(tPairs);
        })
        .catch((err) => {
            console.error(err);
        });
}

main();

function step1(tPairs){
    let total = 0;
    let id = 0;
    for(let pair of tPairs){
        let p1 = pair.split(',')[0].split('-');
        let p2 = pair.split(',')[1].split('-');
        id++;
        if (isContains(p1, p2) || isContains(p2, p1)){
            // console.log('Les pairs',p1,'et',p2,'s\'incluent.');
            total++;
        } else {
            // console.log('Les pairs', p1, 'et', p2, 'ne s\'incluent pas.');
        }
        // if(id > 20){
        //     break;
        // }
    }
    console.log('Le total des pairs qui s\'incluent est de ',total);
}

function step2(tPairs) {
    let total = 0;
    let id = 0;
    for (let pair of tPairs) {
        let p1 = pair.split(',')[0].split('-');
        let p2 = pair.split(',')[1].split('-');
        id++;
        if (isOverlapping(p1, p2)) {
            // console.log('Les pairs',p1,'et',p2,'s\'overlap.');
            total++;
        } else {
            // console.log('Les pairs', p1, 'et', p2, 'ne s\'overlap pas.');
        }
        // if(id >= 20){
        //     break;
        // }
    }
    console.log('Le total des pairs qui s\'overlappent est de ', total);
}

/**
 * Est-ce que a est contenu dans b ?
 * @param {[borneInf,borneSup]} a 
 * @param {[borneInf,borneSup]} b 
 */
function isContains(a,b){
    if(parseInt(a[0]) >= parseInt(b[0]) && parseInt(a[1]) <= parseInt(b[1])){
        return true;
    }
    return false;
}
/**
 * Est-ce que a et b s'overlap ?
 * @param {[borneInf,borneSup]} a 
 * @param {[borneInf,borneSup]} b 
 */
function isOverlapping(a,b){
    a[0] = parseInt(a[0]);
    a[1] = parseInt(a[1]);
    b[0] = parseInt(b[0]);
    b[1] = parseInt(b[1]);
    if(a[0] >= b[0] && a[0] <= b[1]){
        return true;
    }
    if (a[1] >= b[0] && a[1] <= b[1]) {
        return true;
    }
    if (b[0] >= a[0] && b[0] <= a[1]) {
        return true;
    }
    if (b[1] >= a[0] && b[1] <= a[1]) {
        return true;
    }

    return false;
}