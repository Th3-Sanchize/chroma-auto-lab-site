// =========================
// Chroma Auto Lab - main.js
// =========================

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // Mobile menu
  // -------------------------
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  menuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  $$("#mobileMenu a").forEach((a) => {
    a.addEventListener("click", () => mobileMenu?.classList.add("hidden"));
  });

  // -------------------------
  // Footer year
  // -------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -------------------------
  // Copy phone button
  // -------------------------
  const copyBtn = $("#copyPhone");
  copyBtn?.addEventListener("click", async () => {
    const original = copyBtn.textContent;

    try {
      await navigator.clipboard.writeText("254-677-8799");
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = original), 1200);
    } catch {
      copyBtn.textContent = "Copy failed";
      setTimeout(() => (copyBtn.textContent = original), 1200);
    }
  });

  // -------------------------
  // Quote Builder
  // -------------------------
  const qbForm = $("#quoteBuilder");
  const qbOutput = $("#qbOutput");
  const qbCopy = $("#qbCopy");
  const qbSend = $("#qbSend");

  const getChecked = (id) => Boolean($("#" + id)?.checked);

  function buildSummary() {
    const vehicle = $("#qbVehicle")?.value?.trim() || "";
    const type = $("#qbType")?.value || "";
    const film = $("#qbFilm")?.value || "";
    const shade = $("#qbShade")?.value || "";
    const notes = $("#qbNotes")?.value?.trim() || "";

    const coverage = [];
    if (getChecked("qbSides")) coverage.push("Sides + rear");
    if (getChecked("qbWindshield")) coverage.push("Windshield");
    if (getChecked("qbBrow")) coverage.push("Brow strip");
    if (getChecked("qbRemoveOld")) coverage.push("Remove old tint");

    const coverageText = coverage.length ? coverage.join(", ") : "Not specified";

    return `CHROMA AUTO LAB — TINT REQUEST
Vehicle: ${vehicle || "[not provided]"} (${type})
Service: Window Tint
Coverage: ${coverageText}
Film: ${film}
Preferred shade: ${shade}
Notes: ${notes || "None"}

Service area: Killeen / Harker Heights / Fort Hood / Nolanville`;
  }

  qbForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (qbOutput) qbOutput.textContent = buildSummary();
  });

  qbCopy?.addEventListener("click", async () => {
    if (!qbOutput) return;
    const text = qbOutput.textContent.trim();
    if (!text || text.startsWith("Fill out")) return;

    const original = qbCopy.textContent;

    try {
      await navigator.clipboard.writeText(text);
      qbCopy.textContent = "Copied!";
      setTimeout(() => (qbCopy.textContent = original), 1200);
    } catch {
      qbCopy.textContent = "Copy failed";
      setTimeout(() => (qbCopy.textContent = original), 1200);
    }
  });

  qbSend?.addEventListener("click", () => {
    const summary = buildSummary();
    if (qbOutput) qbOutput.textContent = summary;

    const details = $("#details");
    const service = $("#service");
    const vehicleField = $("#vehicle");

    if (service) service.value = "Window Tint";
    if (vehicleField) vehicleField.value = $("#qbVehicle")?.value?.trim() || vehicleField.value;
    if (details) details.value = summary;

    $("#contact")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => details?.focus(), 600);
  });

  // -------------------------
  // Gallery Lightbox
  // -------------------------
  const imgs = $$(".gallery-img");
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbClose = $("#lbClose");
  const lbPrev = $("#lbPrev");
  const lbNext = $("#lbNext");

  let currentIndex = 0;

  function openLightbox(index) {
    if (!imgs.length || !lightbox || !lbImg) return;
    currentIndex = index;
    lbImg.src = imgs[currentIndex].src;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function prevImg() {
    if (!imgs.length || !lbImg) return;
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    lbImg.src = imgs[currentIndex].src;
  }

  function nextImg() {
    if (!imgs.length || !lbImg) return;
    currentIndex = (currentIndex + 1) % imgs.length;
    lbImg.src = imgs[currentIndex].src;
  }

  imgs.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));

  lbClose?.addEventListener("click", closeLightbox);
  lbPrev?.addEventListener("click", prevImg);
  lbNext?.addEventListener("click", nextImg);

  // Close if clicking the backdrop (only if you click the outer container)
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.classList.contains("hidden")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImg();
    if (e.key === "ArrowRight") nextImg();
  });
});