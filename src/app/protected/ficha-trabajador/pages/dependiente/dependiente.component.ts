import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { Ciudad } from 'src/app/protected/interfaces/Ciudad';
import { Pais } from 'src/app/protected/interfaces/Pais';
import { Persona } from 'src/app/protected/interfaces/Persona';
import { lstDocumentoExpedido, lstEstadoCivil, lstSexo, lstTipoDependientes, Tipos } from 'src/app/protected/interfaces/Tipos';
import { Zona } from 'src/app/protected/interfaces/Zona';
import { PaisService } from 'src/app/protected/pais/services/pais.service';
import { Dependiente } from '../../../interfaces/Dependiente';
import { RrhhService } from '../../../rrhh/services/rrhh.service';
import { FichaTrabajadorService } from '../../services/ficha-trabajador.service';

@Component({
  selector: 'app-dependiente',
  templateUrl: './dependiente.component.html',
  styleUrls: ['./dependiente.component.css'],
  providers: [ MessageService ]
})
export class DependienteComponent implements OnInit, OnDestroy {

  //Formularios
  formDatosDependiente : FormGroup = new FormGroup({});

  //Listas
  lstDependientes     : Dependiente[] = [];
  lstGenero           : Tipos[] = [];
  lstExpedido         : Tipos[] = [];
  lstEstadoCivil      : Tipos[] = [];
  lstPais             : Pais[]  = [];
  lstCiudad           : Ciudad[] = [];
  lstZona             : Zona[] = [];
  lstTipoDependientes : Tipos[] = [];

  //Objetos
  datoPersonaDep  : Persona = {};
  //variables
  codEmpleado     : number = 0;
  displayModal   : boolean = false;

  //Suscriptions
  dependienteSuscription : Subscription = new Subscription();

  constructor(
    private fb                     : FormBuilder,
    private rrhhService            : RrhhService,
    private fichaTrabajadorService : FichaTrabajadorService,
    private loginService           : LoginService,
    private paisService            : PaisService,
    private messageService         : MessageService,
  ) {

    this.codEmpleado = this.loginService.codEmpleado;
    this.cargarListaDependientes( this.codEmpleado );

    this.lstGenero = lstSexo(); // para listar el genero
    this.lstExpedido = lstDocumentoExpedido(); // para listar en donde fue expedido un CI
    this.lstEstadoCivil =  lstEstadoCivil();  // para desplegar los estados civiles
    this.lstTipoDependientes = lstTipoDependientes(); // para desplegar los tipos de dependientes para el registro de un dependientes

    this.obtenerPaises();


  }
  ngOnDestroy(): void {
    this.dependienteSuscription.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarFormulario();
  }


  /**
   * Metodo para iniciarliar el formulario
   */
   cargarFormulario(): void {


    this.formDatosDependiente = this.fb.group({

      nombres         : [ '', [ Validators.required, Validators.minLength(3) ] ],
      apPaterno       : [ '', [ Validators.required, Validators.minLength(3) ] ],
      apMaterno       : [ '', [ Validators.required, Validators.minLength(3) ] ],
      sexo            : [ 'M', [ Validators.required, Validators.minLength(1) ] ],
      fecNac          : [ , [ Validators.required, Validators.nullValidator ]],
      lugarNacimiento : [ , [ Validators.required, Validators.minLength(3) ] ],
      ci              : [ , [ Validators.required, Validators.minLength(5) ] ],
      expedido        : [ , [ Validators.required, Validators.minLength(1) ] ],
      ciVenci         : [ , [ Validators.required, Validators.nullValidator ]],
      estCivil        : [ 'cas', [ Validators.required, Validators.minLength(2) ]],
      direccion       : [ , [ Validators.required, Validators.minLength(3) ]],
      zonaRe          : [ , [ Validators.required ]],
      codPais         : [ , [ Validators.required ]],
      nacionalidad    : [ 1, [ Validators.required ]],
      ciudad          : [ , [ Validators.required ]],
      parentesco      : [ 'hij', [ Validators.required ]],

    });
  }

  /**
  * Procedimiento para obtener Paises
  */
   obtenerPaises(): void {
    this.dependienteSuscription = this.paisService.obtenerPaises().subscribe((resp) => {
      if (resp) {
        this.lstPais = resp;
      }
    }, (err) => {
      this.lstPais = [];
      console.log(err);
    });
  }

   /**
    * Procedimiento para obtener dependientes por Empleado
    * @param codEmpleado
    */
  cargarListaDependientes( codEmpleado : number): void {
    this.dependienteSuscription = this.fichaTrabajadorService.obtenerDependientes(codEmpleado).subscribe((resp) => {

      if (resp) {
        this.lstDependientes = resp;
        console.log(this.lstDependientes);
      }

    }, (err) => {
      this.lstDependientes = [];
      console.log(err);
    });
  }

  /**
   * Cargara los datos de un dependiente
   * @param codPersona
   */
  cargarDatosDependiente( ) : void {

    this.formDatosDependiente.reset();
    this.displayModal = true;

  }
  /**
   * Procedimiento para obtener los datos personales de la persona
   * @param codPersona
   */
  obtenerDatosPersonales( codPersona: number ) {
    this.dependienteSuscription = this.rrhhService.obtenerDatosPersonales(codPersona).subscribe((resp) => {
      if (resp) {
        this.datoPersonaDep = resp;
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Cargara las ciudades por pais
   * @param event
   */
   cargarCiudades( event: number ): void {

    if(!event) return;

    this.obtenerCiudadesXPais(event);
  }

  /**
   * Cargara las zonas por ciudad
   * @param event
   * @returns
   */
  cargarZonas(event: number): void {

    if(!event )return;

    this.obtenerZonaXCiudad( event );

  }

  /**
   * Procedimiento para obtener las ciudades por pais
   * @param codPais
   */
   obtenerCiudadesXPais( codPais: number ): void {

    this.dependienteSuscription = this.rrhhService.obtenerCiudadesXPais(codPais).subscribe((resp) => {
      if (resp) {
        this.lstCiudad = resp;
        this.lstZona = [];
      }
    }, (err) => {
      this.lstCiudad = [];
      console.log(err);
    });
  }

  /**
   * Procedimiento para obtener las zonas por ciudad
   * @param codCiudad
   */
   obtenerZonaXCiudad(codCiudad: number): void {
    this.dependienteSuscription = this.rrhhService.obtenerZonaxCiudad(codCiudad).subscribe((resp) => {

      if (resp.length > 0) {
        this.lstZona = resp;
      } else {
        this.lstZona = [];
      }
    }, (err) => {
      this.lstZona = [];
      console.log(err);
    });

  }


  /**
   * Para guardar la informacion
   */
  guardar():void{

    const {codPersona, nombres, apPaterno, apMaterno, sexo, fecNac, lugarNacimiento, ci, expedido, ciVenci, estCivil, direccion, zonaRe, nacionalidad, parentesco } = this.formDatosDependiente.value;

      const regPersona : Persona = {
        codPersona,
        nombres,
        apPaterno,
        apMaterno,
        sexo,
        fechaNacimiento : fecNac,
        lugarNacimiento,
        ciNumero : ci,
        ciExpedido : expedido,
        ciFechaVencimiento : ciVenci,
        estadoCivil : estCivil,
        direccion,
        codZona : zonaRe,
        nacionalidad,
        audUsuarioI : this.loginService.codUsuario,

      }

      this.dependienteSuscription = this.rrhhService.registrarInfoPersona(regPersona)
      .subscribe(( resp )=>{
        if( resp && resp?.ok === "ok" ){

          const tempDep : Dependiente = {
            codEmpleado : this.codEmpleado,
            parentesco,
            esActivo : 'SI',// por defecto es activo
            audUsuario : regPersona.audUsuarioI
          };

          this.registrarDependiente( tempDep );


        }else{
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error al Registrar la Persona', detail: resp.msg  });

        }
      },(err) => {
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error al Registrar la Persona', detail: "Error al General " + err  });
      });



  };


  /**
   * Para registrar Los dependientes
   * @param tempDep
   */
   registrarDependiente(tempDep : Dependiente): void {

    this.dependienteSuscription = this.fichaTrabajadorService.registrarInfoDependiente( tempDep )
    .subscribe(( resp ) => {

      if(resp && resp?.ok === "ok"){

        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: resp.msg });
        this.displayModal = false;
        this.cargarListaDependientes( this.codEmpleado );

      }else{
        console.error("no se registro el dependiente");
      }

    });


  }

  /**
   * Procedimiento para validar los campos
   * @param campo
   * @returns
   */
   esValido( campo: string ): boolean | null {
    return this.formDatosDependiente.controls[campo].errors && this.formDatosDependiente.controls[campo].touched;
  }

}
