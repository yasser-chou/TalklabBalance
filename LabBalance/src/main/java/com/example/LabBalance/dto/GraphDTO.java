package com.example.LabBalance.dto;

import com.example.LabBalance.dao.entity.Expense;
import com.example.LabBalance.dao.entity.Income;
import lombok.Data;

import java.util.List;

@Data
public class GraphDTO {

    private List<Expense> expenseList;
    private List<Income> incomeList;
}
