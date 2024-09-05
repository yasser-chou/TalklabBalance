package com.example.LabBalance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Enable scheduling in Spring Boot
public class LabBalanceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LabBalanceApplication.class, args);
	}

}
