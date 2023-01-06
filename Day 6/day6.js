const tools = require('../General/tools');

function main() {
    // tools.readFileSync('./test_input')
    tools.readFileSync('./input')
        .then((data) => {
            console.log('file readed !');
            step1(data);
            step2(data);
        })
        .catch((err) => {
            console.error(err);
        });
}

main();

function step1(data){
    let oPreviousChars = {};
    let cnt = 1;
    const nbCharDiff = 4;
    for(let i=0;i<data.length;i++){
        //création de l'entrée pour le car courant
        if (!oPreviousChars[data[i]]){
            oPreviousChars[data[i]] = 0;
        }
        oPreviousChars[data[i]]++;
        //décrémentation du char - nbCharDiff (voir suppression)
        if(i-nbCharDiff >= 0){
            oPreviousChars[data[i-nbCharDiff]]--;
            if (oPreviousChars[data[i - nbCharDiff]] == 0){
                delete oPreviousChars[data[i - nbCharDiff]];
            }
        }
        if (Object.keys(oPreviousChars).length == nbCharDiff){
            console.log('answer is',cnt);
            break;
        }
        cnt++;
    }
}

function step2(data) {
    let oPreviousChars = {};
    let cnt = 1;
    const nbCharDiff = 14;
    for (let i = 0; i < data.length; i++) {
        //création de l'entrée pour le car courant
        if (!oPreviousChars[data[i]]) {
            oPreviousChars[data[i]] = 0;
        }
        oPreviousChars[data[i]]++;
        //décrémentation du char - nbCharDiff (voir suppression)
        if (i - nbCharDiff >= 0) {
            oPreviousChars[data[i - nbCharDiff]]--;
            if (oPreviousChars[data[i - nbCharDiff]] == 0) {
                delete oPreviousChars[data[i - nbCharDiff]];
            }
        }
        if (Object.keys(oPreviousChars).length == nbCharDiff) {
            console.log('answer is', cnt);
            break;
        }
        cnt++;
    }
}