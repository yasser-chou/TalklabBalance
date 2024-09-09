package com.example.LabBalance.controller;

import com.example.LabBalance.dao.entity.User;
import com.example.LabBalance.dao.repository.UserRepository;
import com.example.LabBalance.dto.AuthenticationRequest;
import com.example.LabBalance.dto.SignUpRequestDTO;
import com.example.LabBalance.dto.UserDTO;
import com.example.LabBalance.exceptions.ResourceNotFoundException;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    public ResponseEntity<?> signupClient(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("firstname") String firstname,
            @RequestParam("lastname") String lastname,
            @RequestParam("phone") String phone,
            @RequestParam("file") MultipartFile file) throws IOException {

        // Check if a user already exists with the provided username
        if (authService.presentByUsername(username)) {
            return new ResponseEntity<>("User already exists with this username!", HttpStatus.NOT_ACCEPTABLE);
        }

        // Save the uploaded profile picture
        String imgPath = null;
        if (file != null && !file.isEmpty()) {
            imgPath = saveImage(file);  // Save the profile picture and get the file path
        }

        // Create the SignUpRequestDTO and set the image path
        SignUpRequestDTO signUpRequestDTO = new SignUpRequestDTO();
        signUpRequestDTO.setUsername(username);
        signUpRequestDTO.setPassword(password);
        signUpRequestDTO.setFirstname(firstname);
        signUpRequestDTO.setLastname(lastname);
        signUpRequestDTO.setPhone(phone);
        signUpRequestDTO.setImg(imgPath);  // Set the image path

        // Call the authService to register the new user
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
        responseBody.put("firstname", user.getFirstname());
        responseBody.put("lastname", user.getLastname());
        responseBody.put("profilePicture", user.getImg());  // Assuming 'img' is the field storing profile picture URL

        // Returning the response with the token in the body
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/user/update-picture")
    public ResponseEntity<?> updateUserPicture(@RequestParam("userId") Long userId, @RequestParam("file") MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Save the file to a directory or a cloud service and get the URL or path
        String imgPath = saveImage(file);  // Implement the file saving logic

        user.setImg(imgPath);
        userRepository.save(user);

        return ResponseEntity.ok("Profile picture updated successfully");
    }

    private static final String UPLOAD_DIRECTORY = "uploads/images/"; // Define upload path

    public String saveImage(MultipartFile file) throws IOException {
        // Ensure the upload directory exists
        File uploadDir = new File(UPLOAD_DIRECTORY);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();  // Create the directory if it doesn't exist
        }

        // Get the original filename
        String filename = file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIRECTORY + filename);

        // Save the file locally
        Files.write(filePath, file.getBytes());

        // Return the relative file path for serving the file later
        return "/uploads/images/" + filename;
    }

}

