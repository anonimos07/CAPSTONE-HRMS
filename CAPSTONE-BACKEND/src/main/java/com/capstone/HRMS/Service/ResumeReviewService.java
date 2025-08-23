package com.capstone.HRMS.Service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.ContentBlock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResumeReviewService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    public String reviewResume(String resumeText) {
        AnthropicClient client = AnthropicOkHttpClient.builder()
                .apiKey(apiKey)
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .maxTokens(700L)
                .addUserMessage("Analyze this resume and provide a comprehensive summary focusing on the following details:\n\n" +
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
                        "Resume text:\n\n" + resumeText)
                .model(Model.CLAUDE_3_5_SONNET_20241022) // Fixed model name
                .build();

        Message message = client.messages().create(params);

        // Safely extract the content from the message
        return message.content().stream()
                .map(ContentBlock::text)
                .filter(Optional::isPresent) // Filter out empty optionals
                .map(Optional::get) // Extract the TextBlock from Optional
                .map(textBlock -> textBlock.text()) // Get the actual string from TextBlock
                .collect(Collectors.joining())
                .trim();
    }
}