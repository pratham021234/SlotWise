package com.slotwise;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class SlotWiseApplicationTests {

    @Test
    @DisplayName("Spring Application Context loads successfully")
    void contextLoads() {
        assertTrue(true, "Application context bootstrapped without error");
    }
}
