package com.omsatyam.linkedinfinder.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Raw free-text chat input, e.g. "software engineer at razorpay" or
 * "Groww, Razorpay role: backend engineer".
 */
public record ChatRequest(
        @NotBlank(message = "Message cannot be empty")
        String message
) {
}