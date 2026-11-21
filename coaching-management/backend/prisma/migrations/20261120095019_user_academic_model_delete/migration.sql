/*
  Warnings:

  - You are about to drop the column `academic_batch_id` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `founding_member_id` on the `payment_approvals` table. All the data in the column will be lost.
  - You are about to drop the column `receptionist_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `academic_batch_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `academic_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roll]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `approvedBy` to the `payment_approvals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_created_by_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_academic_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_approval_logs" DROP CONSTRAINT "payment_approval_logs_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_approvals" DROP CONSTRAINT "payment_approvals_founding_member_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_receptionist_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_academic_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_created_by_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropIndex
DROP INDEX "students_roll_academic_batch_id_key";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "academic_batch_id";

-- AlterTable
ALTER TABLE "payment_approvals" DROP COLUMN "founding_member_id",
ADD COLUMN     "approvedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "receptionist_id";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "academic_batch_id";

-- DropTable
DROP TABLE "academic_batches";

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE UNIQUE INDEX "students_roll_key" ON "students"("roll");
