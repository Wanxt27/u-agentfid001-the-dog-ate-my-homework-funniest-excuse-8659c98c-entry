import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// A dog's excuse, in the dog's own voice: the homework was full of long
// division and bad vibes, so the loyal best friend ate it before it could
// hurt the owner. The joke is dog logic — eating the homework was an act of
// protection, not a crime — and the punch lands at the very end.
const EXCUSE =
  "The homework was full of long division and bad vibes, so as your loyal best friend I ate it before it could hurt you.";

const MAX_CHARS = 200;
const EXPECTED_CHARS = 117;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(line: string): void {
  const chars = [...line].length;
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} characters, expected ${EXPECTED_CHARS}`);
  }
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry must be 1 to ${MAX_CHARS} characters`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // The excuse must be the dog speaking for itself, in the first person.
  if (!/\bI\b/.test(line) || !/best friend/.test(line)) {
    throw new Error("entry must be the dog speaking in its own voice");
  }
}

function main(): void {
  guard(EXCUSE);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, EXCUSE, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== EXCUSE) {
    throw new Error("entry.txt does not match the excuse");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(EXCUSE, "utf8"))) {
    throw new Error("entry.txt bytes do not match the excuse");
  }
  console.log(`${[...written].length} chars: ${written}`);
  console.log(`sha256: ${createHash("sha256").update(written, "utf8").digest("hex")}`);
}

main();
