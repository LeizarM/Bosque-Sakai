import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Empleado } from '../../../interfaces/Empleado';
import { RrhhService } from '../../services/rrhh.service';
import { Empresa } from '../../../interfaces/Empresa';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Sucursal } from '../../../interfaces/Sucursal';
import { CargoSucursal } from '../../../interfaces/CargoSucursal';
import { lstEstadoActivoInactivo, lstTipoRelEmp, Tipos } from 'src/app/protected/interfaces/Tipos';
import { LoginService } from 'src/app/auth/services/login.service';
import { EmpleadoCargo } from '../../../interfaces/EmpleadoCargo';
import { RelEmplEmpr } from '../../../interfaces/RelEmpEmpr';

@Component({
  selector: 'app-datos-empleado',
  templateUrl: './datos-empleado.component.html',
  styleUrls: ['./datos-empleado.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]

})
export class DatosEmpleadoComponent implements OnInit {

  registroEmpleado!: Empleado;

  @Input() regEmp !: Empleado;

  displayModal    : boolean = false;

  formEmpleado    : FormGroup = new FormGroup({});

  lstEmpresas         : Empresa[] = [];
  lstEmpresasP        : Empresa[] = []; //Para determinar el cargo para la planilla
  lstSucursales       : Sucursal[] = [];
  lstSucursalesP      : Sucursal[] = []; //para determinar el cargo para la planilla
  lstCargoSucursales  : CargoSucursal[] = [];
  lstCargoSucursalesP : CargoSucursal[] = []; //para determinar el cargo para la planilla
  lstFechaBenficio    : RelEmplEmpr[] = [];

  lstRelacionLaboral: Tipos[] = [];
  lstTipoRelEmp     : Tipos[] = [];

  tipoUsuario         !: boolean;


  constructor(private loginService: LoginService,
    private rrhhService: RrhhService,
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private messageService: MessageService) {

    this.obtenerEmpresas();
    this.lstRelacionLaboral = lstEstadoActivoInactivo();
    this.lstTipoRelEmp = lstTipoRelEmp();
    this.obtenerTipoUsuario();
  }

  ngOnInit(): void {
    this.registroEmpleado = {};
    this.obtenerDatoEmpleado(this.regEmp.codEmpleado!);

    this.registroEmpleado = {...this.regEmp};

    this.registroEmpleado.empleadoCargo!.fechaInicio = new Date(this.registroEmpleado.empleadoCargo?.fechaInicio!);
    this.registroEmpleado.empleadoCargo!.fechaInicio.setDate(this.registroEmpleado.empleadoCargo!.fechaInicio.getDate() + 1);
    this.registroEmpleado.relEmpEmpr!.fechaIni = new Date(this.registroEmpleado.relEmpEmpr?.fechaIni!);
    this.registroEmpleado.relEmpEmpr!.fechaIni.setDate(this.registroEmpleado.relEmpEmpr!.fechaIni.getDate() + 1);
    this.registroEmpleado.relEmpEmpr!.fechaFin = new Date(this.registroEmpleado.relEmpEmpr?.fechaFin!);
    this.registroEmpleado.relEmpEmpr!.fechaFin.setDate(this.registroEmpleado.relEmpEmpr!.fechaFin.getDate() + 1);


    //Para los internos
    this.obtenerSucursalesXEmpresa(this.registroEmpleado.empleadoCargo?.cargoSucursal?.cargo?.codEmpresa!);
    this.obtenerCargoXSucursal(this.registroEmpleado.empleadoCargo?.codCargoSucursal!);

    //Para planillas
    this.obtenerSucursalesXEmpresaPlanilla(this.registroEmpleado.empleadoCargo?.cargoSucursal?.cargo?.codEmpresaPlanilla!);
    this.obtenerCargoXSucursalPlanilla(this.registroEmpleado.empleadoCargo?.codCargoSucPlanilla!);

    //Para cargar las fechas beneficio
    this.obtenerFechasBeneficio(this.registroEmpleado.codEmpleado!);


    this.formEmpleado = this.fb.group({
      codEmpleado              : [ this.registroEmpleado.codEmpleado ],
      codPersona               : [ this.registroEmpleado.codPersona ],
      numCuenta                : [ this.registroEmpleado.numCuenta, [ Validators.required ]],
      codRelBeneficios         : [ this.registroEmpleado.codRelBeneficios], // esto cambiarlo con el combo
      codRelPlanilla           : [ this.registroEmpleado.codRelPlanilla ],// esto cambiarlo con el combo

      codEmpresa               : [ this.registroEmpleado.empleadoCargo?.cargoSucursal?.cargo?.codEmpresa],
      codSucursal              : [ this.registroEmpleado.empleadoCargo?.codCargoSucursal],
      codCargo                 : [ this.registroEmpleado.empleadoCargo?.cargoSucursal?.cargo?.codCargo],
      apartirDe                : [ this.registroEmpleado.empleadoCargo?.fechaInicio ], // necessary for update

      codEmpresaP              : [ this.registroEmpleado.empleadoCargo?.cargoSucursal?.cargo?.codEmpresaPlanilla],
      codSucursalP             : [ this.registroEmpleado.empleadoCargo?.codCargoSucPlanilla ],
      codCargoP                : [ this.registroEmpleado.empleadoCargo?.cargoSucursal?.cargo?.codCargoPlanilla  ],

      codRelEmplEmpr           : [ this.registroEmpleado.relEmpEmpr?.codRelEmplEmpr ],
      esActivo                 : [ this.registroEmpleado.relEmpEmpr?.esActivo?.toString()],
      tipoRelacion             : [ this.registroEmpleado.relEmpEmpr?.tipoRel],
      fechaInicio              : [ this.registroEmpleado.relEmpEmpr?.fechaIni],
      fechaFin                 : [ this.registroEmpleado.relEmpEmpr!.fechaFin = this.registroEmpleado.relEmpEmpr?.esActivo == 0 ? this.registroEmpleado.relEmpEmpr?.fechaFin : null  ],
      motivoFin                : [ this.registroEmpleado.relEmpEmpr?.motivoFin],

    });

  }

  /**
   * Procedimiento para desplegar el modal
   */
  desplegarModal(): void {

    this.displayModal = true;
    this.ngOnInit();
  }
  /**
   * Procedimiento para cambiar el valor de la empresa
   * @param
   */
  cargarSucursales(event: any): void {

    this.formEmpleado.controls['codSucursal'].setValue(0);
    this.obtenerSucursalesXEmpresa(event.value);
    this.lstCargoSucursales = [];

  }
  /**
   * Procedimiento para cambiar el valor de la empresa de las planillas
   * @param event
   */
  cargarSucursalesPlanilla(event: any): void {

    this.formEmpleado.controls['codSucursalP'].setValue(0);
    this.obtenerSucursalesXEmpresaPlanilla(event.value);
    this.lstCargoSucursalesP = [];

  }

  /**
   * Procedimiento para obtener los cargos por sucursales
   * @param event
   */
  cargarCargos(event: any): void {
    console.log(event.value);
    this.formEmpleado.controls['codCargo'].setValue(0);
    this.obtenerCargoXSucursal(event.value);
  }

  /**
   * Procedimiento para obtener los cargos por sucursal para las planillas
   * @param event
   */
  cargarCargosPlanilla(event: any): void {

    console.log(event.value);
    this.obtenerCargoXSucursalPlanilla(event.value); //aqui otro metodo
  }

  /**
   * obtendra las empresas registradas
   */
  obtenerEmpresas(): void {
    this.empresaService.obtenerEmpresas().subscribe((resp) => {
      if (resp) {
        this.lstEmpresas = resp;
        this.lstEmpresasP = resp;
      }
    }, (err) => {
      this.lstEmpresas = [];
      this.lstEmpresasP = [];
      console.log(err);
    });
  }

  /**
   * Obtendra las sucursales por empresa
   * @param codEmpresa
   */
  obtenerSucursalesXEmpresa(codEmpresa: number): void {
    this.rrhhService.obtenerSucursalesXEmpresa(codEmpresa).subscribe((resp) => {
      if (resp) {
        this.lstSucursales = resp;
      }
    }, (err) => {
      console.log(err);
      this.lstSucursales = [];
    });
  }

  /**
   * Obtendra las sucursales por empresa para la planilla
   * @param codEmpresa
   */
  obtenerSucursalesXEmpresaPlanilla(codEmpresa: number): void {
    this.rrhhService.obtenerSucursalesXEmpresa(codEmpresa).subscribe((resp) => {
      if (resp) {
        this.lstSucursalesP = resp;
      }
    }, (err) => {
      console.log(err);
      this.lstSucursalesP = [];
    });
  }


  /**
   * Obtendra los cargos por sucursal
   * @param codSucursal
   */
  obtenerCargoXSucursal(codSucursal: number): void {
    this.rrhhService.obtenerCargoXSucursal(codSucursal).subscribe((resp) => {
      if (resp) {
        this.lstCargoSucursales = resp;
      }
    }, (err) => {
      console.log(err);
      this.lstCargoSucursales = [];
    });
  }

  /**
   * Obtendra los cargos por sucursal para la planilla
   * @param codSucursal
   */
  obtenerCargoXSucursalPlanilla(codSucursal: number): void {
    this.rrhhService.obtenerCargoXSucursal(codSucursal).subscribe((resp) => {
      if (resp) {
        this.lstCargoSucursalesP = resp;
      }
    }, (err) => {
      console.log(err);
      this.lstCargoSucursalesP = [];
    });
  }

  /**
   * Obtendra el tipo de usuario
   * @returns true or false
   */
  obtenerTipoUsuario(): boolean {

    if (this.loginService.tipoUsuario === 'ROLE_ADM') return false;
    return true;
  }

  /**
   * Obtendra los datos de empleado
   * @param codEmpleado
   */
  obtenerDatoEmpleado(codEmpleado: number) {
    console.log("entro para actualizar");
    this.rrhhService.obtenerDetalleEmpleado(codEmpleado).subscribe((resp) => {
      if (resp) {
        this.regEmp = resp;
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Procedimiento para obtener las lista de fechas beneficio de un empleado
   * @param codEmpleado
   */
  obtenerFechasBeneficio(codEmpleado: number) {
    this.rrhhService.obtenerFechasBeneficio(codEmpleado).subscribe((resp) => {
      if (resp) {
        this.lstFechaBenficio = resp;
      }
    }, (err) => {
      this.lstFechaBenficio = [];
      console.log(err);
    });
  }


  /**
   * Para registrar la información del empleado
   */
  guardar(): void {

    //para actualizar el empleado y su informacion
    const { codEmpleado
      , codPersona
      , numCuenta
      , codRelBeneficios
      , codRelPlanilla
      , codEmpresa
      , codSucursal
      , codCargo
      , codEmpresaP
      , codSucursalP
      , codCargoP
      , apartirDe
      , codRelEmplEmpr
      , esActivo
      , tipoRelacion
      , fechaInicio
      , fechaFin
      , motivoFin
      , fecInicioBeneficio
      , fecInicioPlanilla } = this.formEmpleado.value;

    // Para actualizar datos de empleado
    let emp: Empleado = {};
    emp.codEmpleado = codEmpleado;
    emp.codPersona = codPersona;
    emp.numCuenta = numCuenta;
    emp.codRelBeneficios = codRelBeneficios;
    emp.codRelPlanilla = codRelPlanilla;

    //Para actualizar datos del los cargos
    let empleadoCargo: EmpleadoCargo = {};
    empleadoCargo.codEmpleado = codEmpleado;
    empleadoCargo.codCargoSucursal = this.lstCargoSucursales.filter(exp => exp.codCargo === codCargo && exp.codSucursal === codSucursal)[0].codCargoSucursal;
    empleadoCargo.codCargoSucPlanilla = this.lstCargoSucursalesP.filter(exp => exp.codCargo === codCargoP && exp.codSucursal === codSucursalP)[0].codCargoSucursal;
    empleadoCargo.fechaInicio = apartirDe;


    //Para actualizar la relacion con la empresa
    let relacionEmpEmpr: RelEmplEmpr = {};
    relacionEmpEmpr.codRelEmplEmpr = codRelEmplEmpr;
    relacionEmpEmpr.codEmpleado = codEmpleado;
    relacionEmpEmpr.esActivo = esActivo;
    relacionEmpEmpr.tipoRel = tipoRelacion;
    relacionEmpEmpr.nombreFileContrato = "";
    relacionEmpEmpr.fechaIni = fechaInicio;
    relacionEmpEmpr.fechaFin = fechaFin;
    relacionEmpEmpr.motivoFin = motivoFin;


    if (!this.formEmpleado.invalid) {
      //se registra la informacion del empleado
      this.rrhhService.registrarInfoEmpleado(emp)
        .pipe(finalize(() => registroEmpleadoCargo))
        .subscribe((resp) => {
          if (resp) {


            this.displayModal = false;
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });

          } else {
            console.log(resp);
            this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
          }
        }, (err) => {
          console.log("Error General");
          console.log(err);
        });



      empleadoCargo.existe = 1;// funciona como un flag para actualizar
      const registroEmpleadoCargo = this.rrhhService.registrarInfoEmpleadoCargo(empleadoCargo)
        .pipe(finalize(() => registroRelEmp))
        .subscribe((resp) => {
          if (resp) {

            this.displayModal = false;


            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });

          } else {
            console.log(resp);
            this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
          }
        }, (err) => {
          console.log("Error General");
          console.log(err);
        });

      const registroRelEmp = this.rrhhService.registrarRelacionEmpleadoEmpresa(relacionEmpEmpr)
        .pipe(finalize(() => this.obtenerDatoEmpleado(codEmpleado)))
        .subscribe((resp) => {
          if (resp) {

            this.displayModal = false;


            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });

          } else {
            console.log(resp);
            this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
          }
        }, (err) => {
          console.log("Error General");
          console.log(err);
        });
    }else {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
    }



  }
  /**
   * Metodo para validar campo
   * @param campo
   * @returns
   */
  campoNoValido(campo: string) {
    return this.formEmpleado.get(campo)?.invalid
      && this.formEmpleado.get(campo)?.touched;
  }


}
