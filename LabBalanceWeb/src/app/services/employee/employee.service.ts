import { Injectable } from '@angular/core';
import { UserStorageService } from "../storage/storage.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';

const BASIC_URL = "http://localhost:8080/api/employee/";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) {}

  // Method to create Authorization header
  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.userStorageService.getToken());
  }

  // POST: Create a new employee with Authorization header
  postEmployee(employeeDto: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(BASIC_URL + "create", employeeDto, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating employee:', error);
        return throwError(error);
      })
    );
  }

  // GET: Get all employees with Authorization header
  getAllEmployees(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(BASIC_URL + "all", { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching employees:', error);
        return throwError(error);
      })
    );
  }

  // GET: Get employee by ID with Authorization header
  getEmployeeById(employeeId: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${BASIC_URL}profile/${employeeId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching employee profile:', error);
        return throwError(error);
      })
    );
  }

  // PUT: Update employee by ID with Authorization header
  updateEmployee(employeeId: any, employeeDTO: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put(`${BASIC_URL}${employeeId}`, employeeDTO, { headers }).pipe(
      catchError((error) => {
        console.error('Error updating employee:', error);
        return throwError(error);
      })
    );
  }

  // DELETE: Delete employee by ID with Authorization header
  deleteEmployee(employeeId: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${BASIC_URL}${employeeId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting employee:', error);
        return throwError(error);
      })
    );
  }
}
