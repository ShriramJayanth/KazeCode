/*
  Warnings:

  - The primary key for the `ExecutionQueue` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ExecutionQueue" DROP CONSTRAINT "ExecutionQueue_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ExecutionQueue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ExecutionQueue_id_seq";
