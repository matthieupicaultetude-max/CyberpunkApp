import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createPublication,
  validatePublication,
  mediaURL,
} from "../plateau-model.js";
const scene = {
  id: "afterlife",
  name: "Afterlife",
  description: "Lieu partagé",
  map: "cartes/afterlife.webp",
  music: "https://example.org/music.mp3",
  video: "",
  included: true,
  notes: "SECRET MJ",
  playing: true,
  token: "private",
};

test("export includes only selected scenes and public fields", () => {
  const data = createPublication({
    activeId: "afterlife",
    scenes: [
      scene,
      { ...scene, id: "hidden", included: false, name: "Lieu secret" },
    ],
  });
  assert.equal(data.scenes.length, 1);
  assert.equal(data.activeId, "afterlife");
  assert.deepEqual(Object.keys(data.scenes[0]), [
    "id",
    "name",
    "description",
    "map",
    "music",
    "video",
  ]);
  assert.equal(JSON.stringify(data).includes("SECRET"), false);
  assert.equal(JSON.stringify(data).includes("hidden"), false);
  assert.equal(data.scenes[0].map, "/CyberpunkApp/cartes/afterlife.webp");
  assert.deepEqual(validatePublication(JSON.parse(JSON.stringify(data))), data);
});
test("empty publication can clear previously published content", () =>
  assert.deepEqual(
    createPublication({ scenes: [], activeId: null }).scenes,
    [],
  ));
test("rejects invalid format, duplicate scene IDs and unpublished welcome scene", () => {
  const data = createPublication({ scenes: [scene], activeId: null });
  assert.throws(() => validatePublication({ ...data, version: 2 }));
  assert.throws(() =>
    validatePublication({ ...data, scenes: [data.scenes[0], data.scenes[0]] }),
  );
  assert.throws(() =>
    createPublication({ activeId: "hidden", scenes: [scene] }),
  );
});
test("media addresses reject executable URLs and credentials and retain portable site paths", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///etc/passwd",
    "https://user:pass@example.org/file",
    "http://external.example/file",
  ])
    assert.throws(() => mediaURL(url));
  assert.equal(
    mediaURL("https://example.org/file.mp4"),
    "https://example.org/file.mp4",
  );
  assert.equal(
    mediaURL("/CyberpunkApp/map.svg", "http://localhost:5173/CyberpunkApp/"),
    "/CyberpunkApp/map.svg",
  );
});

test("the shipped publication file has a supported format", () => {
  validatePublication(
    JSON.parse(
      readFileSync(new URL("../public/plateau.json", import.meta.url), "utf8"),
    ),
  );
});
