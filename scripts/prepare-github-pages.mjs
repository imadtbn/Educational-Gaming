import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const buildRoot = resolve(projectRoot, "dist/public");
const outputRoot = "/home/ubuntu/webdev-static-assets/github-pages-site";
const assetList = "/home/ubuntu/webdev-static-assets/pages-asset-paths.txt";
const pagesBase = "/Educational-Gaming";

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await cp(buildRoot, outputRoot, { recursive: true });
await mkdir(`${outputRoot}/media`, { recursive: true });

const paths = (await readFile(assetList, "utf8"))
  .split("\n")
  .map((path) => path.trim())
  .filter(Boolean);
const replacements = new Map();

for (const assetPath of paths) {
  const response = await fetch(`http://localhost:3000${assetPath}`);
  if (!response.ok) throw new Error(`Could not download ${assetPath}: ${response.status}`);
  const name = basename(assetPath);
  await writeFile(`${outputRoot}/media/${name}`, Buffer.from(await response.arrayBuffer()));
  replacements.set(assetPath, `${pagesBase}/media/${name}`);
}

async function rewrite(directory) {
  const { readdir } = await import("node:fs/promises");
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await rewrite(filePath);
    else if (/\.(html|js|css|json|webmanifest|xml)$/i.test(entry.name)) {
      let content = await readFile(filePath, "utf8");
      for (const [from, to] of replacements) content = content.split(from).join(to);
      content = content.split('"/__manus__/').join(`"${pagesBase}/__manus__/`);
      if (entry.name === "manifest.webmanifest") {
        content = content.split("https://educational-gaming.manus.space/").join("https://imadtbn.github.io/Educational-Gaming/");
      }
      if (entry.name === "index.html") content = content.split("https://educational-gaming.manus.space/").join("https://imadtbn.github.io/Educational-Gaming/");
      await writeFile(filePath, content);
    }
  }
}

await rewrite(outputRoot);
const indexHtml = await readFile(`${outputRoot}/index.html`, "utf8");
const stationRoutes = ["arabic", "english", "animals", "numbers", "writing", "games"];

for (const route of stationRoutes) {
  await mkdir(`${outputRoot}/${route}`, { recursive: true });
  await writeFile(`${outputRoot}/${route}/index.html`, indexHtml);
}

await writeFile(`${outputRoot}/404.html`, indexHtml);
await writeFile(`${outputRoot}/.nojekyll`, "");
console.log(`github-pages-static-ready: ${paths.length} local assets, ${stationRoutes.length} route fallbacks`);
