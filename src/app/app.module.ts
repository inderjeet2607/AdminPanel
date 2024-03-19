import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'
import { GroupListComponent } from './components/group-list/group-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker'
import {provideNativeDateAdapter} from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GroupListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatRadioModule,
    MatDatepickerModule,
    FormsModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
