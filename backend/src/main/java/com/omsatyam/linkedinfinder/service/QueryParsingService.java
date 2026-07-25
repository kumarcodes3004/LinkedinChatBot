package com.omsatyam.linkedinfinder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omsatyam.linkedinfinder.dto.ParsedQuery;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class QueryParsingService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    private static final String QUERY_PARSING_PROMPT = """
        Extract the company names and (optional) job role/title from this message.
        Expand well-known abbreviations to their full company name (e.g. "JPMC" -> "JPMorgan Chase",
        "GS" -> "Goldman Sachs"). If no role/title is mentioned, set roleFilter to null.

        Respond with ONLY a JSON object, no other text, in this exact shape:
        {"companies": ["..."], "roleFilter": "..." }

        Message: "%s"
        """;

    public QueryParsingService(WebClient.Builder webClientBuilder,
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

    public Mono<ParsedQuery> parse(String message) {
        String prompt = QUERY_PARSING_PROMPT.formatted(message);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "temperature", 0,
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "You extract structured search intent from recruiter chat messages. You only respond with valid JSON, no prose, no markdown fences."),
                        Map.of("role", "user", "content", prompt)
                )
        );

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GroqResponse.class)
                .map(this::parseResult)
                .onErrorResume(ex -> {
                    System.err.println("Query parsing failed, falling back to comma-split: " + ex.getMessage());
                    return Mono.just(fallback(message));
                });
    }

    private ParsedQuery parseResult(GroqResponse response) {
        try {
            String content = response.choices().get(0).message().content().trim();
            content = content.replaceAll("```json", "").replaceAll("```", "").trim();
            return objectMapper.readValue(content, ParsedQuery.class);
        } catch (Exception e) {
            System.err.println("Failed to parse Groq query-parsing response: " + e.getMessage());
            return fallback("");
        }
    }

    /**
     * If Groq is unavailable, fall back to the old naive behavior (split on commas,
     * no role) rather than returning nothing.
     */
    private ParsedQuery fallback(String message) {
        List<String> companies = message.isBlank()
                ? List.of()
                : List.of(message.split(",")).stream().map(String::trim).filter(s -> !s.isBlank()).toList();
        return new ParsedQuery(companies, null);
    }

    // --- Minimal records matching Groq/OpenAI-compatible response shape ---

    private record GroqResponse(List<Choice> choices) {
    }

    private record Choice(Message message) {
    }

    private record Message(String content) {
    }
}