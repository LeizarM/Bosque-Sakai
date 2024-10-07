import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { EntregaChofer } from 'src/app/protected/interfaces/EntregaChofer';
import { MapaLibreService } from 'src/app/protected/mapaLibre/mapaLibre.service';
import { RevisionEntregasService } from '../../services/revision-entregas.service';

@Component({
  selector: 'app-revision-entregas',
  templateUrl: './revision-entregas.component.html',
  styleUrls: ['./revision-entregas.component.css']
})
export class RevisionEntregasComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  filterDate: Date | string = "";
  codEmpleado: number = 0;
  lstEntregasRegistradas: EntregaChofer[] = [];
  lstChoferes: EntregaChofer[]=[];
  map!: maplibregl.Map;
  selectedEntrega: EntregaChofer | null = null;

  constructor(
    private revisionEntregaService: RevisionEntregasService,
    private mapaLibreServices: MapaLibreService
  ) { }

  ngOnInit() {
    this.obtenerChoferes();
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.adjustMapSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustMapSize();
  }

  initializeMap() {
    this.map = new maplibregl.Map({
      container: this.mapElement.nativeElement,
      style: this.mapaLibreServices.obtenerZonaxCiudad(),
      center: [-68.1500, -16.5000],
      zoom: 12
    });
  }

  adjustMapSize() {
    if (this.mapContainer && this.mapContainer.nativeElement) {
      const containerHeight = window.innerHeight - this.mapContainer.nativeElement.getBoundingClientRect().top - 20;
      this.mapContainer.nativeElement.style.height = `${containerHeight}px`;
      this.map.resize();
    }
  }

  onBuscar() {
    if (this.filterDate) {
      this.revisionEntregaService.obtenerEntregasXFecha(this.filterDate, this.codEmpleado).subscribe({
        next: (res) => {
          this.lstEntregasRegistradas = res;
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  }

  obtenerChoferes(){
    this.revisionEntregaService.obtenerChoferes().subscribe({
      next: (res) => {
        this.lstChoferes = res;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  onVerEntrega(entrega: EntregaChofer): void {
    this.selectedEntrega = entrega;
    if (entrega.longitud && entrega.latitud) {
      this.map.flyTo({
        center: [entrega.longitud, entrega.latitud],
        zoom: 15
      });

      const existingMarkers = document.getElementsByClassName('maplibregl-marker');
      while(existingMarkers[0]) {
        if (existingMarkers[0] && existingMarkers[0].parentNode) {
          existingMarkers[0].parentNode.removeChild(existingMarkers[0]);
        }
      }

      new maplibregl.Marker()
        .setLngLat([entrega.longitud, entrega.latitud])
        .addTo(this.map);
    }

    setTimeout(() => {
      this.adjustMapSize();
    }, 0);
  }
}
