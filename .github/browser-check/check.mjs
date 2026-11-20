// Opens the live demo pages in headless Chromium (desktop and phone sizes), asks questions and prints
// what a visitor would see. Fails if a page errors or no answer appears.
import { chromium, devices } from "playwright";

const BASE = "https://exotic-siddharth.github.io";
let failed = false;

async function ragEvalLab(name, contextOptions) {
  const browser = await chromium.launch();
  const page = await (await browser.newContext(contextOptions)).newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${BASE}/rag-eval-lab/`);
  await page.waitForSelector(".ex", { timeout: 30000 });
  for (const [i, q] of ["In what country is Normandy located?", "Which country holds the majority of the Amazon rainforest?"].entries()) {
    const t0 = Date.now();
    await page.fill("#q", q);
    await page.click("#go");
    await page.waitForFunction(() => !document.getElementById("go").disabled && document.querySelector("#answerbox .answer"), null, { timeout: 240000 });
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    const answer = await page.innerText("#answerbox .answer");
    const timing = await page.innerText("#answerbox .timing");
    const top = await page.innerText("#passages .passage .phead b").catch(() => "(none)");
    console.log(`[${name}] ${i === 0 ? "first question (downloads models)" : "second question (models cached)"}: ${secs} s`);
    console.log(`   Q: ${q}\n   A: ${answer}\n   top passage: ${top}\n   ${timing.replace(/\n/g, " | ")}`);
  }
  await page.screenshot({ path: `rag-${name}.png` });
  if (errors.length) { failed = true; console.log(`[${name}] page errors:`, errors); }
  await browser.close();
}

async function fakeNews(name, contextOptions) {
  const browser = await chromium.launch();
  const page = await (await browser.newContext(contextOptions)).newPage();
  await page.goto(`${BASE}/fake-news/`);
  await page.waitForFunction(() => document.getElementById("status").textContent.includes("ready"), null, { timeout: 30000 });
  await page.click("[data-ex=clickbait]");
  console.log(`[${name}] fake-news clickbait example -> ${await page.innerText("#verdict")} (${await page.innerText("#confidence")})`);
  await browser.close();
}

for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 900 } }], ["phone", devices["Pixel 7"]]]) {
  try { await ragEvalLab(name, opts); await fakeNews(name, opts); }
  catch (e) { failed = true; console.log(`[${name}] FAILED: ${e.message}`); }
}
process.exit(failed ? 1 : 0);
