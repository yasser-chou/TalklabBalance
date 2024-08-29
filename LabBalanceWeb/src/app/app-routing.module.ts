import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {ExpenseComponent} from "./components/expense/expense.component";
import {UpdateExpenseComponent} from "./components/update-expense/update-expense.component";
import {IncomeComponent} from "./components/income/income.component";
import {UpdateIncomeComponent} from "./components/update-income/update-income/update-income.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";


const routes: Routes = [
  {path:"expense", component:ExpenseComponent},
  {path:"dashboard", component:DashboardComponent},
  {path:"income", component:IncomeComponent},
  {path:"expense/:id/edit", component:UpdateExpenseComponent},
  {path:"income/:id/edit", component:UpdateIncomeComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard by default
  { path: '**', redirectTo: '/dashboard' } // Wildcard route for a 404 page (optional)
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
