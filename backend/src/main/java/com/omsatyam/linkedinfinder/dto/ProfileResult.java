package com.omsatyam.linkedinfinder.dto;

/**
 * Final, LLM-ranked result shown in the UI.
 */
public record ProfileResult(
        String name,
        String title,
        String company,
        String linkedinUrl,
        String matchReason,   // one-line reasoning from the LLM
        int relevanceScore     // 0-100, from the LLM
) {
}
