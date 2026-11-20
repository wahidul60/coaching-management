/*
  Warnings:

  - You are about to drop the column `academic_batch_id` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_reference` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `academic_batch_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `academic_batches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_academic_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_academic_batch_id_fkey";

-- DropIndex
DROP INDEX "payments_payment_reference_key";

-- DropIndex
DROP INDEX "students_roll_academic_batch_id_key";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "academic_batch_id";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_reference";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "academic_batch_id";

-- DropTable
DROP TABLE "academic_batches";
