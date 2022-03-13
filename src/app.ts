import cheerio from "cheerio";
import Getter from "./helpers/Getter";
import Csv from "./helpers/Csv";
import ITasaPobreza from "./interfaces/TasaPobreza";
import IPoblacionCarente from "./interfaces/PoblacionCarente";
import extractionType from "./enums/ExtractionType";
import Database from "./config/Database";
import TasaPobreza from "./Models/TasaPobreza";
import PoblacionCarente from "./Models/PoblacionCarente";

const URL = "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2020&idcom=14101";
main();

async function main() {

    await Database.connect();

    const html = await savePage();

    const {tasPobArr, poblCarArr} = extractData(html);

    saveToCsv(tasPobArr, poblCarArr);
    saveToDB(tasPobArr, poblCarArr);
}

const savePage = async (): Promise<string> => {
    const bcn = await Getter.build(URL);
    bcn.save();
    return bcn.html;
};

const extractData = (html: string) => {
    let tasPobArr: ITasaPobreza[] = [];
    let poblCarArr: IPoblacionCarente[] = [];
    const date = new Date();
    const $ = cheerio.load(html);
    $("#v-pills-2").each((_idx, elem) => {
        const tables = $(elem).find("table");
        tasPobArr = extractTas(tables, html, date);
        poblCarArr = extractPob(tables, html, date);
    });
    return {tasPobArr, poblCarArr};
};

const extractPob = (tables: cheerio.Cheerio, html: string, date: Date): IPoblacionCarente[] => {
    const $ = cheerio.load(html);
    const poblCarArr = $(tables[1]).find("tr").map((_idx, elem) => {
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
    return poblCarArr;
};

const extractTas = (tables: cheerio.Cheerio, html: string, date: Date): ITasaPobreza[] => {
    const $ = cheerio.load(html);
    const tasPobArr = $(tables[0]).find("tr").map((_idx, elem) => {
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
    return tasPobArr;
};

const stringToNumber = (textNumber: string): Number => {
    const replaceCommaToDot = textNumber.replace(",", ".");
    const finalNumber = parseFloat(replaceCommaToDot);
    return finalNumber;
};

const saveToCsv = (tasPobArr: ITasaPobreza[], poblCarArr: IPoblacionCarente[]) => {
    const tasPobArrCsv = new Csv(tasPobArr);
    const poblCarArrCsv = new Csv(poblCarArr);
    tasPobArrCsv.save("tasa");
    poblCarArrCsv.save("poblacion");
};

const saveToDB = (tasPobArr: ITasaPobreza[], poblCarArr: IPoblacionCarente[]) => {
    newTasPob(tasPobArr);
    newPoblCar(poblCarArr);
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
