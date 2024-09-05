package com.example.LabBalance.services;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;




@Service
public class AccessCodeService {

    @Value("${register.access.code}")
    private String accessCode;

    public boolean validateCode(String code) {
        return accessCode.equals(code);
    }
}