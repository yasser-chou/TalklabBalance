package com.example.LabBalance.controller;

import com.example.LabBalance.dao.entity.Employee;
import com.example.LabBalance.dto.EmployeeDTO;
import com.example.LabBalance.services.employee.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;  // Correct import for java.io.IOException
import java.util.List;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    // Constructor-based dependency injection
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> postEmployee(@ModelAttribute EmployeeDTO employeeDTO) throws io.jsonwebtoken.io.IOException, java.io.IOException {
        // Check for duplicate email or phone
        if (employeeService.existsByEmail(employeeDTO.getEmail()) || employeeService.existsByPhone(employeeDTO.getPhone())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Employee with this email or phone number already exists!");
        }

        boolean success = employeeService.postEmployee(employeeDTO);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllEmployees() {
        try {
            List<EmployeeDTO> ads = employeeService.getAllEmployees();
            return ResponseEntity.ok(ads);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching employees");
        }
    }

    @GetMapping("/profile/{employeeId}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long employeeId){
        EmployeeDTO employeeDTO = employeeService.getEmployeeById(employeeId);
        if(employeeDTO != null){
            return ResponseEntity.ok(employeeDTO);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long employeeId, @ModelAttribute EmployeeDTO employeeDTO) throws java.io.IOException {
        boolean success = employeeService.updateEmployee(employeeId,employeeDTO);
        if(success){
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long employeeId){
        boolean success = employeeService.deleteEmployee(employeeId);
        if(success){

            return ResponseEntity.status(HttpStatus.OK).build();

        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // GET: Search for employees by name
    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDTO>> searchEmployees(@RequestParam("name") String name) {
        List<EmployeeDTO> employees = employeeService.searchEmployees(name);
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }




}
