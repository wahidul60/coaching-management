# Coaching Management Software — Combined Master Project Plan

## 1. Executive Summary & System Overview

### 1.1 System Purpose
The **Coaching Management Software (CMS)** is an enterprise-grade administrative and financial management system designed for coaching centers and educational institutions. It streamlines and secures the operational lifecycle from student registration to course enrollment, fee collection, founding member payment approval, payment card generation with scannable QR codes, and public verification.

### 1.2 Key Objectives
1. **Centralized Student Management**: Single source of truth for student registration, profile tracking, and academic batch assignments anchored by unique token numbers.
2. **Financial Integrity & Fee Locking**: Strict separation between admin baseline course fees and student enrollment agreed fees, preventing historical data corruption when fee structures change.
3. **Multi-Stage Payment Verification Workflow**: Two-step payment verification where receptionists enter pending payments and Founding Members review, approve, or reject transactions with mandatory reasons.
4. **Printable Payment Card & QR Verification**: Automated generation of branded, print-optimized payment cards containing secure QR tokens for tamper-proof status verification.
5. **Role-Based Access Control & Security**: Fine-grained authorization, bcrypt password encryption, JWT auth, and immutable audit logs for sensitive operations.

---

## 2. Business Workflow & Role-Based Requirements

### 2.1 Operational Lifecycle Workflow
```mermaid
sequenceDiagram
    autonumber
    participant S as Student
    participant H as Helpdesk
    participant R as Receptionist
    participant F as Founding Member
    participant SYS as System / DB
    participant V as Verification Portal

    S->>H: 1. Request Registration / Inquiry
    H->>SYS: 2. Search Profile (Token/Name/Phone)
    alt Student New
        H->>SYS: Create Student Profile
        SYS-->>H: Return Generated Unique Token Number
    else Student Exists
        SYS-->>H: Return Student Details
    end
    H-->>S: Direct Student to Reception with Token Number
    S->>R: 3. Provide Token Number & Select Course
    R->>SYS: Lookup Token & Fetch Admin Courses
    R->>SYS: Input Payment (Amount Received, Payment Method, Ref)
    SYS-->>R: Record Saved as PENDING (No Card Generated)
    SYS-->>F: Payment Enqueued in Approval Queue
    F->>SYS: 4. Review Pending Payment Details
    alt Approved
        F->>SYS: Approve Payment
        SYS->>SYS: Create PaymentApproval Record & Log Status
        SYS->>SYS: Generate PaymentCard & Unique QR Token


---

### 2.2 System Roles & Permissions Matrix

| Domain / Action | ADMIN | HELPDESK | RECEPTIONIST | FOUNDING_MEMBER | PUBLIC / GUEST |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **System User Management** | Read / Write | No Access | No Access | Read Only | No Access |
| **Academic Batch Management** | Read / Write | Read Only | Read Only | Read Only | No Access |
| **Course Category & Course Config** | Read / Write | Read Only | Read Only | Read Only | No Access |
| **Student Registration & Search** | Read / Write | Read / Write | Read Only (Search) | Read Only | No Access |
| **Enrollment Creation** | Read / Write | No Access | Read / Write | Read Only | No Access |
| **Payment Submission (`PENDING`)** | Read / Write | No Access | Read / Write | Read Only | No Access |
| **Payment Approval Queue Access** | Read Only | No Access | No Access | Read / Write | No Access |
| **Approve / Reject Payment** | Overwrite (Opt) | No Access | No Access | Read / Write | No Access |
| **Payment Card View & Print** | Read / Print | No Access | Read / Print | Read / Print | No Access |
| **Public QR Code Verification** | Public | Public | Public | Public | Read Only |
| **Audit Logs Inspection** | Full Access | No Access | No Access | Read Only | No Access |

---

### 2.3 Detailed Functional Requirements per Role

#### 1. Helpdesk Role (`HELPDESK`)
- **Student Search**: Fast, real-time lookup by Token Number, Student Name, or Phone Number.
- **Profile Verification**: Validate existing identity and batch assignments before passing to Receptionist.
- **New Student Registration**: Input mandatory demographic fields and upload student photograph.
- **Token Assignment**: Auto-generation or assignment of unique system-wide `token_number`.

#### 2. Receptionist Role (`RECEPTIONIST`)
- **Token Lookup**: Instant retrieval of registered student profile via Token Number.
- **Course Selection UI**: Browse active ADMIN-managed courses categorized under Academic, Admission, or Other.
- **Payment Entry Form**:
  - Automatically fetch baseline course fee.
  - Record agreed fee snapshot upon enrollment.
  - Input `amount_received`, calculate `remaining_balance` dynamically.
  - Record payment method (Cash, Bank Transfer, Mobile Wallet), transaction references, payment date, and remarks.
- **Pending Submission**: Submitting a payment sets initial status to `PENDING`. Payment cards CANNOT be printed while status is `PENDING` or `REJECTED`.
- **Payment Resubmission**: Ability to update and resubmit rejected payment entries for re-evaluation.

#### 3. Founding Member Role (`FOUNDING_MEMBER`)
- **Approval Queue Dashboard**: Dedicated queue displaying all `PENDING` payments with student details, agreed course fee, amount received, remaining balance, receptionist identity, and payment receipts/references.
- **Verification Actions**:
  - **Approve**: Transitions status to `APPROVED`, triggers payment card generation.
  - **Reject**: Requires mandatory text input for `rejection_reason`, transitions status to `REJECTED`, returns record to receptionist workspace for correction.
- **Approval Audit Ledger**: View complete immutable history of review actions in `PaymentApprovalLog`.

#### 4. System Administrator Role (`ADMIN`)
- **User Management**: Create, update, deactivate staff accounts and assign roles.
- **Course Catalog Management**: Create course categories, establish courses, update baseline fees, and toggle active status.
- **Academic Batch Configuration**: Define academic sessions/batches and institutional parameters.
- **System Settings & Audit Trail**: Monitor global security audit logs and file storage settings.

#### 5. Verification Portal (Public Endpoint)
- **Scannable QR Target**: Endpoint (`/verify?token=...` or `/api/verify/...`) accessible via smartphone or barcode scanner.


---

### 2.4 Confirmed Business Rules & Unresolved Questions

#### Confirmed Business Rules
1. **Token Permanence**: Unique `token_number` is permanent across academic sessions for a student.
2. **Agreed Fee Locking**: The course fee at time of enrollment is frozen as `agreed_fee` in `Enrollment`, protecting financial calculations from future fee changes by Admin.
3. **Mandatory Rejection Reason**: Founding Members cannot reject a payment without providing an explicit rejection reason string.
4. **Card Issue Constraint**: Payment cards and QR tokens are created ONLY upon payment approval (`APPROVED`).
5. **Dynamic Balance Integrity**: Payment `remaining_balance` is computed as `agreed_fee - SUM(amount_received of approved payments)`.

#### Unresolved Questions & Technical Assumptions
- **Token Format**: Standardized semantic string `CMS-YYYY-XXXXX` (e.g. `CMS-2026-00001`).
- **Multi-Course Enrollment**: Supported via 1:N Student to Enrollment relations. Each course enrollment receives a separate Payment Card.
- **Partial Payments**: Supported. Remaining balance is calculated dynamically per transaction.
- **Refund Management**: Refunded payment cards transition to `REVOKED` or `CANCELLED` status.

---

## 3. System Architecture & Tech Stack

### 3.1 Tech Stack Specification
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, Axios, Zod, React Hook Form.
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM.
- **Database**: PostgreSQL 15+ (`DECIMAL(10,2)` for currency, `UUID` for PKs).
- **Authentication**: JWT (JSON Web Tokens), Bcrypt (salt factor 12), Express RBAC Middleware.
- **File Storage**: Local filesystem storage (`/uploads/students/photos/`, `/uploads/institution/`) with cloud storage abstraction layer (`IStorageService`).
- **Card Rendering & QR**: QR Code generation via `qrcode` / Canvas API, CSS Print Media styles (`@media print`).

---

### 3.2 High-Level System Architecture Diagram
```mermaid
graph TD
    subgraph Client ["Frontend (Next.js / TypeScript / Tailwind)"]
        UI[User Dashboards & Role Pages]
        ClientAuth[Auth State & JWT Context]
        APIClient[Axios REST Client]
    end

    subgraph Backend ["Backend API (Express / Node.js Modular Monolith)"]
        Server[server.ts / app.ts]
        GlobalMW[Helmet / CORS / RateLimit]
        AuthMW[JWT Auth Middleware]
        RBACMW[RBAC Authorization Middleware]

        subgraph Modules ["Feature Modules"]
            AuthMod[auth module]
            StudentMod[students module]
            BatchMod[batches module]
            CourseMod[courses module]
            EnrollMod[enrollments module]
            PaymentMod[payments module]
            ApprovalMod[approvals module]
            CardMod[payment-cards module]
            ReportMod[reports & audit module]
        end

        SharedUtils[Shared Helpers, Error Handler & Logger]
    end

    subgraph Database ["Persistence Layer"]
        Prisma[Prisma ORM Client]
        Postgres[(PostgreSQL Database)]
    end

    Client -->|HTTPS / REST API| Server
    Server --> GlobalMW --> AuthMW --> RBACMW --> Modules
    Modules --> SharedUtils
    Modules --> Prisma
    Prisma --> Postgres
```

- **Sanitized Information Display**: Validates payment card status (`APPROVED`) and renders:
  - Institution Branding & Student Photo
  - Student Full Name & Roll Number
  - Academic Batch & Enrolled Course Name
  - Verification Badge (SUCCESS / INVALID / REJECTED)
  - *Privacy Rule*: Hides private phone numbers and guardian contacts.

    else Rejected
        F->>SYS: Reject Payment (Mandatory Rejection Reason)
        SYS->>SYS: Create PaymentApproval Record & Log Status
        R->>SYS: Option to Edit & Resubmit Corrected Payment
    end
    S->>SYS: 5. Receive Printed Payment Card
    V->>SYS: 6. Public QR Scan (`/verify?token=...`)
    SYS-->>V: Display Sanitized Verification Info (No Private Contacts)
```
