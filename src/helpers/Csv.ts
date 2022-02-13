import {Parser} from "json2csv";
import fs from "fs";
import path from "path";

class Csv <ObjectType>{
    #object: ObjectType[];
    #csv: string;

    constructor (object: ObjectType[]){
        this.#object = object;
        this.#csv = this.createCsv();
    }

    private createCsv(){
        const json2CsvParser = new Parser();
        return json2CsvParser.parse(this.#object);
    }

    save(name: string){
        const dir = path.resolve(__dirname, "../public");
        const saveDir = `${dir}/${name}.csv`;
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        fs.writeFileSync(saveDir, this.#csv);
    }

    get csv(){
        return this.#csv;
    }

    get object(){
        return this.#object;
    }
}

export default Csv;