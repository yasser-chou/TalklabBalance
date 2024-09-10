package com.example.LabBalance.services.expense;

import com.example.LabBalance.dao.entity.Expense;
import com.example.LabBalance.dto.ExpenseDTO;

import java.util.List;

public interface ExpenseService {
    Expense postExpense(ExpenseDTO expenseDTO);
    List<Expense> getAllExpenses();
    Expense getExpenseById(Long id);
    Expense updateExpense(Long id,ExpenseDTO expenseDTO);
    void deleteExpense(Long id);
    List<Expense> getExpensesByEmployee(Long employeeId);


}
