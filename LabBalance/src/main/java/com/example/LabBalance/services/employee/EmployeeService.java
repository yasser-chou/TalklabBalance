package com.example.LabBalance.services.employee;

import com.example.LabBalance.dao.entity.Employee;
import com.example.LabBalance.dto.EmployeeDTO;

import java.io.IOException;
import java.util.List;

public interface EmployeeService {
    boolean postEmployee(EmployeeDTO employeeDTO) throws IOException;
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<EmployeeDTO> getAllEmployees();
    EmployeeDTO getEmployeeById(Long EmployeeId);
    boolean updateEmployee(Long EmployeeId,EmployeeDTO EmployeeDTO) throws IOException;
    boolean deleteEmployee(Long EmployeeId);
    List<EmployeeDTO> searchEmployees(String name); // Return DTO instead of Employee

}
