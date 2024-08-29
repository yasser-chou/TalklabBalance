import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExpenseService} from "../../services/expense/expense.service";
import {NzMessageModule, NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {

  expenses:any;

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
              private router: Router) {}

  ngOnInit(){
    this.getAllExpenses();
    this.expenseForm=this.fb.group({
      title: [null,Validators.required],
      amount: [null,Validators.required],
      date: [null,Validators.required],
      category: [null,Validators.required],
      description: [null,Validators.required],

    })
  }

  submitForm(){
    this.expenseService.postExpense(this.expenseForm.value).subscribe(res=>{
      this.notification.success("Expense Posted","Expense posted successfully",{nzDuration: 5000});
      this.getAllExpenses();

    },error=>{
      this.message.error("Error while posting expense",{nzDuration: 5000});
    })
  }

  getAllExpenses(){
    this.expenseService.getAllExpenses().subscribe(res=>{
      this.expenses=res;
      console.log(this.expenses);
      }
    )
  }

  updateExpense(id:number){
    this.router.navigateByUrl(`/expense/${id}/edit`);

  }

  deleteExpense(id:number){
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


  confirmDeleteExpense(id:number){
    this.expenseService.deleteExpense(id).subscribe(res => {
      this.notification.success("Expense deleted successfully", 'Expense has been deleted',{nzDuration:5000});
      this.getAllExpenses();

    }, error=>{
      this.notification.error("Error!","Error while deleting expense" ,{nzDuration:5000});
    })
  }
}
