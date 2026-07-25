package com.omsatyam.linkedinfinder.exception;

public class ExternalApiException extends RuntimeException {

    private final String provider;

    public ExternalApiException(String provider, String message, Throwable cause) {
        super(message, cause);
        this.provider = provider;
    }

    public String getProvider() {
        return provider;
    }
}