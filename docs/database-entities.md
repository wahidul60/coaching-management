# Database Entities: Coaching Management Software

This document provides a comprehensive overview of the 12 database entities defined in the Coaching Management Software ER diagram (docs/er-diagram.drawio) and database design (docs/database-design.md), detailing their core roles and fields.

1. **Role**
   - **Role in System**: Defines system access levels and permissions (ADMIN, HELPDESK, RECEPTIONIST, FOUNDING_MEMBER).
   - **Fields**:
     - id (PK)
     - name (UNIQUE)
     - description
     - Values: ADMIN, HELPDESK, RECEPTIONIST, FOUNDING_MEMBER

2. **User**
   - **Role in System**: Manages staff user accounts, authentication credentials, active status, and role-based access control.
   - **Fields**:
     - id (PK)
     - role_id (FK -> Role.id)
     - username (UNIQUE)
     - email (UNIQUE, optional)
     - password_hash
     - full_name
     - is_active
     - created_at

3. **Academic Batch**
   - **Role in System**: Represents institutional scheduling groups, batches, or session groupings assigned to students and enrollment snapshots.
   - **Fields**:
     - id (PK)
     - name
     - institution / school
     - created_at

4. **Student**
   - **Role in System**: Stores student demographic and identification profiles registered via Helpdesk, anchored by a unique token number.
   - **Fields**:
     - id (PK)
     - token_number (UNIQUE)
     - academic_batch_id (FK -> AcademicBatch.id)
     - full_name
     - roll
     - phone_self
     - phone_guardian
     - blood_group
     - school_college
     - photo_url
     - created_by (FK -> User.id)
     - created_at

5. **Course Category**
   - **Role in System**: Categorizes educational courses into classifications (e.g., Academic, Admission, Other).
   - **Fields**:
     - id (PK)
     - name (UNIQUE)
     - description

6. **Course**
   - **Role in System**: Defines educational course offerings, descriptions, baseline fees, and active statuses managed exclusively by ADMIN users.
   - **Fields**:
     - id (PK)
     - name (UNIQUE)
     - category_id (FK -> CourseCategory.id)
     - fee (DECIMAL)
     - description
     - is_active
     - created_by (FK -> User.id)
     - created_at

7. **Enrollment**
   - **Role in System**: Associates a student with a course within an academic batch snapshot, capturing the agreed course fee to protect against future fee changes.
   - **Fields**:
     - id (PK)
     - student_id (FK -> Student.id)
     - course_id (FK -> Course.id)
     - academic_batch_id (FK -> AcademicBatch.id)
     - agreed_fee (DECIMAL)
     - status
     - enrolled_at

8. **Payment**
   - **Role in System**: Represents payment submissions made by receptionists against an enrollment, tracking received amounts, remaining balances, payment methods, and approval statuses (PENDING, APPROVED, REJECTED).
   - **Fields**:
     - id (PK)
     - payment_reference (UNIQUE)
     - enrollment_id (FK -> Enrollment.id)
     - amount_received (DECIMAL)
     - remaining_balance (DECIMAL)
     - payment_method
     - transaction_reference
     - payment_date
     - status
     - receptionist_id (FK -> User.id)
     - remarks
     - created_at

9. **Payment Approval**
   - **Role in System**: Records the Founding Member verification outcome, storing the current/latest decision (approval or rejection) with mandatory reasoning per payment.
   - **Fields**:
     - id (PK)
     - payment_id (FK -> Payment.id)
     - founding_member_id (FK -> User.id)
     - status
     - rejection_reason
     - reviewed_at

10. **Payment Approval Log**
    - **Role in System**: Maintains a comprehensive chronological audit ledger tracking every submission, rejection, resubmission, and approval event across payment lifecycles.
    - **Fields**:
      - id (PK)
      - payment_id (FK -> Payment.id)
      - actor_id (FK -> User.id)
      - action
      - previous_status
      - new_status
      - rejection_reason
      - comments
      - created_at

11. **Payment Card**
    - **Role in System**: Represents the generated print-friendly enrollment/course identity card issued upon first payment approval, featuring scannable QR tokens and card numbers.
    - **Fields**:
      - id (PK)
      - enrollment_id (FK -> Enrollment.id)
      - qr_token (UNIQUE)
      - card_number (UNIQUE)
      - issued_at
      - status

12. **Audit Log**
    - **Role in System**: Maintains an immutable system-wide audit trail of all sensitive administrative actions, user logins, data modifications, and security events.
    - **Fields**:
      - id (PK)
      - user_id (FK -> User.id)
      - action
      - module
      - details (JSONB)
      - ip_address
      - created_at

