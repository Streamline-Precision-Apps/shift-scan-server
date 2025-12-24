-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "EquipmentState" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'NEEDS_REPAIR', 'RETIRED');

-- CreateEnum
CREATE TYPE "EquipmentTags" AS ENUM ('TRUCK', 'TRAILER', 'VEHICLE', 'EQUIPMENT');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('OWNED', 'LEASED', 'RENTAL');

-- CreateEnum
CREATE TYPE "materialUnit" AS ENUM ('TONS', 'YARDS');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('USER', 'MANAGER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "IsActive" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('MECHANIC', 'TRUCK_DRIVER', 'LABOR', 'TASCO');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('PENDING', 'LOW', 'MEDIUM', 'HIGH', 'TODAY');

-- CreateEnum
CREATE TYPE "LoadType" AS ENUM ('UNSCREENED', 'SCREENED');

-- CreateEnum
CREATE TYPE "EquipmentUsageType" AS ENUM ('TASCO', 'TRUCKING', 'MAINTENANCE', 'LABOR', 'GENERAL');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ReportVisibility" AS ENUM ('PRIVATE', 'MANAGEMENT', 'COMPANY');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "FormTemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'DATE', 'DATE_TIME', 'TIME', 'DROPDOWN', 'CHECKBOX', 'HEADER', 'PARAGRAPH', 'MULTISELECT', 'RADIO', 'SEARCH_PERSON', 'SEARCH_ASSET');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('EQUIPMENT', 'JOBSITES', 'COST_CODES', 'CLIENTS');

-- CreateEnum
CREATE TYPE "FormTemplateCategory" AS ENUM ('GENERAL', 'MAINTENANCE', 'SAFETY', 'INSPECTION', 'INCIDENT', 'FINANCE', 'OTHER', 'HR', 'OPERATIONS', 'COMPLIANCE', 'CLIENTS', 'IT');

-- CreateEnum
CREATE TYPE "CreatedVia" AS ENUM ('ADMIN', 'MOBILE');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "SubscriptionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT,

    CONSTRAINT "CostCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CCTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CCTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crew" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "crewType" "WorkType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdfDocument" (
    "id" TEXT NOT NULL,
    "qrId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "description" TEXT,
    "fileData" BYTEA NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'application/pdf',
    "size" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTag" (
    "id" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "DocumentTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "qrId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creationReason" TEXT,
    "equipmentTag" "EquipmentTags" NOT NULL DEFAULT 'EQUIPMENT',
    "state" "EquipmentState" NOT NULL DEFAULT 'AVAILABLE',
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "overWeight" BOOLEAN DEFAULT false,
    "currentWeight" DOUBLE PRECISION DEFAULT 0,
    "createdById" TEXT,
    "createdVia" "CreatedVia" NOT NULL DEFAULT 'MOBILE',
    "acquiredDate" TIMESTAMP(3),
    "code" TEXT,
    "color" TEXT,
    "licensePlate" TEXT,
    "licenseState" TEXT,
    "make" TEXT,
    "memo" TEXT,
    "model" TEXT,
    "ownershipType" "OwnershipType",
    "registrationExpiration" TIMESTAMP(3),
    "serialNumber" TEXT,
    "year" TEXT,
    "acquiredCondition" "Condition",
    "status" "FormTemplateStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeEquipmentLog" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT,
    "maintenanceId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "comment" TEXT,
    "timeSheetId" INTEGER NOT NULL,
    "rental" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EmployeeEquipmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormTemplate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spanishName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSignatureRequired" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "isActive" "FormTemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "formType" "FormTemplateCategory" NOT NULL DEFAULT 'GENERAL',
    "isApprovalRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FormTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormGrouping" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "spanishTitle" TEXT,
    "order" INTEGER NOT NULL,
    "conditionalOnFieldId" TEXT,
    "conditionType" TEXT,
    "conditionalOnValue" TEXT,

    CONSTRAINT "FormGrouping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL,
    "formGroupingId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "spanishLabel" TEXT,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "placeholder" TEXT,
    "maxLength" INTEGER,
    "content" TEXT,
    "filter" TEXT,
    "minLength" INTEGER,
    "multiple" BOOLEAN DEFAULT false,
    "conditionalOnFieldId" TEXT,
    "conditionType" TEXT,
    "conditionalOnValue" TEXT,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormFieldOption" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "spanishValue" TEXT,

    CONSTRAINT "FormFieldOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "title" TEXT,
    "formTemplateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "formType" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "status" "FormStatus" NOT NULL DEFAULT 'DRAFT',
    "id" SERIAL NOT NULL,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormApproval" (
    "id" TEXT NOT NULL,
    "signedBy" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "signature" TEXT,
    "comment" TEXT,
    "formSubmissionId" INTEGER NOT NULL,

    CONSTRAINT "FormApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobsite" (
    "id" TEXT NOT NULL,
    "qrId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creationReason" TEXT,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "addressId" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archiveDate" TIMESTAMP(3),
    "createdById" TEXT,
    "createdVia" "CreatedVia" NOT NULL DEFAULT 'ADMIN',
    "code" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "radiusMeters" DOUBLE PRECISION,
    "status" "FormTemplateStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Jobsite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationMarker" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationMarker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parameters" JSONB,
    "visibility" "ReportVisibility" NOT NULL DEFAULT 'PRIVATE',
    "tags" TEXT[],
    "id" INTEGER NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportRun" (
    "id" TEXT NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReportStatus" NOT NULL,
    "results" JSONB,
    "duration" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "customParams" JSONB,
    "exportFormats" TEXT[],
    "lastExportedAt" TIMESTAMP(3),
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "ReportRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSheet" (
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "jobsiteId" TEXT NOT NULL,
    "costcode" TEXT NOT NULL,
    "nu" TEXT NOT NULL DEFAULT 'nu',
    "Fp" TEXT NOT NULL DEFAULT 'fp',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "comment" TEXT,
    "statusComment" TEXT,
    "location" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "workType" "WorkType" NOT NULL,
    "editedByUserId" TEXT,
    "newTimeSheetId" TEXT,
    "createdByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clockInLat" DOUBLE PRECISION,
    "clockInLng" DOUBLE PRECISION,
    "clockOutLat" DOUBLE PRECISION,
    "clockOutLng" DOUBLE PRECISION,
    "withinFenceIn" BOOLEAN,
    "withinFenceOut" BOOLEAN,
    "wasInjured" BOOLEAN DEFAULT false,
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER,

    CONSTRAINT "TimeSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mechanicProjects" (
    "id" SERIAL NOT NULL,
    "timeSheetId" INTEGER NOT NULL,
    "hours" DOUBLE PRECISION,
    "equipmentId" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "mechanicProjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "comment" TEXT,
    "timeSheetId" INTEGER NOT NULL,

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "equipmentIssue" TEXT,
    "employeeEquipmentLogId" TEXT,
    "additionalInfo" TEXT,
    "location" TEXT,
    "problemDiagnosis" TEXT,
    "solution" TEXT,
    "totalHoursLaboured" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" "Priority" NOT NULL,
    "delay" TIMESTAMP(3),
    "delayReasoning" TEXT,
    "repaired" BOOLEAN NOT NULL DEFAULT false,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "hasBeenDelayed" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TascoLog" (
    "id" TEXT NOT NULL,
    "shiftType" TEXT NOT NULL,
    "equipmentId" TEXT,
    "laborType" TEXT,
    "materialType" TEXT,
    "LoadQuantity" INTEGER NOT NULL DEFAULT 0,
    "screenType" "LoadType",
    "timeSheetId" INTEGER NOT NULL,

    CONSTRAINT "TascoLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TascoFLoads" (
    "id" SERIAL NOT NULL,
    "tascoLogId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "screenType" "LoadType",

    CONSTRAINT "TascoFLoads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TascoMaterialTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TascoMaterialTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckingLog" (
    "id" TEXT NOT NULL,
    "laborType" TEXT NOT NULL,
    "taskName" TEXT,
    "equipmentId" TEXT,
    "startingMileage" INTEGER,
    "endingMileage" INTEGER,
    "truckLaborLogId" TEXT,
    "trailerNumber" TEXT,
    "truckNumber" TEXT,
    "timeSheetId" INTEGER NOT NULL,

    CONSTRAINT "TruckingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateMileage" (
    "id" TEXT NOT NULL,
    "truckingLogId" TEXT NOT NULL,
    "state" TEXT,
    "stateLineMileage" INTEGER,

    CONSTRAINT "StateMileage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "truckingLogId" TEXT NOT NULL,
    "LocationOfMaterial" TEXT,
    "name" TEXT,
    "quantity" DOUBLE PRECISION,
    "materialWeight" DOUBLE PRECISION,
    "loadType" "LoadType",
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "unit" "materialUnit",

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefuelLog" (
    "id" TEXT NOT NULL,
    "employeeEquipmentLogId" TEXT,
    "truckingLogId" TEXT,
    "tascoLogId" TEXT,
    "gallonsRefueled" DOUBLE PRECISION,
    "milesAtFueling" INTEGER,

    CONSTRAINT "RefuelLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentHauled" (
    "id" TEXT NOT NULL,
    "truckingLogId" TEXT,
    "equipmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endMileage" INTEGER,
    "startMileage" INTEGER,
    "destination" TEXT,
    "source" TEXT,

    CONSTRAINT "EquipmentHauled_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSheetChangeLog" (
    "id" TEXT NOT NULL,
    "timeSheetId" INTEGER NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changeReason" TEXT,
    "changes" JSONB NOT NULL,
    "wasStatusChange" BOOLEAN NOT NULL DEFAULT false,
    "numberOfChanges" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TimeSheetChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "signature" TEXT,
    "DOB" TIMESTAMP(3),
    "truckView" BOOLEAN NOT NULL,
    "tascoView" BOOLEAN NOT NULL,
    "laborView" BOOLEAN NOT NULL,
    "mechanicView" BOOLEAN NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "terminationDate" TIMESTAMP(3),
    "accountSetup" BOOLEAN NOT NULL DEFAULT false,
    "clockedIn" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "passwordResetTokenId" TEXT,
    "workTypeId" TEXT,
    "middleName" TEXT,
    "secondLastName" TEXT,
    "lastSeen" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "generalReminders" BOOLEAN NOT NULL DEFAULT false,
    "personalReminders" BOOLEAN NOT NULL DEFAULT false,
    "cameraAccess" BOOLEAN NOT NULL DEFAULT false,
    "locationAccess" BOOLEAN NOT NULL DEFAULT false,
    "cookiesAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "emergencyContact" TEXT,
    "emergencyContactNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountSetupToken" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AccountSetupToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FCMToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FCMToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicSubscription" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TopicSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "topic" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "url" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pushedAt" TIMESTAMP(3),
    "pushAttempts" INTEGER NOT NULL DEFAULT 0,
    "readAt" TIMESTAMP(3),
    "id" SERIAL NOT NULL,
    "referenceId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationResponse" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRead" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CCTagToCostCode" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CCTagToCostCode_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CCTagToJobsite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CCTagToJobsite_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CrewToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CrewToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentTagToEquipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentTagToEquipment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocumentTagToPdfDocument" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DocumentTagToPdfDocument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FormGroupingToFormTemplate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FormGroupingToFormTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CostCode_name_key" ON "CostCode"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CCTag_name_key" ON "CCTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PdfDocument_qrId_key" ON "PdfDocument"("qrId");

-- CreateIndex
CREATE INDEX "PdfDocument_qrId_idx" ON "PdfDocument"("qrId");

-- CreateIndex
CREATE INDEX "PdfDocument_fileName_idx" ON "PdfDocument"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_qrId_key" ON "Equipment"("qrId");

-- CreateIndex
CREATE INDEX "Equipment_qrId_idx" ON "Equipment"("qrId");

-- CreateIndex
CREATE INDEX "Equipment_status_idx" ON "Equipment"("status");

-- CreateIndex
CREATE INDEX "Equipment_approvalStatus_idx" ON "Equipment"("approvalStatus");

-- CreateIndex
CREATE INDEX "EmployeeEquipmentLog_timeSheetId_equipmentId_maintenanceId_idx" ON "EmployeeEquipmentLog"("timeSheetId", "equipmentId", "maintenanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Jobsite_qrId_key" ON "Jobsite"("qrId");

-- CreateIndex
CREATE INDEX "Jobsite_status_idx" ON "Jobsite"("status");

-- CreateIndex
CREATE INDEX "Jobsite_qrId_idx" ON "Jobsite"("qrId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_name_key" ON "Report"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Maintenance_employeeEquipmentLogId_key" ON "Maintenance"("employeeEquipmentLogId");

-- CreateIndex
CREATE UNIQUE INDEX "TascoMaterialTypes_name_key" ON "TascoMaterialTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RefuelLog_employeeEquipmentLogId_key" ON "RefuelLog"("employeeEquipmentLogId");

-- CreateIndex
CREATE INDEX "TimeSheetChangeLog_timeSheetId_idx" ON "TimeSheetChangeLog"("timeSheetId");

-- CreateIndex
CREATE INDEX "TimeSheetChangeLog_changedBy_idx" ON "TimeSheetChangeLog"("changedBy");

-- CreateIndex
CREATE INDEX "TimeSheetChangeLog_changedAt_idx" ON "TimeSheetChangeLog"("changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_username_key" ON "User"("firstName", "lastName", "username");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_employeeId_key" ON "Contacts"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "AccountSetupToken_userId_key" ON "AccountSetupToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_street_city_state_zipCode_key" ON "Address"("street", "city", "state", "zipCode");

-- CreateIndex
CREATE UNIQUE INDEX "FCMToken_token_key" ON "FCMToken"("token");

-- CreateIndex
CREATE INDEX "FCMToken_userId_idx" ON "FCMToken"("userId");

-- CreateIndex
CREATE INDEX "FCMToken_token_idx" ON "FCMToken"("token");

-- CreateIndex
CREATE INDEX "TopicSubscription_topic_idx" ON "TopicSubscription"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "TopicSubscription_userId_topic_key" ON "TopicSubscription"("userId", "topic");

-- CreateIndex
CREATE INDEX "Notification_topic_createdAt_referenceId_idx" ON "Notification"("topic", "createdAt", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationResponse_notificationId_key" ON "NotificationResponse"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationRead_notificationId_userId_key" ON "NotificationRead"("notificationId", "userId");

-- CreateIndex
CREATE INDEX "_CCTagToCostCode_B_index" ON "_CCTagToCostCode"("B");

-- CreateIndex
CREATE INDEX "_CCTagToJobsite_B_index" ON "_CCTagToJobsite"("B");

-- CreateIndex
CREATE INDEX "_CrewToUser_B_index" ON "_CrewToUser"("B");

-- CreateIndex
CREATE INDEX "_DocumentTagToEquipment_B_index" ON "_DocumentTagToEquipment"("B");

-- CreateIndex
CREATE INDEX "_DocumentTagToPdfDocument_B_index" ON "_DocumentTagToPdfDocument"("B");

-- CreateIndex
CREATE INDEX "_FormGroupingToFormTemplate_B_index" ON "_FormGroupingToFormTemplate"("B");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormTemplate" ADD CONSTRAINT "FormTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formGroupingId_fkey" FOREIGN KEY ("formGroupingId") REFERENCES "FormGrouping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormFieldOption" ADD CONSTRAINT "FormFieldOption_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "FormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApproval" ADD CONSTRAINT "FormApproval_formSubmissionId_fkey" FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApproval" ADD CONSTRAINT "FormApproval_signedBy_fkey" FOREIGN KEY ("signedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobsite" ADD CONSTRAINT "Jobsite_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobsite" ADD CONSTRAINT "Jobsite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMarker" ADD CONSTRAINT "LocationMarker_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportRun" ADD CONSTRAINT "ReportRun_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_costcode_fkey" FOREIGN KEY ("costcode") REFERENCES "CostCode"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_jobsiteId_fkey" FOREIGN KEY ("jobsiteId") REFERENCES "Jobsite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mechanicProjects" ADD CONSTRAINT "mechanicProjects_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mechanicProjects" ADD CONSTRAINT "mechanicProjects_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TascoLog" ADD CONSTRAINT "TascoLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TascoLog" ADD CONSTRAINT "TascoLog_materialType_fkey" FOREIGN KEY ("materialType") REFERENCES "TascoMaterialTypes"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TascoLog" ADD CONSTRAINT "TascoLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TascoFLoads" ADD CONSTRAINT "TascoFLoads_tascoLogId_fkey" FOREIGN KEY ("tascoLogId") REFERENCES "TascoLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckingLog" ADD CONSTRAINT "TruckingLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckingLog" ADD CONSTRAINT "TruckingLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckingLog" ADD CONSTRAINT "TruckingLog_trailerNumber_fkey" FOREIGN KEY ("trailerNumber") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckingLog" ADD CONSTRAINT "TruckingLog_truckNumber_fkey" FOREIGN KEY ("truckNumber") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateMileage" ADD CONSTRAINT "StateMileage_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefuelLog" ADD CONSTRAINT "RefuelLog_employeeEquipmentLogId_fkey" FOREIGN KEY ("employeeEquipmentLogId") REFERENCES "EmployeeEquipmentLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefuelLog" ADD CONSTRAINT "RefuelLog_tascoLogId_fkey" FOREIGN KEY ("tascoLogId") REFERENCES "TascoLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefuelLog" ADD CONSTRAINT "RefuelLog_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentHauled" ADD CONSTRAINT "EquipmentHauled_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentHauled" ADD CONSTRAINT "EquipmentHauled_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheetChangeLog" ADD CONSTRAINT "TimeSheetChangeLog_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheetChangeLog" ADD CONSTRAINT "TimeSheetChangeLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountSetupToken" ADD CONSTRAINT "AccountSetupToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FCMToken" ADD CONSTRAINT "FCMToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicSubscription" ADD CONSTRAINT "TopicSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationResponse" ADD CONSTRAINT "NotificationResponse_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationResponse" ADD CONSTRAINT "NotificationResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagToCostCode" ADD CONSTRAINT "_CCTagToCostCode_A_fkey" FOREIGN KEY ("A") REFERENCES "CCTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagToCostCode" ADD CONSTRAINT "_CCTagToCostCode_B_fkey" FOREIGN KEY ("B") REFERENCES "CostCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagToJobsite" ADD CONSTRAINT "_CCTagToJobsite_A_fkey" FOREIGN KEY ("A") REFERENCES "CCTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagToJobsite" ADD CONSTRAINT "_CCTagToJobsite_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrewToUser" ADD CONSTRAINT "_CrewToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrewToUser" ADD CONSTRAINT "_CrewToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTagToEquipment" ADD CONSTRAINT "_DocumentTagToEquipment_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTagToEquipment" ADD CONSTRAINT "_DocumentTagToEquipment_B_fkey" FOREIGN KEY ("B") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTagToPdfDocument" ADD CONSTRAINT "_DocumentTagToPdfDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTagToPdfDocument" ADD CONSTRAINT "_DocumentTagToPdfDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "PdfDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormGroupingToFormTemplate" ADD CONSTRAINT "_FormGroupingToFormTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "FormGrouping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormGroupingToFormTemplate" ADD CONSTRAINT "_FormGroupingToFormTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "FormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
