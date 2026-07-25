package com.omsatyam.linkedinfinder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omsatyam.linkedinfinder.dto.ProfileResult;
import com.omsatyam.linkedinfinder.dto.RawProfileSnippet;
import com.omsatyam.linkedinfinder.exception.ExternalApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import static com.omsatyam.linkedinfinder.util.UtilityMtds.PROMPT;
import static com.omsatyam.linkedinfinder.util.UtilityMtds.isAuthError;


@Service
public class GroqRankingService {
    private static final Logger log = LoggerFactory.getLogger(GroqRankingService.class);
    private static final Duration TIMEOUT = Duration.ofSeconds(12);
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

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
                    if (isAuthError(ex)) {
                        return Mono.error(new ExternalApiException(
                                "Groq", "Groq API key was rejected (401/403) - check GROQ_API_KEY", ex));
                    }
                    log.error("Groq ranking failed", ex);
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
            // Strip accidental markdown fences if the model adds them anyway
            content = content.replaceAll("```json", "").replaceAll("```", "").trim();
            return List.of(objectMapper.readValue(content, ProfileResult[].class));
        } catch (Exception e) {
            log.error("Failed to parse Groq JSON response", e);
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
