# SlotWise Concurrency Control: Double-Booking Prevention Strategy

## 1. The Concurrency Challenge

In a commercial SaaS appointment scheduling system, multiple customers frequently attempt to book the exact same staff member for identical or overlapping time windows simultaneously.

A naive "check-then-insert" pattern is vulnerable to standard race conditions:
```
Thread A: SELECT count(*) WHERE staff_id = X AND overlapping...  (returns 0)
Thread B: SELECT count(*) WHERE staff_id = X AND overlapping...  (returns 0)
Thread A: INSERT INTO appointments ...                           (SUCCESS)
Thread B: INSERT INTO appointments ...                           (SUCCESS -> DOUBLE BOOKING!)
```

SlotWise enforces a multi-layered, hardware- and database-backed concurrency shield to ensure that **under no circumstances can two overlapping appointments ever be created for the same staff member**.

---

## 2. Multi-Layer Concurrency Architecture

SlotWise protects against double booking across three distinct layers:

```
[Layer 1: Edge & Client]
  └── Idempotency Keys (UUIDv4) in HTTP Header 'Idempotency-Key'
      └── Protects against client duplicate submissions & network retry replay.

[Layer 2: Application / Distributed Coordination]
  └── Distributed Resource Locking (Redis / Database Lock Primitive)
      └── Lock Key: lock:tenant:{tenantId}:staff:{staffId}:slot:{timestamp}
      └── Lease Time: 5000ms with fail-safe automatic expiration.

[Layer 3: Storage Engine Invariant Guard]
  └── PostgreSQL GiST Exclusion Constraint using 'btree_gist'
      └── EXCLUDE USING gist (staff_id WITH =, tstzrange(start_time, end_time, '[)') WITH &&)
          WHERE (status NOT IN ('CANCELLED', 'REJECTED'))
      └── Physical database guarantee: conflicting transactions are blocked/rolled back at commit.
```

---

## 3. Storage Layer: PostgreSQL GiST Exclusion Constraints

The foundational invariant is enforced directly inside PostgreSQL. By leveraging the `btree_gist` extension (already initialized in SlotWise baseline migrations), we define a temporal range constraint:

```sql
-- Ensure extension is loaded
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Appointment table exclusion constraint
ALTER TABLE appointments
ADD CONSTRAINT no_overlapping_staff_appointments
EXCLUDE USING gist (
    tenant_id WITH =,
    staff_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
)
WHERE (status NOT IN ('CANCELLED', 'REJECTED'));
```

### Why Exclusion Constraints Are Superior to Unique Indexes
1. Standard B-Tree unique indexes can only match exact equality (`start_time = start_time`).
2. Appointments have durations (e.g. 10:00 - 10:45 vs 10:30 - 11:15). An appointment from 10:30 to 11:15 overlaps with 10:00 to 10:45, even though their start times differ.
3. The `tstzrange` GiST index operates on interval intersection (`&&`). If any microsecond of overlap occurs between active appointments for that staff member, PostgreSQL instantly raises a constraint violation:
   ```
   ERROR: conflicting key value violates exclusion constraint "no_overlapping_staff_appointments"
   DETAIL: Key (tenant_id, staff_id, tstzrange(start_time, end_time, '[)'::text))=(..., ..., ["2026-11-14 10:00:00+00","2026-11-14 10:45:00+00")) conflicts with existing key...
   ```

---

## 4. Application Layer: Lock Acquisition & Conflict Translation

When a booking request is received:

1. **Idempotency Key Check:**
   - The server verifies if an operation with this `Idempotency-Key` has already been recorded for this tenant.
   - If previously processed, the cached response is returned immediately without re-execution.
2. **Pessimistic Locking / Distributed Lock:**
   - The service acquires a short-lived lock on the staff member's scheduling partition.
   - Lock timeout is strictly bounded (e.g., 5 seconds) to prevent starvation in case of network partitions or process crashes.
3. **Availability Validation:**
   - Queries existing appointments and shifts to verify availability.
4. **Transactional Commit:**
   - Inserts the new appointment within a `@Transactional(isolation = Isolation.READ_COMMITTED)` boundary.
5. **Conflict Translation:**
   - If a concurrent transaction commits first, the second transaction catches `DataIntegrityViolationException`.
   - The exception is intercepted by `GlobalExceptionHandler` and translated into a clean, human-readable HTTP 409 Conflict:
     ```json
     {
       "success": false,
       "error": {
         "code": "SLOT_ALREADY_BOOKED",
         "message": "The selected appointment slot has just been reserved by another client. Please select an alternate time."
       },
       "timestamp": "2026-11-13T17:15:00Z"
     }
     ```

---

## 5. Verification: Concurrent Integration Test Plan

In Phase 5 (Appointments & Concurrency Implementation), an automated integration test executes concurrent requests against the real PostgreSQL container:

```java
@Test
void testConcurrentBookingsForSameStaffSlotOnlyOneSucceeds() throws Exception {
    int threadCount = 20;
    ExecutorService executor = Executors.newFixedThreadPool(threadCount);
    CountDownLatch startGate = new CountDownLatch(1);
    CountDownLatch endGate = new CountDownLatch(threadCount);

    AtomicInteger successCount = new AtomicInteger(0);
    AtomicInteger conflictCount = new AtomicInteger(0);

    for (int i = 0; i < threadCount; i++) {
        executor.submit(() -> {
            try {
                startGate.await(); // Synchronize all threads to fire simultaneously
                BookingResult result = appointmentService.bookAppointment(request);
                successCount.incrementAndGet();
            } catch (SlotConflictException ex) {
                conflictCount.incrementAndGet();
            } finally {
                endGate.countDown();
            }
        });
    }

    startGate.countDown(); // Release all threads at once
    endGate.await(10, TimeUnit.SECONDS);

    assertEquals(1, successCount.get(), "Exactly one booking must succeed");
    assertEquals(threadCount - 1, conflictCount.get(), "All other concurrent attempts must be rejected");
}
```
