-- AlterTable
ALTER TABLE "FormField" ADD COLUMN     "conditionType" TEXT,
ADD COLUMN     "conditionalOnFieldId" TEXT,
ADD COLUMN     "conditionalOnValue" TEXT,
ADD COLUMN     "spanishLabel" TEXT;

-- AlterTable
ALTER TABLE "FormFieldOption" ADD COLUMN     "spanishValue" TEXT;

-- AlterTable
ALTER TABLE "FormGrouping" ADD COLUMN     "conditionType" TEXT,
ADD COLUMN     "conditionalOnFieldId" TEXT,
ADD COLUMN     "conditionalOnValue" TEXT,
ADD COLUMN     "spanishTitle" TEXT;

-- AlterTable
ALTER TABLE "FormTemplate" ADD COLUMN     "spanishName" TEXT;
