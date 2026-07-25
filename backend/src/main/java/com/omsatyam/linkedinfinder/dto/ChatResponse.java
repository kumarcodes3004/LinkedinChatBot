package com.omsatyam.linkedinfinder.dto;

import java.util.List;

/**
 * What the /api/chat endpoint returns: the parsed intent (so the frontend can show
 * "Got it - searching X for role Y") plus the ranked profile results.
 */
public record ChatResponse(
        List<String> companies,
        String roleFilter,
        List<ProfileResult> results
) {
}