import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../../services/employee/employee.service";

@Component({
  selector: 'app-all-employers',
  templateUrl: './all-employers.component.html',
  styleUrls: ['./all-employers.component.css']
})
export class AllEmployersComponent  implements OnInit {

  employees:any;

  constructor(private employeeService:EmployeeService) {}

  getAllEmployees(){
    this.employeeService.getAllEmployees().subscribe(res=>
    {
      this.employees=res;
    })
  }

  updateImg(img) {
    return 'data:image/jpeg;base64,' + img;
  }

  ngOnInit():void{
    this.getAllEmployees();
  }

}
