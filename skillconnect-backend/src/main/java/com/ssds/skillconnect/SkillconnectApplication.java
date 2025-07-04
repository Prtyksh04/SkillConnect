package com.ssds.skillconnect;

import com.ssds.skillconnect.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.logging.Logger;

@SpringBootApplication
@EnableScheduling
public class SkillconnectApplication {
	public static void main(String[] args) {
		SpringApplication.run(SkillconnectApplication.class, args);
	}

}
