import { readFile, writeFile, access, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EnvVar {
  key: string;
  value: string;
  description?: string;
}

const parseEnv = (content: string): EnvVar[] => {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const equalIndex = line.indexOf("=");
      if (equalIndex === -1) return null;

      const key = line.slice(0, equalIndex).trim();
      let value = line.slice(equalIndex + 1).trim();

      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      return { key, value };
    })
    .filter((entry): entry is EnvVar => entry !== null);
};

const runCommand = (command: string, args: string[], cwd?: string) => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      cwd,
    });

    child.once("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
    child.once("error", reject);
  });
};

async function setupEnvironment() {
  const projectRoot = process.cwd();

  try {
    console.log("🚀 Setting up centralized environment management...");

    // 1. Check if .env.example exists
    const examplePath = join(projectRoot, ".env.example");
    let exampleContent = "";

    try {
      exampleContent = await readFile(examplePath, "utf8");
    } catch {
      console.log("⚠️  No root .env.example found, will create one");
      exampleContent = ""; // Will be populated from app examples
    }

    const exampleVars = parseEnv(exampleContent);

    // 2. Collect environment variables from all app .env.example files
    const appPaths = [
      "apps/web",
      "apps/server", // Fixed: was "apps/api"
    ];

    const allEnvVars = new Map<string, EnvVar>();

    // Add existing root variables
    exampleVars.forEach((variable) => {
      allEnvVars.set(variable.key, variable);
    });

    console.log("📁 Collecting environment variables from apps...");

    // Collect from app .env.example files
    for (const appPath of appPaths) {
      const appExamplePath = join(projectRoot, appPath, ".env.example");

      try {
        const appContent = await readFile(appExamplePath, "utf8");
        const appVars = parseEnv(appContent);

        appVars.forEach((variable) => {
          if (!allEnvVars.has(variable.key)) {
            allEnvVars.set(variable.key, variable);
            console.log(`   ✅ Found ${variable.key} in ${appPath}`);
          }
        });
      } catch {
        console.log(`   ⚠️  No .env.example found in ${appPath}`);
      }
    }

    // Add default variables that are commonly needed
    const defaultVars: EnvVar[] = [
      { key: "NODE_ENV", value: "development" },
      {
        key: "DATABASE_URL",
        value: "postgresql://postgres:password@localhost:5432/convo",
      },
      {
        key: "DATABASE_URL_POOLER",
        value: "postgresql://postgres:password@localhost:5432/convo",
      },
      { key: "CORS_ORIGIN", value: "http://localhost:3001" },
      {
        key: "BETTER_AUTH_SECRET",
        value: "your-secret-key-min-32-characters-long",
      },
      { key: "BETTER_AUTH_URL", value: "http://localhost:3000" },
      { key: "REDIS_URL", value: "redis://localhost:6379" },
      { key: "NEXT_PUBLIC_SERVER_URL", value: "http://localhost:3000" },
    ];

    defaultVars.forEach((variable) => {
      if (!allEnvVars.has(variable.key)) {
        allEnvVars.set(variable.key, variable);
        console.log(`   ✅ Added default variable ${variable.key}`);
      }
    });

    // 3. Update root .env.example if it's missing variables
    if (allEnvVars.size > exampleVars.length) {
      const newExampleContent = Array.from(allEnvVars.values())
        .map((v) => `${v.key}=${v.value}`)
        .join("\n");

      await writeFile(examplePath, newExampleContent);
      console.log("✅ Updated root .env.example with all variables");
    }

    // 4. Check current .env
    const envPath = join(projectRoot, ".env");
    let currentVars: EnvVar[] = [];

    try {
      const currentContent = await readFile(envPath, "utf8");
      currentVars = parseEnv(currentContent);
    } catch {
      console.log("📝 No root .env file found, creating one");
    }

    // 5. Find missing variables
    const missingVars = Array.from(allEnvVars.values()).filter(
      (example) => !currentVars.find((current) => current.key === example.key)
    );

    if (missingVars.length > 0) {
      console.log("\n🔧 Missing environment variables:");
      missingVars.forEach((v) => console.log(`   ${v.key}=${v.value}`));

      // Add missing variables with example values
      const updatedVars = [...currentVars, ...missingVars];
      const envContent = updatedVars
        .map((v) => `${v.key}="${v.value}"`)
        .join("\n");

      await writeFile(envPath, envContent);
      console.log("✅ Updated root .env file with missing variables");
    }

    // 6. Sync to apps
    console.log("\n📁 Syncing environment files to apps...");

    for (const appPath of appPaths) {
      const fullAppPath = join(projectRoot, appPath);

      try {
        await access(fullAppPath);

        // Copy .env to different formats based on the app type
        if (appPath.includes("web")) {
          // Next.js app - copy as .env.local
          await writeFile(
            join(fullAppPath, ".env.local"),
            await readFile(envPath)
          );
          console.log(`   ✅ Synced to ${appPath}/.env.local`);
        } else if (appPath.includes("server")) {
          // Cloudflare app - copy as .dev.vars and .env.local
          await writeFile(
            join(fullAppPath, ".dev.vars"),
            await readFile(envPath)
          );
          await writeFile(
            join(fullAppPath, ".env.local"),
            await readFile(envPath)
          );
          console.log(`   ✅ Synced to ${appPath}/.dev.vars and .env.local`);
        }
      } catch {
        console.log(`   ⚠️  Skipped ${appPath} (directory doesn't exist)`);
      }
    }

    // 7. Generate TypeScript types
    console.log("\n🔄 Generating TypeScript environment types...");

    const currentEnvVars = parseEnv(await readFile(envPath, "utf8"));
    const envTypes = generateEnvTypes(currentEnvVars);

    // Ensure types directory exists
    const typesDir = join(projectRoot, "types");
    try {
      await mkdir(typesDir, { recursive: true });
    } catch {
      // Directory already exists
    }

    // Save types file
    await writeFile(join(typesDir, "env.d.ts"), envTypes);
    console.log("   ✅ Generated types/env.d.ts");

    // 8. Run type generation for apps if they have type scripts
    for (const appPath of appPaths) {
      const packageJsonPath = join(projectRoot, appPath, "package.json");
      try {
        const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
        if (packageJson.scripts?.["cf-typegen"]) {
          console.log(`   🔄 Running type generation for ${appPath}...`);
          await runCommand(
            "pnpm",
            ["run", "cf-typegen"],
            join(projectRoot, appPath)
          );
        }
      } catch {
        // Skip if no package.json or cf-typegen script
      }
    }

    console.log("\n🎉 Environment setup complete!");
    console.log("\n📋 Next steps:");
    console.log("   1. Review and update values in .env");
    console.log("   2. Run 'pnpm dev' to start development");
    console.log("   3. Use 'pnpm env:sync' to sync changes");
  } catch (error) {
    console.error("❌ Error setting up environment:", error);
    process.exit(1);
  }
}

function generateEnvTypes(vars: EnvVar[]): string {
  const declarations = vars.map((v) => `    ${v.key}: string;`).join("\n");

  return `// Auto-generated environment types
// This file is generated by scripts/env-manager.ts
// Do not edit manually - run 'pnpm env:setup' to regenerate

declare namespace NodeJS {
  interface ProcessEnv {
${declarations}
  }
}

export {};
`;
}

// Run the setup function
setupEnvironment().catch(console.error);

export { setupEnvironment, parseEnv };
