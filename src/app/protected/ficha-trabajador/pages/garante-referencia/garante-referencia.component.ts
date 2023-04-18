import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import maplibregl, { Marker, Popup } from 'maplibre-gl';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { Ciudad } from 'src/app/protected/interfaces/Ciudad';
import { Pais } from 'src/app/protected/interfaces/Pais';
import { Persona } from 'src/app/protected/interfaces/Persona';
import { lstDocumentoExpedido, lstEstadoCivil, lstGaranteYReferencia, lstSexo, Tipos } from 'src/app/protected/interfaces/Tipos';
import { Zona } from 'src/app/protected/interfaces/Zona';
import { PaisService } from 'src/app/protected/pais/services/pais.service';
import { RrhhService } from 'src/app/protected/rrhh/services/rrhh.service';
import { GaranteReferencia } from '../../../interfaces/GaranteReferencia';
import { Feature } from '../../../interfaces/MapBoxLibre';
import { FichaTrabajadorService } from '../../services/ficha-trabajador.service';


@Component({
  selector: 'app-garante-referencia',
  templateUrl: './garante-referencia.component.html',
  styleUrls: ['./garante-referencia.component.css'],
  providers: [MessageService]
})
export class GaranteReferenciaComponent implements OnInit, OnDestroy {

  //Formularios
  formDatosGaranYRef: FormGroup = new FormGroup({});

  lstGaranteReferencia: GaranteReferencia[] = [];
  lstExpedido: Tipos[] = [];
  lstGenero: Tipos[] = [];
  lstEstadoCivil: Tipos[] = [];
  lstGaranteYRef: Tipos[] = [];
  lstPais: Pais[] = [];
  lstCiudad: Ciudad[] = [];
  lstZona: Zona[] = [];
  lugares: Feature[] = [];

  //variables
  codEmpleado: number = 0;
  displayModal: boolean = false;

  //Maps
  @ViewChild('mapE') mapE !: ElementRef; //map Edit
  mapaEdit !: maplibregl.Map;
  private markers: Marker[] = [];
  private center: [number, number] = [-68.13539986925227, -16.51605372184381]; // coordenadas aleatorias

  //Suscriptions
  garantRefSuscription: Subscription = new Subscription();

  //Debouncer
  public selectedId: number = 0;

  private debounceTimer?: NodeJS.Timeout;

  constructor(
    private fb: FormBuilder,
    private fichaTrabajadorService: FichaTrabajadorService,
    private loginService: LoginService,
    private paisService: PaisService,
    private rrhhService: RrhhService,
    private messageService: MessageService,
  ) {
    this.codEmpleado = this.loginService.codEmpleado;
    this.cargarGaranteReferencia(this.codEmpleado);

    this.lstGenero = lstSexo(); // para listar el genero
    this.lstExpedido = lstDocumentoExpedido(); // para listar en donde fue expedido un CI
    this.lstEstadoCivil = lstEstadoCivil();  // para desplegar los estados civiles
    this.lstGaranteYRef = lstGaranteYReferencia() // pàra desplegar si una persona sera referencia o garante

    this.obtenerPaises();

  }

  ngOnInit(): void {

    this.cargarFormulario();

  }

  ngOnDestroy(): void {

    if (this.mapaEdit) {

      this.mapaEdit.off('move', () => { });
      this.mapaEdit.off('load', () => { });
      this.mapaEdit.off('dragend', () => { });

    }

    this.garantRefSuscription.unsubscribe();

  }

  /**
   * Prepara el formulario para que se pueda agregar datos
   */
  cargarFormulario(): void {

    this.formDatosGaranYRef = this.fb.group({

      nombres   : ['', [Validators.required, Validators.minLength(3)]],
      apPaterno : ['', [Validators.required, Validators.minLength(3)]],
      apMaterno : ['', [Validators.required, Validators.minLength(3)]],
      sexo      : ['M', [Validators.required, Validators.minLength(1)]],
      fecNac    : [, [Validators.required, Validators.nullValidator]],
      lugarNacimiento: [, [Validators.required, Validators.minLength(3)]],
      ci      : [, [Validators.required, Validators.minLength(5)]],
      expedido: ['lp', [Validators.required, Validators.minLength(1)]],
      ciVenci : [, [Validators.required, Validators.nullValidator]],
      estCivil: ['cas', [Validators.required, Validators.minLength(2)]],
      direccion : [, [Validators.required, Validators.minLength(3)]],
      zonaRe    : [, [Validators.required]],
      codPais   : [, [Validators.required]],
      nacionalidad: [1, [Validators.required]],
      ciudad: [, [Validators.required]],
      lat     : [],
      lng     : [],

      direccionTrabajo: ['', [Validators.required, Validators.minLength(5)]],
      empresaTrabajo: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['ref', [Validators.required, Validators.minLength(2)]],
      obs: ['',]

    });
  }

  /**
   * Para desplegar el mapa y cargar datos
   * @param lat
   * @param lng
   */
  mapaLectura(lat: number = 0, lng: number = 0): void {

    if (lat === null || lng === null || lat === undefined || lng === undefined || lng === 0 || lat === 0) {
      [lat, lng] = this.center;
    }

    this.mapaEdit = new maplibregl.Map({
      container: this.mapE.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: [lat, lng],
      zoom: 16,
    });

    this.mapaEdit.once('load', () => {
      this.mapaEdit.resize();
    })
  }
  /**
   * Para cargar los garante y/o referencias por empleado
   * @param codEmpleado
   */
  cargarGaranteReferencia(codEmpleado: number): void {
    this.garantRefSuscription = this.fichaTrabajadorService.obtenerGaranteYReferencias(codEmpleado).subscribe((resp) => {

      if (resp) {
        this.lstGaranteReferencia = resp;
      }

    }, (err) => {
      this.lstGaranteReferencia = [];
      console.log(err);
    });
  }
  /**
   * Para prepara el formulario y desplegar el dialog
   */
  prepararFormulario(): void {
    this.displayModal = true;
    console.log("entro en preparar formulario");
    this.mapaLectura();
  }

  /**
   * Guardara la informacion de un dependiente o garante
   */
  guardar(): void {

    const { nombres, apPaterno, apMaterno, sexo, fecNac, lugarNacimiento, ci, expedido, ciVenci, direccion, zonaRe, nacionalidad, direccionTrabajo, direccionDomicilio, empresaTrabajo, tipo, obs } = this.formDatosGaranYRef.value;

    const regPersona: Persona = {
      nombres,
      apPaterno,
      apMaterno,
      sexo,
      fechaNacimiento: fecNac,
      lugarNacimiento,
      ciNumero: ci,
      ciExpedido: expedido,
      ciFechaVencimiento: ciVenci,
      direccion,
      codZona: zonaRe,
      nacionalidad,
      audUsuarioI: this.loginService.codUsuario

    };

    const datoGaranteReferencia: GaranteReferencia = {
      codEmpleado: this.codEmpleado,
      direccionTrabajo,
      empresaTrabajo,
      tipo,
      observacion: obs,
      audUsuario: this.loginService.codUsuario
    };


    this.garantRefSuscription = this.rrhhService.registrarInfoPersona(regPersona)
      .subscribe((resp) => {
        if (resp && resp?.ok === "ok") {

          //console.log("🚀 ~ file: garante-referencia.component.ts:142 ~ GaranteReferenciaComponent ~ guardar ~ datoGaranteReferencia", datoGaranteReferencia);
          this.registrarGaranteReferencia(datoGaranteReferencia);


        } else {
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error al Registrar la Persona', detail: resp.msg });

        }
      }, (err) => {
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error al Registrar la Persona', detail: "Error al General " + err });
      });


  }

  /**
   * Para registrar Los dependientes
   * @param tempDep
   */
  registrarGaranteReferencia(tempGarRef: GaranteReferencia): void {

    this.garantRefSuscription = this.fichaTrabajadorService.registrarInfoGaranteReferencia(tempGarRef)
      .subscribe((resp) => {

        if (resp && resp?.ok === "ok") {

          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: resp.msg });
          this.displayModal = false;
          this.cargarGaranteReferencia(this.codEmpleado);

        } else {
          console.error("no se registro el garante o referencia");
        }

      });


  }



  /**
  * Procedimiento para obtener Paises
  */
  obtenerPaises(): void {
    this.paisService.obtenerPaises().subscribe((resp) => {
      if (resp) {
        this.lstPais = resp;
      }
    }, (err) => {
      this.lstPais = [];
      console.log(err);
    });
  }

  /**
   * Cargara las ciudades por pais
   * @param event
   */
  cargarCiudades(event: number): void {

    if (!event) return;

    this.obtenerCiudadesXPais(event);
  }

  /**
   * Procedimiento para obtener las ciudades por pais
   * @param codPais
   */
  obtenerCiudadesXPais(codPais: number): void {

    this.garantRefSuscription = this.rrhhService.obtenerCiudadesXPais(codPais).subscribe((resp) => {
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
   * Cargara las zonas por ciudad
   * @param event
   * @returns
   */
  cargarZonas(event: number): void {

    if (!event) return;

    this.obtenerZonaXCiudad(event);

  }

  /**
   * Procedimiento para obtener las zonas por ciudad
   * @param codCiudad
   */
  obtenerZonaXCiudad(codCiudad: number): void {

    this.garantRefSuscription = this.rrhhService.obtenerZonaxCiudad(codCiudad).subscribe((resp) => {

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
     * Para ir a la ubicacion seleccionada en una lista
     * @param lugar
     */
  flyTo(lugar : Feature){
    this.selectedId = lugar.properties.place_id;

    this.mapaEdit.flyTo({
      center :[
                lugar.bbox[0] + ( lugar.bbox[2] - lugar.bbox[0] ) / 2,
                lugar.bbox[1] + ( lugar.bbox[3] - lugar.bbox[1] ) / 2
              ]
    });

  }

  /**
    * Para obtener lugares en el mapa de acuerdo al query
    * @param query
    */
  onQueryChange(query: string = ''): void {

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {

      this.garantRefSuscription = this.fichaTrabajadorService.obtenerLugares(query).subscribe((resp) => {
        if (resp.features.length > 0) {

          this.lugares = resp.features;

          this.crearMarcadoresDeLugares(this.lugares);
        } else {
          this.lugares = [];
        }
      });

    }, 1000);

  }

  /**
     * Se crean marcadores de acuerdo
     * @param lugares
     * @returns
     */
  crearMarcadoresDeLugares(lugares: Feature[]): void {

    if (!this.mapaEdit) throw Error("Mapa no encontrado");

    this.markers.forEach(marker => marker.remove());

    const newMarkers = [];

    for (const lugar of this.lugares) {
      let center = [
        lugar.bbox[0] + (lugar.bbox[2] - lugar.bbox[0]) / 2,
        lugar.bbox[1] + (lugar.bbox[3] - lugar.bbox[1]) / 2
      ];
      const [lng, lat] = center;
      const popup = new Popup().setHTML(
        `
        <h6>${lugar.properties.display_name}</h6>
        `
      );
      const newMarker = new Marker(
        {
          color: '#FF0000'
        }
      )
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.mapaEdit);

      newMarkers.push(newMarker);

    }
    this.markers = newMarkers;

    if (lugares.length === 0) return; // si no existen resultados de lugares, hasta aqui se detiene

    //ajustamos el mapa hacia los resultados de los marcadores
    const bounds = new maplibregl.LngLatBounds();

    newMarkers.forEach(marker => bounds.extend(marker.getLngLat())); //iteramos los marcadores
    const [lat, lng] = this.center
    bounds.extend([lng, lat]);
    // agregando tambien la ubicacion actual de la persona

    this.mapaEdit.fitBounds(bounds, { //reajustando el mapa para que encierre a todos los marcadores, incluyendo la ubicacion de la persona
      padding: 100,
    });
  }

  /**
   * Procedimiento para validar los campos
   * @param campo
   * @returns
   */
  esValido(campo: string): boolean | null {
    return this.formDatosGaranYRef.controls[campo].errors && this.formDatosGaranYRef.controls[campo].touched;
  }


}
