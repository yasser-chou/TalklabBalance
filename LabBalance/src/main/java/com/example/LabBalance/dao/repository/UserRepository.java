package com.example.LabBalance.dao.repository;

import com.example.LabBalance.dao.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findFirstByUsername(String username);
}
