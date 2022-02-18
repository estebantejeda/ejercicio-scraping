import DataInformation from "./DataInformation";

interface PoblacionCarente extends DataInformation{
    unidadTerritorial: string;
    personasCarentes: number;
    hogaresHacinados: number;
}

export default PoblacionCarente;