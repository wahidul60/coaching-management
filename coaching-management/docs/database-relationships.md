# Database Relationships: Coaching Management Software

This document outlines the entity relationships, foreign keys, relationship types, and cardinalities as defined in the Coaching Management Software ER diagram (docs/er-diagram.drawio).

1. **Role to User** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: User.role_id → Role.id
   - **Description**: One Role defines access permissions for multiple Users.

2. **Academic Batch to Student** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: Student.academic_batch_id → AcademicBatch.id
   - **Description**: One Academic Batch contains multiple Students (representing the student's current batch assignment).

3. **Academic Batch to Enrollment** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: Enrollment.academic_batch_id → AcademicBatch.id
   - **Description**: One Academic Batch captures historical student enrollment snapshots.

4. **User to Student** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: Student.created_by → User.id
   - **Description**: One User (Helpdesk staff) can register multiple Student profiles.

5. **User to Course** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: Course.created_by → User.id
   - **Description**: One User (Admin) can create and manage multiple Courses.

6. **Course Category to Course** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: Course.category_id → CourseCategory.id
   - **Description**: One Course Category can categorize multiple Courses.

7. **User to Audit Log** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: AuditLog.user_id → User.id
   - **Description**: One User can generate multiple Audit Log entries during system actions.

8. **Student to Enrollment** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: Enrollment.student_id → Student.id
   - **Description**: One Student profile can have multiple course Enrollments.

9. **Course to Enrollment** (1 : N)
   - **Relationship**: One-to-Many
   - **Foreign Key**: Enrollment.course_id → Course.id
   - **Description**: One Course can have multiple Student Enrollments.

10. **Enrollment to Payment** (1 : N)
    - **Relationship**: One-to-Many
    - **Foreign Key**: Payment.enrollment_id → Enrollment.id
    - **Description**: One Course Enrollment can receive multiple Payment submissions or installment records.

11. **User (Receptionist) to Payment** (1 : N)
    - **Relationship**: One-to-Many
    - **Foreign Key**: Payment.receptionist_id → User.id
    - **Description**: One User (Receptionist) can record multiple Payment submissions.

12. **Payment to Payment Approval** (1 : 0..1)
    - **Relationship**: One-to-Zero-or-One
    - **Foreign Key**: PaymentApproval.payment_id → Payment.id
    - **Description**: Each Payment submission maps to one current/latest Payment Approval verification record (approval or rejection with reasons).

13. **User (Founding Member) to Payment Approval** (1 : N)
    - **Relationship**: One-to-Many
    - **Foreign Key**: PaymentApproval.founding_member_id → User.id
    - **Description**: One User (Founding Member) can review and approve/reject multiple Payment Approvals.

14. **Payment to Payment Approval Log** (1 : N)
    - **Relationship**: One-to-Many
    - **Foreign Key**: PaymentApprovalLog.payment_id → Payment.id
    - **Description**: Each Payment tracks multiple chronological lifecycle audit events.

15. **User (Actor) to Payment Approval Log** (1 : N)
    - **Relationship**: One-to-Many
    - **Foreign Key**: PaymentApprovalLog.actor_id → User.id
    - **Description**: One User can act in multiple payment review audit events.

16. **Enrollment to Payment Card** (1 : 0..N)
    - **Relationship**: One-to-Zero-or-Many
    - **Foreign Key**: PaymentCard.enrollment_id → Enrollment.id
    - **Description**: Each Enrollment issues course identity cards (with QR tokens) upon initial approval; reissues create additional card records.
