// Same steps as scikit-learn's TfidfVectorizer (default settings) + LogisticRegression.
// Tokens: lowercase, runs of 2+ "word" characters, like Python's (?u)\b\w\w+\b.
const TOKEN_RE = /[\p{L}\p{M}\p{N}\p{Pc}]{2,}/gu;

function buildModel(raw) {
  const index = new Map();
  raw.words.forEach((w, i) => index.set(w, i));
  return { ...raw, index };
}

function predict(model, text) {
  const counts = new Map();
  for (const tok of text.toLowerCase().match(TOKEN_RE) || []) {
    const i = model.index.get(tok);
    if (i !== undefined) counts.set(i, (counts.get(i) || 0) + 1);
  }
  // tf * idf, then L2-normalise
  let norm = 0;
  const weights = [];
  for (const [i, c] of counts) {
    const w = c * model.idf[i];
    weights.push([i, w]);
    norm += w * w;
  }
  norm = Math.sqrt(norm) || 1;
  let z = model.intercept;
  const contrib = [];
  for (const [i, w] of weights) {
    const c = (w / norm) * model.coef[i];
    z += c;
    contrib.push({ word: model.words[i], value: c });
  }
  const pReal = 1 / (1 + Math.exp(-z));
  contrib.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  return { pReal, known: counts.size, contrib };
}

if (typeof module !== "undefined") module.exports = { buildModel, predict };
