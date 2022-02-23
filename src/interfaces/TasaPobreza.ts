import DataInformation from "./DataInformation";

interface TasaPobreza extends DataInformation{
    unidadTerritorial: String;
    porIngresos: Number;
    multidimensional: Number;
}

export default TasaPobreza;