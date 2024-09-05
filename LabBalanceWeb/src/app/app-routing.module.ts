import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {ExpenseComponent} from "./components/expense/expense.component";
import {UpdateExpenseComponent} from "./components/update-expense/update-expense.component";
import {IncomeComponent} from "./components/income/income.component";
import {UpdateIncomeComponent} from "./components/update-income/update-income/update-income.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SignupClientComponent} from "./components/signupclient/signupclient.component";
import {LoginComponent} from "./components/login/login/login.component";
import {AuthGuard} from "./services/auth/AuthGuard";
import {AccessCodeGuard} from "./services/auth/AccessCodeGuard";
import {CreateEmployerComponent} from "./components/create-employer/create-employer.component";
import {AllEmployersComponent} from "./components/all-employers/all-employers.component";
import {EmployerProfileComponent} from "./components/employer-profile/employer-profile.component";
import {UpdateEmployerComponent} from "./components/update-employer/update-employer.component";




const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'expense', component: ExpenseComponent, canActivate: [AuthGuard] },
  { path: 'register', component: SignupClientComponent,canActivate: [AccessCodeGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'employee/create', component: CreateEmployerComponent, canActivate: [AuthGuard] },
  { path: 'employee/all', component: AllEmployersComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: EmployerProfileComponent, canActivate: [AuthGuard] },
  { path: 'income', component: IncomeComponent, canActivate: [AuthGuard] },
  { path: 'expense/:id/edit', component: UpdateExpenseComponent, canActivate: [AuthGuard] },
  { path: 'income/:id/edit', component: UpdateIncomeComponent, canActivate: [AuthGuard] },
  { path: 'update-employee/:id', component: UpdateEmployerComponent },

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
