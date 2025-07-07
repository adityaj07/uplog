import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { extname, join, relative } from "path";

const SRC_FOLDER = "src";
const DIST_FOLDER = "dist";

function log(msg: string) {
  console.log(`[generate-exports] ${msg}`);
}

function getExportableFiles(dir: string, root: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getExportableFiles(fullPath, root));
    } else if (
      entry.isFile() &&
      extname(entry.name) === ".ts" &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.startsWith("_")
    ) {
      const relativePath = fullPath
        .replace(join(root, SRC_FOLDER) + "/", "")
        .replace(/\.ts$/, "");
      files.push(relativePath); // e.g. auth/login or auth/index
    }
  }

  return files;
}

function generateExports(files: string[]): Record<string, any> {
  const base = {
    ".": {
      types: `./${DIST_FOLDER}/index.d.ts`,
      import: `./${DIST_FOLDER}/index.js`,
    },
  };

  const exports: Record<string, any> = { ...base };

  for (const file of files) {
    exports[`./${file}`] = {
      types: `./${DIST_FOLDER}/${file}.d.ts`,
      import: `./${DIST_FOLDER}/${file}.js`,
    };

    // Also support folder-level exports if it's an index.ts (e.g. ./auth instead of ./auth/index)
    const parts = file.split("/");
    if (parts[parts.length - 1] === "index") {
      const folderPath = parts.slice(0, -1).join("/");
      if (folderPath) {
        exports[`./${folderPath}`] = {
          types: `./${DIST_FOLDER}/${folderPath}/index.d.ts`,
          import: `./${DIST_FOLDER}/${folderPath}/index.js`,
        };
      }
    }
  }

  return exports;
}

function updatePackageJson(pkgDir: string) {
  const pkgPath = join(pkgDir, "package.json");
  let pkg: any;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch (err) {
    throw new Error(`Could not read package.json in ${pkgDir}`);
  }

  const srcPath = join(pkgDir, SRC_FOLDER);
  if (!statSync(srcPath).isDirectory()) {
    throw new Error(`Missing src/ folder in ${pkgDir}`);
  }

  const files = getExportableFiles(srcPath, pkgDir);
  const exportsField = generateExports(files);
  pkg.exports = exportsField;

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  log(`✅ Updated exports in ${relative(process.cwd(), pkgPath)}`);
}

const targetPkg = process.argv[2];

if (!targetPkg) {
  console.error("❌ Please provide a package path: e.g. `packages/schemas`");
  process.exit(1);
}

try {
  updatePackageJson(targetPkg);
} catch (err) {
  console.error(`❌ Failed to generate exports: ${(err as Error).message}`);
  process.exit(1);
}
