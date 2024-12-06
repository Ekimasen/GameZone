import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';
import { LoadingScreenComponent } from '../components/loading-screen/loading-screen.component';

@NgModule({
  declarations: [BottomNavComponent, LoadingScreenComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    HttpClientModule

  ],
  exports: [BottomNavComponent, LoadingScreenComponent]
})
export class SharedModule {}
