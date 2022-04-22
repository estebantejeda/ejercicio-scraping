import cheerio from "cheerio";
import ITasaPobreza from "../interfaces/TasaPobreza";
import ExtractionType from "../enums/ExtractionType";

class ScrapePoverty {
	readonly #date: Date;
	readonly #extractionLevel: ExtractionType;
	readonly #html: string;
	readonly #url: string;

	constructor(html: string, url: string) {
		this.#date = new Date();
		this.#extractionLevel = ExtractionType.COMUNAL;
		this.#html = html;
		this.#url = url;
	}

	extractData(): ITasaPobreza[] {
		const $ = cheerio.load(this.#html);
		return $("#v-pills-2 table tr").map((_idx, elem) => {
			const tds = $(elem).find("td");
			const unidadTerritorial = $(tds[0]).text().trim();
			const porIngresosTemp = $(tds[1]).text().trim();
			const multidimensionalTemp = $(tds[2]).text().trim();
			const porIngresos = this.#stringToNumber(porIngresosTemp);
			const multidimensional = this.#stringToNumber(multidimensionalTemp);
			if(this.#areEmptyData({unidadTerritorial, porIngresos, multidimensional})) return;
			return {
				unidadTerritorial,
				porIngresos,
				multidimensional,
				date: this.#date,
				extractionLevel: this.#extractionLevel,
				url: this.#url
			} as ITasaPobreza;
		}).get() as ITasaPobreza[];
	}

	#areEmptyData(conditions: { porIngresos: number; multidimensional: number; unidadTerritorial: string }): boolean {
		const {unidadTerritorial, porIngresos, multidimensional} = conditions;
		return unidadTerritorial === "" || isNaN(porIngresos) || isNaN(multidimensional);
	}

	#stringToNumber(text: string): number {
		const replace = text.replace(",", ".");
		return parseFloat(replace);
	}
}

export default ScrapePoverty;