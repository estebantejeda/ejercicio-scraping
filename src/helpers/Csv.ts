import {Parser} from "json2csv";
import fs from "fs";
import path from "path";

class Csv <ArrayType>{
    #array: ArrayType[];
    #csv: string;

    constructor (array: ArrayType[]){
        this.#array = array;
        this.#csv = this.createCsv();
    }

    private createCsv(){
        const json2CsvParser = new Parser();
        return json2CsvParser.parse(this.#array);
    }

    save(name: string){
        const dir = path.resolve(__dirname, "../public");
        const saveDir = `${dir}/${name}.csv`;
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        fs.writeFileSync(saveDir, this.#csv);
        console.log(`CSV saved in ${saveDir}`);
    }

    get csv(){
        return this.#csv;
    }

    get array(){
        return this.#array;
    }

}

export default Csv;