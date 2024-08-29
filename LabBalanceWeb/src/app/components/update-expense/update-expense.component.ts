import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExpenseService} from "../../services/expense/expense.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-expense',
  templateUrl: './update-expense.component.html',
  styleUrls: ['./update-expense.component.css']
})
export class UpdateExpenseComponent {
  expenses:any;
  id:number = this.activatedRoute.snapshot.params['id'];

  expenseForm!: FormGroup;
  listOfCategory:any[] = [
    "Salaries",
    "Bonuses and Incentives",
    "Health ansurance",
    "Telecommunication systems",
    "Computer Hardware",
    "General offiche supplies",
    "Other"
  ];

  constructor(private fb: FormBuilder,
              private expenseService:ExpenseService,
              private notification: NzNotificationService,
              private message: NzMessageService,
              private modal: NzModalService,
              private router: Router,
              private activatedRoute:ActivatedRoute) {}

  ngOnInit(){
    this.expenseForm=this.fb.group({
      title: [null,Validators.required],
      amount: [null,Validators.required],
      date: [null,Validators.required],
      category: [null,Validators.required],
      description: [null,Validators.required],

    });
    this.getExpenseById();
  }

  getExpenseById(): void {
    this.expenseService.getExpenseById(this.id).subscribe(
      res => {
        this.expenseForm.patchValue(res);
      },
      error => {
        this.message.error("Something went wrong", { nzDuration: 5000 });
      }
    );
  }


  submitForm(){
    this.expenseService.updateExpense(this.id, this.expenseForm.value).subscribe(res=>{
        this.notification.success("Expense Updated","Expense Updated Successfully",{nzDuration:5000})
        this.router.navigateByUrl("/expense");
      },error=>{
        this.message.error("Error while updating expense",{nzDuration:5000})
      }
    )
  }

}
