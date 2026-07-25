package com.omsatyam.linkedinfinder.controller;

import com.omsatyam.linkedinfinder.dto.ChatRequest;
import com.omsatyam.linkedinfinder.dto.ChatResponse;
import com.omsatyam.linkedinfinder.dto.ParsedQuery;
import com.omsatyam.linkedinfinder.dto.ProfileResult;
import com.omsatyam.linkedinfinder.dto.SearchRequest;
import com.omsatyam.linkedinfinder.service.GroqRankingService;
import com.omsatyam.linkedinfinder.service.QueryParsingService;
import com.omsatyam.linkedinfinder.service.TavilySearchService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final QueryParsingService queryParsingService;
    private final TavilySearchService tavilySearchService;
    private final GroqRankingService groqRankingService;

    public SearchController(QueryParsingService queryParsingService,
                            TavilySearchService tavilySearchService,
                            GroqRankingService groqRankingService) {
        this.queryParsingService = queryParsingService;
        this.tavilySearchService = tavilySearchService;
        this.groqRankingService = groqRankingService;
    }


    @PostMapping("/chat")
    public Mono<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        return queryParsingService.parse(request.message())
                .flatMap(parsed ->
                        tavilySearchService.searchCompanies(parsed.companies(), parsed.roleFilter())
                                .flatMap(groqRankingService::rank)
                                .map(results -> new ChatResponse(parsed.companies(), parsed.roleFilter(), results))
                );
    }


    @PostMapping("/search")
    public Mono<List<ProfileResult>> search(@Valid @RequestBody SearchRequest request) {
        return tavilySearchService.searchCompanies(request.companies(), request.roleFilter())
                .flatMap(groqRankingService::rank);
    }

    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}