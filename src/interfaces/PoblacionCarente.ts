import DataInformation from "./DataInformation";

interface PoblacionCarente extends DataInformation{
    unidadTerritorial: String;
    personasCarentes: Number;
    hogaresHacinados: Number;
}

export default PoblacionCarente;