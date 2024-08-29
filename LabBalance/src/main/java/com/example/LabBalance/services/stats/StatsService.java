package com.example.LabBalance.services.stats;

import com.example.LabBalance.dto.GraphDTO;
import com.example.LabBalance.dto.StatsDTO;

public interface StatsService {
    GraphDTO getChartData();
    StatsDTO getStats();
}
