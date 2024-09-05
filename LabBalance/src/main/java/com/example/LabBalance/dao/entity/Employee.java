package com.example.LabBalance.dao.entity;


import com.example.LabBalance.dto.EmployeeDTO;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Entity
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
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

    public EmployeeDTO getemployeeDTO(){
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setId(Id);
        employeeDTO.setFirstname(firstname);
        employeeDTO.setLastname(lastname);
        employeeDTO.setEmail(email);
        employeeDTO.setPhone(phone);
        employeeDTO.setPosition(position);
        employeeDTO.setSalary(salary);
        employeeDTO.setStartDate(startDate);
        employeeDTO.setReturnedImg(img);

        return employeeDTO;

    }

}