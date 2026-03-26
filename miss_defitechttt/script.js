// ╔══════════════════════════════════════════════════════════════╗
// ║  ✏️  ZONE DE CONFIGURATION — MODIFIE ICI TES CANDIDATS      ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                              ║
// ║  PHOTOS — 2 options possibles :                              ║
// ║    ① Fichier local dans le dossier photos/                   ║
// ║       photo1: "photos/miss/m1_photo1.jpeg"                   ║
// ║       ⚠️ Formats acceptés : .jpg  .jpeg  .png  .webp         ║
// ║       ⚠️ PAS de chemin Windows comme C:\Users\...            ║
// ║          → copie le fichier dans le dossier photos/          ║
// ║                                                              ║
// ║    ② Lien URL en ligne                                       ║
// ║       photo1: "https://monsite.com/photo.jpeg"               ║
// ║                                                              ║
// ║    Laisser ""  →  l'emoji s'affiche à la place               ║
// ║                                                              ║
// ║  DESCRIPTION : texte libre, aussi long que voulu             ║
// ╚══════════════════════════════════════════════════════════════╝

const DATA = {
  miss: [
    {
      id: "m1",
      name: "Séréna KOUDJAHO",
      info: "18 ans, 1m54 de passion et de good vibes",
      ico: "👸",
      // ── PHOTOS ── (chemin relatif ou URL, laisser "" si indisponible)
      // ⚠️ Tu avais : "c:\Users\luthe\Downloads\m1.jpg"
      // ✅ Copie ce fichier dans photos/miss/ et écris :
      photo1: "photos/miss/m11.jpeg",
      photo2: "photos/miss/m1.jpeg",
      // ── DESCRIPTION ──
      description: "Amoureuse de l'art sous toutes ses formes(chant, danse, poésie...), je suis une personne créative attachante et toujours prete à apprendre et partager de bons délires. Authentique, positive et pleine d'énergie je veux représenter bien plus qu'une image: une vraie vibe. Votez pour moi"
    },
    {
      id: "m2",
      name: "Paméla",
      info: "agée de 18 ans, étudiante en deuxième année d' Administration de gestion",
      ico: "💃",
      photo1: "photos/miss/m2.jpeg",
      photo2: "photos/miss/m22.jpeg",
      description: "Originaire d' Atakpamé, je suis une jeune étudiante passionnée par la danse, la lecture et le foot"
    },
    {
      id: "m3",
      name: "Bénédicte Kossiwa ADANOUTO LOGO",
      info: "Agée de 17 ans, étudiante en génie civil",
      ico: "🌺",
      photo1: "photos/miss/m3.jpeg",
      photo2: "photos/miss/m33.jpeg",
      description: "Originaire du sud, je suis une jeune étudiante passionnée par les animés et la musique ."
    },
    
  ],

  mister: [
    {
      id: "r1",
      name: "ABOUDJO Yao Joachim",
      info: "Agé de 18 ans, mésurant 1m80 pour 64kg",
      ico: "🎩",
      photo1: "photos/mister/r1.jpeg",
      photo2: "photos/mister/r11.jpeg",
      description: "Etudiant en génie civil, je suis déterminé, ambitieux et passionné, je vis pour la construction, le basketball et les livres"
    },
    {
      id: "r2",
      name: "AKAKPOVI Folly Hanvi Etienne",
      info: "Agé de 19 ans, mésurant 1m85 pour 100kg",
      ico: "👑",
      photo1: "photos/mister/r2.jpeg",
      photo2: "photos/mister/r33.jpeg",
      description: "Etudiant en première année de Compatabilité Controle Audit, je suis passionné par la natation, la musique, l'entrepreunariat et la gestion de projet"
    },
    {
      id: "r3",
      name: "Alphonse Kokou MAKOUHUI",
      info: "Agé de 19, mésurant 1m70 pour 87kg",
      ico: "🌟",
      photo1: "photos/mister/r10.jpeg",
      photo2: "",
      description: "Etudiant en première année de comptabilité controle audit"
    },
    
    {
      id: "r4",
      name: "LAWSON Laté Prince Eddie",
      info: "Agé de 18 ans, mésurant 1m80",
      ico: "🔥",
      // ⚠️ Tu avais : "c:\Users\luthe\Downloads\r5.jpeg"
      // ✅ Copie ces fichiers dans photos/mister/ et écris :
      photo1: "photos/mister/r26.jpeg",
      photo2: "photos/mister/r25.jpeg",
      description: "Etudiant en première année de génie logiciel, je suis passionné par l'informatique, l'élégance, je crois en la force du détail et en la puissance de la détermination, si mon profil vous parle, votre soutien fera toute la différence."
    },
    
  ]
};

// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚙️  CONFIG JSONBIN — Remplace par tes clés jsonbin.io       ║
// ╚══════════════════════════════════════════════════════════════╝
const BIN_ID     = "TON_ID_ICI";     // EX: "65e..."
const MASTER_KEY = "TA_CLE_MAITRE";  // EX: "$2b$10$..."
const API_URL    = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let V       = {};
let P       = null;
let curTab  = "miss";
let gallery = { photos: [], index: 0 };
let isSync  = false;

// ── Chargement des votes ──────────────────────────────────────
async function loadVotes() {
  try {
    const res = await fetch(`${API_URL}/latest`, {
      headers: { "X-Master-Key": MASTER_KEY }
    });
    if (!res.ok) throw new Error("Erreur " + res.status);
    const data = await res.json();
    V = data.record || {};
    render(curTab);
  } catch (e) {
    console.warn("Utilisation de localStorage (secours) :", e);
    V = JSON.parse(localStorage.getItem("dft_free") || "{}");
    render(curTab);
  }
}

// ── Sauvegarde des votes ──────────────────────────────────────
async function saveVotes() {
  // 1. Sauvegarde locale immédiate
  localStorage.setItem("dft_free", JSON.stringify(V));
  
  isSync = true;
  render(curTab);
  
  try {
    // 2. Synchronisation jsonbin.io (utilise PUT)
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
      },
      body: JSON.stringify(V)
    });
    
    if (!res.ok) throw new Error("Status " + res.status);
    console.log("✅ Sync OK");
  } catch (e) {
    console.error("❌ Sync Error:", e);
    showToast("⚠️ Mode hors-ligne (sauvé localement)");
  } finally {
    isSync = false;
    render(curTab);
  }
}

// ── Compte à rebours ──────────────────────────────────────────
const EVT = new Date("2026-03-26T19:00:00");
function tick() {
  const l = EVT - Date.now();
  const pad = n => String(Math.max(0, n)).padStart(2, "0");
  document.getElementById("xd").textContent = pad(Math.floor(l / 86400000));
  document.getElementById("xh").textContent = pad(Math.floor((l % 86400000) / 3600000));
  document.getElementById("xm").textContent = pad(Math.floor((l % 3600000) / 60000));
  document.getElementById("xs").textContent = pad(Math.floor((l % 60000) / 1000));
}
setInterval(tick, 1000); tick();

// ── Onglets ───────────────────────────────────────────────────
function sw(t) {
  curTab = t;
  document.getElementById("tbm").className = "tb " + (t === "miss"   ? "ma" : "mi");
  document.getElementById("tbr").className = "tb " + (t === "mister" ? "ra" : "ri");
  document.getElementById("gtit").textContent = t === "miss"
    ? "👑 Candidates Miss DefITech"
    : "🎩 Candidats Mister DefITech";
  render(t);
}

// ── Zone photo de la carte ────────────────────────────────────
function getPhotoHTML(c, isMiss, idx) {
  const photos = [c.photo1, c.photo2].filter(p => p && p.trim() !== "");
  const numStr  = `N°${idx + 1}`;
  const noClass = isMiss ? "mno" : "rno";
  const bgClass = isMiss ? "mph" : "rph";

  if (photos.length === 0) {
    return `<div class="cph ${bgClass}">
      <span class="cph-ico">${c.ico}</span>
      <span class="cno ${noClass}">${numStr}</span>
    </div>`;
  }

  const hasTwo     = photos.length === 2;
  const safePhotos = JSON.stringify(photos).replace(/"/g, "&quot;");
  const galleryArg = JSON.stringify(photos).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  return `<div class="cph ${bgClass} has-photo">
    <img class="cph-img" src="${photos[0]}" alt="Photo de ${c.name}"
      onerror="this.style.opacity='0';this.nextElementSibling.style.display='flex'">
    <div class="cph-fallback" style="display:none">${c.ico}</div>
    <span class="cno ${noClass}">${numStr}</span>
    <div class="cph-actions">
      ${hasTwo
        ? `<button class="photo-nav-btn" title="Autre photo"
             data-photos="${safePhotos}" data-idx="0"
             onclick="event.stopPropagation();cyclePhoto(this)">⇄</button>`
        : ""}
      <button class="zoom-btn" title="Agrandir"
        onclick="event.stopPropagation();openGallery('${galleryArg}',0)">⛶</button>
    </div>
  </div>`;
}

// ── Switcher photo sur la carte ───────────────────────────────
function cyclePhoto(btn) {
  const photos = JSON.parse(btn.dataset.photos.replace(/&quot;/g, '"'));
  let idx = (parseInt(btn.dataset.idx) + 1) % photos.length;
  btn.dataset.idx = idx;
  const img = btn.closest(".cph").querySelector(".cph-img");
  img.style.opacity = "0";
  setTimeout(() => { img.src = photos[idx]; img.style.opacity = "1"; }, 180);
}

// ── Rendu des cartes ──────────────────────────────────────────
function render(t) {
  const list   = DATA[t];
  const total  = list.reduce((a, c) => a + (V[c.id] || 0), 0);
  const isMiss = t === "miss";

  document.getElementById("gg").innerHTML = list.map((c, i) => {
    const cnt      = V[c.id] || 0;
    const pct      = total > 0 ? Math.round((cnt / total) * 100) : 0;
    const hasVoted = cnt > 0;

    return `<div class="cc${hasVoted ? (isMiss ? " vc" : " vrc") : ""}"
                 style="animation:fadeUp .4s ${i * .07}s both">
      ${getPhotoHTML(c, isMiss, i)}
      <div class="cbody">
        <div class="cname">${c.name}</div>
        <div class="cinfo">${c.info}</div>
        ${c.description ? `<p class="cdesc">${c.description}</p>` : ""}
        <button class="vbtn ${isMiss ? "mvb" : "rvb"}" ${isSync ? "disabled" : ""}
          onclick="openVoteModal('${c.id}','${c.name}','${t}','${c.ico}')">
          ${isSync ? "⌛ Sync..." : `Voter ✨${cnt > 0 ? " (" + cnt + ")" : ""}`}
        </button>
        ${hasVoted
          ? `<button class="vbtn-cancel" ${isSync ? "disabled" : ""}
               onclick="cancelVote('${c.id}','${t}')">✕ Annuler mon vote</button>`
          : ""}
        <div class="bw"><div class="bf ${isMiss ? "mbf" : "rbf"}" style="width:${pct}%"></div></div>
        <div class="bi">
          <span>${cnt} vote${cnt > 1 ? "s" : ""}</span>
          <span>${pct}%</span>
        </div>
      </div>
    </div>`;
  }).join("");
}

// ── Annuler un vote depuis la carte ──────────────────────────
function cancelVote(id, t) {
  if (!V[id] || V[id] <= 0) return;
  V[id]--;
  if (V[id] === 0) delete V[id];
  saveVotes();
  render(t);
  showToast("↩️ Vote annulé");
}

// ── Modal de vote ─────────────────────────────────────────────
function openVoteModal(id, name, t, ico) {
  P = { id, name, t };
  const c      = DATA[t].find(x => x.id === id);
  const photos = c ? [c.photo1, c.photo2].filter(p => p && p.trim() !== "") : [];

  document.getElementById("xi").textContent  = ico;
  document.getElementById("xnm").textContent = name;
  document.getElementById("xth").textContent = t === "miss" ? "Voter pour Miss ?" : "Voter pour Mister ?";
  document.getElementById("xok").className   = "mok " + (t === "miss" ? "mk" : "rk");

  // Photo dans la modal
  const mPhotoEl = document.getElementById("m-photo");
  if (photos.length > 0) {
    mPhotoEl.innerHTML     = `<img src="${photos[0]}" alt="${name}" onerror="this.parentElement.style.display='none'">`;
    mPhotoEl.style.display = "block";
  } else {
    mPhotoEl.style.display = "none";
  }

  // Description dans la modal
  const mDescEl = document.getElementById("m-desc");
  if (c && c.description) {
    mDescEl.textContent    = c.description;
    mDescEl.style.display  = "block";
  } else {
    mDescEl.style.display  = "none";
  }

  // Bouton "annuler mon vote" dans la modal
  const mDelEl  = document.getElementById("m-del");
  const hasVote = V[id] && V[id] > 0;
  mDelEl.style.display = hasVote ? "block" : "none";

  document.getElementById("mdl").classList.add("open");
}

function closeMdl() {
  document.getElementById("mdl").classList.remove("open");
  P = null;
}

function doVote() {
  if (!P) return;
  const { id, name, t } = P;
  if (isSync) return; // Évite les doubles votes
  V[id] = (V[id] || 0) + 1;
  saveVotes();
  closeMdl();
  render(t);
  showToast("🌟 Vote pour " + name + " enregistré !");
}

// ── Annuler depuis la modal ───────────────────────────────────
function doCancel() {
  if (!P) return;
  const { id, t } = P;
  cancelVote(id, t);
  closeMdl();
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  const el = document.getElementById("tst");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3000);
}

// ── Galerie plein écran ───────────────────────────────────────
function openGallery(photosArg, startIdx) {
  let photos;
  if (typeof photosArg === "string") {
    try { photos = JSON.parse(photosArg); }
    catch { photos = [photosArg]; }
  } else {
    photos = photosArg;
  }
  gallery = { photos, index: startIdx || 0 };
  renderGallery();
  document.getElementById("gallery").classList.add("open");
}

function closeGallery() {
  document.getElementById("gallery").classList.remove("open");
}

function galleryNav(dir) {
  gallery.index = (gallery.index + dir + gallery.photos.length) % gallery.photos.length;
  renderGallery();
}

function renderGallery() {
  const { photos, index } = gallery;
  const img = document.getElementById("gallery-img");
  img.style.opacity = "0";
  setTimeout(() => { img.src = photos[index]; img.style.opacity = "1"; }, 130);
  document.getElementById("gallery-counter").textContent =
    photos.length > 1 ? `${index + 1} / ${photos.length}` : "";
  document.getElementById("gallery-prev").style.display = photos.length > 1 ? "flex" : "none";
  document.getElementById("gallery-next").style.display = photos.length > 1 ? "flex" : "none";
}

// ── Fermetures (clic extérieur + clavier) ─────────────────────
document.getElementById("mdl").addEventListener("click", e => {
  if (e.target === document.getElementById("mdl")) closeMdl();
});
document.getElementById("gallery").addEventListener("click", e => {
  if (e.target === document.getElementById("gallery")) closeGallery();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeMdl(); closeGallery(); }
  if (document.getElementById("gallery").classList.contains("open")) {
    if (e.key === "ArrowLeft")  galleryNav(-1);
    if (e.key === "ArrowRight") galleryNav(1);
  }
});

// ── Init ──────────────────────────────────────────────────────
loadVotes();
