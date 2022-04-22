import cheerio from "cheerio";
import IPoblacionCarente from "../interfaces/PoblacionCarente";
import ExtractionType from "../enums/ExtractionType";

class ScrapePopulation {
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

	extractData(): IPoblacionCarente[] {
		const $ = cheerio.load(this.#html);
		return $("#v-pills-2 table").map((_idx, elem) => {
			const tds = $(elem).find("td");
			const unidadTerritorial = $(tds[0]).text().trim();
			const personasCarentesTemp = $(tds[1]).text().trim();
			const hogaresHacinadosTemp = $(tds[2]).text().trim();
			const personasCarentes = this.#stringToNumber(personasCarentesTemp);
			const hogaresHacinados = this.#stringToNumber(hogaresHacinadosTemp);
			if(this.#areEmptyData({unidadTerritorial, personasCarentes, hogaresHacinados})) return;
			return {
				unidadTerritorial,
				personasCarentes,
				hogaresHacinados,
				date: this.#date,
				extractionLevel: this.#extractionLevel,
				url: this.#url
			} as IPoblacionCarente;
		}).get() as IPoblacionCarente[];
	}

	#areEmptyData(conditions: { personasCarentes: number; hogaresHacinados: number; unidadTerritorial: string }): boolean {
		const {unidadTerritorial, personasCarentes, hogaresHacinados} = conditions;
		return unidadTerritorial === "" || isNaN(personasCarentes) || isNaN(hogaresHacinados);
	}

	#stringToNumber(text: string): number {
		const replace = text.replace(",", ".");
		return parseFloat(replace);
	}

}

export default ScrapePopulation;