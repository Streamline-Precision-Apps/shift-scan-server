// Test script to verify timesheet creation
const testPayload = {
  date: new Date().toISOString(),
  userId: "test-user-id",
  jobsiteId: "test-jobsite-id",
  costcode: "test-costcode",
  startTime: new Date().toISOString(),
  endTime: null,
  workType: "LABOR",
  comments: "Test comment",
  mechanicProjects: [],
  truckingLogs: [],
  tascoLogs: [],
  employeeEquipmentLogs: []
};

console.log("Testing timesheet creation with payload:");
console.log(JSON.stringify(testPayload, null, 2));

fetch("http://localhost:5000/api/v1/admins/timesheet", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testPayload),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("\n✅ Response received:");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
  });
