package com.slotwise.common.exception;

import org.springframework.http.HttpStatus;

public class TenantAccessDeniedException extends BusinessException {

    public TenantAccessDeniedException(String message) {
        super("TENANT_ACCESS_DENIED", message, HttpStatus.FORBIDDEN);
    }
}
