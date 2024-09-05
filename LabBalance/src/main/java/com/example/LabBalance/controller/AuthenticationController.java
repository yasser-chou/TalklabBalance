package com.example.LabBalance.controller;

import com.example.LabBalance.dao.entity.User;
import com.example.LabBalance.dao.repository.UserRepository;
import com.example.LabBalance.dto.AuthenticationRequest;
import com.example.LabBalance.dto.SignUpRequestDTO;
import com.example.LabBalance.dto.UserDTO;
import com.example.LabBalance.services.authentication.AuthService;
import com.example.LabBalance.services.jwt.UserDetailsServiceImpl;
import com.example.LabBalance.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
public class AuthenticationController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    @Autowired
    public AuthenticationController(AuthService authService, AuthenticationManager authenticationManager,
                                    UserDetailsServiceImpl userDetailsService, JwtUtil jwtUtil,
                                    UserRepository userRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/client/sign-up")
    public ResponseEntity<?> signupClient(@RequestBody SignUpRequestDTO signUpRequestDTO) {
        if (authService.presentByUsername(signUpRequestDTO.getUsername())) {
            return new ResponseEntity<>("User already exists with this username!", HttpStatus.NOT_ACCEPTABLE);
        }

        UserDTO createUser = authService.signupClient(signUpRequestDTO);
        return new ResponseEntity<>(createUser, HttpStatus.OK);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect Username or Password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        User user = userRepository.findFirstByUsername(authenticationRequest.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Creating a JSON object to hold both the token and the user ID (or other relevant info)
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("token", jwt);
        responseBody.put("userId", String.valueOf(user.getId())); // You can include additional information here if needed

        // Returning the response with the token in the body
        return ResponseEntity.ok(responseBody);
    }
}

