export const FORMAT = "fia-plateau";
export const VERSION = 1;
const BASE = "https://plateau.local/CyberpunkApp/";

export function mediaURL(value, base = BASE) {
  if (!value) return "";
  if (typeof value !== "string" || value.length > 2048)
    throw Error("Adresse de média invalide (2048 caractères maximum).");
  const url = new URL(value.trim(), base);
  if (
    (url.protocol !== "https:" && url.origin !== new URL(base).origin) ||
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw Error("Utilisez une adresse HTTPS ou un fichier du site.");
  return url.origin === new URL(base).origin
    ? url.pathname + url.search + url.hash
    : url.href;
}

export function publicScene(scene, base = BASE) {
  if (
    !scene ||
    typeof scene.id !== "string" ||
    !/^[a-zA-Z0-9_-]{1,100}$/.test(scene.id)
  )
    throw Error("Identifiant de lieu invalide.");
  if (
    typeof scene.name !== "string" ||
    !scene.name.trim() ||
    scene.name.length > 100
  )
    throw Error("Renseignez un nom de lieu de 100 caractères maximum.");
  if (typeof scene.description !== "string" || scene.description.length > 4000)
    throw Error("Description invalide (4000 caractères maximum).");
  return {
    id: scene.id,
    name: scene.name.trim(),
    description: scene.description,
    map: mediaURL(scene.map, base),
    music: mediaURL(scene.music, base),
    video: mediaURL(scene.video, base),
  };
}

export function validatePublication(value, base = BASE) {
  if (
    !value ||
    value.format !== FORMAT ||
    value.version !== VERSION ||
    !Array.isArray(value.scenes) ||
    value.scenes.length > 100
  )
    throw Error("Fichier de plateau invalide ou version non prise en charge.");
  const scenes = value.scenes.map((scene) => publicScene(scene, base));
  if (new Set(scenes.map((scene) => scene.id)).size !== scenes.length)
    throw Error("Deux lieux possèdent le même identifiant.");
  if (
    value.activeId !== null &&
    !scenes.some((scene) => scene.id === value.activeId)
  )
    throw Error("Le lieu d’accueil doit être inclus dans la publication.");
  return { format: FORMAT, version: VERSION, activeId: value.activeId, scenes };
}

export function createPublication(draft, base = BASE) {
  return validatePublication(
    {
      format: FORMAT,
      version: VERSION,
      activeId: draft.activeId || null,
      scenes: draft.scenes.filter((scene) => scene.included === true),
    },
    base,
  );
}
