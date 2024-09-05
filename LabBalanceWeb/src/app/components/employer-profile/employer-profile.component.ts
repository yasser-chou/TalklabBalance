import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {EmployeeService} from "../../services/employee/employee.service";
import { Location } from '@angular/common';  // Import Location from @angular/common

@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.css']
})
export class EmployerProfileComponent implements OnInit {
  employee: any;
  employees: any;
  employeeId: any = this.activatedroute.snapshot.params['id'];

  constructor(
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private modal: NzModalService, // Used for popups
    private notification: NzNotificationService,
    private location: Location  // Use Location for navigating back
  ) {}

  ngOnInit(): void {
    this.getAllEmployees();
    this.getEmployeeById();
  }

  getEmployeeById() {
    this.employeeService.getEmployeeById(this.employeeId).subscribe(
      (res) => {
        this.employee = res;
      },
      (error) => {
        if (error.status === 403) {
          this.notification.error('Access Denied', 'You do not have permission to view this profile.');
        } else {
          this.notification.error('Error', 'Failed to fetch employee profile.');
        }
        console.error('Error fetching employee profile:', error);
      }
    );
  }

  updateImg(img) {
    return 'data:image/jpeg;base64,' + img;
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (res) => {
        this.employees = res;
      },
      (error) => {
        if (error.status === 403) {
          this.notification.error('Access Denied', 'You do not have permission to view employees.');
        } else {
          this.notification.error('Error', 'Failed to fetch employees list.');
        }
        console.error('Error fetching employees list:', error);
      }
    );
  }

  deleteEmployee(employeeId: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this employee?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, Delete It',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.confirmDeleteEmployee(employeeId),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel delete')
    });
  }

  confirmDeleteEmployee(employeeId: any) {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      res => {
        this.notification.success(
          'SUCCESS',
          'Employee Has Been Deleted Successfully',
          { nzDuration: 5000 }
        );
        this.getAllEmployees();  // Refresh the list
        this.location.back();  // Use location.back() to navigate back
      },
      error => {
        console.error('Error deleting employee:', error);
        this.notification.error(
          'ERROR',
          'Failed to delete employee',
          { nzDuration: 5000 }
        );
      }
    );
  }
}
