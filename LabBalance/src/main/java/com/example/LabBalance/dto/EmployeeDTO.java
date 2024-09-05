package com.example.LabBalance.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class EmployeeDTO {
    private Long id;

    private String firstname;
    private String lastname;
    private String position;
    private double salary;
    private String email;
    private String phone;
    private LocalDate startDate;
    private MultipartFile img;
    private byte[] returnedImg;
    private Long userId;


}