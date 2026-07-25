package com.omsatyam.linkedinfinder.service;

import com.omsatyam.linkedinfinder.dto.RawProfileSnippet;
import com.omsatyam.linkedinfinder.exception.ExternalApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import static com.omsatyam.linkedinfinder.util.UtilityMtds.isAuthError;


@Service
public class TavilySearchService {

    private static final Logger log = LoggerFactory.getLogger(TavilySearchService.class);
    private static final Duration TIMEOUT = Duration.ofSeconds(8);

    private final WebClient webClient;
    private final String apiKey;
    private final String apiUrl;

    public TavilySearchService(WebClient.Builder webClientBuilder,
                               @Value("${tavily.api.key}") String apiKey,
                               @Value("${tavily.api.url}") String apiUrl) {
        this.webClient = webClientBuilder.build();
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    /**
     * Fires one Tavily search per company (in parallel) and flattens the results.
     */
    public Mono<List<RawProfileSnippet>> searchCompanies(List<String> companies, String roleFilter) {
        return Flux.fromIterable(companies)
                .flatMap(company -> searchOneCompany(company, roleFilter))
                .collectList()
                .map(lists -> lists.stream().flatMap(List::stream).toList());
    }

    private Mono<List<RawProfileSnippet>> searchOneCompany(String company, String roleFilter) {
        String query = buildQuery(company, roleFilter);

        Map<String, Object> requestBody = Map.of(
                "api_key", apiKey,
                "query", query,
                "search_depth", "advanced",
                "include_domains", List.of("linkedin.com"),
                "max_results", 10
        );

        return webClient.post()
                .uri(apiUrl)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(TavilyResponse.class)
                .timeout(TIMEOUT)
                .map(response -> {
                    List<RawProfileSnippet> snippets = toSnippets(company, response);
                    // Debug logging - tells you exactly how many raw hits Tavily returned
                    // vs how many survived the linkedin.com/in/ filter, per company.
                    int rawCount = response != null && response.results() != null ? response.results().size() : 0;
                    log.info("Tavily search for {} -> {} raw results, {} kept as linkedin.com/in",
                            company, rawCount, snippets.size());
                    return snippets;
                })
                .onErrorResume(ex -> {
                    if (isAuthError(ex)) {
                        return Mono.error(new ExternalApiException(
                                "Tavily", "Tavily API key was rejected (401/403) - check TAVILY_API_KEY", ex));
                    }
                    // Anything else (timeout, 5xx, network blip) is treated as recoverable:
                    // don't let one company's failure kill the whole request.
                    log.error("Tavily search failed for {}", company, ex);
                    return Mono.just(List.of());
                });
    }



    private String buildQuery(String company, String roleFilter) {
        String base = company;
        if (roleFilter != null && !roleFilter.isBlank()) {
            base += " " + roleFilter + " linkedin ";
        }
        return base + " software engineer ";
    }

    private List<RawProfileSnippet> toSnippets(String company, TavilyResponse response) {
        if (response == null || response.results() == null) {
            return List.of();
        }
        return response.results().stream()
                .filter(r -> r.url() != null && r.url().contains("linkedin.com/in/"))
                .map(r -> new RawProfileSnippet(company, r.title(), r.url(), r.content()))
                .toList();
    }

    // --- Minimal records matching Tavily's response shape ---

    private record TavilyResponse(List<TavilyResult> results) {
    }

    private record TavilyResult(String title, String url, String content) {
    }
}