package com.slotwise.health.controller;

import com.slotwise.common.api.ApiResponse;
import com.slotwise.health.dto.HealthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
@Tag(name = "System Health", description = "Endpoints for platform liveness, readiness, and diagnostics")
public class HealthController {

    private final DataSource dataSource;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @GetMapping
    @Operation(summary = "System health check", description = "Returns operational health, uptime and database connectivity status")
    public ResponseEntity<ApiResponse<HealthResponse>> checkHealth() {
        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        Map<String, Object> components = new HashMap<>();
        boolean dbHealthy = checkDatabaseHealth(components);

        String overallStatus = dbHealthy ? "UP" : "DEGRADED";

        HealthResponse health = HealthResponse.builder()
                .status(overallStatus)
                .application("SlotWise SaaS")
                .version("1.0.0")
                .environment(activeProfile)
                .timestamp(Instant.now())
                .uptimeSeconds(uptimeSeconds)
                .components(components)
                .build();

        return ResponseEntity.ok(ApiResponse.ok("SlotWise platform is operational", health));
    }

    private boolean checkDatabaseHealth(Map<String, Object> components) {
        Map<String, Object> dbDetails = new HashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(2);
            dbDetails.put("status", valid ? "UP" : "DOWN");
            dbDetails.put("database", conn.getMetaData().getDatabaseProductName());
            dbDetails.put("version", conn.getMetaData().getDatabaseProductVersion());
            components.put("database", dbDetails);
            return valid;
        } catch (Exception ex) {
            log.error("Database health check failed: {}", ex.getMessage());
            dbDetails.put("status", "DOWN");
            dbDetails.put("error", ex.getMessage());
            components.put("database", dbDetails);
            return false;
        }
    }
}

