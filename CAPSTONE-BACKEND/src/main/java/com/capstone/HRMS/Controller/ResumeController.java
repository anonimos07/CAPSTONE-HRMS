package com.capstone.HRMS.Controller;

import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.pipeline.*;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
import edu.stanford.nlp.util.CoreMap;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.InputStream;
import java.util.*;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Extract text from PDF
            String text = extractTextFromPDF(file.getInputStream());

            // 2. Analyze with CoreNLP
            Map<String, Object> result = analyzeText(text);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to process file: " + e.getMessage());
        }
    }

    private String extractTextFromPDF(InputStream pdfStream) throws Exception {
        PDDocument document = PDDocument.load(pdfStream);
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        document.close();
        return text;
    }

    private Map<String, Object> analyzeText(String text) {
        // Setup CoreNLP pipeline
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,parse,sentiment");
        StanfordCoreNLP pipeline = new StanfordCoreNLP(props);

        // Create annotation object
        Annotation document = new Annotation(text);
        pipeline.annotate(document);

        // Sentiment analysis
        List<CoreMap> sentences = document.get(CoreAnnotations.SentencesAnnotation.class);

        List<Map<String, String>> sentimentResults = new ArrayList<>();
        double score = 0.0;

        for (CoreMap sentence : sentences) {
            String sentiment = sentence.get(SentimentCoreAnnotations.SentimentClass.class);
            String sentenceText = sentence.toString();

            Map<String, String> entry = new HashMap<>();
            entry.put("Sentence", sentenceText);
            entry.put("Feedback", sentiment);
            sentimentResults.add(entry);

            if (sentiment.equalsIgnoreCase("Positive") || sentiment.equalsIgnoreCase("Very positive")) {
                score += 1.0;
            } else if (sentiment.equalsIgnoreCase("Neutral")) {
                score += 0.5;
            }
            // Negative and Very negative get 0 points
        }

        int totalSentences = sentences.size();
        double scorePercentage = totalSentences > 0 ? (score / totalSentences) * 100 : 0;

        String overallAnalysis;
        if (scorePercentage >= 70) {
            overallAnalysis = "The resume shows a great potential candidate with strong positive traits.";
        } else if (scorePercentage >= 40) {
            overallAnalysis = "The resume indicates a good candidate with some areas for improvement.";
        } else {
            overallAnalysis = "The resume needs improvement; the candidate's traits appear less positive.";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("originalText", text);
        result.put("Feedback Analysis", sentimentResults);
        result.put("Sentiment Score", String.format("%.2f", score));
        result.put("Score Percentage", String.format("%.2f%%", scorePercentage));
        result.put("Overall Analysis", overallAnalysis);

        return result;
    }


}