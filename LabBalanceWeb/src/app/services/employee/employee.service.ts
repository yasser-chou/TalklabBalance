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
    const token = this.userStorageService.getToken();
    if (!token) {
      console.warn('No token found. User may not be authenticated.');
      throw new Error('No token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  // POST: Create a new employee with Authorization header
  postEmployee(employeeDto: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(BASIC_URL + "create", employeeDto, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating employee:', error);
        if (error.status === 401 || error.status === 403) {
          // Handle unauthorized access or forbidden error
          alert('Unauthorized or forbidden: please check your credentials.');
        }
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
        if (error.status === 401 || error.status === 403) {
          alert('Unauthorized or forbidden: please check your credentials.');
        }
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
        if (error.status === 401 || error.status === 403) {
          alert('Unauthorized or forbidden: please check your credentials.');
        }
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
        if (error.status === 401 || error.status === 403) {
          alert('Unauthorized or forbidden: please check your credentials.');
        }
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
        if (error.status === 401 || error.status === 403) {
          alert('Unauthorized or forbidden: please check your credentials.');
        }
        return throwError(error);
      })
    );
  }

  // Method to search employees by name
// Method to search employees by name with Authorization header
  // Search Employees by Name
  searchEmployees(name: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(BASIC_URL + `search`, {
      headers,
      params: { name }
    }).pipe(
      catchError((error) => {
        console.error('Error searching employees:', error);
        return throwError(error);
      })
    );
  }


}
