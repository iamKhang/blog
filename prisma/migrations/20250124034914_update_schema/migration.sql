/*
  Warnings:

  - You are about to drop the column `authorId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_resourceId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "authorId",
DROP COLUMN "technologies";

-- DropTable
DROP TABLE "Material";

-- DropTable
DROP TABLE "Resource";

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectTechnologies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectTechnologies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE INDEX "_ProjectTechnologies_B_index" ON "_ProjectTechnologies"("B");

-- AddForeignKey
ALTER TABLE "_ProjectTechnologies" ADD CONSTRAINT "_ProjectTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTechnologies" ADD CONSTRAINT "_ProjectTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
