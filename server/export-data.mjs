// Simple script to trigger the data export
// Run with: node export-data.mjs

async function exportData() {
  try {
    console.log("Triggering data export...");
    
    const response = await fetch("http://localhost:3000/v1/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    
    if (result.success) {
      console.log("\n✅ Export successful!");
      console.log("\n📁 Files created:");
      console.log(`   Prisma Seed: ${result.files.prisma}`);
      console.log(`   JSON Export: ${result.files.json}`);
      console.log(`   SQL Export:  ${result.files.sql}`);
      console.log("\n📊 Metadata:");
      console.log(`   Total Records: ${result.metadata.totalRecords}`);
      console.log(`   Export Date: ${result.metadata.exportDate}`);
      console.log("\n📋 Record counts:");
      for (const [table, count] of Object.entries(result.metadata.recordCounts)) {
        console.log(`   ${table}: ${count} records`);
      }
    } else {
      console.error("❌ Export failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

exportData();
