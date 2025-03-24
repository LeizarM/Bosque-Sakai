export interface UsuarioBtn {
  codUsuario?:  number;
  codBtn?:      number;
  nivelAcceso?: number;
  audUsuario?:  number;
  
  
  // variables de apoyo
  boton?: string;
  permiso?: number;
  pertenVist?:number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toUsuarioBtn(json: string): UsuarioBtn {
      return JSON.parse(json);
  }

  public static usuarioBtnToJson(value: UsuarioBtn): string {
      return JSON.stringify(value);
  }
}
