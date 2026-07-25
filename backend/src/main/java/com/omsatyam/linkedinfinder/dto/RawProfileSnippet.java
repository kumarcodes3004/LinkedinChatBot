package com.omsatyam.linkedinfinder.dto;

/**
 * A single raw search hit returned by Tavily before the LLM ranks/summarizes it.
 */
public record RawProfileSnippet(
        String company,
        String title,      // page title, usually "Name - Headline - LinkedIn"
        String url,         // linkedin.com/in/... profile link
        String snippet       // short text excerpt from the indexed page
) {
}
