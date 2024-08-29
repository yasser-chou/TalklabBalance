import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {ExpenseService} from "../../services/expense/expense.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {IncomeService} from "../../services/income/income.service";

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent {

  incomes:any;

  incomeForm!:FormGroup;
  listOfCategory:any[]=
    ["Customer Support",
      "Telemarketing Campaigns",
      "Lead Generation",
      "Automotive Industry Calls",
      "Technical Assistance",
      "Other"
    ];

  constructor(private fb:FormBuilder,
              private incomeService:IncomeService,
              private notification: NzNotificationService,
              private message: NzMessageService,
              private modal: NzModalService,
              private router: Router) {}


  ngOnInit() {
    this.getAllIncomes();
    this.incomeForm=this.fb.group({
      title: [null,Validators.required],
      amount: [null,Validators.required],
      date: [null,Validators.required],
      category: [null,Validators.required],
      description: [null,Validators.required],
    })
  }

  submitForm(){
    this.incomeService.postIncome(this.incomeForm.value).subscribe(res=> {
      this.notification.success("Income Posted", "Income posted successfully", {nzDuration: 5000});
      this.getAllIncomes();
    },error=>{
      this.message.error("Error while posting income",{nzDuration: 5000});
    })
  }

  getAllIncomes(){
    this.incomeService.getAllIncomes().subscribe(res=>{
        this.incomes=res;
        console.log(this.incomes);
      },error => {
      this.message.error("Error fetching incomes",{nzDuration:5000});
      }
    )
  }

  updateIncome(id:number){
    this.router.navigateByUrl(`/expense/${id}/edit`);
  }

  deleteIncome(id:number){
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this income?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, Delete It',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.confirmDeleteIncome(id),
      nzCancelText: 'Cancel',
      nzOnCancel: () => console.log('Cancel delete')
    });
  }


  confirmDeleteIncome(id:number){
    this.incomeService.deleteIncome(id).subscribe(res => {
      this.notification.success("Expense deleted successfully", 'Expense has been deleted',{nzDuration:5000});
      this.getAllIncomes();

    }, error=>{
      this.notification.error("Error!","Error while deleting expense" ,{nzDuration:5000});
    })
  }

}
