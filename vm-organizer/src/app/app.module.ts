import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PopappformComponent } from './component/popappform/popappform.component';
import { MatDialogModule } from '@angular/material/dialog'

import { SearchVm } from './shared/search.pipe';
import { PopappformeditComponent } from './component/popappformedit/popappformedit.component'

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PopappformComponent,
    SearchVm,
    PopappformeditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
