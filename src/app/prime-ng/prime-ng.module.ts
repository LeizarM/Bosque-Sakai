import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ListboxModule } from 'primeng/listbox';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';


@NgModule({

  exports: [
    AccordionModule,
    PanelMenuModule,
    MessagesModule,
    MessageModule,
    ToolbarModule,
    TabViewModule,
    ButtonModule,
    SplitButtonModule,
    TableModule,
    RippleModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    DropdownModule,
    CardModule,
    PanelModule,
    DialogModule,
    InputTextareaModule,
    InputTextModule,
    ImageModule,
    CalendarModule,
    ToastModule,
    InputNumberModule,
    KeyFilterModule,
    BlockUIModule,
    ConfirmPopupModule,
    StepsModule,
    DividerModule,
    FileUploadModule,
    ListboxModule,
    ScrollPanelModule,
    PasswordModule,
    CheckboxModule,
    SidebarModule,
    FieldsetModule,
    InputMaskModule,
    AutoCompleteModule

  ]
})
export class PrimeNgModule { }
