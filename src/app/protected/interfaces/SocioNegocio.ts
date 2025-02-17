export interface SocioNegocio {
    
    codCliente?:     string;
    datoCliente?:    string;
    razonSocial?:    string;
    nit?:            string;
    codCiudad?:      number;
    datoCiudad?:     string;
    esVigente?:      string;
    codEmpresa?:     number;
    audUsuario?:     number;
    nombreCompleto?: string;
    
}

// Converts JSON strings to/from your types
export class Convert {
    public static toSocioNegocio(json: string): SocioNegocio {
        return JSON.parse(json);
    }

    public static socioNegocioToJson(value: SocioNegocio): string {
        return JSON.stringify(value);
    }
}
