package com.omsatyam.linkedinfinder.dto;

import java.util.List;

/**
 * Structured intent extracted from a free-text chat message by QueryParsingService.
 * roleFilter is null when the user didn't mention a specific title.
 */
public record ParsedQuery(
        List<String> companies,
        String roleFilter
) {
}