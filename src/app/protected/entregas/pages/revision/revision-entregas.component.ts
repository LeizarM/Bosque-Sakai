import { Component, OnInit } from '@angular/core';
import { EntregaChofer } from 'src/app/protected/interfaces/EntregaChofer';
import { RevisionEntregasService } from '../../services/revision-entregas.service';

@Component({
  selector: 'app-revision-entregas',
  templateUrl: './revision-entregas.component.html',
  styleUrls: ['./revision-entregas.component.css']
})
export class RevisionEntregasComponent implements OnInit {


  filterDate: Date | string = "";


  lstEntregasRegistradas : EntregaChofer[]= [];

  constructor(
    private revisionEntregaService : RevisionEntregasService
  ) { }

  ngOnInit() {

  }


  onBuscar() {

    if (this.filterDate) {
      this.revisionEntregaService.obtenerEntregasXFecha(this.filterDate).subscribe({
        next: (res) => {
          this.lstEntregasRegistradas = res;
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  }


  onVerEntrega( entrega : EntregaChofer ) : void {

    console.log(entrega);

  }









}
