import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import maplibregl, { Marker, Popup } from 'maplibre-gl';
import { MessageService } from 'primeng/api';
import { Ciudad } from '../../../interfaces/Ciudad';
import { Empleado } from '../../../interfaces/Empleado';
import { Feature } from '../../../interfaces/Lugares';
import { Pais } from '../../../interfaces/Pais';
import { Persona } from '../../../interfaces/Persona';
import { lstDocumentoExpedido, lstEstadoCivil, lstSexo, Tipos } from '../../../interfaces/Tipos';
import { Zona } from '../../../interfaces/Zona';
import { PaisService } from '../../../pais/services/pais.service';
import { RrhhService } from '../../services/rrhh.service';


@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css'],
  providers: [MessageService]

})
export class DatosPersonalesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() regPer !: Persona;
  @Input() regEmp !: Empleado;

  @ViewChild('mapR') mapR !: ElementRef;
  @ViewChild('mapE') mapE !: ElementRef;

  private debounceTimer?: NodeJS.Timeout;
  private markers: Marker[] = [];


  mapa            !: maplibregl.Map;
  mapaEdit        !: maplibregl.Map;

  center: [number, number] = [-68.13539986925227, -16.51605372184381];

  displayModal: boolean = false;

  registroPersona: Persona = {};

  lstGenero       : Tipos[] = [];
  lstPais         : Pais[]  = [];
  lstCiudad       : Ciudad[] = [];
  lstZona         : Zona[]  = [];
  lstEstadoCivil  : Tipos[] = [];
  lstCiExpedido   : Tipos[] = [];

  formDatosPersonales: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private rrhhService: RrhhService,
    private paisService: PaisService,
    private messageService: MessageService
  ) {
    this.lstGenero = lstSexo();
    this.obtenerPaises();
    this.lstEstadoCivil = lstEstadoCivil();
    this.lstCiExpedido = lstDocumentoExpedido();
  }

  ngOnDestroy(): void {
    this.mapa.off('move', () => { });
    this.mapa.off('load', () => { });
    this.mapa.off('dragend', () => { });

  }

  ngAfterViewInit(): void {
    this.mapaLectura(this.registroPersona.lat!, this.registroPersona.lng!);
  }

  ngOnInit(): void {

    //recibiendo datos del componente padre


    this.obtenerDatosPersonales(this.regEmp.codPersona!);
    this.registroPersona = { ...this.regPer };

    this.registroPersona.ciFechaVencimiento = new Date(this.registroPersona.ciFechaVencimiento?.toString()!);
    this.registroPersona.ciFechaVencimiento!.setDate(this.registroPersona.ciFechaVencimiento!.getDate() + 1);
    this.registroPersona.fechaNacimiento = new Date(this.registroPersona.fechaNacimiento?.toString()!);
    this.registroPersona.fechaNacimiento!.setDate(this.registroPersona.fechaNacimiento!.getDate() + 1);

    this.obtenerCiudadesXPais(this.registroPersona.ciudad?.codPais!);
    this.obtenerZonaXCiudad(this.registroPersona.ciudad?.codCiudad!);


    this.formDatosPersonales = this.fb.group({

      codPersona        : [this.registroPersona.codPersona],
      nombres           : [this.registroPersona.nombres],
      apPaterno         : [this.registroPersona.apPaterno],
      apMaterno         : [this.registroPersona.apMaterno],
      sexo              : [this.registroPersona.sexo],
      nacionalidad      : [this.registroPersona.nacionalidad],
      lugarNacimiento   : [this.registroPersona.lugarNacimiento],
      ciNumero          : [this.registroPersona.ciNumero],
      ciExpedido        : [this.registroPersona.ciExpedido],
      codPais           : [this.registroPersona.ciudad?.codPais],
      codCiudad         : [this.registroPersona.ciudad?.codCiudad],
      codZona           : [this.registroPersona.codZona],
      ciFechaVencimiento: [this.registroPersona.ciFechaVencimiento],
      fechaNacimiento   : [this.registroPersona.fechaNacimiento],
      direccion         : [this.registroPersona.direccion],
      estadoCivil       : [this.registroPersona.estadoCivil],
      lat               : [this.registroPersona.lat],
      lng               : [this.registroPersona.lng]

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
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center: [lat, lng],
      zoom: 16,
    });

    // Agregando marcador
    new maplibregl.Marker().setLngLat([lat, lng]).addTo(this.mapa);
  }


  /**
   * Procedimiento para obtener los datos personales del empleado
   * @param codPersona
   */
  obtenerDatosPersonales(codPersona: number) {
    this.rrhhService.obtenerDatosPersonales(codPersona).subscribe((resp) => {
      if (resp) {
        this.regPer = resp;
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Procedimiento desplegar el modal
   */
  desplegarModal(): void {
    this.ngOnInit();

    this.center = [this.registroPersona.lat!, this.registroPersona.lng!];

    this.mapaEdit = new maplibregl.Map({
      container: this.mapE.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
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

    this.displayModal = true;
  }

  /**
   * Cargara las ciudades al seleccionar un pais
   * @param event
   * @returns
   */
  cargarCiudades(event: any): void {

    this.registroPersona.pais!.codPais = event.value;
    if (this.registroPersona.pais?.codPais === undefined || this.registroPersona.pais?.codPais === null || this.registroPersona.pais?.codPais <= 0) return;
    this.obtenerCiudadesXPais(this.registroPersona.pais.codPais);
  }

  /**
   * Cargara las Zonas por ciudad
   * @param event
   * @returns
   */
  cargarZonas(event: any): void {
    this.registroPersona.ciudad!.codCiudad = event.value;
    if (this.registroPersona.ciudad?.codCiudad === null || this.registroPersona.ciudad?.codCiudad === undefined || this.registroPersona.ciudad?.codCiudad <= 0) return;
    this.obtenerZonaXCiudad(this.registroPersona.ciudad.codCiudad);

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
   * Procedimiento para obtener las zonas por ciudad
   * @param codCiudad
   */
  obtenerZonaXCiudad(codCiudad: number): void {
    this.rrhhService.obtenerZonaxCiudad(codCiudad).subscribe((resp) => {

      if (resp.length > 0) {
        this.lstZona = resp;
      } else {
        this.lstZona = [];
        this.registroPersona.codZona = 0;
      }
    }, (err) => {
      this.lstZona = [];
      console.log(err);
    });

  }

  /**
   * Procedimiento para guardar la informacion del formulario
   */
  guardar(): void {

    const persona: Persona = this.formDatosPersonales.value;

    this.rrhhService.registrarInfoPersona(persona).subscribe((resp) => {

      if (resp?.ok === 'ok' && resp) {

        this.displayModal = false;
        this.obtenerDatosPersonales(persona.codPersona!);
        this.mapaLectura(persona.lat!, persona.lng!);
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });

      } else {
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
      }
    }, (err) => {
      console.log("Error General");
      console.log(err);
    });

  }
  /**
   * Metodo para mostrar los datos para el mapa
   * @param query
   */
  onQueryChanged(query: string = "") {

    if (query.length === 0) {
      this.rrhhService.lugares = [];
      this.rrhhService.isLoading = false;
      return;
    }
    const lugares : Feature[] = this.rrhhService.buscarLugar(query);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {

      if (!this.mapaEdit) throw Error("mapaEdit is required ");

      this.markers.forEach(marker => marker.remove());

      const newMarkers: Marker[] = [];

      for (const lugar of lugares) {
        let center = [lugar.bbox[0] + (lugar.bbox[2] - lugar.bbox[0]) / 2, lugar.bbox[1] + (lugar.bbox[3] - lugar.bbox[1]) / 2];

        const [lng, lat] = center;

        const popup = new Popup()
        .setHTML(`<h6>${lugar?.properties?.display_name}</h6>`);

        const newMarker = new Marker({ color: 'red' }).setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(this.mapaEdit);

        newMarkers.push(newMarker);
      }

      this.markers = newMarkers;

    }, 250);
  }


  /**
   * Para acercar el mapa
   */
  zoomIn(): void {
    this.mapa.zoomIn();
  }

  /**
   * Para alejar el mapa
   */
  zoomOut(): void {
    this.mapa.zoomOut();
  }

  /**
   * Obteniendo el atributo
  */
  get isLoading(): boolean {
    return this.rrhhService.isLoading;
  }
  /**
   * Para obtener los lugares
   */
  get lugares(): Feature[] {
    return this.rrhhService.lugares;
  }
}
