import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {UserStorageService} from "../storage/storage.service";
import {catchError} from "rxjs/operators";

const BASIC_URL ="http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) {}

  // Method to create Authorization header
  private createAuthorizationHeader(): HttpHeaders {
    const token = this.userStorageService.getToken(); // Ensure this returns a valid token
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  // Method to fetch expenses by employee ID
  getExpensesByEmployee(employeeId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get(BASIC_URL + 'employee/' + employeeId, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching expenses for employee:', error);
        return throwError(error);
      })
    );
  }



  postExpense(expenseDTO:any):Observable<any>{
    return this.http.post(BASIC_URL+ "api/expense",expenseDTO);
  }

  getAllExpenses():Observable<any>{
    return this.http.get(BASIC_URL+ "api/expense/all");
  }

  deleteExpense(id: number):Observable<any>{
    return this.http.delete(BASIC_URL + `api/expense/${id}`)
  }

  getExpenseById(id:number):Observable<any>{
    return this.http.get(BASIC_URL+ `api/expense/${id}`);
  }

  updateExpense(id:number,expenseDTO:any):Observable<any>{
    return this.http.put(BASIC_URL+ `api/expense/${id}`,expenseDTO);
  }

  // New method to fetch all employers
  getAllEmployees(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/employee/all'); // Assuming this is the endpoint for getting employers
  }
}
