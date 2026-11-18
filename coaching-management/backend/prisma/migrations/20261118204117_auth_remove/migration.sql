/*
  Warnings:

  - You are about to drop the column `institution` on the `academic_batches` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `token_number` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verification_token]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "students_token_number_idx";

-- DropIndex
DROP INDEX "students_token_number_key";

-- AlterTable
ALTER TABLE "academic_batches" DROP COLUMN "institution";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_method",
DROP COLUMN "remarks",
ADD COLUMN     "billing_period_end" TIMESTAMP(6),
ADD COLUMN     "billing_period_start" TIMESTAMP(6),
ADD COLUMN     "verification_token" VARCHAR(100);

-- AlterTable
ALTER TABLE "students" DROP COLUMN "token_number";

-- CreateIndex
CREATE UNIQUE INDEX "payments_verification_token_key" ON "payments"("verification_token");

-- CreateIndex
CREATE INDEX "students_roll_idx" ON "students"("roll");
