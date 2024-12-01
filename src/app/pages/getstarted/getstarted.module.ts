import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetstartedPageRoutingModule } from './getstarted-routing.module';

import { GetstartedPage } from './getstarted.page';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetstartedPageRoutingModule,
    SharedModule
  ],
  declarations: [GetstartedPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GetstartedPageModule {}
