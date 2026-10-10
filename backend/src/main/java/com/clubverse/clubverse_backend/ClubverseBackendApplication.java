package com.clubverse.clubverse_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class ClubverseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClubverseBackendApplication.class, args);
	}

}
