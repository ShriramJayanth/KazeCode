/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "ExecutionQueue" (
    "id" SERIAL NOT NULL,
    "languageID" INTEGER NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "stdin" TEXT NOT NULL,
    "timeout" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "stdout" TEXT,
    "stderr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionQueue_pkey" PRIMARY KEY ("id")
);
