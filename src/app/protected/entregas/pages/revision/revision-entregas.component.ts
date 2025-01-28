import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { EntregaChofer } from 'src/app/protected/interfaces/EntregaChofer';
import { MapaLibreService } from 'src/app/protected/mapaLibre/mapaLibre.service';
import { RevisionEntregasService } from '../../services/revision-entregas.service';
import { LoginService } from 'src/app/auth/services/login.service';

interface MapMarker {
  marker: maplibregl.Marker;
  id: number;
}

@Component({
  selector: 'app-revision-entregas',
  templateUrl: './revision-entregas.component.html',
  styleUrls: ['./revision-entregas.component.css'],
  providers: [MessageService]
})
export class RevisionEntregasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElement!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  // Estado del componente
  private destroy$ = new Subject<void>();
  loading: boolean = false;
  filterDate: Date | string = "";
  codEmpleado: number = 0;
  selectedEntrega: EntregaChofer | null = null;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();

  // Datos
  lstEntregasRegistradas: EntregaChofer[] = [];
  lstChoferes: EntregaChofer[] = [];
  activeMarkers: MapMarker[] = [];
  lstExtracto: EntregaChofer[] = [];

  chartOptions: any;
  pieOptions: any;

  // Mapa
  map!: maplibregl.Map;
  mapInitialized: boolean = false;
  defaultCenter: [number, number] = [-68.1500, -16.5000];
  defaultZoom: number = 12;

  tablePagination = {
    first: 0,
    rows: 25,
    totalRecords: 0
  }

  constructor(
    private revisionEntregaService: RevisionEntregasService,
    private mapaLibreServices: MapaLibreService,
    private messageService: MessageService,
    private loginService: LoginService
  ) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.adjustMapSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearMarkers();
  }

  private initChartOptions(): void {
    this.chartOptions = {
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Minutos' }
        }
      }
    };

    this.pieOptions = {
      plugins: {
        legend: { position: 'right' }
      }
    };
  }

  private loadInitialData(): void {
    this.loading = true;
    this.obtenerChoferes();
    // Inicializar con el rango de fechas actual
    this.actualizarDashboard();
  }

  actualizarDashboard(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor seleccione ambas fechas'
      });
      return;
    }

    this.loading = true;
    this.obtenerExtracto(this.fechaInicio, this.fechaFin);
  }

  onFechasChange(): void {
    if (this.fechaInicio && this.fechaFin) {
      this.actualizarDashboard();
    }
  }

  private obtenerExtracto(fechaInicio: Date, fechaFin: Date): void {
    this.loading = true;
    this.revisionEntregaService.obtenerExtractoChoferes(
      fechaInicio,
      fechaFin,
      this.getCodSucursalEmpleado(),
      this.getUser(),
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.lstExtracto = res;
       
      },
      error: (error) => {
        console.error('Error fetching entregas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las entregas'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }



  // Métodos de cálculo para KPIs
  getTotalRutas(): number {
    return this.lstExtracto.filter(ruta => ruta.ord !== -1).length;
  }

  getRutasCompletadas(): number {
    return this.lstExtracto.filter(ruta => ruta.flag === 1).length;
  }

  getRutasEnProceso(): number {
    return this.lstExtracto.filter(ruta => ruta.flag === 0).length;
  }

  getEstatusGeneral(): string {
    const completadas = this.getRutasCompletadas();
    const total = this.getTotalRutas();
    if (total === 0) return 'Sin rutas';
    const porcentaje = (completadas / total) * 100;
    return `${Math.round(porcentaje)}% Completado`;
  }
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Completo': return 'success';
      case 'En Proceso': return 'warning';
      case 'Pendiente': return 'danger';
      default: return 'info';
    }
  }
  private initializeMap(): void {
    try {
      this.map = new maplibregl.Map({
        container: this.mapElement.nativeElement,
        style: this.mapaLibreServices.obtenerZonaxCiudad(),
        center: this.defaultCenter,
        zoom: this.defaultZoom,
        maxZoom: 18,
        minZoom: 8
      });

      this.map.on('load', () => {
        this.mapInitialized = true;
        this.addMapControls();
      });

      this.map.on('error', (e) => {
        console.error('Map error:', e);
        this.messageService.add({
          severity: 'error',
          summary: 'Error del mapa',
          detail: 'Error al cargar el mapa'
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo inicializar el mapa'
      });
    }
  }

  private addMapControls(): void {
    this.map.addControl(new maplibregl.NavigationControl({}));
    this.map.addControl(new maplibregl.FullscreenControl({}));
    this.map.addControl(new maplibregl.ScaleControl({}));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustMapSize();
  }

  private adjustMapSize(): void {
    if (this.mapContainer?.nativeElement && this.map) {
      const containerHeight = window.innerHeight - this.mapContainer.nativeElement.getBoundingClientRect().top - 20;
      this.mapContainer.nativeElement.style.height = `${Math.max(300, containerHeight)}px`;
      this.map.resize();
    }
  }

  onBuscar(): void {
    if (!this.filterDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor seleccione una fecha'
      });
      return;
    }

    this.loading = true;
    this.clearMarkers();

    this.revisionEntregaService.obtenerEntregasXFecha(this.filterDate, this.codEmpleado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.lstEntregasRegistradas = res;
          this.tablePagination.totalRecords = res.length;
          this.adjustMapBounds();
        },
        error: (error) => {
          console.error('Error fetching entregas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar las entregas'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private obtenerChoferes(): void {
    this.revisionEntregaService.obtenerChoferes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.lstChoferes = res;
        },
        error: (error) => {
          console.error('Error fetching choferes:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar la lista de choferes'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }


  onVerEntrega(entrega: EntregaChofer): void {
    this.selectedEntrega = entrega;
    
    if (!entrega.longitud || !entrega.latitud) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'No hay coordenadas disponibles para esta entrega'
      });
      return;
    }

    this.flyToLocation(entrega);
    this.updateMarkers(entrega);
    
    setTimeout(() => this.adjustMapSize(), 0);
  }

  private flyToLocation(entrega: EntregaChofer): void {
    if (this.map && entrega.longitud && entrega.latitud) {
      this.map.flyTo({
        center: [entrega.longitud, entrega.latitud],
        zoom: 15,
        duration: 2000
      });
    }
  }

  private updateMarkers(entrega: EntregaChofer): void {
    this.clearMarkers();

    if (entrega.longitud && entrega.latitud) {
      const marker = new maplibregl.Marker({
        color: '#FF0000',
        draggable: false
      })
        .setLngLat([entrega.longitud, entrega.latitud])
        .addTo(this.map);

      // Agregar popup con información
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${entrega.nombreCompleto}</strong><br>
          Fecha: ${entrega.fechaEntregaCad}<br>
          Estado: ${entrega.estatusRuta}
        `);

      marker.setPopup(popup);

      this.activeMarkers.push({
        marker,
        id: entrega.idEntrega
      });
    }
  }

  private clearMarkers(): void {
    this.activeMarkers.forEach(markerInfo => {
      markerInfo.marker.remove();
    });
    this.activeMarkers = [];
  }

  private adjustMapBounds(): void {
    if (this.lstEntregasRegistradas.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    this.lstEntregasRegistradas.forEach(entrega => {
      if (entrega.longitud && entrega.latitud) {
        bounds.extend([entrega.longitud, entrega.latitud]);
      }
    });

    if (!bounds.isEmpty()) {
      this.map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }

  exportToExcel(): void {
    // Implementar exportación a Excel
  }

  onFilterChange(): void {
    this.onBuscar();
  }


  /**
   * obtendra el codigo de usuario actual
   */
  getUser(): number {
    return this.loginService.codUsuario;
  }

  getCodEmpleado(): number {
    return this.loginService.codEmpleado;
  }

  getCodSucursalEmpleado(): number {
    return this.loginService.codSucursalEmpleado;
  }
}