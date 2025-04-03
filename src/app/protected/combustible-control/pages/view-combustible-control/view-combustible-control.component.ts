import { Component, OnInit } from '@angular/core';
import { CombustibleControlService } from '../../services/combustible-control.service';
import { CombustibleControl } from '../../../interfaces/CombustibleControl';

@Component({
  selector: 'app-view-combustible-control',
  templateUrl: './view-combustible-control.component.html',
  styleUrls: ['./view-combustible-control.component.css']
})
export class ViewCombustibleControlComponent implements OnInit {

  vehiculos: CombustibleControl[] = [];
  vehiculoSeleccionado: CombustibleControl | null = null;
  cargando: boolean = false;
  cargandoHistorial: boolean = false;
  error: string | null = null;
  errorHistorial: string | null = null;
  historialRegistros: CombustibleControl[] = [];

  constructor(private combustibleService: CombustibleControlService) { }

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.cargando = true;
    this.combustibleService.obtenerCoches()
      .subscribe({
        next: (response) => {
          this.vehiculos = response.data || [];
          this.cargando = false;
        },
        error: (err) => {
          this.error = err.message;
          this.cargando = false;
        }
      });
  }

  onVehiculoSeleccionado(vehiculo: CombustibleControl) {
    this.vehiculoSeleccionado = vehiculo;
    this.historialRegistros = []; // Clear previous records
    if (vehiculo && vehiculo.idCoche) {
      this.cargarKilometrajes(vehiculo.idCoche);
    }
  }

  cargarKilometrajes(idCoche: number) {
    this.cargandoHistorial = true;
    this.errorHistorial = null;
    
    this.combustibleService.obtenerKilometrajes(idCoche)
      .subscribe({
        next: (response) => {
          this.historialRegistros = response.data || [];
          this.cargandoHistorial = false;
        },
        error: (err) => {
          this.errorHistorial = err.message;
          this.cargandoHistorial = false;
          console.error('Error al cargar kilometrajes:', err);
        }
      });
  }
  
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Format as dd/MM/yyyy
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/');
    } catch (e) {
      return dateString;
    }
  }
}
