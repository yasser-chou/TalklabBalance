package com.example.LabBalance.dao.entity;

import com.example.LabBalance.dto.UserDTO;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String firstname;
    private String lastname;
    private String phone;

    private String img;  // Add this field for profile picture URL or file path


    @Column(nullable = false)
    private boolean firstLogin = true;

    private boolean enabled = true;


    public UserDTO getDTO(){
        UserDTO userDto = new UserDTO();
        userDto.setId(id);
        userDto.setFirstname(firstname);
        userDto.setUsername(username);

        userDto.setImg(img);  // Pass image to DTO




        return userDto;


    }



}
