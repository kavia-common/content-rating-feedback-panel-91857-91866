const STORAGE_KEY = 'crp_ratings';

async function simulateNetwork(result, fail = false, delay = 300) {
  await new Promise((res) => setTimeout(res, delay));
  if (fail) throw new Error('Network error');
  return result;
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// PUBLIC_INTERFACE
export async function getRating(contentId) {
  /** Returns the saved rating for contentId or null. Placeholder for API GET. */
  const all = readAll();
  const rec = all[contentId] || null;
  return simulateNetwork(rec, false, 200);
}

// PUBLIC_INTERFACE
export async function submitRating(contentId, rating) {
  /** Saves a rating. Placeholder for API POST/PUT. */
  const all = readAll();
  const rec = { contentId, rating, updatedAt: Date.now() };
  all[contentId] = rec;
  writeAll(all);
  const fail = Math.random() < 0.1;
  return simulateNetwork(rec, fail, 400);
}

// PUBLIC_INTERFACE
export async function deleteRating(contentId) {
  /** Removes the rating. Placeholder for API DELETE. */
  const all = readAll();
  delete all[contentId];
  writeAll(all);
  const fail = Math.random() < 0.1;
  return simulateNetwork(undefined, fail, 300);
}
