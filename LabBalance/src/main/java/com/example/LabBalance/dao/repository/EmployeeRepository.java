package com.example.LabBalance.dao.repository;

import com.example.LabBalance.dao.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
