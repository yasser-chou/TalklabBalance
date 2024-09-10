package com.example.LabBalance.services.expense;

import com.example.LabBalance.dao.entity.Expense;
import com.example.LabBalance.dao.entity.Employee;
import com.example.LabBalance.dao.repository.EmployeeRepository;
import com.example.LabBalance.dao.repository.ExpenseRepository;
import com.example.LabBalance.dto.ExpenseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final EmployeeRepository employeeRepository;

    private final ExpenseRepository expenseRepository;

    public Expense postExpense(ExpenseDTO expenseDTO){
        return saveOrUpdateExpense(new Expense(),expenseDTO);
    }

    private Expense saveOrUpdateExpense(Expense expense, ExpenseDTO expenseDTO){
        expense.setTitle(expenseDTO.getTitle());
        expense.setDate(expenseDTO.getDate());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setDescription(expenseDTO.getDescription());

        if (expenseDTO.getEmployeeId() == null) {
            throw new IllegalArgumentException("Employee ID must not be null");
        }
        // Fetch and set the employer using employeeeId from DTO
        Employee employee = employeeRepository.findById(expenseDTO.getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + expenseDTO.getEmployeeId()));
        expense.setEmployee(employee);

        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses(){
        return expenseRepository.findAll().stream()
               .sorted(Comparator.comparing(Expense::getDate).reversed())  //reversed to get latest expenses on top
                .collect(Collectors.toList());
    }

    public Expense getExpenseById(Long id){
        Optional<Expense> optionalExpense = expenseRepository.findById(id);
        if(optionalExpense.isPresent()){
            return optionalExpense.get();
        }else{
            throw new EntityNotFoundException("Expense is not present with id " +id);
        }
    }

    public Expense updateExpense(Long id,ExpenseDTO expenseDTO){
        Optional<Expense> optionalExpense=expenseRepository.findById(id);
        if(optionalExpense.isPresent()){
            return saveOrUpdateExpense(optionalExpense.get(),expenseDTO);
        }else{
            throw new EntityNotFoundException("Expense is not present with id " +id);
        }
    }

    public void deleteExpense(Long id){
        Optional<Expense> optionalExpense = expenseRepository.findById(id);
        if(optionalExpense.isPresent()){
            expenseRepository.deleteById(id);
        }else{
            throw new EntityNotFoundException("Expense is not present with id " +id);
        }
    }

        // Method to add salaries to expenses
        @Scheduled(cron = "0 0 0 1 * ?")  // Runs at 12 AM on the first day of every month
        public void addSalariesAsExpenses() {
            List<Employee> employees = employeeRepository.findAll();

            for (Employee employee : employees) {
                try {
                    Expense salaryExpense = new Expense();
                    salaryExpense.setTitle("Salary for " + employee.getFirstname() + " " + employee.getLastname());
                    salaryExpense.setDescription("Monthly salary payment");
                    salaryExpense.setCategory("Salaries");
                    salaryExpense.setDate(LocalDate.now());
                    salaryExpense.setAmount(employee.getSalary());
                    salaryExpense.setEmployee(employee);

                    expenseRepository.save(salaryExpense);
                    System.out.println("Added salary expense for employee: " + employee.getFirstname());
                } catch (Exception e) {
                    System.err.println("Error adding salary expense for employee: " + employee.getFirstname() + " " + e.getMessage());
                }
            }
        }

    public List<Expense> getExpensesByEmployee(Long employeeId) {
        return expenseRepository.findByEmployeeId(employeeId);
    }

}






