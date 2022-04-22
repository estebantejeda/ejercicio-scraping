import {Schema, model} from "mongoose";
import extractionType from "../enums/ExtractionType";
import ITasaPobreza from "../interfaces/TasaPobreza";

const TasaPobreza = new Schema<ITasaPobreza>({
	url: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: new Date()
	},
	extractionLevel: {
		type: String,
		enum: Object.values(extractionType),
		required: true
	},
	unidadTerritorial: String,
	porIngresos: Number,
	multidimensional: Number
});

export default model <ITasaPobreza>("tasa_pobreza", TasaPobreza);