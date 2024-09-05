package com.example.LabBalance.dao.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    private String title;
    private String description;
    private String category;
    private LocalDate date;
    private Double amount;
    @ManyToOne
    @JoinColumn(name = "employer_id", referencedColumnName = "id")
    private Employee employee; // Many expenses to one employer
}
