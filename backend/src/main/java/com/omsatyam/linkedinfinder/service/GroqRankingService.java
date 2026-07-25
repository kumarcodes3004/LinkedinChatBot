package com.omsatyam.linkedinfinder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omsatyam.linkedinfinder.dto.ProfileResult;
import com.omsatyam.linkedinfinder.dto.RawProfileSnippet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Sends the raw Tavily snippets to Groq (OpenAI-compatible chat completions API)
 * and asks it to rank + explain relevance for each profile, returning strict JSON
 * that we parse into ProfileResult records.
 */
@Service
public class GroqRankingService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;
    private static  final String PROMPT="Below is a list of publicly indexed LinkedIn profile snippets (title, url, short content excerpt).\n" +
            "                For each one, extract a likely name, current title, and a relevanceScore (0-100) for how strong\n" +
            "                a software engineering candidate they look like based ONLY on the visible text (seniority words\n" +
            "                like Senior/Staff/Lead, specific tech stack mentions, etc). Also give a one-sentence matchReason.\n" +
            "\n" +
            "                Respond with ONLY a JSON array, no other text, in this exact shape:\n" +
            "                [\n" +
            "                  {\"name\": \"...\", \"title\": \"...\", \"company\": \"...\", \"linkedinUrl\": \"...\", \"matchReason\": \"...\", \"relevanceScore\": 0}\n" +
            "                ]\n" +
            "\n" +
            "                Profiles:";

    public GroqRankingService(WebClient.Builder webClientBuilder,
                               ObjectMapper objectMapper,
                               @Value("${groq.api.key}") String apiKey,
                               @Value("${groq.api.url}") String apiUrl,
                               @Value("${groq.model}") String model) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
    }

    public Mono<List<ProfileResult>> rank(List<RawProfileSnippet> snippets) {
        if (snippets.isEmpty()) {
            return Mono.just(List.of());
        }

        String prompt = buildPrompt(snippets);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "temperature", 0.2,
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "You are a technical recruiter's assistant. You only respond with valid JSON, no prose, no markdown fences."),
                        Map.of("role", "user", "content", prompt)
                )
        );

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GroqResponse.class)
                .map(this::parseResults)
                .onErrorResume(ex -> {
                    System.err.println("Groq ranking failed: " + ex.getMessage());
                    // Fall back to unranked results rather than showing nothing
                    return Mono.just(fallback(snippets));
                });
    }

    private String buildPrompt(List<RawProfileSnippet> snippets) {
        StringBuilder sb = new StringBuilder();
        sb.append(PROMPT);
        for (RawProfileSnippet s : snippets) {
            sb.append("- company: ").append(s.company())
                    .append(" | title: ").append(s.title())
                    .append(" | url: ").append(s.url())
                    .append(" | excerpt: ").append(s.snippet())
                    .append("\n");
        }
        return sb.toString();
    }

    private List<ProfileResult> parseResults(GroqResponse response) {
        try {
            String content = response.choices().get(0).message().content().trim();
            content = content.replaceAll("```json", "").replaceAll("```", "").trim();
            return List.of(objectMapper.readValue(content, ProfileResult[].class));
        } catch (Exception e) {
            System.err.println("Failed to parse Groq JSON response: " + e.getMessage());
            return List.of();
        }
    }

    private List<ProfileResult> fallback(List<RawProfileSnippet> snippets) {
        return snippets.stream()
                .map(s -> new ProfileResult(
                        s.title() != null ? s.title() : "Unknown",
                        "See profile",
                        s.company(),
                        s.url(),
                        "Ranking unavailable - showing raw search match.",
                        0))
                .toList();
    }

    // --- Minimal records matching Groq/OpenAI-compatible response shape ---

    private record GroqResponse(List<Choice> choices) {
    }

    private record Choice(Message message) {
    }

    private record Message(String content) {
    }
}
