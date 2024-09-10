package com.example.LabBalance.services.user;


import com.example.LabBalance.dao.entity.User;
import com.example.LabBalance.dao.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String username) {
        // Implement the logic to find the user by username (e.g., using a repository)
        return userRepository.findFirstByUsername(username);
    }

    @Override
    public void deleteUserById(Long userId) {
        userRepository.deleteById(userId);
    }
}
