import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { NavbarComponent } from './components/navbar/navbar.component'
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GroupListComponent,
    NavbarComponent,
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
    MatChipsModule,
    MatListModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_51OtUU9ANXWzVIo6gmFhQjk1ZoUafmmnbUdZb2vJZosTBBwK8JWbsB3kEMPSAzIEAjpGxpb6YUiC1AtyfpPpxesBe00ASEDLBCy')
  ],
  providers: [
    provideAnimationsAsync(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
