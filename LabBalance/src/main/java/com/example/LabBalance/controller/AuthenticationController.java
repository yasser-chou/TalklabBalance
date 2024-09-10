package com.example.LabBalance.controller;

import com.example.LabBalance.dao.entity.User;
import com.example.LabBalance.dao.repository.UserRepository;
import com.example.LabBalance.dto.AuthenticationRequest;
import com.example.LabBalance.exceptions.ResourceNotFoundException;
import com.example.LabBalance.services.authentication.AuthService;
import com.example.LabBalance.services.jwt.UserDetailsServiceImpl;
import com.example.LabBalance.services.user.UserService;
import com.example.LabBalance.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
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

    private static final String UPLOAD_DIRECTORY = "uploads/images";

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

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

    // **MODIFIED** Client Sign-up with image upload
    @PostMapping("/client/sign-up")
    public ResponseEntity<Map<String, String>> signupClient(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("firstname") String firstname,
            @RequestParam("lastname") String lastname,
            @RequestParam("phone") String phone,
            @RequestParam("file") MultipartFile file) throws IOException {

        Map<String, String> response = new HashMap<>();

        // Check if user exists
        if (authService.presentByUsername(username)) {
            response.put("error", "User already exists with this username!");
            return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
        }

        // Save image if provided
        String profilePicture = null;
        if (file != null && !file.isEmpty()) {
            profilePicture = saveImage(file);  // Save the file and get the path
        }

        // Encrypt password
        String encodedPassword = passwordEncoder.encode(password);

        // Create new user and save to repository
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(encodedPassword);
        newUser.setFirstname(firstname);
        newUser.setLastname(lastname);
        newUser.setPhone(phone);
        newUser.setProfilePicture(profilePicture);  // Use profilePicture instead of img for clarity

        userRepository.save(newUser);

        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    // **MODIFIED** Authentication with profile picture info
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

        // Fetch the user from the repository
        User user = userRepository.findFirstByUsername(authenticationRequest.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Build a response with token and user details
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("token", jwt);
        responseBody.put("userId", String.valueOf(user.getId()));
        responseBody.put("firstname", user.getFirstname());
        responseBody.put("lastname", user.getLastname());
        responseBody.put("profilePicture", user.getProfilePicture());  // Return profile picture path

        return ResponseEntity.ok(responseBody);
    }

    // **MODIFIED** Update Profile Picture
    @PostMapping("/user/update-picture")
    public ResponseEntity<?> updateUserPicture(@RequestParam("userId") Long userId, @RequestParam("file") MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Save the new file and get the path
        String profilePicture = saveImage(file);

        // Update user with the new image path
        user.setProfilePicture(profilePicture);
        userRepository.save(user);

        return ResponseEntity.ok("Profile picture updated successfully");
    }

    // **MODIFIED** Get Image by Filename
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException, IOException {
        Path file = Paths.get("src/main/resources/static/uploads/images").resolve(filename).normalize();
        System.out.println("Attempting to access file: " + file.toAbsolutePath().toString());  // Log the path

        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Return 404 if file is not found
        }

        // Determine the content type
        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";  // Default content type if unknown
        }

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
    }

    // **MODIFIED** Get Profile Picture for Logged-in User
    @GetMapping("/user/profile-image")
    public ResponseEntity<Resource> getUserProfileImage(Principal principal) throws IOException {
        // Retrieve logged-in user
        String username = principal.getName();
        User user = userService.findByUsername(username);

        // Get profile picture filename
        String filename = user.getProfilePicture();
        if (filename == null || filename.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // No profile picture set
        }

        // Load the profile picture
        Path file = Paths.get("src/main/resources/static/uploads/images").resolve(filename).normalize();
        System.out.println("Attempting to access file: " + file.toAbsolutePath().toString());

        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Return 404 if file is not found
        }

        // Dynamically determine the content type
        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";  // Default content type
        }

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
    }

    // **REUSED** Save Image Method
    private String saveImage(MultipartFile file) throws IOException {
        // Path to the resources/static/uploads/images directory
        String uploadDir = new File("src/main/resources/static/uploads/images").getAbsolutePath();

        // Ensure the directory exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();  // Create the directory if it doesn't exist
        }

        // Create a unique file name to prevent overwriting
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);

        // Save the file to the specified path
        Files.write(filePath, file.getBytes());

        // Return the filename (without the full path) to be saved in the database
        return filename;
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }


}
