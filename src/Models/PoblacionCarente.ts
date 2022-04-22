import {Schema, model} from "mongoose";
import IPoblacionCarente from "../interfaces/PoblacionCarente";
import extractionType from "../enums/ExtractionType";

const PoblacionCarente = new Schema<IPoblacionCarente>({
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
	personasCarentes: Number,
	hogaresHacinados: Number
});

export default model <IPoblacionCarente>("poblacion_carente", PoblacionCarente);