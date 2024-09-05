package com.example.LabBalance.services.employee;

import com.example.LabBalance.dao.entity.Employee;
import com.example.LabBalance.dao.repository.EmployeeRepository;
import com.example.LabBalance.dto.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService{

    @Autowired
    private EmployeeRepository employeeRepository;

    public boolean postEmployee(EmployeeDTO employeeDTO) throws IOException {
        Employee employee = new Employee();
        employee.setFirstname(employeeDTO.getFirstname());
        employee.setLastname(employeeDTO.getLastname());  // Correct this line to set lastname
        employee.setPosition(employeeDTO.getPosition());
        employee.setSalary(employeeDTO.getSalary());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setStartDate(employeeDTO.getStartDate());

        // Assuming employeeDTO.getImg() is of type MultipartFile
        if (employeeDTO.getImg() != null && !employeeDTO.getImg().isEmpty()) {
            employee.setImg(employeeDTO.getImg().getBytes());  // Correct file handling
        }

        try {
            employeeRepository.save(employee);
            return true;  // Success
        } catch (Exception e) {
            // Log error message if needed
            e.printStackTrace();  // You can replace this with proper logging
            return false;  // Return false in case of failure
        }
    }

    public boolean existsByEmail(String email){
        return employeeRepository.existsByEmail(email);
    }
    public boolean existsByPhone(String phone) {
        return employeeRepository.existsByPhone(phone);
    }


    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream().map(Employee::getemployeeDTO).collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long employeeId){
        Optional<Employee> optionalEmployee = employeeRepository.findById(employeeId);
        if(optionalEmployee.isPresent()){
            return optionalEmployee.get().getemployeeDTO();
        }
        return null;
    }

    public boolean updateEmployee(Long EmployeeId,EmployeeDTO EmployeeDTO) throws IOException {
        Optional<Employee> optionalEmployee = employeeRepository.findById(EmployeeId);
        if(optionalEmployee.isPresent()){
            Employee Employee = optionalEmployee.get();

            Employee.setFirstname(EmployeeDTO.getFirstname());
            Employee.setLastname(EmployeeDTO.getLastname());
            Employee.setPosition(EmployeeDTO.getPosition());
            Employee.setStartDate(EmployeeDTO.getStartDate());
            Employee.setSalary(EmployeeDTO.getSalary());
            Employee.setEmail(EmployeeDTO.getEmail());
            Employee.setPhone(EmployeeDTO.getPhone());
            if(EmployeeDTO.getImg() != null){
                Employee.setImg(EmployeeDTO.getImg().getBytes());
            }

            employeeRepository.save(Employee);
            return true;

        }else{
            return false;
        }
        
    }


    public boolean deleteEmployee(Long EmployeeId){
        Optional<Employee> optionalEmployee = employeeRepository.findById(EmployeeId);
        if(optionalEmployee.isPresent()){
            employeeRepository.delete(optionalEmployee.get());
            return true;
        }
        return false;
    }

}
