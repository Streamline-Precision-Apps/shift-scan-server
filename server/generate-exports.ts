// Standalone script to export database data without needing the API
// Run with: npx tsx generate-exports.ts

import { PrismaClient } from "./generated/prisma/index.js";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

const TABLES_TO_EXPORT = [
  "Company",
  "CostCode",
  "CCTag",
  "Crew",
  "Equipment",
  "FormTemplate",
  "FormGrouping",
  "FormField",
  "FormFieldOption",
  "Jobsite",
  "Material",
  "User",
  "UserSettings",
  "Contacts",
] as const;

async function main() {
  console.log("🚀 Starting data export...\n");

  const data: Record<string, any[]> = {};

  // Fetch data from each table
  for (const tableName of TABLES_TO_EXPORT) {
    const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
    const prismaModel = (prisma as any)[modelName];

    if (prismaModel && typeof prismaModel.findMany === "function") {
      console.log(`📥 Fetching data from ${tableName}...`);
      const records = await prismaModel.findMany();
      data[tableName] = records;
      console.log(`✓ Fetched ${records.length} records from ${tableName}`);
    } else {
      console.warn(`⚠ Could not find model for ${tableName}`);
      data[tableName] = [];
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  // Create directories
  await fs.mkdir(path.join(process.cwd(), "prisma", "seeds"), {
    recursive: true,
  });
  await fs.mkdir(path.join(process.cwd(), "prisma", "exports"), {
    recursive: true,
  });

  console.log("\n📝 Generating export files...\n");

  // 1. Generate TypeScript Seed File
  const seedFilename = `seed-${timestamp}.ts`;
  const seedFilepath = path.join(
    process.cwd(),
    "prisma",
    "seeds",
    seedFilename
  );

  let seedContent = `import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  try {
`;

  for (const tableName of TABLES_TO_EXPORT) {
    const records = data[tableName];
    if (!records || records.length === 0) {
      seedContent += `    // No data for ${tableName}\n\n`;
      continue;
    }

    const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);

    seedContent += `    // Seed ${tableName}\n`;
    seedContent += `    console.log("Seeding ${tableName}...");\n`;
    seedContent += `    const ${modelName}Data = ${JSON.stringify(
      records,
      null,
      2
    )};\n`;
    seedContent += `    for (const record of ${modelName}Data) {\n`;
    seedContent += `      await prisma.${modelName}.upsert({\n`;
    seedContent += `        where: { id: record.id },\n`;
    seedContent += `        update: record,\n`;
    seedContent += `        create: record,\n`;
    seedContent += `      });\n`;
    seedContent += `    }\n`;
    seedContent += `    console.log(\`✓ Seeded \${${modelName}Data.length} records in ${tableName}\`);\n\n`;
  }

  seedContent += `    console.log("✓ Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
`;

  await fs.writeFile(seedFilepath, seedContent, "utf-8");
  console.log(`✅ Prisma seed file: ${seedFilepath}`);

  // 2. Generate JSON Export
  const jsonFilename = `export-${timestamp}.json`;
  const jsonFilepath = path.join(
    process.cwd(),
    "prisma",
    "exports",
    jsonFilename
  );

  const exportData = {
    exportDate: new Date().toISOString(),
    tables: TABLES_TO_EXPORT,
    data,
    metadata: {
      totalRecords: Object.values(data).reduce(
        (sum, records) => sum + records.length,
        0
      ),
      tableCount: TABLES_TO_EXPORT.length,
    },
  };

  await fs.writeFile(jsonFilepath, JSON.stringify(exportData, null, 2), "utf-8");
  console.log(`✅ JSON export file: ${jsonFilepath}`);

  // 3. Generate SQL Export
  const sqlFilename = `export-${timestamp}.sql`;
  const sqlFilepath = path.join(
    process.cwd(),
    "prisma",
    "exports",
    sqlFilename
  );

  let sqlContent = `-- Database Export Generated: ${new Date().toISOString()}\n`;
  sqlContent += `-- Tables exported: ${TABLES_TO_EXPORT.join(", ")}\n\n`;
  sqlContent += `-- WARNING: Review and test this SQL before running in production!\n\n`;

  for (const tableName of TABLES_TO_EXPORT) {
    const records = data[tableName];
    if (!records || records.length === 0) {
      sqlContent += `-- No data for ${tableName}\n\n`;
      continue;
    }

    sqlContent += `-- Inserting data into ${tableName}\n`;

    for (const record of records) {
      const columns = Object.keys(record);
      const values = columns.map((col) => {
        const value = record[col];

        if (value === null || value === undefined) {
          return "NULL";
        } else if (typeof value === "string") {
          return `'${value.replace(/'/g, "''")}'`;
        } else if (typeof value === "boolean") {
          return value ? "TRUE" : "FALSE";
        } else if (value instanceof Date) {
          return `'${value.toISOString()}'`;
        } else if (typeof value === "object") {
          return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        } else {
          return String(value);
        }
      });

      sqlContent += `INSERT INTO "${tableName}" (${columns
        .map((c) => `"${c}"`)
        .join(", ")}) VALUES (${values.join(
        ", "
      )}) ON CONFLICT (id) DO UPDATE SET ${columns
        .map((c) => `"${c}" = EXCLUDED."${c}"`)
        .join(", ")};\n`;
    }

    sqlContent += `\n`;
  }

  await fs.writeFile(sqlFilepath, sqlContent, "utf-8");
  console.log(`✅ SQL export file: ${sqlFilepath}`);

  const totalRecords = Object.values(data).reduce(
    (sum, records) => sum + records.length,
    0
  );

  console.log("\n📊 Export Summary:");
  console.log(`   Total Records: ${totalRecords}`);
  console.log(`   Tables Exported: ${TABLES_TO_EXPORT.length}`);
  console.log("\n📋 Record Counts:");
  for (const [table, records] of Object.entries(data)) {
    console.log(`   ${table}: ${records.length} records`);
  }

  console.log("\n✅ All exports completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Export failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
