package com.injuryvision;

import com.injuryvision.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class InjuryvisionApplication {

	public static void main(String[] args) {
		SpringApplication.run(InjuryvisionApplication.class, args);
	}

}
