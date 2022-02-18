import request from "request-promise";
import fs from "fs";
import path from "path";

class Getter{
    #url: string;
    #html: string;

    private constructor (url: string, html: string){
        this.#url = url;
        this.#html = html;
    }

    static async build(url: string): Promise<Getter>{
        const htmlRequest = await request.get(url);
        return new Getter(url, htmlRequest);
    }

    save(name: string = "page", extension: string = "html"){
        const dir = path.resolve(__dirname, "../public");
        const saveDir = `${dir}/${name}.${extension}`;
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        fs.writeFileSync(saveDir, this.#html);
        console.log(`${extension.toUpperCase()} saved in ${saveDir}`);
    }

    get url(){
        return this.#url;
    }

    get html(){
        return this.#html;
    }

}

export default Getter;