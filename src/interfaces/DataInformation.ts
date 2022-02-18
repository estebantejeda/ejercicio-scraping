import extractionType from "../enums/ExtractionType";

interface DataInformation{
    url: string,
    date: Date,
    extractionLevel: extractionType
}

export default DataInformation;