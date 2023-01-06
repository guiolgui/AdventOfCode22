const tools = require('../General/tools');

function main() {
    tools.readFileSync('./input')
        .then((data) => {
            console.log('file readed !');
            let tSacks = data.split('\n');
            tSacks.pop(); //remove last empty item
            step1(tSacks);
            step2(tSacks);
        })
        .catch((err) => {
            console.error(err);
        });
}

main();

function step1(tSacks){
    // let id = 1;
    // let o;
    let total = 0;
    for (let sack of tSacks){
        let comp1 = [...sack];
        let comp2 = comp1.splice(sack.length/2);
        const filteredArray = comp1.filter(value => comp2.includes(value));
        // const setFilter = [...new Set(filteredArray)];
        // if (setFilter.length > 1){
        //     console.log(setFilter);
        // }
        if (filteredArray.length > 0){
            let type = filteredArray[0];
            let charCode = type.charCodeAt(0);
            if (charCode >= 97){
                charCode -= 96;
            } else {

                charCode -= 38;
            }
            total += charCode;
        }
    }
    console.log('Le score total est de:',total);
}

function step2(tSacks){
    let nbGroup = tSacks.length / 3;
    let total = 0;
    console.log('Il y a', nbGroup,'groupes d\'elfes.');
    for (let i = 0; i < tSacks.length;i = i+3){
        // console.log('group: n°',(i/3) + 1);
        let sack1 = [...tSacks[i]];
        let sack2 = [...tSacks[i+1]];
        let sack3 = [...tSacks[i+2]];
        let filteredArray = sack1.filter(value => sack2.includes(value));
        filteredArray = filteredArray.filter(value => sack3.includes(value));
        // console.log('group: n°', (i / 3) + 1, '. L\'objet en commun est', filteredArray[0]);
        let charCode = filteredArray[0].charCodeAt(0);
        if (charCode >= 97) {
            charCode -= 96;
        } else {

            charCode -= 38;
        }
        total += charCode;
    }
    console.log('Le score total est de:', total);
}