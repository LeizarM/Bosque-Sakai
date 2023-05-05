import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PreciosService } from '../../services/precios.service';


@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
})
export class PropuestaComponent implements OnInit, OnDestroy {


  receivedVisible       : boolean = true;
  private subscription  !: Subscription;

  constructor( private precioService : PreciosService ){

  }
  ngOnInit(): void {

     this.subscription = this.precioService.sharedVisible$.subscribe((value) => {
     this.receivedVisible = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
