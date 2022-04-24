import ExtractionType from "../enums/ExtractionType";

interface DataInformation{
    url: string,
    date: Date,
    extractionLevel: ExtractionType
}

export default DataInformation;