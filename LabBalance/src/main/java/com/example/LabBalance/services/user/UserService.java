package com.example.LabBalance.services.user;

import com.example.LabBalance.dao.entity.User;

public interface UserService {
    User findByUsername(String username);
    void deleteUserById(Long userId);
}
