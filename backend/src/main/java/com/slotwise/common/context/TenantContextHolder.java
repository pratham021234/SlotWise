package com.slotwise.common.context;

import java.util.Optional;
import java.util.UUID;

/**
 * ThreadLocal holder for multi-tenant execution context.
 * Enables automatic tenant isolation across service and repository layers.
 */
public final class TenantContextHolder {

    private static final ThreadLocal<TenantContext> CONTEXT = new ThreadLocal<>();

    private TenantContextHolder() {
        // Utility class
    }

    public static void setContext(TenantContext context) {
        CONTEXT.set(context);
    }

    public static Optional<TenantContext> getContext() {
        return Optional.ofNullable(CONTEXT.get());
    }

    public static Optional<UUID> getCurrentTenantId() {
        return getContext().map(TenantContext::getTenantId);
    }

    public static UUID getRequiredTenantId() {
        return getCurrentTenantId().orElseThrow(() ->
                new IllegalStateException("No active TenantContext found for current thread execution"));
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
