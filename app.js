/* ============================================================
   Vocabulary Vault — App Logic
   ============================================================ */

const STORAGE_KEY = "vocab_vault_words";

let words = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Önceden yüklenecek kelimeler
const STARTER_WORDS = [
  { word: "haphazard", meaning: "düzensiz, rastgele, plansız", example: "The books were piled in a haphazard manner on the shelf." },
  { word: "pellucid", meaning: "çok açık, saydam, anlaşılır", example: "Her pellucid writing style made the complex topic easy to understand." },
  { word: "aggravate", meaning: "kötüleştirmek, ağırlaştırmak", example: "Stress can aggravate the symptoms of a cold." },
  { word: "repudiate", meaning: "reddetmek, kabul etmemek, inkâr etmek", example: "The government repudiated the false accusations against it." },
  { word: "corroborate", meaning: "doğrulamak, kanıtlarla desteklemek", example: "The witness's statement corroborates the evidence found at the scene." },
  { word: "ameliorate", meaning: "iyileştirmek, daha iyi hale getirmek, hafifletmek", example: "The new policy aims to ameliorate poverty in the region." },
  { word: "scrupulous", meaning: "titiz, özenli, kılı kırk yaran", example: "She was scrupulous about keeping accurate records." },
  { word: "perfunctory", meaning: "üstünkörü, baştan savma, özensiz", example: "He gave a perfunctory nod and left the room." },
  { word: "nonchalant", meaning: "kayıtsız, umursamaz, rahat", example: "She was nonchalant about the approaching deadline, as if it didn't matter." },
  { word: "ostentatious", meaning: "gösterişçi, şatafatlı, abartılı", example: "The ostentatious mansion was full of gold decorations." },
  { word: "lethargic", meaning: "uyuşuk, miskin, enerjisiz", example: "The hot weather made everyone feel lethargic and sluggish." },
  { word: "apathetic", meaning: "ilgisiz, kayıtsız, duygusuz", example: "Many voters felt apathetic and didn't bother to vote." },
  { word: "assiduous", meaning: "gayretli, çalışkan, sebatkâr, titiz", example: "He was an assiduous student who studied every night." },
  { word: "desultory", meaning: "düzensiz, gelişigüzel, amaçsız, kopuk", example: "They had a desultory conversation without any real focus." },
  { word: "docile", meaning: "uysal, söz dinleyen, kolay yönetilen", example: "The docile horse allowed the child to ride it easily." },
  { word: "amenable", meaning: "uyumlu, razı olmaya/uzlaşmaya açık", example: "She was amenable to changing the meeting time." },
  { word: "tractable", meaning: "kolay işlenen, uysal, söz dinler", example: "The problem was tractable once they broke it into smaller steps." },
  { word: "recalcitrant", meaning: "dikbaşlı, inatçı, otoriteye direnen", example: "The recalcitrant student refused to follow the rules." },
];

// DOM elemanları
const $ = (id) => document.getElementById(id);
const addForm = $("add-form");
const inputWord = $("input-word");
const inputMeaning = $("input-meaning");
const inputExample = $("input-example");
const btnTranslate = $("btn-translate");
const btnExample = $("btn-example");
const wordList = $("word-list");
const emptyState = $("empty-state");
const inputSearch = $("input-search");
const statTotal = $("stat-total");
const statTranslated = $("stat-translated");
const statExamples = $("stat-examples");
const btnDark = $("btn-dark-toggle");
const themeIcon = document.querySelector(".theme-icon");

// Başlangıç kelimelerini ekle / eksik olanları birleştir
function init() {
  if (words.length === 0) {
    words = [...STARTER_WORDS];
    save();
  } else {
    // Mevcut kullanıcılarda eksik olan başlangıç kelimelerini ekle
    let added = false;
    STARTER_WORDS.forEach((sw) => {
      const exists = words.some((w) => w.word.toLowerCase() === sw.word.toLowerCase());
      if (!exists) {
        words.push(sw);
        added = true;
      }
    });
    if (added) save();
  }
  render();
  updateStats();
}

// Kaydet
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  updateStats();
}

// Render
function render() {
  const query = inputSearch.value.toLowerCase().trim();
  const filtered = words.filter((w) =>
    w.word.toLowerCase().includes(query) ||
    w.meaning.toLowerCase().includes(query)
  );

  wordList.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    wordList.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  wordList.style.display = "flex";

  filtered.forEach((w, idx) => {
    const el = document.createElement("div");
    el.className = "word-item";
    el.innerHTML = `
      <div class="word-main">
        <div>
          <div class="word-term">${escapeHtml(w.word)}</div>
          <div class="word-meaning">${escapeHtml(w.meaning || "Anlam eklenmedi")}</div>
          <div class="word-example">💬 ${escapeHtml(w.example || "Örnek cümle yok")}</div>
        </div>
        <div class="word-actions">
          <button class="btn-edit" title="Düzenle" onclick="appEdit(${idx})">✏️</button>
          <button class="btn-delete" title="Sil" onclick="appDelete(${idx})">🗑️</button>
        </div>
      </div>
    `;
    wordList.appendChild(el);
  });
}

// İstatistikler
function updateStats() {
  statTotal.textContent = words.length;
  statTranslated.textContent = words.filter((w) => w.meaning && w.meaning.trim() !== "").length;
  statExamples.textContent = words.filter((w) => w.example && w.example.trim() !== "").length;
}

// HTML escape
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Global callback'ler (HTML onclick için)
window.appDelete = function (idx) {
  if (!confirm("Bu kelimeyi silmek istediğinizden emin misiniz?")) return;
  words.splice(idx, 1);
  save();
  render();
};

window.appEdit = function (idx) {
  const w = words[idx];
  const newWord = prompt("Kelimeyi düzenleyin:", w.word);
  if (newWord === null) return;
  const newMeaning = prompt("Anlamı düzenleyin:", w.meaning);
  if (newMeaning === null) return;
  const newExample = prompt("Örnek cümleyi düzenleyin:", w.example);
  if (newExample === null) return;
  words[idx] = { word: newWord.trim(), meaning: newMeaning.trim(), example: newExample.trim() };
  save();
  render();
};

// ================= OTOMATİK ÇEVİRİ =================
async function translateWord(text) {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|tr`
    );
    const data = await res.json();
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (e) {
    console.error("Çeviri hatası:", e);
  }
  return null;
}

btnTranslate.addEventListener("click", async () => {
  const text = inputWord.value.trim();
  if (!text) {
    alert("Lütfen önce bir İngilizce kelime yazın.");
    inputWord.focus();
    return;
  }
  const btnText = btnTranslate.textContent;
  btnTranslate.textContent = "⏳";
  btnTranslate.disabled = true;
  try {
    const tr = await translateWord(text);
    if (tr) {
      inputMeaning.value = tr;
    } else {
      alert("Çeviri alınamadı. Lütfen anlamı elle girin.");
    }
  } finally {
    btnTranslate.textContent = btnText;
    btnTranslate.disabled = false;
  }
});

// ================= ÖRNEK CÜMLE =================
async function generateExample(text) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
    if (res.ok) {
      const data = await res.json();
      const first = data[0];
      for (const meaning of first.meanings) {
        for (const def of meaning.definitions) {
          if (def.example) return def.example;
        }
      }
    }
  } catch (e) {
    console.error("Örnek cümle hatası:", e);
  }
  // Fallback: basit şablon
  const templates = [
    `She studied the word "${text}" carefully to understand its meaning.`,
    `The concept of "${text}" is important in everyday English.`,
    `Can you use "${text}" in a sentence?`,
    `He explained "${text}" with a clear example.`,
    `Learning "${text}" will improve your vocabulary.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

btnExample.addEventListener("click", async () => {
  const text = inputWord.value.trim();
  if (!text) {
    alert("Lütfen önce bir İngilizce kelime yazın.");
    inputWord.focus();
    return;
  }
  const btnText = btnExample.textContent;
  btnExample.textContent = "⏳";
  btnExample.disabled = true;
  try {
    const ex = await generateExample(text);
    inputExample.value = ex;
  } finally {
    btnExample.textContent = btnText;
    btnExample.disabled = false;
  }
});

// ================= FORM SUBMIT =================
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const word = inputWord.value.trim();
  const meaning = inputMeaning.value.trim();
  const example = inputExample.value.trim();

  if (!word) {
    alert("Lütfen bir kelime girin.");
    inputWord.focus();
    return;
  }

  // Aynı kelime var mı?
  const exists = words.find((w) => w.word.toLowerCase() === word.toLowerCase());
  if (exists) {
    if (!confirm(`"${word}" zaten listede. Güncellenmesini ister misiniz?`)) return;
    const idx = words.findIndex((w) => w.word.toLowerCase() === word.toLowerCase());
    words[idx] = { word, meaning: meaning || exists.meaning, example: example || exists.example };
  } else {
    words.push({ word, meaning, example });
  }

  save();
  render();

  inputWord.value = "";
  inputMeaning.value = "";
  inputExample.value = "";
  inputWord.focus();
});

// ================= ARAMA =================
inputSearch.addEventListener("input", render);

// ================= TEMA =================
const savedTheme = localStorage.getItem("vocab_vault_theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeIcon.textContent = "☀️";
}

btnDark.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeIcon.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("vocab_vault_theme", isLight ? "light" : "dark");
});

// ================= BAŞLAT =================
init();

