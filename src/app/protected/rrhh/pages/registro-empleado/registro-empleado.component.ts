import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { finalize, tap, map } from 'rxjs/operators';
import maplibregl, { Marker, Popup } from 'maplibre-gl';
import { Tipos, lstTipoRelEmp } from 'src/app/protected/interfaces/Tipos';
import { lstDocumentoExpedido, lstSexo, lstEstadoCivil, lstTipoFormacion, lstTipoMedicion, lstTipoLicencia } from '../../../interfaces/Tipos';
import { Pais } from '../../../interfaces/Pais';
import { PaisService } from '../../../pais/services/pais.service';
import { RrhhService } from '../../services/rrhh.service';
import { Ciudad } from '../../../interfaces/Ciudad';
import { Zona } from '../../../interfaces/Zona';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Sucursal } from 'src/app/protected/interfaces/Sucursal';
import { CargoSucursal } from '../../../interfaces/CargoSucursal';
import { Empleado } from '../../../interfaces/Empleado';
import { Persona } from '../../../interfaces/Persona';
import { RelEmplEmpr } from 'src/app/protected/interfaces/RelEmpEmpr';
import { EmpleadoCargo } from 'src/app/protected/interfaces/EmpleadoCargo';


@Component({
  selector: 'app-registro-empleado',
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.css']
})
export class RegistroEmpleadoComponent implements OnInit, OnDestroy {

  //Traqbajando con mapas
  @ViewChild('mapReg') mapReg !: ElementRef;

  mapa            !: maplibregl.Map;
  center: [number, number] = [-68.13539986925227, -16.51605372184381];


  // listas
  lstExpedido: Tipos[] = [];
  lstGenero: Tipos[] = [];
  lstEstCivil: Tipos[] = [];
  lstPais: Pais[] = [];
  lstPaisResi: Pais[] = [];
  lstCiudad: Ciudad[] = [];
  lstZona: Zona[] = [];
  lstRelacionLaboral: Tipos[] = [];
  lstEmpresas: Empresa[] = [];
  lstSucursales: Sucursal[] = [];
  lstCargoSucursales: CargoSucursal[] = [];
  lstFormacion: Tipos[] = [];
  lstMedicion: Tipos[] = [];
  lstTipoLicencia: Tipos[] = [];

  //formularios
  formDatosPersona: FormGroup = new FormGroup({});
  formDatosEmpleado: FormGroup = new FormGroup({});
  formEmail: FormGroup = this.fb.group({
    emailArr: this.fb.array([])
  });
  formTelefono: FormGroup = this.fb.group({
    telfArr: this.fb.array([])
  });
  formExpLab: FormGroup = this.fb.group({
    expLabArr: this.fb.array([])
  });
  formFormacion: FormGroup = this.fb.group({
    formaArr: this.fb.array([])
  });
  formLicenciaCon: FormGroup = this.fb.group({
    licenArr: this.fb.array([])
  });


  //objectos
  regEmpleado !: Empleado;
  regPersona  !: Persona;


  constructor(private fb: FormBuilder,
    private rrhhService: RrhhService,
    private paisService: PaisService,
    private empresaService: EmpresaService,) {

    //Obtener la lista de expediciones
    this.lstExpedido = lstDocumentoExpedido();
    //lista de genero
    this.lstGenero = lstSexo();
    // lista de estado civil
    this.lstEstCivil = lstEstadoCivil();
    //obtendra los paises
    this.obtenerPaises();
    //Obtendrea el tipo de relacion del nuevo empleado
    this.lstRelacionLaboral = lstTipoRelEmp();
    //obtendra las empresas
    this.obtenerEmpresas();
    // para obtener el tipo de medicion y tipo de formacion
    this.lstFormacion = lstTipoFormacion();
    this.lstMedicion = lstTipoMedicion();
    // para obtener la lista de categorias de licencias de conducir
    this.lstTipoLicencia = lstTipoLicencia();


  }
  ngOnDestroy(): void {
    this.mapa.off('move', () => { });
    this.mapa.off('dragend', () => { });
  }


  ngOnInit(): void {
    this.formDatosPersona = this.fb.group({

      nombres           : ['', [Validators.required, Validators.minLength(3)]],
      apPaterno         : ['', [Validators.required, Validators.minLength(3)]],
      apMaterno         : ['', [Validators.required, Validators.minLength(3)]],
      sexo              : ['', [Validators.required, Validators.minLength(1)]],
      ciNumero          : ['', [Validators.required, Validators.minLength(5)]],
      ciExpedido        : ['', [Validators.required, Validators.minLength(1)]],
      ciFechaVencimiento: ['', [Validators.required, Validators.nullValidator]],
      fechaNacimiento   : ['', [Validators.required, Validators.nullValidator]],
      nacionalidad      : ['', [Validators.required, Validators.min(1)]],
      lugarNacimiento   : ['', [Validators.required, Validators.minLength(3)]],
      codZona           : [0, [Validators.required, Validators.min(1)]],
      direccion         : ['', [Validators.required, Validators.minLength(5)]],
      estadoCivil       : ['', [Validators.required, Validators.minLength(2)]],
      lng               : [ 0 ],
      lat               : [ 0 ]


    });
    // form datos empleado

    this.formDatosEmpleado = this.fb.group({

      numCuenta: ['', [Validators.required, Validators.minLength(3)]],
      codEmpresa: [0, [Validators.required]],
      codSucursal: [0, [Validators.required]],
      codCargo: [0, [Validators.required]],
      tipoRel: ['', [Validators.required]],
      fechaInicio: [0, [Validators.required]],
      fechaFin: [0, [Validators.required]]
    });

  }

  ngAfterViewInit(): void {


    this.mapaLectura(-68.13539986925227, -16.51605372184381);


  }

  /**
   * Para desplegar el mapa y cargar datos
   * @param lat
   * @param lng
   */
  mapaLectura(lat: number, lng: number): void {
    this.mapa = new maplibregl.Map({
      container: this.mapReg.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: [lat, lng],
      zoom: 16,
    });
    const  marker = new maplibregl.Marker(
      {
        draggable: true,
      }
    )
    .setLngLat( this.center )
    .addTo(this.mapa);

    marker.on('dragend', (ev) => {
      const { lng, lat } = ev.target._lngLat;
      // Se invierten la latitud y longitud
      this.formDatosPersona.controls['lng'].setValue(lat);
      this.formDatosPersona.controls['lat'].setValue(lng);
    });
  }

  /**
   * Procedimiento para obtener Paises
   */
  obtenerPaises(): void {
    this.paisService.obtenerPaises().subscribe((resp) => {
      if (resp) {
        this.lstPais = resp;
        this.lstPaisResi = [...this.lstPais];
      }
    }, (err) => {
      this.lstPais = [];
      console.log(err);
    });
  }


  /**
   * Cargara las ciudades al seleccionar un pais
   * @param event
   * @returns
   */
  cargarCiudades(event: any): void {

    if (!event.value) return;
    this.lstCiudad = [];
    this.lstZona = [];
    this.formDatosPersona.controls['codZona'].setValue(0);
    this.obtenerCiudadesXPais(event.value);
  }

  /**
   * Procedimiento para obtener las ciudades por pais
   * @param codPais
   */
  obtenerCiudadesXPais(codPais: number): void {
    this.rrhhService.obtenerCiudadesXPais(codPais).subscribe((resp) => {
      if (resp) {
        this.lstCiudad = resp;
      }
    }, (err) => {
      this.lstCiudad = [];
      console.log(err);
    });
  }

  /**
   * Cargara las Zonas por ciudad
   * @param event
   * @returns
   */
  cargarZonas(event: any): void {
    if (!event.value) return;
    this.obtenerZonaXCiudad(event.value);

  }

  /**
   * Procedimiento para obtener las zonas por ciudad
   * @param codCiudad
   */
  obtenerZonaXCiudad(codCiudad: number): void {
    this.rrhhService.obtenerZonaxCiudad(codCiudad).subscribe((resp) => {

      if (resp.length > 0) {
        this.lstZona = resp;
      }
    }, (err) => {
      this.lstZona = [];
      console.log(err);
    });
  }

  /**
   * obtendra las empresas registradas
   */
  obtenerEmpresas(): void {
    this.empresaService.obtenerEmpresas().subscribe((resp) => {
      if (resp) {
        this.lstEmpresas = resp;

      }
    }, (err) => {
      this.lstEmpresas = [];

      console.log(err);
    });
  }

  /**
   * Obtendra las sucursales que pertenecen a una empresa
   * @param event
   * @returns
   */
  cargarSucursales(event: any) {
    if (!event.value) return;
    this.lstSucursales = [];
    this.lstCargoSucursales = [];
    this.obtenerSucursalesXEmpresa(event.value);
  }

  /**
   * Obtendran los cargos que pertenece a una sucursal que pertenecen a una empresa
   * @param event
   * @returns
   */
  cargarCargoXSucursal(event: any) {
    if (!event.value) return;

    this.obtenerCargoXSucursal(event.value);
  }

  /**
  * Obtendra las sucursales por empresa
  * @param codEmpresa
  */
  obtenerSucursalesXEmpresa(codEmpresa: number): void {
    this.rrhhService.obtenerSucursalesXEmpresa(codEmpresa).subscribe((resp) => {
      if (resp) {
        this.lstSucursales = resp;
        console.log(this.lstSucursales);
      }
    }, (err) => {
      console.log(err);
      this.lstSucursales = [];
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
   * Metodo para agregar un registro a la lista de emails
   */
  agregarRegistroEmail(): void {
    this.lstFormEmail().markAllAsTouched();
    this.lstFormEmail().push(this.crearNuevoRegistroEmail());
  }
  /**
   * Metodo para agregar un registro a la lista de emails
   */
  agregarRegistroTelefono(): void {
    this.lstFormTelf().markAllAsTouched();
    this.lstFormTelf().push(this.crearNuevoRegistroTelf());

  }
  /**
   * Metodo para agregar un registro a la lista de experiencia laboral
   */
  agregarExperienciaLaboral(): void {
    this.lstFormExpLab().markAllAsTouched();
    this.lstFormExpLab().push(this.crearNuevoRegistroExpLab())
  }
  /**
   * Para agregar un registro en  la lista de formacion
   */
  agregarFormacion(): void {

    this.lstFormFormacion().push(this.crearNuevoRegistroFormacion());
    this.lstFormFormacion().markAllAsTouched();
  }
  /**
   * Para agregar un nuevo registro para una licencia de conducir
   */
  agregarLicenciaConducir(): void {
    this.lstFormLicencia().markAllAsTouched();
    this.lstFormLicencia().push(this.crearNuevoRegistroLicConducir());
  }


  /**
   * Crear nuevo registro
   * @returns
   */
  crearNuevoRegistroEmail(): FormGroup {
    return this.fb.group({
      codEmail: new FormControl(0),
      codPersona: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.minLength(5)]),
      audUsuario: new FormControl(34)
    });
  }

  /**
   * Crear nuevo registro de telefono
   * @returns
   */
  crearNuevoRegistroTelf(): FormGroup {
    return this.fb.group({
      codTelefono: new FormControl(0),
      codPersona: new FormControl(),
      telefono: new FormControl('', [Validators.required]),
      audUsuario: new FormControl(34)
    });
  }
  /**
   * crear un nuevo registro para experiencia laboral
   */
  crearNuevoRegistroExpLab(): FormGroup {
    return this.fb.group({
      codExperienciaLaboral: new FormControl(0),
      codEmpleado: new FormControl(0),
      nombreEmpresa: new FormControl('', [Validators.required, Validators.minLength(5)]),
      cargo: new FormControl('', [Validators.required, Validators.minLength(5)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(5)]),
      fechaInicio: new FormControl('', [Validators.required]),
      fechaFin: new FormControl('', [Validators.required]),
      nroReferencia: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }
  /**
   * Para crear un nuevo registro de formacion
   * @returns
   */
  crearNuevoRegistroFormacion(): FormGroup {
    return this.fb.group({
      codFormacion  : new FormControl(0),
      codEmpleado   : new FormControl(0),
      descripcion   : new FormControl('',),
      duracion      : new FormControl(0, [Validators.required]),
      tipoDuracion  : new FormControl('', [Validators.required]),
      tipoFormacion : new FormControl('', [Validators.required]),
      fechaFormacion: new FormControl('', [Validators.required]),
    });
  }
  /**
   * Para crear un nuevo registro de la licencia de conducir
   * @returns
   */
  crearNuevoRegistroLicConducir(): FormGroup {
    return this.fb.group({
      codLicencia: new FormControl(0),
      codPersona: new FormControl(0),
      categoria: new FormControl('', [Validators.required]),
      fechaCaducidad: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Desplegara los datos del formulario para los emails
   * @returns
   */
  lstFormEmail(): FormArray {
    return this.formEmail.get('emailArr') as FormArray;
  }

  /**
   * Desplegara los datos del formulario para los telefonos
   * @returns
   */
  lstFormTelf(): FormArray {
    return this.formTelefono.get('telfArr') as FormArray;
  }
  /**
   * Desplegara los datos del formulario para la experiencia Laboral
   * @returns
   */
  lstFormExpLab(): FormArray {
    return this.formExpLab.get('expLabArr') as FormArray;
  }
  /**
   * Desplegara los datos del formulario para la formacion
   * @returns
   */
  lstFormFormacion(): FormArray {
    return this.formFormacion.get('formaArr') as FormArray;
  }
  /**
   * Desplegara los datos del formulario para la licencia de conducir
   * @returns
   */
  lstFormLicencia(): FormArray {
    return this.formLicenciaCon.get('licenArr') as FormArray;
  }

  /**
   * Procedimiento para eliminar un Email por empleado
   * @param event
   * @param index
   */
  eliminarRegistroEmail(event: Event, index: number): void {
    this.lstFormEmail().removeAt(index);
  }
  /**
  * Procedimiento para eliminar un Telefono por empleado
  * @param event
  * @param index
  */
  eliminarRegistroTelf(event: Event, index: number): void {
    this.lstFormTelf().removeAt(index);
  }
  /**
   * Para eliminar la experiencia laboral un registro
   * @param index
   */
  eliminarDatosExperienciaLab(index: number): void {
    this.lstFormExpLab().removeAt(index);
  }

  /**
   * Procedimiento para eliminar registro de datos de formacion
   * @param index
   */
  eliminarDatosFormacion(index: number): void {
    this.lstFormFormacion().removeAt(index);
  }
  /**
   * Para eliminar un registro o elemento de la lista de licencia de conducir
   * @param index
   */
  eliminarDatosLicenciaConducir(index: number): void {
    this.lstFormLicencia().removeAt(index);
  }

  /**
   * Procedimiento para guardar
   */
  guardar(): void {

    let persona: Persona = {};
    let empleado: Empleado = {};
    let relEmp: RelEmplEmpr = {};
    let empCargo: EmpleadoCargo = {};



    //se registra a los datos de la persona y se le asigna al objeto persona los datos del formulario
    persona = this.formDatosPersona.value;

    const registroPersona = this.rrhhService.registrarInfoPersona(persona)
      .subscribe((resp) => {
        if (resp?.ok === 'ok' && resp) {
          const codUltimoPer = this.rrhhService.obtenerUltimoCodigoPersona()
            .pipe(
            tap(() => registroPersona))
            .subscribe((resp) => {

              if (resp) {
                this.regPersona = resp;

                empleado = this.formDatosEmpleado.value;
                empleado.codPersona = this.regPersona.codPersona;

                this.rrhhService.registrarInfoEmpleado(empleado)
                  .pipe(
                    tap(() => codUltimoEmp))
                  .subscribe((resp) => {
                    console.log("entro al registrarInfoEmpleado");
                    if (resp) {
                      console.log("bien");

                    } else {
                      console.log(resp);

                    }
                  }, (err) => {
                    console.log("Error General");
                    console.log(err);
                  });
                const codUltimoEmp = this.rrhhService.obtenerUltimoCodigoEmpleado().subscribe((resp) => {
                  if (resp) {
                    this.regEmpleado = resp;

                    // Para registrar la relacion del empleado con la empresa
                    const { codEmpresa, codSucursal, codCargo, tipoRel, fechaInicio, fechaFin } = this.formDatosEmpleado.value;
                    relEmp.codEmpleado = this.regEmpleado.codEmpleado;
                    relEmp.tipoRel = tipoRel;
                    relEmp.esActivo = 1; // POR DEFECTO ESTA ACTIVO
                    relEmp.fechaIni = fechaInicio;
                    relEmp.fechaFin = fechaFin;

                    this.rrhhService.registrarRelacionEmpleadoEmpresa(relEmp).subscribe((resp) => {
                      if (resp) {

                        empCargo.codEmpleado = this.regEmpleado.codEmpleado;
                        empCargo.codCargoSucursal = codCargo;
                        empCargo.codCargoSucPlanilla = codCargo;
                        empCargo.fechaInicio = fechaInicio;
                        empCargo.existe = 0;

                        this.rrhhService.registrarInfoEmpleadoCargo(empCargo)
                          .pipe(
                            finalize(() => codUltimoPer))
                          .subscribe
                          ((resp) => {
                            if (resp) {
                              // si existe emails todo sale bien registramos los emails
                              if (this.lstFormEmail().controls.length > 0) {
                                this.lstFormEmail().controls.map(e => {
                                  e.value.codPersona = this.regPersona.codPersona;
                                  this.rrhhService.registrarEmail(e.value).subscribe(
                                    (resp) => {
                                      if (resp) {
                                        console.log("bien");
                                        //registramos los telefonos
                                        if (this.lstFormTelf().controls.length > 0) {
                                          this.lstFormTelf().controls.map(e => {
                                            e.value.codPersona = this.regPersona.codPersona;
                                            this.rrhhService.registrarTelefono(e.value).subscribe(
                                              (resp) => {
                                                if (resp) {
                                                  console.log("bien");
                                                } else {
                                                  console.log(resp);
                                                }
                                              }, (err) => {
                                                console.log("Error General");
                                                console.log(err);
                                              }
                                            );
                                          });
                                        }
                                        // registramos las experiencias laborales
                                        if (this.lstFormExpLab().controls.length > 0) {
                                          this.lstFormExpLab().controls.map(e => {
                                            e.value.codEmpleado = this.regEmpleado.codEmpleado;
                                            this.rrhhService.registrarExperienciaLaboral(e.value).subscribe(
                                              (resp) => {
                                                if (resp) {
                                                  console.log("bien exp lab");
                                                } else {
                                                  console.log(resp);
                                                }
                                              }, (err) => {
                                                console.log("Error en Experiencia Laboral");
                                                console.log(err);
                                              }
                                            );
                                          });
                                        }
                                        // registramos datos formacion
                                        if (this.lstFormFormacion().controls.length > 0) {
                                          this.lstFormFormacion().controls.map(e => {
                                            e.value.codEmpleado = this.regEmpleado.codEmpleado;
                                            this.rrhhService.registrarFormacion(e.value).subscribe(
                                              (resp) => {
                                                if (resp) {
                                                  console.log("bien formacion");
                                                } else {
                                                  console.log(resp);
                                                }
                                              }, (err) => {
                                                console.log("Error al registrar la formacion");
                                                console.log(err);
                                              }
                                            );
                                          });
                                        }
                                        // Para registra la licencia de conducir
                                        if (this.lstFormLicencia().controls.length > 0) {
                                          this.lstFormLicencia().controls.map(e => {
                                            e.value.codPersona = this.regPersona.codPersona;
                                            this.rrhhService.registrarLicencia(e.value).subscribe(
                                              (resp) => {
                                                if (resp) {
                                                  console.log("bien licencia conducir");
                                                } else {
                                                  console.log(resp);
                                                }
                                              }, (err) => {
                                                console.log("error al registrar la licencia de conducir");
                                                console.log(err);
                                              }
                                            );
                                          })
                                        }
                                      } else {
                                        console.log(resp);
                                      }
                                    }, (err) => {
                                      console.log("Error General");
                                      console.log(err);
                                    }
                                  );
                                });
                              }


                            }
                          }, (err) => {
                            console.log(err);
                          });

                      } else {
                        console.log("Error en registrar la relacion con el empleado");
                      }
                    }, (err) => {
                      console.log(err);

                    });

                  }
                }, (err) => {
                  console.log(err);
                  this.regEmpleado = {};
                });

              }
            }, (err) => {
              console.log(err);
              this.regPersona = {};
            });

        } else {
          console.log(resp);
        }
      }, (err) => {
        console.log("Error General");
        console.log(err);
      });




  }

}
