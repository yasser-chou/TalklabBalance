package com.example.LabBalance.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class SignUpRequestDTO {

    private Long id;


    private String username;


    private String password;

    private String firstname;
    private String lastname;
    private String phone;
    private String img;  // Field for storing the image path

}
