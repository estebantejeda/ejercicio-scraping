import Getter from "./helpers/Getter";
import Save from "./utils/Save";
import Csv from "./utils/Csv";
import TasaPobreza from "./Models/TasaPobreza";
import PoblacionCarente from "./Models/PoblacionCarente";
import ITasaPobreza from "./interfaces/TasaPobreza";
import IPoblacionCarente from "./interfaces/PoblacionCarente";
import ScrapePopulation from "./helpers/ScrapePopulation";
import ScrapePoverty from "./helpers/ScrapePoverty";
import Database from "./database";

const URL = "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2020&idcom=14101";

main();

async function main() {

	const database = new Database();
	await database.connect();

	const html = await savePage();

	const {tasPobArr, poblCarArr} = extractData(html);
	saveToCsv(tasPobArr, poblCarArr);
	saveToDB(tasPobArr, poblCarArr);

}

const savePage = async (): Promise<string> => {
	const bcn = await Getter.build(URL);
	Save.toHtml(bcn.html);
	return bcn.html;
};

const extractData = (html: string): {tasPobArr: ITasaPobreza[], poblCarArr: IPoblacionCarente[]} => {
	const scrapePopulation = new ScrapePopulation(html, URL);
	const scrapePoverty = new ScrapePoverty(html, URL);
	const poblCarArr = scrapePopulation.extractData();
	const tasPobArr = scrapePoverty.extractData();
	return {tasPobArr, poblCarArr};
};

const saveToCsv = (tasPobArr: ITasaPobreza[], poblCarArr: IPoblacionCarente[]) => {
	const tasPobArrCsv = Csv.toCsv(tasPobArr);
	const poblCarArrCsv = Csv.toCsv(poblCarArr);
	Save.toCsv(tasPobArrCsv, "tasa");
	Save.toCsv(poblCarArrCsv,"poblacion");
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
