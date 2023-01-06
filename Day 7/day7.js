const tools = require('../General/tools');
const defaultPath = '/';

class File {
    /**
     * 
     * @param {string} name Nom du fichier
     * @param {integer} size Taille du fichier (octet)
     */
    constructor(name, size) {
        this.name = name;
        this.size = parseInt(size);
    }
}

class Folder {
    /**
     * Initialise un objet de type dossier
     * @param {string} name Nom du dossier
     * @param {Folder[]} tFolders Liste des dossiers contenus
     * @param {File[]} tFiles Liste des fichiers contenus
     * @param {integer} totalSize Taille complète du dossier
     * @param {Folder} parentFolder Dossier père
     */
    constructor(name, tFolders = [], tFiles = [], totalSize = 0, parentFolder = null) {
        this.name = name;
        this.tFolders = tFolders;
        this.tFiles = tFiles;
        this.totalSize = parseInt(totalSize);
        this.parentFolder = parentFolder;
    }
    /**
     * Ajoute un dossier
     * @param {Folder} folder 
     */
    addFolder(folder) {
        folder.parentFolder = this;
        this.tFolders.push(folder);
    }
    /**
     * Ajoute un fichier
     * @param {File} file 
     */
    addFile(file) {
        //on ajoute pas un fichier identique
        if(this.tFiles.find(
            (element) => {
                return file.name == element.name && file.size == element.size;
            }
        )){
            return;
        }
        this.tFiles.push(file);
        // console.log('ancienne taille total de',this.name,':',this.totalSize);
        // console.log('Ajout du fichier',file.name,'de taille',file.size);
        this.totalSize += file.size;
        // console.log('anci    enne taille total de', this.name, ':', this.totalSize);
        let previousFolder = this.parentFolder;
        while (previousFolder != null) {
            previousFolder.totalSize += file.size;
            previousFolder = previousFolder.parentFolder;
        }
    }

    setParentFolder(parentFolder){
        this.parentFolder = parentFolder;
        this.parentFolder.tFolders.push(this);
    }
}

function main() {
    tools.readFileSync('./input')
    // tools.readFileSync('./test_input')
        .then((data) => {
            console.log('file readed !');
            let tCommands = data.split('\n');
            let oRepo = step1(tCommands);
            step2(oRepo);
        })
        .catch((err) => {
            console.error(err);
        });
}

main();

function step1(tCommands){
    let oRepo = {};
    oRepo[defaultPath] = new Folder(defaultPath, [], [], 0, null);
    let currentPath = defaultPath;
    let i = 0;
    for (let command of tCommands) {
        ++i;
        //console.log('Current line',command);
        //traiter la commande
        if (command[0] == '$'){
            let args = command.trim().split(' ');
            if (args[1] == 'cd'){
                let paths;
                switch (args[2]){
                    case defaultPath:
                        currentPath = defaultPath;
                        break;
                    //on remonte d'un folder
                    case '..':
                        paths = currentPath.split(defaultPath);
                        paths.pop();
                        if (paths.length <= 1){
                            currentPath = defaultPath;
                        } else {
                            currentPath = paths.join(defaultPath);
                        }
                        break;
                    default:
                        paths = currentPath.split(defaultPath);
                        paths.push(args[2]);
                        if(currentPath == defaultPath){
                            paths.shift();
                        }
                        currentPath = paths.join(defaultPath);
                        break;
                }
            }
        } else {
            let resultsLs = command.trim().split(' ');
            switch (resultsLs[0]) {
                case 'dir':
                    let dirPath;
                    if (currentPath !== defaultPath){
                        dirPath = currentPath + defaultPath + resultsLs[1];
                    } else {
                        dirPath = defaultPath + resultsLs[1];
                    }
                    // console.log('dirPath', dirPath);
                    if (!oRepo[dirPath]){
                        //création du dossier
                        let folder = new Folder(resultsLs[1],[],[],0,null);
                        folder.setParentFolder(oRepo[currentPath]);
                        // if (currentPath !== defaultPath){
                        //     let allFolder = currentPath.split(defaultPath);
                        //     folder.setParentFolder(oRepo[allFolder[allFolder.length - 1]]);
                        // } else {
                        //     folder.setParentFolder(oRepo[defaultPath]);
                        // }
                        // if (resultsLs[1] == 'gdbv') {
                        //     console.log('ID LINE',i);
                        //     console.log(currentPath);
                        //     console.log(dirPath);
                        // }
                        oRepo[dirPath] = folder;
                    }
                    break;
                default:
                    //création du fichier
                    let file = new File(resultsLs[1], resultsLs[0]);
                    // let currentFolder = defaultPath;
                    // if (currentPath !== defaultPath) {
                    //     let allFolder = currentPath.split(defaultPath);
                    //     currentFolder = allFolder[allFolder.length - 1];
                    // }
                    //console.log('Ajout du fichier',file.name,'dans ',currentFolder);
                    try {
                        oRepo[currentPath].addFile(file);
                    } catch (error) {
                        console.log('ID LINE',i);
                        console.log(currentPath);
                        console.log(file);
                        console.log(oRepo);
                        return;
                    }
                    break;
            }
        }
        //console.log('Current path', currentPath);
        // if (i >= 510 && i <= 530) {
        //     console.log(command);
        //     console.log(currentPath);
        // }
    }
    const maxSize = 100000;
    let answer = 0;
    for (let folder of Object.values(oRepo)){
        if(folder.totalSize <= maxSize){
            console.log('Le dossier "',folder.name,'" fait',folder.totalSize);
            answer += folder.totalSize;
        }
    }
    console.log('La taille totale de ces dossiers est donc de:',answer);
    return oRepo;
}

function step2(oRepo){
    const tailleTotale = 70000000;
    const tailleMaj = 30000000;
    const tailleDispo = (tailleTotale - oRepo['/'].totalSize);
    const tailleReq = tailleMaj - tailleDispo;
    console.log('\n');
    console.log('Taille Disponible:', tailleDispo);
    console.log('Taille Requise:', tailleReq);
    console.log('\nRecherche du plus petit dossier pouvant libérer cette espace');
    let minSizeFolder = tailleTotale;
    for(let folder of Object.values(oRepo)){
        if(folder.totalSize < tailleReq){
            continue;
        }
        if (minSizeFolder >= folder.totalSize){
            minSizeFolder = folder.totalSize;
            console.log('Nouveau minimum atteint avec le dossier',folder.name,' taille:',folder.totalSize);
        }
    }
}