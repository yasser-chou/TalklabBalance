import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserStorageService } from "../storage/storage.service";

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) {}

  // Method to create Authorization header
  private createAuthorizationHeader(): HttpHeaders {
    const token = this.userStorageService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST: Create a new expense
  postExpense(expenseDTO: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${BASIC_URL}api/expense`, expenseDTO, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error creating expense:', error);
          return throwError(error);
        })
      );
  }

  // GET: Fetch all expenses
  getAllExpenses(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${BASIC_URL}api/expense/all`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching all expenses:', error);
          return throwError(error);
        })
      );
  }

  // DELETE: Delete expense by ID
  deleteExpense(id: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${BASIC_URL}api/expense/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting expense:', error);
          return throwError(error);
        })
      );
  }

  // GET: Fetch a specific expense by ID
  getExpenseById(id: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${BASIC_URL}api/expense/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching expense by ID:', error);
          return throwError(error);
        })
      );
  }

  // PUT: Update expense by ID
  updateExpense(id: number, expenseDTO: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put(`${BASIC_URL}api/expense/${id}`, expenseDTO, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating expense:', error);
          return throwError(error);
        })
      );
  }

  // GET: Fetch all employees
  getAllEmployees(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${BASIC_URL}api/employee/all`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching all employees:', error);
          return throwError(error);
        })
      );
  }

  // GET: Fetch expenses by employee
  getExpensesByEmployee(employeeId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(`${BASIC_URL}api/expense/employee/${employeeId}/expenses`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching expenses for employee:', error);
          if (error.status === 403) {
            alert('You do not have permission to access this resource.');
          }
          return throwError(error);
        })
      );
  }
}
