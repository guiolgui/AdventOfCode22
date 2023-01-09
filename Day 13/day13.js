const tools = require('../General/tools');

function main() {
    tools.readFileSync('./input')
    // tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let tPackets =data.split('\r\n');
            console.time('step1');
            // let left = [[4, 4], 4, 4];
            // let right = [[4, 4], 4, 4, 4];
            // log('Comparaison entre [' + JSON.stringify(left) + '] / [' + JSON.stringify(right) + '].');
            // compare(left, right);
            step1(tPackets);
            console.timeEnd('step1');

            console.time('step2');
            step2(tPackets);         
            console.timeEnd('step2');
        })
        .catch((err) => {
            console.error(err);
        });
}

function step1(tPackets){
    let nbPackets = tPackets.length / 3;
    console.log('Il y a', nbPackets,' paquets à comparer.');
    let total = 0;
    for (let i = 1; i <= nbPackets;i++){
        // console.log('Paquet n°',i);
        let leftPack  = new Function('return' + tPackets[(i - 1) * 3])();
        let rightPack = new Function('return' + tPackets[(i - 1) * 3 + 1])();
        console.log('--------------------\nPaquet',i,'\nComparaison entre', JSON.stringify(leftPack) , 'et', JSON.stringify(rightPack));
        if(compare(leftPack,rightPack) == -1){
            total += i;
        }
    }
    console.log('Réponse:',total);
}

function compare(left,right){
    let firstLeft = left.shift();
    let firstRight = right.shift();
    log('\t- Comparaison entre ' + JSON.stringify(firstLeft) + ' / ' + JSON.stringify(firstRight) + '.');

    //si un des deux à court avant l'autre 
    if (firstLeft == undefined && (firstRight || firstRight == 0)) {
        log('Left side ran out of items, so inputs are in the right order');
        return -1;
    }

    if (firstRight == undefined && (firstLeft || firstLeft == 0)) {
        log('Right side ran out of items, so inputs are not in the right order');
        return 1;
    }

    if (firstLeft == undefined && firstRight == undefined){
        return 0;
    }

    //si deux number
    if (typeof firstLeft == 'number' && typeof firstRight == 'number'){
        //si égaux alors on passe à la comp suivante
        if (firstLeft == firstRight){
            return compare(left,right);
        } else if(firstLeft < firstRight){
            log('Left side is smaller, so inputs are in the right order');
            return -1;
        } else { //(firstLeft > firstRight)
            log('Right side is smaller, so inputs are not in the right order');
            return 1;
        }
    // } else if (typeof firstLeft == 'object' && typeof firstRight == 'object'){
    } else {
        if (typeof firstLeft == 'number') {
            log('Convert Left to list.');
            firstLeft = [firstLeft];
        } 
        
        if (typeof firstRight == 'number'){
            log('Convert Right to list.');
            firstRight = [firstRight];
        }
        let comp = compare(firstLeft, firstRight);
        if(comp == 0){
            return compare(left, right);
        } else {
            return comp;
        }
    }
}

function step2(tPackets) {
    let nbPackets = tPackets.length / 3;
    let tAllPackets = [];
    for (let i = 1; i <= nbPackets; i++) {
        tAllPackets.push(new Function('return' + tPackets[(i - 1) * 3])());
        tAllPackets.push(new Function('return' + tPackets[(i - 1) * 3 + 1])());
    }
    tAllPackets.push(new Function('return [[2]]')());
    tAllPackets.push(new Function('return [[6]]')());

    // tAllPackets = tAllPackets.slice(1,3);

    console.log('Il y a', tAllPackets.length, ' paquets à trier.');

    // console.log(tAllPackets);
    tAllPackets.sort( (a,b) => {
        // console.log(tAllPackets);
        let cp1 = JSON.parse(JSON.stringify(a));
        let cp2 = JSON.parse(JSON.stringify(b));
        let cmp = compare(cp1,cp2);
        // console.log('Sort',JSON.stringify(a), 'et',JSON.stringify(b),'==>',cmp);
        // compare(a.slice(),b.slice());
        return cmp;
        // return -1;
    });
    // console.log(tAllPackets);
    //recherche de l'index de [[2]] et [[6]]
    let val2 = JSON.stringify([[2]]);
    let val6 = JSON.stringify([[6]]);
    for (let i = 0; i < tAllPackets.length;i++){
        let currentVal = JSON.stringify(tAllPackets[i]);

        if (val2 == currentVal){
            val2 = i + 1;
        }
        if (val6 == currentVal){
            val6 = i + 1;
        }
        if (typeof val2 !== 'string' && typeof val6 !== 'string'){
            break;
        }
    }
    console.log('Réponse:', val2 * val6);
}

function log(sLog){
    return;
    console.log(sLog);
}

main();