import Getter from "./helpers/Getter";
import Save from "./utils/Save";
import Csv from "./utils/Csv";
import ScrapePopulation from "./helpers/ScrapePopulation";
import ScrapePoverty from "./helpers/ScrapePoverty";
import Database from "./database";
import PoblacionCarente from "./Models/PoblacionCarente";
import TasaPobreza from "./Models/TasaPobreza";

const URL = "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2020&idcom=14101";

main();

async function main() {

	const database = new Database();
	await database.connect();

	const bcn = await Getter.build(URL);
	const html = bcn.html;

	const scrapePopulation = new ScrapePopulation(html, URL);
	const scrapePoverty = new ScrapePoverty(html, URL);
	const poblCar = scrapePopulation.extractData();
	const tasPob = scrapePoverty.extractData();

	const poblCarCsv = Csv.toCsv(poblCar);
	const tasPobCsv = Csv.toCsv(tasPob);
	Save.toCsv(poblCarCsv, "poblacion");
	Save.toCsv(tasPobCsv, "tasa");

	Save.toDB(poblCar, PoblacionCarente);
	Save.toDB(tasPob, TasaPobreza);

	await database.disconnect();
}