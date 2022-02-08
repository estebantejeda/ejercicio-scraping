import cheerio from "cheerio";
import Getter from "./helpers/Getter";

import TasaPobreza from "./Interfaces/TasaPobreza";
import PoblacionCarente from "./Interfaces/PoblacionCarente";

class App {
    static async main(){
        const URL = "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2020&idcom=14101";
        const bcn = await Getter.build(URL);
        const html = bcn.html;

        const $ = cheerio.load(html);

        let tasPobArr: TasaPobreza[] = [];
        let poblCarArr: PoblacionCarente[] = [];

        $("#v-pills-2").each((_idx, elem) => {
            const tables = $(elem).find("table");

            tasPobArr = $(tables[0]).find("tr").map((_idx, elem) => {
                const tds = $(elem).find("td");
                const uniTer = $(tds[0]).text().trim();
                const porIng = $(tds[1]).text().trim();
                const multDim = $(tds[2]).text().trim();
                if(uniTer === "" || porIng === "" || multDim === "") return;
                return {
                    unidadTerritorial: uniTer, 
                    porIngresos: porIng, 
                    multidimensional: multDim
                };
            }).get();

            poblCarArr = $(tables[1]).find("tr").map((_idx, elem) => {
                const tds = $(elem).find("td");
                const uniTer = $(tds[0]).text().trim();
                const perCar = $(tds[1]).text().trim();
                const hogHac = $(tds[2]).text().trim();
                if(uniTer === "" || perCar === "" || hogHac === "") return;
                return {
                    unidadTerritorial: uniTer, 
                    personasCarentes: perCar, 
                    hogaresHacinados: hogHac
                };
            }).get();

        });
        console.log(tasPobArr);
        console.log(poblCarArr);
    }
}

App.main();