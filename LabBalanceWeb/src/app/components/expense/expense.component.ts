import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ExpenseService } from "../../services/expense/expense.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Router } from "@angular/router";
import {SharedService} from "../../services/shared/shared.service";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {

  expenses: any = [];
  employees: any[] = [];  // Store the list of employees

  expenseForm!: FormGroup;
  listOfCategory: any[] = [
    "Bonuses and Incentives",
    "Health insurance",
    "Telecommunication systems",
    "Computer Hardware",
    "General office supplies",
    "Other"
  ];

  constructor(private fb: FormBuilder,
              private expenseService: ExpenseService,
              private notification: NzNotificationService,
              private message: NzMessageService,
              private modal: NzModalService,
              private router: Router,
              private sharedService: SharedService  // Inject the shared service
  ) {}

  ngOnInit() {
    // Fetch employees first, then expenses
    this.getAllEmployees().then(() => {
      this.getAllExpenses();
    });

    this.expenseForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      employeeId: [null, Validators.required]  // Ensure this field is populated
    });
  }

  // Fetch list of employees
  getAllEmployees(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.expenseService.getAllEmployees().subscribe(res => {
        this.employees = res;
        resolve();
      }, error => {
        this.message.error("Error fetching employees", { nzDuration: 5000 });
        reject();
      });
    });
  }

  // Fetch all expenses and map employee names
  getAllExpenses() {
    this.expenseService.getAllExpenses().subscribe(res => {
      this.expenses = res.map(expense => {
        // Ensure expense.employee is not null before accessing employee.id
        if (expense.employee) {
          const employee = this.employees.find(emp => emp.id === expense.employee.id);
          if (employee) {
            expense.employeeName = employee.firstname + ' ' + employee.lastname;
          } else {
            console.log('No matching employee found for EmployeeId:', expense.employee.id);
            expense.employeeName = 'Unknown Employee';
          }
        } else {
          console.log('Expense has no employee assigned.');
          expense.employeeName = 'No Employee Assigned';
        }
        return expense;
      });
    }, error => {
      this.message.error("Error while fetching expenses", { nzDuration: 5000 });
    });
  }


  submitForm() {
    this.expenseService.postExpense(this.expenseForm.value).subscribe(res => {
      this.notification.success("Expense Posted", "Expense posted successfully", { nzDuration: 5000 });
      // Reset the form after successful submission
      // Re-fetch chart data to reflect the new expense
      this.getAllExpenses();
      this.sharedService.triggerChartUpdate();
      this.expenseForm.reset();
    }, error => {
      this.message.error("Error while posting expense", { nzDuration: 5000 });
    });
  }

  updateExpense(id: number) {
    this.router.navigateByUrl(`/expense/${id}/edit`);
  }

  deleteExpense(id: number) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this expense?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, Delete It',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.confirmDeleteExpense(id),
      nzCancelText: 'Cancel',
      nzOnCancel: () => console.log('Cancel delete')
    });
  }

  confirmDeleteExpense(id: number) {
    this.expenseService.deleteExpense(id).subscribe(res => {
      this.notification.success("Expense deleted successfully", 'Expense has been deleted', { nzDuration: 5000 });
      this.getAllExpenses();
    }, error => {
      this.notification.error("Error!", "Error while deleting expense", { nzDuration: 5000 });
    });
  }
}
