package com.omsatyam.linkedinfinder.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Incoming request: e.g. { "companies": ["Groww", "Razorpay", "JPMC"] }
 */
public record SearchRequest(
        @NotEmpty(message = "At least one company name is required")
        List<String> companies,

        // Optional: let the caller narrow the role, e.g. "Backend Engineer"
        String roleFilter
) {
}
