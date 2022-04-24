import DataInformation from "./DataInformation";

interface TasaPobreza extends DataInformation{
    unidadTerritorial: string;
    porIngresos: number;
    multidimensional: number;
}

export default TasaPobreza;