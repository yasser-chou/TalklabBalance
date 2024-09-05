import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ExpenseService } from "../../services/expense/expense.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-update-expense',
  templateUrl: './update-expense.component.html',
  styleUrls: ['./update-expense.component.css']
})
export class UpdateExpenseComponent {
  expenses: any;
  employees: any[] = [];  // Store the list of employees

  id: number = this.activatedRoute.snapshot.params['id'];

  expenseForm!: FormGroup;
  listOfCategory: any[] = [
    "Salaries",
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
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.expenseForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      employeeId: [null, Validators.required]  // Ensure the form control name matches your response
    });

    this.getAllEmployees();  // Fetch list of employees first
  }

  // Fetch the list of all employees
  getAllEmployees(): void {
    this.expenseService.getAllEmployees().subscribe(
      res => {
        this.employees = res;  // Store the list of employees

        // After loading employees, fetch the expense details
        this.getExpenseById();  // Ensure this is called after employees are loaded
      },
      error => {
        this.message.error("Error fetching employees", { nzDuration: 5000 });
      }
    );
  }

  // Fetch the expense details by ID
  getExpenseById(): void {
    this.expenseService.getExpenseById(this.id).subscribe(
      res => {
        console.log(res);  // Log the response to ensure `employeeId` exists
        this.expenseForm.patchValue({
          title: res.title,
          amount: res.amount,
          date: res.date,
          category: res.category,
          description: res.description,
          employeeId: res.employeeId  // Make sure `employeeId` exists and matches your backend
        });
      },
      error => {
        this.message.error("Something went wrong", { nzDuration: 5000 });
      }
    );
  }

  // Submit the updated form
  submitForm() {
    this.expenseService.updateExpense(this.id, this.expenseForm.value).subscribe(
      res => {
        this.notification.success("Expense Updated", "Expense Updated Successfully", { nzDuration: 5000 });
        this.router.navigateByUrl("/expense");
      },
      error => {
        this.message.error("Error while updating expense", { nzDuration: 5000 });
      }
    );
  }
}
