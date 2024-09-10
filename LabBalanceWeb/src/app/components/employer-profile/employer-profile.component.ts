import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { EmployeeService } from "../../services/employee/employee.service";
import { Location } from '@angular/common';
import { ExpenseService } from "../../services/expense/expense.service";  // Import Location from @angular/common

@Component({
  selector: 'app-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.css']
})
export class EmployerProfileComponent implements OnInit {
  employee: any;
  employees: any;
  employeeId: any;
  expenses: any[] = [];

  constructor(
    private activatedroute: ActivatedRoute,
    private employeeService: EmployeeService,
    private expenseService: ExpenseService,
    private modal: NzModalService, // Used for popups
    private notification: NzNotificationService,
    private location: Location  // Use Location for navigating back
  ) {}

  ngOnInit(): void {
    this.employeeId = +this.activatedroute.snapshot.paramMap.get('id'); // Get employeeId from route
    this.getAllEmployees();
    this.getEmployeeById();
  }

  // Fetch a specific employee by ID
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

  // Method to handle base64 image display
  updateImg(img) {
    return 'data:image/jpeg;base64,' + img;
  }

  // Fetch all employees (if needed for a list or other purposes)
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

  // Confirm and delete employee
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

  // Perform the delete action and handle navigation
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

  // Fetch expenses related to the employee
  showEmployeeExpenses(): void {
    console.log('Employee ID:', this.employeeId); // Check if employeeId is correct
    this.expenseService.getExpensesByEmployee(this.employeeId).subscribe(
      (data) => {
        this.expenses = data;
        console.log('Fetched expenses:', this.expenses); // Log the response
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        this.notification.error('Error', 'Failed to fetch expenses for this employee.');
      }
    );
  }

}
