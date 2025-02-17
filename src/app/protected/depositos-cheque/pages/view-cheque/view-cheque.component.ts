import { Component, OnInit } from '@angular/core';
import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
import { DepositoChequeService } from '../../services/deposito-cheque.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-view-cheque',
  templateUrl: './view-cheque.component.html',
  styleUrls: ['./view-cheque.component.css'],
  providers: [MessageService]
})
export class ViewChequeComponent implements OnInit {


  depositos: DepositoCheque[] = [];
  loading: boolean = false;

  constructor(
    private depositoChequeService: DepositoChequeService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.cargarDepositos();
  }


  cargarDepositos(): void {
    this.loading = true;
    this.depositoChequeService.obtenerDepositos()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.depositos = response.data;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar depósitos: ' + error.message
          });
        }
      });
  }

  descargarImagen(deposito: DepositoCheque): void {

    console.log(deposito);

    if (!deposito.idDeposito) return;
    this.loading = true;
    this.depositoChequeService.descargarImagen(deposito.idDeposito)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `deposito_${deposito.idDeposito}${this.getFileExtension(deposito.fotoPath)}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al descargar imagen: ' + error.message
          });
        }
      });
  }


  descargarPdf(deposito: DepositoCheque): void {
    this.loading = true;
    this.depositoChequeService.descargarPdf(deposito)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `deposito_${deposito.idDeposito}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al descargar PDF: ' + error.message
                });
            }
        });
}


  private getFileExtension(fileName: string | undefined): string {
    if (!fileName) return '.jpg';
    return fileName.substring(fileName.lastIndexOf('.'));
  }
}
