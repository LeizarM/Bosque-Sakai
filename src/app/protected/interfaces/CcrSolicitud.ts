
export interface CcrSolicitud {
    
    idSolicitud?:     number;
    codEmpresa?:      number;
    numeracion?:      number;
    tipoSolicitud?:   string;
    fechaSistema?:    Date;
    fechaSistemaJ?:   Date;
    fechaSolicitud?:  Date;
    fechaSolicitudJ?: Date;
    idSolicitante?:   number;
    datoSolicitante?: string;
    estado?:          string;
    observacion?:     string;
    totalToneladas?:  number;
    sapObservacion?:  string;
    sapToneladas?:    number;
    audUsuario?:      number;
 
    fila?:                  number;
    datoNroSolicitud?:      string;
    datoEmpresa?:           string;
    datoEstado?:            string;
    fechaSistemaString?:    string;
    fechaSolicitudString?:  string;
    datoTipoSolicitud?:     string;

}


///   Converts JSON strings to/from your types
export class Convert {

    public static toCcrSolicitud(json: string): CcrSolicitud {
        return JSON.parse(json);
    }
  
    public static ccrSolicitudToJson(value: CcrSolicitud): string {
        return JSON.stringify(value);
    }

}