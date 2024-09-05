package com.example.LabBalance.services.authentication;


import com.example.LabBalance.dao.entity.User;
import com.example.LabBalance.dao.repository.UserRepository;
import com.example.LabBalance.dto.SignUpRequestDTO;
import com.example.LabBalance.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService{

    @Autowired
    private UserRepository userRepository;

    public UserDTO signupClient(SignUpRequestDTO signUpRequestDTO){
        User user=new User();

        user.setFirstname(signUpRequestDTO.getFirstname());
        user.setLastname(signUpRequestDTO.getLastname());
        user.setUsername(signUpRequestDTO.getUsername());
        user.setPhone(signUpRequestDTO.getPhone());
        user.setPassword(new BCryptPasswordEncoder().encode(signUpRequestDTO.getPassword()));

        return  userRepository.save(user).getDTO();

    }

    @Override
    public boolean presentByUsername(String username) {
        User user = userRepository.findFirstByUsername(username);
        boolean userExists = user != null;
        System.out.println("User exists check for username '" + username + "': " + userExists);
        return userExists;
    }

}
