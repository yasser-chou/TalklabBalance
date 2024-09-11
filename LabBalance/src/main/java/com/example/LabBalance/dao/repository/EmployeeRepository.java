package com.example.LabBalance.dao.repository;

import com.example.LabBalance.dao.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    List<Employee> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(String firstname, String lastname); //This query will find employers where either the first name or the last name contains the search term (case-insensitive).

}
