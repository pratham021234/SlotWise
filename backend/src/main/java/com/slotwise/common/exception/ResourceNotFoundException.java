package com.slotwise.common.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super("RESOURCE_NOT_FOUND",
                String.format("%s with identifier '%s' was not found", resourceName, identifier),
                HttpStatus.NOT_FOUND);
    }
}

