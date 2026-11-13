package com.slotwise.common.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Mapped superclass for all multi-tenant domain entities.
 * Automatically enforces tenant ownership with a non-nullable, non-updatable tenant_id.
 */
@Getter
@Setter
@MappedSuperclass
public abstract class BaseTenantEntity extends BaseEntity {

    @Column(name = "tenant_id", nullable = false, updatable = false)
    private UUID tenantId;
}
