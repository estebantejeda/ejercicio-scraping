import cheerio from "cheerio";
import Getter from "./helpers/Getter";
import Csv from "./helpers/Csv";
import ITasaPobreza from "./interfaces/TasaPobreza";
import IPoblacionCarente from "./interfaces/PoblacionCarente";
import extractionType from "./enums/ExtractionType";
import Database from "./config/Database";
import TasaPobreza from "./Models/TasaPobreza";
import PoblacionCarente from "./Models/PoblacionCarente";

async function main() {

    await Database.connect();

    const URL = "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2020&idcom=14101";
    const bcn = await Getter.build(URL);
    const html = bcn.html;
    bcn.save();

    const $ = cheerio.load(html);

    let tasPobArr: ITasaPobreza[] = [];
    let poblCarArr: IPoblacionCarente[] = [];
    const date = new Date();

    $("#v-pills-2").each((_idx, elem) => {
        const tables = $(elem).find("table");

        tasPobArr = $(tables[0]).find("tr").map((_idx, elem) => {
            const tds = $(elem).find("td");
            const uniTer = $(tds[0]).text().trim();
            const porIng = $(tds[1]).text().trim();
            const multDim = $(tds[2]).text().trim();
            if (uniTer === "" || porIng === "" || multDim === "") return;
            const porIngresos = stringToNumber(porIng);
            const multidimensional = stringToNumber(multDim);
            const data: ITasaPobreza = {
                unidadTerritorial: uniTer,
                porIngresos,
                multidimensional,
                date,
                extractionLevel: extractionType.COMUNAL,
                url: URL,
            };
            return data;
        }).get();

        poblCarArr = $(tables[1]).find("tr").map((_idx, elem) => {
            const tds = $(elem).find("td");
            const uniTer = $(tds[0]).text().trim();
            const perCar = $(tds[1]).text().trim();
            const hogHac = $(tds[2]).text().trim();
            if (uniTer === "" || perCar === "" || hogHac === "") return;
            const personasCarentes = stringToNumber(perCar);
            const hogaresHacinados = stringToNumber(hogHac);
            const data: IPoblacionCarente = {
                unidadTerritorial: uniTer,
                personasCarentes, 
                hogaresHacinados,
                date,
                extractionLevel: extractionType.COMUNAL,
                url: URL,
            };
            return data;
        }).get();

    });

    const tasPobArrCsv = new Csv(tasPobArr);
    const poblCarArrCsv = new Csv(poblCarArr);
    
    tasPobArrCsv.save("tasa");
    poblCarArrCsv.save("poblacion");

    newTasPob(tasPobArr);
    newPoblCar(poblCarArr);
}


const stringToNumber = (textNumber: string): Number => {
    const replaceCommaToDot = textNumber.replace(",", ".");
    const finalNumber = parseFloat(replaceCommaToDot);
    return finalNumber;
};

const newTasPob = (tasPobArr: ITasaPobreza[]) => {
    tasPobArr.forEach(async tasPob => {
        const newTasPob = new TasaPobreza(tasPob);
        await newTasPob.save();
    });
};

const newPoblCar = (poblCar: IPoblacionCarente[]) => {
    poblCar.forEach(async poblCar => {
        const newPoblCar = new PoblacionCarente(poblCar);
        await newPoblCar.save();
    });
};

main();
