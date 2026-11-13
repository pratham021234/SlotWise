package com.slotwise.common.context;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Encapsulates the resolved tenant and security context for the current executing thread.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantContext {

    private UUID tenantId;
    private String tenantSlug;
    private UUID userId;
    private String userRole;
    private boolean isPlatformAdmin;

    public static TenantContext of(UUID tenantId) {
        return TenantContext.builder()
                .tenantId(tenantId)
                .build();
    }
}

