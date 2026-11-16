# Database Constraints Analysis: Coaching Management Software

## 1. Overview
This document identifies critical database constraints (Primary Keys, Foreign Keys, UNIQUE, NOT NULL, CHECK, and referential delete/update rules) across the core tables of the Coaching Management Software as defined in docs/er-diagram.drawio and docs/database-design.md, ensuring robust data validation and financial consistency at the PostgreSQL layer.

---

## 2. Table-by-Table Constraints & Validation Rules

### 2.1. Role Table
- **Primary Key**: id (UUID, PK)
- **Unique Constraints**: name (UNIQUE, values: ADMIN, HELPDESK, RECEPTIONIST, FOUNDING_MEMBER)
- **NOT NULL Constraints**: id, name

### 2.2. User Table
- **Primary Key**: id (UUID, PK)
- **Foreign Key**: role_id (FK -> Role.id, ON DELETE RESTRICT)
- **Unique Constraints**: username (UNIQUE), email (UNIQUE, optional/nullable)
- **NOT NULL Constraints**: id, role_id, username, password_hash, full_name, is_active, created_at

### 2.3. Academic Batch Table
- **Primary Key**: id (UUID, PK)
- **NOT NULL Constraints**: id, name, created_at

### 2.4. Student Table
- **Primary Key**: id (UUID, PK)
- **Foreign Keys**: 
  - academic_batch_id (FK -> AcademicBatch.id, ON DELETE RESTRICT)
  - created_by (FK -> User.id, ON DELETE RESTRICT)
- **Unique Constraints**: token_number (UNIQUE), composite uniqueness on (roll, academic_batch_id) to prevent duplicate student rolls within the same batch.
- **NOT NULL Constraints**: id, token_number, academic_batch_id, full_name, roll, phone_self, school_college, created_by, created_at

### 2.5. Course Category Table
- **Primary Key**: id (UUID, PK)
- **Unique Constraints**: name (UNIQUE)
- **NOT NULL Constraints**: id, name

### 2.6. Course Table
- **Primary Key**: id (UUID, PK)
- **Foreign Keys**:
  - category_id (FK -> CourseCategory.id, ON DELETE RESTRICT)
  - created_by (FK -> User.id, ON DELETE RESTRICT)
- **Unique Constraints**: name (UNIQUE)
- **Check Constraints**: fee >= 0 (positive course fee validation)
- **NOT NULL Constraints**: id, name, category_id, fee, is_active, created_by, created_at

### 2.7. Enrollment Table
- **Primary Key**: id (UUID, PK)
- **Foreign Keys**:
  - student_id (FK -> Student.id, ON DELETE RESTRICT)
  - course_id (FK -> Course.id, ON DELETE RESTRICT)
  - academic_batch_id (FK -> AcademicBatch.id, ON DELETE RESTRICT)
- **Unique Constraints**: Composite unique constraint on (student_id, course_id) to prevent duplicate active course enrollments per student.
- **Check Constraints**: agreed_fee >= 0
- **NOT NULL Constraints**: id, student_id, course_id, academic_batch_id, agreed_fee, status, enrolled_at

### 2.8. Payment Table
- **Primary Key**: id (UUID, PK)
- **Foreign Keys**:
  - enrollment_id (FK -> Enrollment.id, ON DELETE RESTRICT)
  - receptionist_id (FK -> User.id, ON DELETE RESTRICT)
- **Unique Constraints**: payment_reference (UNIQUE)
- **Check Constraints**: amount_received > 0 and remaining_balance >= 0
- **NOT NULL Constraints**: id, payment_reference, enrollment_id, amount_received, remaining_balance, payment_date, status, receptionist_id, created_at

### 2.9. Payment Approval Table
- **Primary Key**: id (UUID, PK)
- **Foreign Keys**:
  - payment_id (FK -> Payment.id, ON DELETE CASCADE)
  - founding_member_id (FK -> User.id, ON DELETE RESTRICT)
- **Unique Constraints**: One-to-One / unique mapping per payment_id
- **Conditional Check Constraints**: If status = REJECTED, rejection_reason must not be null or empty (enforcing mandatory rejection reason business rule).
- **NOT NULL Constraints**: id, payment_id, founding_member_id, status, reviewed_at

### 2.10. Payment Approval Log Table
- **Primary Key**: id (UUID, PK)
- **Foreign Keys**:
  - payment_id (FK -> Payment.id, ON DELETE CASCADE)
  - actor_id (FK -> User.id, ON DELETE RESTRICT)
- **NOT NULL Constraints**: id, payment_id, actor_id, action, previous_status, new_status, created_at

### 2.11. Payment Card Table
- **Primary Key**: id (UUID, PK)
- **Foreign Key**: enrollment_id (FK -> Enrollment.id, ON DELETE RESTRICT)
- **Unique Constraints**: qr_token (UNIQUE), card_number (UNIQUE)
- **NOT NULL Constraints**: id, enrollment_id, qr_token, card_number, issued_at, status

### 2.12. Audit Log Table
- **Primary Key**: id (UUID, PK)
- **Foreign Key**: user_id (FK -> User.id, ON DELETE SET NULL or RESTRICT)
- **Immutability Rule**: Database triggers enforcing strict immutability (preventing UPDATE and DELETE operations on audit_logs).
- **NOT NULL Constraints**: id, action, module, created_at
