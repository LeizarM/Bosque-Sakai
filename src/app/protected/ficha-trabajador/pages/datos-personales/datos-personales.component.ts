import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import maplibregl, { Marker, Popup } from 'maplibre-gl';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { Utiles } from 'src/app/protected/Utiles/Utiles';
import { Ciudad } from 'src/app/protected/interfaces/Ciudad';
import { Empleado } from 'src/app/protected/interfaces/Empleado';
import { Pais } from 'src/app/protected/interfaces/Pais';
import { Persona } from 'src/app/protected/interfaces/Persona';
import { Zona } from 'src/app/protected/interfaces/Zona';
import { PaisService } from 'src/app/protected/pais/services/pais.service';
import { RrhhService } from 'src/app/protected/rrhh/services/rrhh.service';
import { Feature } from '../../../interfaces/MapBoxLibre';
import { Tipos, lstDocumentoExpedido, lstEstadoCivil, lstSexo } from '../../../interfaces/Tipos';
import { FichaTrabajadorService } from '../../services/ficha-trabajador.service';



@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css'],
  providers: [ MessageService ]
})
export class DatosPersonalesComponent implements OnInit, OnDestroy {

  regEmp              : Empleado = {};

  regPer              : Persona = {};
  regPerEditar        : Persona = {};
  formDatosPersonales : FormGroup = new FormGroup({});
  isDisabled          : boolean = true;

  @ViewChild('mapR', { static: true }) mapR!: ElementRef; //map read
  @ViewChild('mapE') mapE !: ElementRef; //map Edit

  private markers: Marker[] = [];
  center: [number, number] = [-68.13539986925227, -16.51605372184381];


  mapa            !: maplibregl.Map;
  mapaEdit        !: maplibregl.Map;

  lstGenero           : Tipos[] = [];
  lstExpedido         : Tipos[] = [];
  lstEstadoCivil      : Tipos[] = [];
  lstPais             : Pais[]  = [];
  lstCiudad           : Ciudad[] = [];
  lstZona             : Zona[] = [];
  lugares             : Feature[] = [];

  codEmpleado : number = 0;
  displayModal : boolean = false;

  public selectedId : number = 0;

  private debounceTimer  ?: NodeJS.Timeout;

  //Suscriptions
  datoPersonalesSuscription : Subscription = new Subscription();

  constructor(
    private fb                     : FormBuilder,
    private messageService         : MessageService,
    private loginService           : LoginService,
    private rrhhService            : RrhhService,
    private paisService            : PaisService,
    private fichaTrabajadorService : FichaTrabajadorService
  ) {
    this.codEmpleado = this.loginService.codEmpleado;
    this.obtenerDetalleEmpleado( this.codEmpleado );

    this.lstGenero = lstSexo();// para listar el genero
    this.lstExpedido = lstDocumentoExpedido(); // para listar en donde fue expedido un CI
    this.lstEstadoCivil =  lstEstadoCivil();// para desplegar los estados civiles

    this.obtenerPaises();

   }


  ngOnDestroy(): void {

    if(this.mapa && this.mapaEdit){

      this.mapa.off('move', () => { });
      this.mapa.off('load', () => { });
      this.mapa.off('dragend', () => { });

      this.mapaEdit.off('move', () => { });
      this.mapaEdit.off('load', () => { });
      this.mapaEdit.off('dragend', () => { });
    }

    this.datoPersonalesSuscription.unsubscribe();


  }


  ngOnInit(): void {

    this.cargarFormulario();

  }


  /**
   * Metodo para iniciarliar el formulario
   */
  cargarFormulario(): void {

    this.formDatosPersonales = this.fb.group({
      codPersona      : [ {value: '', disabled: this.isDisabled},],
      nombres         : [ {value: '', disabled: this.isDisabled},],
      apPaterno       : [ {value: '', disabled: this.isDisabled},],
      apMaterno       : [ {value: '', disabled: this.isDisabled},],
      sexo            : [ {value: '', disabled: this.isDisabled},],
      fecNac          : [ {value: '', disabled: this.isDisabled},],
      lugarNacimiento : [ {value: 0, disabled: this.isDisabled},],
      ci              : [ {value: '', disabled: this.isDisabled},],
      expedido        : [ {value: '', disabled: this.isDisabled},],
      ciVenci         : [ {value: 0, readOnly: this.isDisabled},],
      estCivil        : [ ],
      direccion       : [ ],
      codZona         : [ ,[ Validators.min(0) ] ],
      lat             : [ ],
      lng             : [ ],

      codPais         : [ ],
      nacionalidad    : [ {value: 0, disabled: this.isDisabled}],
      ciudad          : [ ],
    });
  }





  /**
   * Para desplegar el mapa y cargar datos
   * @param lat
   * @param lng
   */
  mapaLectura(lat: number, lng: number): void {
    this.mapa = new maplibregl.Map({
      container: this.mapR.nativeElement,
      style: 'https://api.maptiler.com/maps/openstreetmap/style.json?key=C4ecPhJcO5UXHU2sCQwc',
      center: [lat, lng],
      zoom: 16,
    });

    // Agregar controles de zoom al mapa
    const nav = new maplibregl.NavigationControl({
      showZoom: true,
      showCompass: true,
      visualizePitch: false
    });
    this.mapa.addControl(nav, 'top-left');

    new maplibregl.Marker().setLngLat([lat, lng]) // longitud, latitud
    .addTo(this.mapa);

  }

  /**
   * Procedimiento para obtener informacion del empleado
   */
   obtenerDetalleEmpleado( codEmpleado : number ): void {

    //Change de suscribe method
    this.datoPersonalesSuscription = this.rrhhService.obtenerDetalleEmpleado( codEmpleado ).subscribe((resp) => {
      if (resp) {
        this.regEmp = resp;

        if(this.regEmp.codPersona){
          this.obtenerDatosPersonales( this.regEmp.codPersona );
        }
      }
    }, (err) => {
      console.log(err);
    });

  }

  /**
   * Procedimiento para obtener los datos persºonales del empleado
   * @param codPersona
   */
   obtenerDatosPersonales(codPersona: number) {
    this.datoPersonalesSuscription = this.rrhhService.obtenerDatosPersonales(codPersona).subscribe((resp) => {
      if (resp) {
        this.regPer = resp;

        this.mapaLectura(this.regPer.lat!, this.regPer.lng!);

      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Para cargar los datos personales de una persona
   */
  async cargarInformacionPersonal():Promise<void>{

    this.displayModal = true;
    this.regPerEditar = {...this.regPer };

    //Convirtiendo de TS a PrimeNG las fechas
    this.regPerEditar.fechaNacimiento    = new Utiles().fechaTStoPrimeNG( this.regPerEditar.fechaNacimiento! );
    this.regPerEditar.ciFechaVencimiento = new Utiles().fechaTStoPrimeNG( this.regPerEditar.ciFechaVencimiento! );


    // limpiando el input de busqueda
    this.lugares = [];

    //cargando los combo
    try {
      await this.obtenerCiudadesXPais(this.regPerEditar.ciudad?.codPais!);
      await this.obtenerZonaXCiudad(this.regPerEditar.ciudad?.codCiudad!);
    } catch (error) {
      console.log("Error al cargar ciudades y zonas:", error);
    }



    //Inicializando el Formulario con valores predeterminados

    this.formDatosPersonales = this.fb.group({

      codPersona      : [ this.regPerEditar.codPersona],
      nombres         : [ this.regPerEditar.nombres ],
      apPaterno       : [ this.regPerEditar.apPaterno ],
      apMaterno       : [ this.regPerEditar.apMaterno ],
      sexo            : [ this.regPerEditar.sexo ],
      fecNac          : [ this.regPerEditar.fechaNacimiento ],
      lugarNacimiento : [ this.regPerEditar.lugarNacimiento ],
      ci              : [ this.regPerEditar.ciNumero ],
      expedido        : [ this.regPerEditar.ciExpedido ],
      ciVenci         : [ this.regPerEditar.ciFechaVencimiento ],
      estCivil        : [ this.regPerEditar.estadoCivil ],
      direccion       : [ this.regPerEditar.direccion ],
      codZona         : [ this.regPerEditar.codZona ],
      lat             : [ this.regPerEditar.lat ],
      lng             : [ this.regPerEditar.lng ],


      codPais         : [ this.regPerEditar.ciudad?.codPais],
      nacionalidad    : [ this.regPerEditar.nacionalidad ],
      ciudad          : [ this.regPerEditar.ciudad?.codCiudad ]

    });



    this.center = [this.regPerEditar.lat!, this.regPerEditar.lng!];

    this.mapaEdit = new maplibregl.Map({
      container: this.mapE.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=C4ecPhJcO5UXHU2sCQwc',
      center: this.center,
      zoom: 18,

    });

    this.mapaEdit.once('load', () => {
      this.mapaEdit.resize();
    })

    this.mapaEdit.on('move', (event) => {
      const { lat, lng, } = event.target.getCenter();
      this.center = [lat, lng];
    });

    // Agregando marcador para editar
    const markEdit = new maplibregl.Marker(
      {
        draggable: true,
      }
    ).setLngLat(this.center).addTo(this.mapaEdit);

    markEdit.on('dragend', (ev) => {
      const { lng, lat } = ev.target._lngLat;
      // Se invierten la latitud y longitud
      this.formDatosPersonales.controls['lng'].setValue(lat);
      this.formDatosPersonales.controls['lat'].setValue(lng);
    });


  }

 /**
  * Procedimiento para obtener Paises
  */
   obtenerPaises(): void {
    this.datoPersonalesSuscription = this.paisService.obtenerPaises().subscribe((resp) => {
      if (resp) {
        this.lstPais = resp;
      }
    }, (err) => {
      this.lstPais = [];
      console.log(err);
    });
  }

  /**
   * Procedimiento para obtener las ciudades por pais
   * @param codPais
   */
   obtenerCiudadesXPais( codPais: number ): Promise<Ciudad[]> {

    return new Promise((resolve, reject) => {
      this.datoPersonalesSuscription = this.rrhhService.obtenerCiudadesXPais(codPais).subscribe(
        (resp) => {
          if (resp) {
            this.lstCiudad = resp;
            this.lstZona = [];
            resolve(resp);
          }
        },
        (err) => {
          this.lstCiudad = [];
          console.log(err);
          reject(err);
        }
      );
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
   * Procedimiento para obtener las zonas por ciudad
   * @param codCiudad
   */
    obtenerZonaXCiudad(codCiudad: number): Promise<Zona[]> {
      return new Promise((resolve, reject) => {
        this.datoPersonalesSuscription = this.rrhhService.obtenerZonaxCiudad(codCiudad).subscribe(
          (resp) => {
            if (resp.length > 0) {
              this.lstZona = resp;
              resolve(resp);
            } else {
              this.lstZona = [];
              resolve([]);
            }
          },
          (err) => {
            this.lstZona = [];
            console.log(err);
            reject(err);
          }
        );
      });

    }

    /**
     * Guardara la informacion
     */
    guardar():void{

      const {codPersona, nombres, apPaterno, apMaterno, sexo, fecNac, lugarNacimiento, ci, expedido, ciVenci, estCivil, direccion, codZona, nacionalidad, lat, lng } = this.formDatosPersonales.value;

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
        codZona : codZona,
        nacionalidad,
        lat,
        lng

      }

      this.datoPersonalesSuscription = this.rrhhService.registrarInfoPersona(regPersona).subscribe(( resp )=>{

        if(resp && resp.ok === "ok"){

          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada' });
          this.displayModal = false;

        }else{
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error al Actualizar'  });

        }

        console.log("el resp es en guardar ",resp);
      },(err) => {
        console.log("Error General...");
        console.log(err);
      });

      // Actualizamos la lista
      this.obtenerDetalleEmpleado( this.codEmpleado );

      this.mapaEdit.off('load', () => { });
      this.mapaEdit.off('dragend', () => { });
      this.mapaEdit.off('move', () => { });

    }

    /**
     * Para obtener lugares en el mapa de acuerdo al query
     * @param query
     */
    onQueryChange( query : string = '' ): void{

      if(this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {

        this.datoPersonalesSuscription = this.fichaTrabajadorService.obtenerLugares( query ).subscribe((resp)=>{
            if(resp.features.length > 0){

              this.lugares = resp.features;
              console.log(this.lugares);
              this.crearMarcadoresDeLugares(this.lugares);
            }else{
              this.lugares = [];
            }
        });

      }, 1000);

    }
    /**
     * Para ir a la ubicacion
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
     * Se crean marcadores de acuerdo
     * @param lugares
     * @returns
     */
    crearMarcadoresDeLugares(lugares : Feature[]): void {

      if(!this.mapaEdit) throw Error("Mapa no encontrado");

      this.markers.forEach(marker => marker.remove());

      const newMarkers = [];

      for( const lugar of this.lugares ){
        let center = [
                      lugar.bbox[0] + (lugar.bbox[2] - lugar.bbox[0]) / 2,
                      lugar.bbox[1] +(lugar.bbox[3] - lugar.bbox[1]) / 2
                      ];
        const [lng, lat] = center;
        const popup = new Popup().setHTML(
          `
          <h6>${ lugar.properties.display_name }</h6>
          `
        );
        const newMarker = new Marker(
          {
            color: '#FF0000'
          }
        )
        .setLngLat([lng,lat])
        .setPopup( popup )
        .addTo(this.mapaEdit);

        newMarkers.push( newMarker );

      }
      this.markers = newMarkers;

      if(lugares.length === 0) return; // si no existen resultados de lugares, hasta aqui se detiene

      //ajustamos el mapa hacia los resultados de los marcadores
      const bounds = new maplibregl.LngLatBounds();

      newMarkers.forEach(marker => bounds.extend( marker.getLngLat() )); //iteramos los marcadores
      const [lat, lng] = this.center
      bounds.extend([lng, lat]);
      // agregando tambien la ubicacion actual de la persona

      this.mapaEdit.fitBounds( bounds,{ //re ajustando el mapa para que encierre a todos los marcadores, incluyendo la ubicacion del empleado
                                        padding: 100,
                                      },  );
    }
}
