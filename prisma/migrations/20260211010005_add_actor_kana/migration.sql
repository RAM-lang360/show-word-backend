/*
  Warnings:

  - You are about to drop the column `name` on the `Actor` table. All the data in the column will be lost.
  - Added the required column `actor_kana` to the `Actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actor_name` to the `Actor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "name",
ADD COLUMN     "actor_kana" TEXT NOT NULL,
ADD COLUMN     "actor_name" TEXT NOT NULL;
