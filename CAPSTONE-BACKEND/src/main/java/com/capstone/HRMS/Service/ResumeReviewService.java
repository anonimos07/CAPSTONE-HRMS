package com.capstone.HRMS.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import java.util.HashMap;

@Service
public class ResumeReviewService {

    @Value("${anthropic.api.key}")
    private String apiKey;
    
    public String getApiKey() {
        System.out.println("API Key loaded: " + (apiKey != null ? apiKey.substring(0, Math.min(10, apiKey.length())) + "..." : "null"));
        return apiKey;
    }

    public String reviewResume(String resumeText) {
        try {
            getApiKey();
            
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "claude-sonnet-4-5-20250929");
            requestBody.put("max_tokens", 700);
            
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", "Analyze this resume and provide a comprehensive summary focusing on the following details:\n\n" +
                    "INCLUDE:\n" +
                    "- Strengths and key qualifications\n" +
                    "- Age (if mentioned)\n" +
                    "- Work experience details\n" +
                    "- Years of experience\n" +
                    "- Summary of job descriptions and roles\n" +
                    "- Comprehensive technical skills\n" +
                    "- Project-based work and specific roles\n" +
                    "- Personal information\n" +
                    "- Education background\n\n" +
                    "EXCLUDE:\n" +
                    "- Format and organization comments\n" +
                    "- Grammar error corrections\n\n" +
                    "After the summary, provide a hiring recommendation section with:\n" +
                    "- RECOMMENDATION: Should this applicant be hired? (YES/NO)\n" +
                    "- REASONING: Short explanation of the decision based on strengths, experience, skills, or gaps\n\n" +
                    "Resume text:\n\n" + resumeText);
            
            requestBody.put("messages", new Map[]{message});

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                "https://api.anthropic.com/v1/messages",
                HttpMethod.POST,
                entity,
                String.class
            );

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonResponse = mapper.readTree(response.getBody());
            
            return jsonResponse.path("content").get(0).path("text").asText();
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to review resume: " + e.getMessage(), e);
        }
    }
}