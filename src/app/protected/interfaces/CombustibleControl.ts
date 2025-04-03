export interface CombustibleControl {
    idC?:                 number;
    idCoche?:             number;
    fecha?:               Date;
    estacionServicio?:    string;
    nroFactura?:          string;
    importe?:             number;
    kilometraje?:         number;
    codEmpleado?:         number;
    diferencia?:          number;
    codSucursalCoche?:    number;
    obs?:                 string;
    litros?:              number;
    audUsuario?:          number;
    coche?:               string;
    kilometrajeAnterior?: number;
    tipoCombustible?:     string;
}