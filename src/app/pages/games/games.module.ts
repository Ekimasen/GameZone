import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GamesPageRoutingModule } from './games-routing.module';
import { GamesPage } from './games.page';
import { SharedModule } from '../../shared/shared.module'; // Import the Shared Module

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamesPageRoutingModule,
    SharedModule // Include it here
  ],
  declarations: [GamesPage]
})
export class GamesPageModule {}