
class File{
    #name;
    #content;
    constructor(name){
        this.#name = name;
    }

    get name(){
        return this.#name;
    }

    get content(){
        return this.#content;
    }

    setFileContent(content){
        this.#content = content;
    }
}

class Folder{
    #name;
    #files = [];
    #folders = [];
    constructor(name){
        this.#name = name;
        this.#files = [];
        this.#folders = [];
    }

    get name(){
        return this.#name;
    }

    get files(){
        return this.#files;
    }

    get folders(){
        return this.#folders;
    }

    addFile(file){
        this.#files.push(file);
    }

    addFolder(folder){
        this.#folders.push(folder);
    }

    
}

class FileTree{
    root;
    #files;
    #folders;
    constructor(root){
        this.root = root;
        this.#files = [];
        this.#folders = [];
    }

    get files(){
        return this.#files;
    }

    get folders(){
        return this.#folders;
    }

    

}

export default {FileTree, File, Folder};