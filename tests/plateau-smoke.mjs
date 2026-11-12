// Start the static Vite preview first. Playwright is supplied externally.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.TEST_BASE_URL || "http://localhost:4173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
let published = {
  format: "fia-plateau",
  version: 1,
  activeId: null,
  scenes: [],
};
try {
  const mjContext = await browser.newContext({
    serviceWorkers: "block",
    acceptDownloads: true,
  });
  const playerContext = await browser.newContext({ serviceWorkers: "block" });
  const errors = [],
    apiRequests = [];
  for (const context of [mjContext, playerContext]) {
    await context.route("**/CyberpunkApp/plateau.json?*", (route) =>
      route.fulfill({ json: published }),
    );
    context.on("request", (req) => {
      if (req.url().includes("/api/")) apiRequests.push(req.url());
    });
  }
  const mj = await mjContext.newPage(),
    player = await playerContext.newPage();
  for (const page of [mj, player]) {
    page.setDefaultTimeout(10000);
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + "/CyberpunkApp/");
  }
  await mj.locator('[data-profile="mj"]').click();
  await mj.locator('[data-mj-tab="plateau"]').click();
  await player.locator('[data-profile="j1"]').click();
  await player.locator('[data-tab="plateau"]').click();
  await player
    .getByText("Aucun lieu à afficher pour le moment.", { exact: true })
    .waitFor();
  async function add(name, included) {
    await mj.locator("[data-new-scene]").click();
    await mj.locator('[name="name"]').fill(name);
    await mj.locator('[name="description"]').fill("Description visible");
    await mj.locator('[name="notes"]').fill("SECRET MJ");
    await mj.locator('[name="map"]').fill("/CyberpunkApp/fia-logo.svg");
    await mj.locator('[name="music"]').fill("https://example.org/music.mp3");
    await mj.locator('[name="video"]').fill("https://example.org/video.mp4");
    await mj.locator('[name="included"]').setChecked(included);
    await mj.locator("[data-scene-form] button.primary").click();
  }
  await add("Afterlife <test>", true);
  await add("Lieu secret", false);
  const firstId = await mj
    .locator("[data-edit-scene]")
    .first()
    .getAttribute("data-edit-scene");
  await mj.locator("[data-active-scene]").selectOption(firstId);
  assert.equal(
    await player.locator(".scene-stage").count(),
    0,
    "Local edits do not change the published site",
  );
  const downloadPromise = mj.waitForEvent("download");
  await mj.locator("[data-export-plateau]").click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "plateau.json");
  const text = await readFile(await download.path(), "utf8");
  const exported = JSON.parse(text);
  assert.equal(exported.scenes.length, 1);
  assert.equal(exported.activeId, firstId);
  assert.equal(text.includes("SECRET MJ"), false);
  assert.equal(text.includes("Lieu secret"), false);
  // Simulate replacing the static site's JSON file after an explicit publication.
  published = exported;
  await player.locator("[data-reload-plateau]").click();
  await player
    .getByRole("heading", { name: "Afterlife <test>", exact: true })
    .waitFor();
  assert.equal(
    await player.locator(".scene-map").getAttribute("src"),
    "/CyberpunkApp/fia-logo.svg",
  );
  assert.equal(
    await player.locator("audio").getAttribute("src"),
    "https://example.org/music.mp3",
  );
  assert.equal(
    await player.locator("video").getAttribute("src"),
    "https://example.org/video.mp4",
  );
  assert.equal(
    await player.getByText("Lieu secret", { exact: true }).count(),
    0,
  );
  await player.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await player.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await mj.locator("[data-edit-scene]").first().click();
  await mj.locator('[name="name"]').fill("Afterlife révisé");
  await mj.locator("[data-scene-form] button.primary").click();
  await player.reload();
  await player.locator('[data-tab="plateau"]').click();
  await player
    .getByRole("heading", { name: "Afterlife <test>", exact: true })
    .waitFor();
  await mj.reload();
  await mj.locator('[data-mj-tab="plateau"]').click();
  await mj.locator("[data-edit-scene]").first().click();
  assert.equal(await mj.locator('[name="notes"]').inputValue(), "SECRET MJ");
  await mj.locator('[name="map"]').fill("javascript:alert(1)");
  await mj.locator("[data-scene-form] button.primary").click();
  assert.ok(await mj.locator("[data-scene-error]").textContent());
  await mj.locator("[data-close-scene]").click();
  published = {
    ...exported,
    scenes: [{ ...exported.scenes[0], name: "Nouvelle publication" }],
  };
  await player.locator("[data-reload-plateau]").click();
  await player
    .getByRole("heading", { name: "Nouvelle publication", exact: true })
    .waitFor();
  await playerContext.route("**/CyberpunkApp/plateau.json?*", (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  await player.locator("[data-reload-plateau]").click();
  await player.getByRole("alert").waitFor();
  assert.equal(
    await player.locator(".scene-stage h2").textContent(),
    "Nouvelle publication",
  );
  assert.deepEqual(apiRequests, []);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: static published file, isolated MJ/player, local drafts, private notes excluded, export, explicit refresh, reload persistence, mobile, URL validation, fetch failure keeps visible content, no API calls or page errors",
  );
} finally {
  await browser.close();
}
