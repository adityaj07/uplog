import { spawn } from "child_process";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDatabase() {
  const maxAttempts = 30;
  let attempts = 0;

  console.log("🔍 Waiting for database to be ready...");

  while (attempts < maxAttempts) {
    try {
      const result = await new Promise((resolve, reject) => {
        const child = spawn(
          "docker",
          ["exec", "uplog-postgres", "pg_isready", "-U", "postgres"],
          {
            stdio: "pipe",
          }
        );

        child.on("close", (code) => {
          resolve(code === 0);
        });

        child.on("error", reject);
      });

      if (result) {
        console.log("✅ Database is ready!");
        return;
      }
    } catch (error) {
      // Continue trying
    }

    attempts++;
    process.stdout.write(`   Attempt ${attempts}/${maxAttempts}...\r`);
    await sleep(2000);
  }

  throw new Error("❌ Database failed to become ready in time");
}

waitForDatabase().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
