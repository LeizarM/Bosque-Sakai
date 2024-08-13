import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { RegistroResma } from 'src/app/protected/interfaces/RegistroResma';
import { MaterialMalEstadoService } from '../../services/materialMalEstado.service';

interface Resma {
  id: number;
  tipo: string;
  cantidad: number;
  estado: string;
}


interface Articulo {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-resmas-mal-estado',
  templateUrl: './registro-resma.component.html',
  styleUrls: ['./registro-resma.component.css']
})
export class RegistroResmaComponent implements OnInit {


  empresas: Empresa[] = [];
  registroResma : RegistroResma[] = [];

  errorMessage: string = '';

  selectedArticulo: Articulo | null = null;

  resmas: Resma[] = [
    { id: 1, tipo: 'Tipo A', cantidad: 100, estado: 'Dañado' },
    { id: 2, tipo: 'Tipo B', cantidad: 150, estado: 'Mojado' },
    { id: 3, tipo: 'Tipo C', cantidad: 200, estado: 'Arrugado' },
    { id: 4, tipo: 'Tipo A', cantidad: 120, estado: 'Dañado' },
    { id: 5, tipo: 'Tipo B', cantidad: 180, estado: 'Mojado' },
  ];



  numeros: number[] = [];
  articulos: Articulo[] = [];

  empresaSeleccionada: Empresa | null = null;
  numeroSeleccionado: number | null = null;

  constructor ( private materialMalEstado : MaterialMalEstadoService ){

  }

  ngOnInit() {
    this.cargarEmpresas();
  }


  /**
   * Cargara las empresas registradas
   */
  cargarEmpresas() {
    this.materialMalEstado.obtenerEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        this.errorMessage = 'No se pudieron cargar las empresas. Por favor, intente de nuevo más tarde.';
        // Aquí podrías también mostrar un mensaje de error al usuario, por ejemplo con un componente de toast
      }
    });
  }

  onEmpresaChange(event: any) {

    this.empresaSeleccionada = event.value;
    this.registroResma = [];
    this.materialMalEstado.obtenerDocNumXEmpresa( event.value ).subscribe({
      next: (registroResma) => {
        this.registroResma = registroResma;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al Cargar los DocNums:', error);
        this.errorMessage = 'No se pudieron cargar los DocNums. Por favor, intente de nuevo más tarde.';
        // Aquí podrías también mostrar un mensaje de error al usuario, por ejemplo con un componente de toast
      }
    });
  }

  onNumeroChange(event: any) {
    this.numeroSeleccionado = event.value;
    this.selectedArticulo = null;
    // Genera artículos aleatorios para el ejemplo
    this.articulos = Array.from({length: 20}, (_, i) => ({
      id: i + 1,
      nombre: `Artículo ${i + 1}`
    }));
  }

  selectArticulo(articulo: Articulo) {
    this.selectedArticulo = articulo;
  }
}
