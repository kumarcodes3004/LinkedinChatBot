package com.omsatyam.linkedinfinder.service;

import com.omsatyam.linkedinfinder.dto.RawProfileSnippet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;


@Service
public class TavilySearchService {
    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(TavilySearchService.class);
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


    public Mono<List<RawProfileSnippet>> searchCompanies(List<String> companies, String roleFilter) {
        log.info("searching Engineers");
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
                .map(response -> {
                    List<RawProfileSnippet> snippets = toSnippets(company, response);
                    // Debug logging - tells you exactly how many raw hits Tavily returned
                    // vs how many survived the linkedin.com/in/ filter, per company.
                    int rawCount = response != null && response.results() != null ? response.results().size() : 0;
                    log.info("[Tavily] {} -> {} raw results, {} kept as linkedin.com/in",company, rawCount, snippets.size());
                    return snippets;
                })
                .onErrorResume(ex -> {
                    // Don't let one company's failure kill the whole request
                    log.error("Tavily search failed for {} : {} ", company, ex.getMessage());
                    return Mono.just(List.of());
                });
    }

    private String buildQuery(String company, String roleFilter) {
        // Deliberately NOT wrapping the company name in quotes - exact-phrase matching
        // kills recall for informal/abbreviated names (e.g. "JPMC" won't exact-match a
        // profile that says "JPMorgan Chase & Co."). include_domains already restricts
        // results to linkedin.com, so we don't need a site: filter in the query text either.
        String base = company;
        if (roleFilter != null && !roleFilter.isBlank()) {
            base += " " + roleFilter + " linkedin ";
        }
        return base + " software engineer";
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