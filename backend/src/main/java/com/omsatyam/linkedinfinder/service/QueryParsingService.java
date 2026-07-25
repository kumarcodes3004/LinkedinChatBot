package com.omsatyam.linkedinfinder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omsatyam.linkedinfinder.dto.ParsedQuery;
import com.omsatyam.linkedinfinder.exception.ExternalApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import static com.omsatyam.linkedinfinder.util.UtilityMtds.QUERY_PARSING_PROMPT;
import static com.omsatyam.linkedinfinder.util.UtilityMtds.isAuthError;


@Service
public class QueryParsingService {

    private static final Logger log = LoggerFactory.getLogger(QueryParsingService.class);
    private static final Duration TIMEOUT = Duration.ofSeconds(10);

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

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
                .timeout(TIMEOUT)
                .map(this::parseResult)
                .onErrorResume(ex -> {
                    if (isAuthError(ex)) {
                        return Mono.error(new ExternalApiException(
                                "Groq", "Groq API key was rejected (401/403) - check GROQ_API_KEY", ex));
                    }
                    log.error("Query parsing failed, falling back to comma-split", ex);
                    return Mono.just(fallback(message));
                });
    }


    private ParsedQuery parseResult(GroqResponse response) {
        try {
            String content = response.choices().get(0).message().content().trim();
            content = content.replaceAll("```json", "").replaceAll("```", "").trim();
            return objectMapper.readValue(content, ParsedQuery.class);
        } catch (Exception e) {
            log.error("Failed to parse Groq query-parsing response", e);
            return fallback("");
        }
    }


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