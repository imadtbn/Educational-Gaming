import { readFileSync } from "node:fs";

const page = readFileSync("client/public/offline.html", "utf8");
for (const marker of ["class=\"star\"", "id=\"score\"", "id=\"reward\"", "لعبة جديدة"]) {
  if (!page.includes(marker)) throw new Error(`Missing offline game marker: ${marker}`);
}
const script = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error("Offline game script not found");
new Function(script);
console.log("offline-game-valid");
