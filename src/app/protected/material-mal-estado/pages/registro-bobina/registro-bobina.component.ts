import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-bobina',
  templateUrl: './registro-bobina.component.html',
  styleUrls: ['./registro-bobina.component.css']
})
export class RegistroBobinaComponent implements OnInit {

  formBobinaMalEstado: FormGroup = this.fb.group({});
  empresas: any[] = []; // Datos de ejemplo para las empresas
  registroResma: any[] = []; // Datos de ejemplo para los registros de resma
  tipoDano: any[] = []; // Datos de ejemplo para tipos de daño
  articulos: any[] = []; // Datos de ejemplo para artículos
  tempArticulo: any[] = []; // Datos de ejemplo para el dropdown de artículos

  totalCantidad: number = 0;  // Total cantidad
  totalSubTotalUSD: number = 0;  // Total SubTotal USD

  constructor(private fb: FormBuilder) {
    this.inicializarFormulario();
  }

  ngOnInit() {
    // Código para inicializar los datos, en este caso vacío
  }

  inicializarFormulario(): void {
    this.formBobinaMalEstado = this.fb.group({
      fecha: new FormControl(new Date(), [Validators.required]),
      empresa: new FormControl(null, [Validators.required]),
      docNum: new FormControl(null, [Validators.required]),
      obs: new FormControl(''),
      detalles: this.fb.array([]),
    });
  }

  get detalles(): FormArray {
    return this.formBobinaMalEstado.get('detalles') as FormArray;
  }

}
