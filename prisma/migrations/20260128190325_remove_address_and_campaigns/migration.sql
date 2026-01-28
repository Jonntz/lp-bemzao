/*
  Warnings:

  - You are about to drop the column `campaignId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Lead` DROP FOREIGN KEY `Lead_campaignId_fkey`;

-- DropIndex
DROP INDEX `Lead_campaignId_fkey` ON `Lead`;

-- AlterTable
ALTER TABLE `Lead` DROP COLUMN `campaignId`,
    DROP COLUMN `cep`,
    DROP COLUMN `city`,
    DROP COLUMN `number`,
    DROP COLUMN `state`,
    DROP COLUMN `street`;

-- DropTable
DROP TABLE `Campaign`;
