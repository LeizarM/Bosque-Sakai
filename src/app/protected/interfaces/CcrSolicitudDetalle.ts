import { CcrSolicitud } from './CcrSolicitud';

export interface CcrSolicitudDetalle {
    
        idSolicitudDetalle?:        number;
        idSolicitud?:               number;
        codigoSAPBase?:             string;
        datoSAPBase?:               string;
        stockDisponibleSAPBase?:    number;
        codTipoItemSAPBase?:        number;
        datoTipoItemSAPBase?:       string;
        codFabricanteSAPBase?:      number;
        datoFabricanteSAPBase?:     string;
        gramajeSAPBase?:            number;
        largoSAPBase?:              number;
        anchoSAPBase?:              number;
        utmSAPBase?:                number;
        empaqueSAPBase?:            string;
        codigoSAPSalida?:           string;
        datoSAPSalida?:             string;
        codTipoItemSAPSalida?:      number;
        datoTipoItemSAPSalida?:     string;
        codFabricanteSAPSalida?:    number;
        datoFabricanteSAPSalida?:   string;
        gramajeSAPSalida?:          number;
        largoSAPSalida?:            number;
        anchoSAPSalida?:            number;
        utmSAPSalida?:              number;
        cantHojasSAPSalida?:        number;
        cantPaquetesSolicitados?:   number;
        cantToneladasSolicitados?:  number;
        empaqueSAPSalida?:          string;
        fechaEntrega?:              Date;

        anchoSalidaEsp?:      number;
        largoSalidaEsp?:      number;
        cantHojasSalidaEsp?:  number;
        nroCortes?:           number;

        sapDocEntry?:        number;
        sapDocNum?:          number;
        sapItemCode?:        string;
        sapProdName?:        string;
        sapEstado?:          string;
        sapPlannedQty?:      number;
        sapComments?:        string;
        sapFecCiereSistem?:  Date;
        sapFecCierre?:       Date;
        sapFecInicio?:       Date;
        sapTipoCorte?:       string;
        sapU_nroCorte?:      number;
        sapCodEmpresa?:      number;
        sapDatoEmpresa?:     string;
        sapFecCiereSistemJ?: Date;
        sapFecCierreJ?:      Date;
        sapFecInicioJ?:      Date;

        sapFecCiereSistemStr?:  string;
        sapFecCierreStr?:       string;
        sapFecInicioStr?:       string;

        audUsuario?:            number;

        fila?:                  number;
        fechaEntregaStr ?:      string;
        fechaEntregaJ?:         Date;

        registroCcrSolicitud?:  CcrSolicitud;
    
}


///   Converts JSON strings to/from your types
export class Convert {

    public static toCcrSolicitudDetalle(json: string): CcrSolicitudDetalle {
        return JSON.parse(json);
    }
  
    public static ccrSolicitudDetalleToJson(value: CcrSolicitudDetalle): string {
        return JSON.stringify(value);
    }

}