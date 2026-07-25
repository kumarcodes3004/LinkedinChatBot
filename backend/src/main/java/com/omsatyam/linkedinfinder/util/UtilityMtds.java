package com.omsatyam.linkedinfinder.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.WebClientResponseException;

public  class UtilityMtds {


    public static  final String PROMPT="Below is a list of publicly indexed LinkedIn profile snippets (title, url, short content excerpt).\n" +
            "                For each one, extract a likely name, current title, and a relevanceScore (0-100) for how strong\n" +
            "                a software engineering candidate they look like based ONLY on the visible text (seniority words\n" +
            "                like Senior/Staff/Lead, specific tech stack mentions, etc). Also give a one-sentence matchReason.\n" +
            "\n" +
            "                Respond with ONLY a JSON array, no other text, in this exact shape:\n" +
            "                [\n" +
            "                  {\"name\": \"...\", \"title\": \"...\", \"company\": \"...\", \"linkedinUrl\": \"...\", \"matchReason\": \"...\", \"relevanceScore\": 0}\n" +
            "                ]\n" +
            "\n" +
            "                Profiles:";



    public static final String QUERY_PARSING_PROMPT = """
        Extract the company names and (optional) job role/title from this message.
        Expand well-known abbreviations to their full company name (e.g. "JPMC" -> "JPMorgan Chase",
        "GS" -> "Goldman Sachs"). If no role/title is mentioned, set roleFilter to null.

        Respond with ONLY a JSON object, no other text, in this exact shape:
        {"companies": ["..."], "roleFilter": "..." }

        Message: "%s"
        """;

    public static boolean isAuthError(Throwable ex) {
        if (ex instanceof WebClientResponseException wcre) {
            return wcre.getStatusCode() == HttpStatus.UNAUTHORIZED || wcre.getStatusCode() == HttpStatus.FORBIDDEN;
        }
        return false;
    }
}
