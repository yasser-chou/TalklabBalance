package com.example.LabBalance.services.authentication;

import com.example.LabBalance.dto.SignUpRequestDTO;
import com.example.LabBalance.dto.UserDTO;

public interface AuthService {

    UserDTO signupClient(SignUpRequestDTO signUpRequestDTO);
    boolean presentByUsername(String email);
}
