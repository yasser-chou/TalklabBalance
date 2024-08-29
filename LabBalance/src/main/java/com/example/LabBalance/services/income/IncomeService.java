package com.example.LabBalance.services.income;

import com.example.LabBalance.dao.entity.Income;
import com.example.LabBalance.dto.IncomeDTO;

import java.util.List;

public interface IncomeService {

    Income postIncome(IncomeDTO incomeDTO);

    List<IncomeDTO> getAllIncomes();
    Income updateIncome(Long id,IncomeDTO incomeDTO);
    void deleteIncome(Long id);
    IncomeDTO getIncomeById(Long id);
}
