const fs = require('fs');

function main() {
    let calories = [];
    fs.readFile('./input', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        calories = data.split('\n');
        if (calories.length > 0) {
            let idElf = 1;
            let oElfCal = {};
            for (let cal of calories) {
                if (cal == '') {
                    idElf++;
                    continue;
                }
                if (!oElfCal[idElf]) {
                    oElfCal[idElf] = 0;
                }
                oElfCal[idElf] += parseInt(cal);
            }
            
            sortArray(Object.values(oElfCal));
        }
    });
}

function sortArray(array){
    let array2 = [...array];
    array2.sort( (a ,b) => {
        // console.log(a, b, (parseFloat(a) > parseFloat(b)));
        if (parseFloat(a) < parseFloat(b)){
            return 1;
        } else {
            return -1;
        }
    });
    console.log('answer 1:',array2[0]);
    console.log('answer 2:', array2[0] + array2[1]  + array2[2]);

}

main();