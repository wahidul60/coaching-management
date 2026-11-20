/*
  Warnings:

  - A unique constraint covering the columns `[roll,academic_batch_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academic_batch_id` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academic_batch_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "academic_batch_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "academic_batch_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "academic_batches" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_roll_academic_batch_id_key" ON "students"("roll", "academic_batch_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academic_batch_id_fkey" FOREIGN KEY ("academic_batch_id") REFERENCES "academic_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_academic_batch_id_fkey" FOREIGN KEY ("academic_batch_id") REFERENCES "academic_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
