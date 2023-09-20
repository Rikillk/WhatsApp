/*
  Warnings:

  - You are about to drop the column `recieverId` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_recieverId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "recieverId",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deviceTokens" TEXT[],
ALTER COLUMN "about" SET DEFAULT 'Hey there..I''m using ';

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
