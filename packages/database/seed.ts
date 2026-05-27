import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { formsTable } from "./models/form";
import { formFieldsTable } from "./models/form-field";
import { formSubmissionTable } from "./models/form-submission";
import pg from "pg";
import { env } from "./env";

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log("🚀 Starting database seeding...");

  // 1. Clear existing submissions and fields
  console.log("🧹 Cleaning old seed data...");
  await db.delete(formSubmissionTable);
  await db.delete(formFieldsTable);
  await db.delete(formsTable);

  const demoUserId = "user_demo_creator_12345";

  // 2. Create the first Form: "Cyberpunk Hackathon Feedback"
  console.log("📝 Seeding first form...");
  const [form1] = await db
    .insert(formsTable)
    .values({
      title: "Cyberpunk Hackathon 2026 Feedback",
      description: "Gathering telemetry on performance, aesthetics, and cybernetic augmentations from the 2026 hackathon attendees.",
      createdBy: demoUserId,
      published: true,
      visibility: "PUBLIC",
      slug: "cyberpunk-hackathon-2026",
    })
    .returning();

  if (!form1) throw new Error("Failed to insert form1");

  console.log("⚡ Seeding fields for form1...");
  const fieldsForm1 = [
    {
      label: "Hacker Codename",
      labelKey: "hacker_codename",
      description: "Enter your handle or alias.",
      placeholder: "e.g., Neuromancer",
      isRequired: true,
      type: "TEXT" as const,
      index: "1.00",
      formId: form1.id,
    },
    {
      label: "Secure Comm Email",
      labelKey: "secure_email",
      description: "Encrypted communications channel.",
      placeholder: "alias@matrix.net",
      isRequired: true,
      type: "EMAIL" as const,
      index: "2.00",
      formId: form1.id,
    },
    {
      label: "Years in the Grid",
      labelKey: "grid_years",
      placeholder: "e.g., 5",
      isRequired: false,
      type: "NUMBER" as const,
      index: "3.00",
      formId: form1.id,
    },
    {
      label: "Primary Implant Vendor",
      labelKey: "implant_vendor",
      description: "Select your primary hardware augmentations vendor.",
      placeholder: "Choose a vendor...",
      isRequired: true,
      type: "SELECT" as const,
      choices: ["Hosaka Corp", "Chiba City Augments", "Tessier-Ashpool", "Ono-Sendai"],
      index: "4.00",
      formId: form1.id,
    },
    {
      label: "Bypass Firewalls Safe?",
      labelKey: "bypass_safe",
      description: "Do you feel safe bypassing grid firewalls during icebreaks?",
      isRequired: false,
      type: "YES_NO" as const,
      index: "5.00",
      formId: form1.id,
    },
  ];

  const seededFields = [];
  for (const field of fieldsForm1) {
    const [inserted] = await db.insert(formFieldsTable).values(field).returning();
    seededFields.push(inserted);
  }

  // 3. Create the second Form: "Startup Landing Page Survey" (Unlisted for testing)
  console.log("📝 Seeding second form (UNLISTED)...");
  const [form2] = await db
    .insert(formsTable)
    .values({
      title: "MiraiForms Feedback Survey",
      description: "Private feedback survey regarding our brutalist SaaS forms engine layout.",
      createdBy: demoUserId,
      published: true,
      visibility: "UNLISTED",
      slug: "miraiforms-private-survey",
    })
    .returning();

  if (!form2) throw new Error("Failed to insert form2");

  console.log("⚡ Seeding fields for form2...");
  const fieldsForm2 = [
    {
      label: "What is your main role?",
      labelKey: "main_role",
      isRequired: true,
      type: "SELECT" as const,
      choices: ["Engineer", "Designer", "Product Manager", "Founder"],
      index: "1.00",
      formId: form2.id,
    },
    {
      label: "How would you rate the cyber-brutalist theme?",
      labelKey: "theme_rating",
      placeholder: "1-10",
      isRequired: true,
      type: "NUMBER" as const,
      index: "2.00",
      formId: form2.id,
    },
  ];

  for (const field of fieldsForm2) {
    await db.insert(formFieldsTable).values(field);
  }

  // 4. Seed realistic submissions for form1
  console.log("📊 Seeding submissions and telemetry for form1...");
  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", // Chrome Mac
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1", // Safari iOS
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0", // Firefox Win
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36", // Chrome Android
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15", // Safari Mac
  ];

  const codenames = ["ZeroCool", "AcidBurn", "CerealKiller", "LordNikon", "CrashOverride", "Plague", "PhantomPhreak", "Kibo", "Gort", "H4ck3r1"];
  const vendors = ["Hosaka Corp", "Chiba City Augments", "Tessier-Ashpool", "Ono-Sendai"];
  
  // Create submissions over the last 7 days to make the analytics look incredible
  const now = new Date();
  const submissionData = [];

  for (let i = 0; i < 35; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    // Random hour/minutes
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    const ua = userAgents[Math.floor(Math.random() * userAgents.length)]!;
    const completionTime = Math.floor(Math.random() * 180) + 30; // 30s to 210s
    const ip = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;

    const codename = codenames[Math.floor(Math.random() * codenames.length)]!;
    const email = `${codename.toLowerCase()}@${["matrix.net", "grid.io", "ono-sendai.com", "gmail.com"][Math.floor(Math.random() * 4)]}`;
    const years = Math.floor(Math.random() * 12) + 1;
    const vendor = vendors[Math.floor(Math.random() * vendors.length)]!;
    const bypass = Math.random() > 0.3 ? "true" : "false";

    // Build values based on actual seeded field IDs
    const responses = [
      { formFieldId: seededFields[0]!.id, value: codename },
      { formFieldId: seededFields[1]!.id, value: email },
      { formFieldId: seededFields[2]!.id, value: String(years) },
      { formFieldId: seededFields[3]!.id, value: vendor },
      { formFieldId: seededFields[4]!.id, value: bypass },
    ];

    submissionData.push({
      formId: form1.id,
      responses,
      metadata: {
        ip,
        userAgent: ua,
        completionTime,
      },
      createdAt: date,
    });
  }

  // Insert submissions
  for (const sub of submissionData) {
    await db.insert(formSubmissionTable).values(sub);
  }

  console.log(`✅ Successfully seeded database!`);
  console.log(`🌐 Public Form URL: /f/${form1.slug}`);
  console.log(`🔒 Private Form URL: /f/${form2.slug}`);
  console.log(`📊 Total Seeded Submissions: ${submissionData.length}`);
  
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
