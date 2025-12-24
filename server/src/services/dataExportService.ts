import { PrismaClient } from "../../generated/prisma/index.js";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Define the tables we want to export
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

type TableName = (typeof TABLES_TO_EXPORT)[number];

interface ExportData {
  [key: string]: any[];
}

/**
 * Fetches all data from specified tables
 */
export async function fetchAllTableData(): Promise<ExportData> {
  const data: ExportData = {};

  try {
    // Fetch data from each table
    for (const tableName of TABLES_TO_EXPORT) {
      const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
      const prismaModel = (prisma as any)[modelName];

      if (prismaModel && typeof prismaModel.findMany === "function") {
        console.log(`Fetching data from ${tableName}...`);
        const records = await prismaModel.findMany();
        data[tableName] = records;
        console.log(`✓ Fetched ${records.length} records from ${tableName}`);
      } else {
        console.warn(`⚠ Could not find model for ${tableName}`);
        data[tableName] = [];
      }
    }

    return data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
}

/**
 * Generates a TypeScript seed file for Prisma
 */
export async function generatePrismaSeedFile(data: ExportData): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `seed-${timestamp}.ts`;
  const filepath = path.join(process.cwd(), "prisma", "seeds", filename);

  // Ensure the seeds directory exists
  await fs.mkdir(path.join(process.cwd(), "prisma", "seeds"), { recursive: true });

  let seedContent = `import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  try {
`;

  // Generate seed code for each table
  for (const tableName of TABLES_TO_EXPORT) {
    const records = data[tableName];
    if (!records || records.length === 0) {
      seedContent += `    // No data for ${tableName}\n\n`;
      continue;
    }

    const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);

    seedContent += `    // Seed ${tableName}\n`;
    seedContent += `    console.log("Seeding ${tableName}...");\n`;
    seedContent += `    for (const record of ${JSON.stringify(records, null, 2)}) {\n`;
    seedContent += `      await prisma.${modelName}.upsert({\n`;
    seedContent += `        where: { id: record.id },\n`;
    seedContent += `        update: record,\n`;
    seedContent += `        create: record,\n`;
    seedContent += `      });\n`;
    seedContent += `    }\n`;
    seedContent += `    console.log(\`✓ Seeded \${${JSON.stringify(records, null, 2)}.length} records in ${tableName}\`);\n\n`;
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

  await fs.writeFile(filepath, seedContent, "utf-8");
  console.log(`✓ Prisma seed file generated: ${filepath}`);

  return filepath;
}

/**
 * Generates a JSON export file
 */
export async function generateJsonExportFile(data: ExportData): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `export-${timestamp}.json`;
  const filepath = path.join(process.cwd(), "prisma", "exports", filename);

  // Ensure the exports directory exists
  await fs.mkdir(path.join(process.cwd(), "prisma", "exports"), { recursive: true });

  const exportData = {
    exportDate: new Date().toISOString(),
    tables: TABLES_TO_EXPORT,
    data,
    metadata: {
      totalRecords: Object.values(data).reduce((sum, records) => sum + records.length, 0),
      tableCount: TABLES_TO_EXPORT.length,
    },
  };

  await fs.writeFile(filepath, JSON.stringify(exportData, null, 2), "utf-8");
  console.log(`✓ JSON export file generated: ${filepath}`);

  return filepath;
}

/**
 * Generates a SQL export file
 */
export async function generateSqlExportFile(data: ExportData): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `export-${timestamp}.sql`;
  const filepath = path.join(process.cwd(), "prisma", "exports", filename);

  // Ensure the exports directory exists
  await fs.mkdir(path.join(process.cwd(), "prisma", "exports"), { recursive: true });

  let sqlContent = `-- Database Export Generated: ${new Date().toISOString()}\n`;
  sqlContent += `-- Tables exported: ${TABLES_TO_EXPORT.join(", ")}\n\n`;
  sqlContent += `-- WARNING: Review and test this SQL before running in production!\n\n`;

  // Generate SQL for each table
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
          // Escape single quotes in strings
          return `'${value.replace(/'/g, "''")}'`;
        } else if (typeof value === "boolean") {
          return value ? "TRUE" : "FALSE";
        } else if (value instanceof Date) {
          return `'${value.toISOString()}'`;
        } else if (typeof value === "object") {
          // Handle JSON/JSONB columns
          return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        } else {
          return String(value);
        }
      });

      sqlContent += `INSERT INTO "${tableName}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${values.join(", ")}) ON CONFLICT (id) DO UPDATE SET ${columns.map((c) => `"${c}" = EXCLUDED."${c}"`).join(", ")};\n`;
    }

    sqlContent += `\n`;
  }

  await fs.writeFile(filepath, sqlContent, "utf-8");
  console.log(`✓ SQL export file generated: ${filepath}`);

  return filepath;
}

/**
 * Main export function that generates all three formats
 */
export async function exportAllFormats(): Promise<{
  success: boolean;
  files: {
    prisma: string;
    json: string;
    sql: string;
  };
  metadata: {
    exportDate: string;
    tables: typeof TABLES_TO_EXPORT;
    recordCounts: Record<string, number>;
    totalRecords: number;
  };
}> {
  try {
    console.log("Starting data export...");

    // Fetch all data
    const data = await fetchAllTableData();

    // Generate all three export formats in parallel
    const [prismaFile, jsonFile, sqlFile] = await Promise.all([
      generatePrismaSeedFile(data),
      generateJsonExportFile(data),
      generateSqlExportFile(data),
    ]);

    const recordCounts = Object.entries(data).reduce(
      (acc, [table, records]) => {
        acc[table] = records.length;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalRecords = Object.values(data).reduce(
      (sum, records) => sum + records.length,
      0
    );

    console.log("✓ All export formats generated successfully!");

    return {
      success: true,
      files: {
        prisma: prismaFile,
        json: jsonFile,
        sql: sqlFile,
      },
      metadata: {
        exportDate: new Date().toISOString(),
        tables: TABLES_TO_EXPORT,
        recordCounts,
        totalRecords,
      },
    };
  } catch (error) {
    console.error("Error during export:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
