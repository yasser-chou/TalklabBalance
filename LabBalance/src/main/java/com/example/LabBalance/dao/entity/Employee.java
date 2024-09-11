package com.example.LabBalance.dao.entity;

import com.example.LabBalance.dto.EmployeeDTO;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.Base64;

@Entity
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstname;
    private String lastname;
    private String position;
    private double salary;
    private String email;
    private String phone;
    private LocalDate startDate;

    @Lob
    @Column(columnDefinition = "longblob")
    private byte[] img;

    // Method to convert Employee entity to EmployeeDTO
    public EmployeeDTO getemployeeDTO() {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setId(id);
        employeeDTO.setFirstname(firstname);
        employeeDTO.setLastname(lastname);
        employeeDTO.setEmail(email);
        employeeDTO.setPhone(phone);
        employeeDTO.setPosition(position);
        employeeDTO.setSalary(salary);
        employeeDTO.setStartDate(startDate);

        // Convert byte[] img to Base64 string and set it to returnedImg
        if (img != null) {
            String base64Image = Base64.getEncoder().encodeToString(img);
            employeeDTO.setReturnedImg(base64Image);
        } else {
            employeeDTO.setReturnedImg(null); // Set null if no image is available
        }

        return employeeDTO;
    }
}
