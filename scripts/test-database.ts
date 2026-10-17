import "dotenv/config";
import { prisma } from "../src/lib/db";

async function testDatabase() {
  console.log("🔍 Testing Prisma Postgres connection...\n");

  try {
    // Test 1: Check connection by fetching users
    console.log("✅ Connected to database!");

    // Test 2: Fetch all users
    console.log("\n📋 Fetching all users...");
    const allUsers = await prisma.user.findMany();
    console.log(`✅ Found ${allUsers.length} user(s):`);
    allUsers.forEach((user) => {
      console.log(`   - ${user.name ?? "No name"} (${user.email})`);
    });

    // Test 3: Count courses and orders
    const courseCount = await prisma.course.count();
    console.log(`\n📚 Total courses in DB: ${courseCount}`);
    const orderCount = await prisma.order.count();
    console.log(`📦 Total orders in DB: ${orderCount}`);

    // Test 4: Count enrollments (course access)
    const accessCount = await prisma.enrollment.count();
    console.log(`🎓 Total enrollments: ${accessCount}`);

    console.log("\n🎉 All tests passed! Your database is working perfectly.\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
