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
        for (CoreMap sentence : sentences) {
            String sentiment = sentence.get(SentimentCoreAnnotations.SentimentClass.class);
            String sentenceText = sentence.toString();

            Map<String, String> entry = new HashMap<>();
            entry.put("sentence", sentenceText);
            entry.put("sentiment", sentiment);
            sentimentResults.add(entry);
        }

        // You can add more NLP steps here (NER, keywords, etc.)

        Map<String, Object> result = new HashMap<>();
        result.put("originalText", text);
        result.put("sentimentAnalysis", sentimentResults);
        return result;
    }
}