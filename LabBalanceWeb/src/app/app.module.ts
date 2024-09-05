import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { DemoNgZorroAntdModule } from './DemoNgZorroAntModules'; // Ensure NzDropDownModule is included here
import { NgxEchartsModule } from 'ngx-echarts';
import { AuthInterceptor } from './services/auth/AuthInterceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

// Components
import { ExpenseComponent } from './components/expense/expense.component';
import { UpdateExpenseComponent } from './components/update-expense/update-expense.component';
import { IncomeComponent } from './components/income/income.component';
import { UpdateIncomeComponent } from './components/update-income/update-income/update-income.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupClientComponent } from './components/signupclient/signupclient.component';
import { LoginComponent } from './components/login/login/login.component';
import { PasswordPromptComponent } from './components/password-prompt/password-prompt.component';
import { AllEmployersComponent } from './components/all-employers/all-employers.component';
import { CreateEmployerComponent } from './components/create-employer/create-employer.component';
import { EmployerProfileComponent } from './components/employer-profile/employer-profile.component';
import { UpdateEmployerComponent } from './components/update-employer/update-employer.component';
import { MatDialogModule } from '@angular/material/dialog';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    ExpenseComponent,
    UpdateExpenseComponent,
    IncomeComponent,
    UpdateIncomeComponent,
    DashboardComponent,
    SignupClientComponent,
    LoginComponent,
    PasswordPromptComponent,
    AllEmployersComponent,
    CreateEmployerComponent,
    EmployerProfileComponent,
    UpdateEmployerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DemoNgZorroAntdModule, // Ensure NzDropDownModule is included here
    MatDialogModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA here
})
export class AppModule { }
