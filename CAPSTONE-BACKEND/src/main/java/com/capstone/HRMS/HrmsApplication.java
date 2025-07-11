package com.capstone.HRMS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;

@SpringBootApplication
public class HrmsApplication {

	public static void main(String[] args) {

		SpringApplication.run(HrmsApplication.class, args);

		System.out.println("Build Success!!");
	}

}
