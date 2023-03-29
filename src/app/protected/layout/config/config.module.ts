import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PrimeNgModule } from '../../../prime-ng/prime-ng.module';
import { AppConfigComponent } from './app.config.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PrimeNgModule
    ],
    declarations: [
        AppConfigComponent
    ],
    exports: [
        AppConfigComponent
    ]
})
export class AppConfigModule { }
