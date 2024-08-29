import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IncomeService} from "../../../services/income/income.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-income',
  templateUrl: './update-income.component.html',
  styleUrls: ['./update-income.component.css']
})
export class UpdateIncomeComponent {
  incomes:any;
  id:number = this.activatedRoute.snapshot.params['id'];

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
              private router: Router,
              private activatedRoute:ActivatedRoute) {}


  ngOnInit() {
    this.incomeForm=this.fb.group({
      title: [null,Validators.required],
      amount: [null,Validators.required],
      date: [null,Validators.required],
      category: [null,Validators.required],
      description: [null,Validators.required],
    });
    this.getIncomeById();
  }
  getIncomeById(): void {
    this.incomeService.getIncomeById(this.id).subscribe(
      res => {
        this.incomeForm.patchValue(res);
      },
      error => {
        this.message.error("Something went wrong", { nzDuration: 5000 });
      }
    );
  }


  submitForm(){
    this.incomeService.updateIncome(this.id, this.incomeForm.value).subscribe(res=>{
        this.notification.success("Income Updated","Income Updated Successfully",{nzDuration:5000})
        this.router.navigateByUrl("/income");
      },error=>{
        this.message.error("Error while updating income",{nzDuration:5000})
      }
    )
  }
}
