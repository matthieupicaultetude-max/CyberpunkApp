import {
  mediaURL as normalizeMediaURL,
  publicScene,
  validatePublication,
  createPublication,
} from "./plateau-model.js";
export const plateauStorageKey = "fia-plateau-v1";
const baseURL = new URL(import.meta.env.BASE_URL, location.origin).href;
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const mediaURL = (value) => normalizeMediaURL(value, baseURL);
let publication = null,
  loading = false,
  error = "",
  requested = false,
  selection = null,
  previewId = null;

export function loadPlateau() {
  const raw = localStorage.getItem(plateauStorageKey);
  if (!raw) return { scenes: [], activeId: null };
  const data = JSON.parse(raw);
  if (!Array.isArray(data.scenes) || data.scenes.length > 100)
    throw Error("Le brouillon du plateau est illisible.");
  // Retain earlier local scenes without publishing them by default.
  const scenes = data.scenes.map((scene) => ({
    ...publicScene({ ...scene, description: scene.description || "" }, baseURL),
    notes: typeof scene.notes === "string" ? scene.notes : "",
    included: scene.included === true,
  }));
  return {
    scenes,
    activeId: scenes.some(
      (scene) => scene.id === data.activeId && scene.included,
    )
      ? data.activeId
      : null,
  };
}

async function fetchPublication() {
  if (loading) return;
  requested = true;
  loading = true;
  error = "";
  window.dispatchEvent(new Event("plateauchange"));
  try {
    const url = new URL("plateau.json", baseURL);
    url.searchParams.set("v", String(Date.now()));
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok)
      throw Error(
        "Le plateau publié ne peut pas être chargé. Réessayez après la publication du site.",
      );
    publication = validatePublication(await response.json(), baseURL);
    selection = publication.activeId || publication.scenes[0]?.id || null;
  } catch (cause) {
    error = cause.message;
  } finally {
    loading = false;
    window.dispatchEvent(new Event("plateauchange"));
  }
}

function stage(scene, draft = false) {
  if (!scene)
    return '<div class="panel empty-state">Aucun lieu à afficher pour le moment.</div>';
  return `<article class="panel scene-stage"><span class="outline-label">${draft ? "APERÇU LOCAL" : "LIEU PUBLIÉ"}</span><h2>${esc(scene.name)}</h2><p class="scene-description">${esc(scene.description)}</p>${scene.map ? `<img class="scene-map" src="${esc(mediaURL(scene.map))}" alt="Carte du lieu ${esc(scene.name)}">` : ""}${scene.music ? `<label>Ambiance musicale<audio controls loop preload="none" src="${esc(mediaURL(scene.music))}"></audio></label>` : ""}${scene.video ? `<label>Vidéo du lieu<video controls playsinline preload="metadata" src="${esc(mediaURL(scene.video))}"></video></label>` : ""}<p class="hint">Lancez les médias avec leurs commandes. Lecture et volume sont propres à votre écran.</p><p role="status" data-media-status></p></article>`;
}

function publishedView() {
  const scene = publication?.scenes.find((item) => item.id === selection);
  return `<section class="published-plateau"><div class="scene-actions"><h2>Plateau de campagne</h2><button class="logout" data-reload-plateau ${loading ? "disabled" : ""}>${loading ? "CHARGEMENT…" : "ACTUALISER LE CONTENU"}</button></div><p class="hint">Les lieux sont préparés par le MJ et publiés sur le site. Actualisez pour récupérer les nouveautés. Chacun choisit son lieu et lance ses médias.</p>${error ? `<p role="alert">${esc(error)}${publication ? " Le dernier contenu chargé reste affiché." : ""}</p>` : ""}${publication ? `<div class="scene-actions" aria-label="Lieux publiés">${publication.scenes.map((item) => `<button class="logout ${selection === item.id ? "is-active" : ""}" data-open-published="${esc(item.id)}">${esc(item.name)}</button>`).join("")}</div>${stage(scene)}` : `<p role="status">${loading ? "Chargement du plateau publié…" : "Aucun contenu publié disponible."}</p>`}</section>`;
}

export function plateauView(role) {
  if (!requested) queueMicrotask(fetchPublication);
  if (role !== "mj") return publishedView();
  try {
    const data = loadPlateau(),
      preview = data.scenes.find((scene) => scene.id === previewId);
    return `<section class="plateau"><div class="relations-heading"><div><div class="eyebrow">PRÉPARATION / CAMPAGNE</div><h2>Plateau MJ</h2><p>Préparez vos lieux, leurs cartes et leurs ambiances.</p></div><button class="primary" data-new-scene>NOUVEAU LIEU +</button></div><section class="panel plateau-publication"><h3>Préparer la publication</h3><ol><li>Créez vos lieux et cochez ceux à inclure pour les joueurs.</li><li>Choisissez le lieu affiché à l’ouverture, puis exportez le plateau.</li><li>Remplacez <code>public/plateau.json</code> par le fichier téléchargé dans le projet, puis republiez le site sur GitHub Pages.</li></ol><p class="hint">Les changements et les notes MJ restent dans ce navigateur. Exporter ne met pas le site en ligne. Seuls les lieux inclus et leurs informations partagées figurent dans le fichier exporté. Les joueurs récupèrent la version publiée en actualisant leur plateau.</p><div class="scene-actions"><button class="primary" data-export-plateau>EXPORTER LE PLATEAU</button><button class="logout" data-import-published ${publication ? "" : "disabled"}>REPRENDRE LE CONTENU PUBLIÉ</button></div><label>Lieu affiché à l’ouverture<select data-active-scene><option value="">Premier lieu de la liste</option>${data.scenes
      .filter((scene) => scene.included)
      .map(
        (scene) =>
          `<option value="${esc(scene.id)}" ${data.activeId === scene.id ? "selected" : ""}>${esc(scene.name)}</option>`,
      )
      .join(
        "",
      )}</select></label><p role="status" data-plateau-status></p></section><div class="plateau-layout"><section class="panel"><h3>Lieux préparés</h3><div class="scene-list">${data.scenes.map((scene) => `<article><h3>${esc(scene.name)}</h3><p class="hint">${scene.included ? "Inclus dans le prochain export" : "Brouillon local uniquement"}${data.activeId === scene.id ? " · Lieu d’accueil" : ""}</p><div class="scene-actions"><button class="logout" data-edit-scene="${esc(scene.id)}">MODIFIER</button><button class="logout" data-preview-scene="${esc(scene.id)}">APERÇU</button><button class="logout" data-delete-scene="${esc(scene.id)}">SUPPRIMER</button></div></article>`).join("") || "<p>Aucun lieu. Créez votre première scène.</p>"}</div></section><section><h3>Aperçu de votre préparation</h3>${stage(preview, true)}</section></div><details class="plateau-online"><summary>Voir le plateau actuellement publié</summary>${publishedView()}</details><dialog class="player-dialog" data-scene-dialog aria-labelledby="scene-title"><h2 id="scene-title">Lieu du plateau</h2><form data-scene-form><input name="id" type="hidden"><label>Nom du lieu<input name="name" maxlength="100" required></label><label>Description partagée<textarea name="description" maxlength="4000" rows="3"></textarea></label><label>Carte — adresse de l’image<input name="map" maxlength="2048" placeholder="https://…/carte.webp ou /CyberpunkApp/cartes/lieu.webp"></label><label>Musique — adresse audio<input name="music" maxlength="2048" placeholder="https://…/ambiance.mp3"></label><label>Vidéo — adresse vidéo<input name="video" maxlength="2048" placeholder="https://…/scene.mp4"></label><p class="hint">Utilisez des liens vers des fichiers accessibles aux joueurs. Les pages YouTube ne sont pas prises en charge. Pour un fichier personnel, ajoutez-le aux ressources du site avant de publier.</p><label class="scene-visibility"><input type="checkbox" name="included"> Inclure ce lieu dans le prochain export destiné aux joueurs</label><label>Notes MJ — conservées uniquement sur cet appareil<textarea name="notes" maxlength="10000" rows="3"></textarea></label><p role="alert" data-scene-error></p><div class="scene-actions"><button class="primary">ENREGISTRER LE BROUILLON</button><button type="button" class="logout" data-close-scene>ANNULER</button></div></form></dialog></section>`;
  } catch {
    return '<p role="alert">Le brouillon du plateau ne peut pas être lu. Les données existantes sont conservées.</p>';
  }
}

export function bindPlateau(role, refresh) {
  document
    .querySelectorAll("[data-reload-plateau]")
    .forEach((button) => (button.onclick = fetchPublication));
  document.querySelectorAll("[data-open-published]").forEach(
    (button) =>
      (button.onclick = () => {
        selection = button.dataset.openPublished;
        refresh();
      }),
  );
  document
    .querySelectorAll(".scene-stage audio,.scene-stage video,.scene-map")
    .forEach((media) =>
      media.addEventListener("error", () => {
        media
          .closest(".scene-stage")
          .querySelector("[data-media-status]").textContent =
          "Ce média ne peut pas être chargé. Vérifiez son adresse, son format et son accès.";
      }),
    );
  if (role !== "mj") return;
  const form = document.querySelector("[data-scene-form]"),
    dialog = document.querySelector("[data-scene-dialog]"),
    status = document.querySelector("[data-plateau-status]");
  if (!form) return;
  function write(change) {
    try {
      const data = loadPlateau();
      change(data);
      localStorage.setItem(plateauStorageKey, JSON.stringify(data));
      refresh();
      return true;
    } catch (cause) {
      const message = "Enregistrement impossible : " + cause.message;
      status.textContent = message;
      if (dialog.open)
        form.querySelector("[data-scene-error]").textContent = message;
      return false;
    }
  }
  function edit(scene = {}) {
    form.reset();
    for (const key of [
      "id",
      "name",
      "description",
      "map",
      "music",
      "video",
      "notes",
    ])
      form.elements[key].value = scene[key] || "";
    form.elements.included.checked = scene.included === true;
    form.querySelector("[data-scene-error]").textContent = "";
    dialog.showModal();
  }
  document.querySelector("[data-new-scene]").onclick = () => edit();
  document.querySelector("[data-close-scene]").onclick = () => dialog.close();
  document
    .querySelectorAll("[data-edit-scene]")
    .forEach(
      (button) =>
        (button.onclick = () =>
          edit(
            loadPlateau().scenes.find(
              (scene) => scene.id === button.dataset.editScene,
            ),
          )),
    );
  document.querySelectorAll("[data-preview-scene]").forEach(
    (button) =>
      (button.onclick = () => {
        previewId = button.dataset.previewScene;
        refresh();
      }),
  );
  document.querySelectorAll("[data-delete-scene]").forEach(
    (button) =>
      (button.onclick = () => {
        if (
          confirm(
            "Supprimer ce lieu du brouillon local ? Le contenu déjà publié restera disponible jusqu’à la prochaine publication.",
          )
        )
          write((data) => {
            data.scenes = data.scenes.filter(
              (scene) => scene.id !== button.dataset.deleteScene,
            );
            if (data.activeId === button.dataset.deleteScene)
              data.activeId = null;
          });
      }),
  );
  form.onsubmit = (event) => {
    event.preventDefault();
    try {
      const fields = new FormData(form),
        id = fields.get("id") || crypto.randomUUID();
      const scene = {
        ...publicScene(
          {
            id,
            ...Object.fromEntries(
              ["name", "description", "map", "music", "video"].map((key) => [
                key,
                fields.get(key).trim(),
              ]),
            ),
          },
          baseURL,
        ),
        notes: fields.get("notes").trim(),
        included: fields.has("included"),
      };
      write((data) => {
        const index = data.scenes.findIndex((item) => item.id === id);
        if (index < 0) {
          if (data.scenes.length >= 100) throw Error("100 lieux maximum.");
          data.scenes.push(scene);
        } else data.scenes[index] = scene;
        if (data.activeId === id && !scene.included) data.activeId = null;
      });
    } catch (cause) {
      form.querySelector("[data-scene-error]").textContent = cause.message;
    }
  };
  document.querySelector("[data-active-scene]").onchange = (event) =>
    write((data) => {
      data.activeId = event.target.value || null;
    });
  document.querySelector("[data-export-plateau]").onclick = () => {
    try {
      const data = createPublication(loadPlateau(), baseURL);
      const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], {
          type: "application/json",
        }),
        url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = "plateau.json";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = `${data.scenes.length} lieu(x) exporté(s). Remplacez public/plateau.json puis republiez le site pour les rendre disponibles aux joueurs.`;
    } catch (cause) {
      status.textContent = "Export impossible : " + cause.message;
    }
  };
  document.querySelector("[data-import-published]").onclick = () => {
    if (
      publication &&
      confirm(
        "Remplacer votre brouillon local par le contenu publié ? Les notes MJ et les lieux non publiés du brouillon seront remplacés.",
      )
    )
      write((data) => {
        data.scenes = publication.scenes.map((scene) => ({
          ...scene,
          notes: "",
          included: true,
        }));
        data.activeId = publication.activeId;
      });
  };
}
