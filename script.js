/* =========================================================
   Wedding Invitation – script.js
   EDIT the CONFIG block with your details.
========================================================= */
const CONFIG = {
  // Muhurtham start, with timezone (IST = +05:30). Drives the countdown.
  weddingDate: "2026-12-20T10:30:00+05:30",

  // WhatsApp number: country code + number, digits only (e.g. 919876543210)
  whatsappNumber: "91XXXXXXXXXX",

  // Google Maps link used by "Get Directions" / "Open in Google Maps"
  mapsLink: "https://maps.google.com/?q=Kochi,Kerala",

  // Used inside the pre-filled WhatsApp messages
  coupleNames: "Arjun & Meera",
};

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Missing gallery photos → elegant monogram placeholder ---------- */
  $$(".stack img").forEach((img) => {
    const hide = () => img.classList.add("no-img");
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide);
  });

  /* ---------- Loader → enable the door button once the artwork is ready ---------- */
  const loader = $("#loader");
  const openBtn = $("#openBtn");
  let ready = false;
  function markReady() {
    if (ready) return;
    ready = true;
    loader.classList.add("done");
    openBtn.disabled = false;
    $("#openLabel").textContent = "Open Invitation";
  }
  const preload = (src) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = res; i.src = src; });
  Promise.all(["assets/images/door.jpg", "assets/images/temple.jpg"].map(preload))
    .then(() => document.fonts ? document.fonts.ready : null)
    .then(() => setTimeout(markReady, 400));
  setTimeout(markReady, 5000); // safety on slow networks

  /* ---------- 1. Open the temple doors + start music ---------- */
  const gate = $("#gate");
  const music = $("#bgMusic");
  const musicBtn = $("#musicBtn");

  function playMusic() {
    music.volume = 0.55;
    music.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
  }
  openBtn.addEventListener("click", () => {
    if (gate.classList.contains("open")) return;
    gate.classList.add("open");
    playMusic(); // started by a tap, so phones allow it
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => {
      document.body.classList.add("opened");
      revealVisible();
      petals.start();
    }, reduceMotion ? 0 : 2400);
    setTimeout(() => {
      document.body.classList.remove("is-locked");
      musicBtn.classList.add("show");
      gate.style.display = "none";
    }, reduceMotion ? 50 : 3400);
  });

  /* ---------- Music toggle ---------- */
  musicBtn.addEventListener("click", () => {
    if (music.paused) playMusic();
    else { music.pause(); musicBtn.classList.remove("playing"); }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !music.paused) { music.pause(); music.dataset.resume = "1"; }
    else if (!document.hidden && music.dataset.resume) { delete music.dataset.resume; playMusic(); }
  });

  /* ---------- Falling rose & jasmine petals (canvas) ---------- */
  const petals = (() => {
    const cv = $("#petals");
    const ctx = cv.getContext("2d");
    let w, h, dpr, items = [], running = false, until = 0;
    const colors = ["#f3a6b4", "#e98a9d", "#f8c9d2", "#fff6e6", "#f6e3a6"];
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
    }
    function make(top) {
      return {
        x: Math.random() * w, y: top ? -20 * dpr : Math.random() * h,
        r: (5 + Math.random() * 6) * dpr, vy: (0.5 + Math.random() * 0.9) * dpr,
        sway: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.04,
        a: Math.random() * Math.PI, c: colors[(Math.random() * colors.length) | 0],
      };
    }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      const spawning = t < until;
      items.forEach((p, i) => {
        p.y += p.vy; p.sway += 0.015; p.x += Math.sin(p.sway) * 0.6 * dpr; p.a += p.spin;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.globalAlpha = 0.85; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        if (p.y > h + 20 * dpr) { if (spawning) items[i] = make(true); else p.dead = true; }
      });
      items = items.filter((p) => !p.dead);
      if (items.length) requestAnimationFrame(frame); else { running = false; ctx.clearRect(0, 0, w, h); }
    }
    addEventListener("resize", size);
    return {
      start(duration = 9000, count = innerWidth < 600 ? 28 : 46) {
        if (reduceMotion) return;
        size();
        for (let i = 0; i < count; i++) items.push(make(true));
        items.forEach((p) => (p.y = -Math.random() * h * 0.8));
        until = performance.now() + duration;
        if (!running) { running = true; requestAnimationFrame(frame); }
      },
    };
  })();

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
  function revealVisible() {
    $$(".reveal").forEach((el, i) => {
      if (el.getBoundingClientRect().top < innerHeight) setTimeout(() => el.classList.add("in"), i * 140);
    });
  }

  /* ---------- Gentle 3D tilt on the family cards (mouse only) ---------- */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- A message for you ---------- */
  $("#sealBtn").addEventListener("click", () => {
    $("#message").classList.add("open");
    $("#letterBody").setAttribute("aria-hidden", "false");
  });

  /* ---------- Countdown ---------- */
  const target = new Date(CONFIG.weddingDate).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const diff = Math.max(0, target - Date.now());
    $("#cd-d").textContent = pad(Math.floor(diff / 864e5));
    $("#cd-h").textContent = pad(Math.floor((diff / 36e5) % 24));
    $("#cd-m").textContent = pad(Math.floor((diff / 6e4) % 60));
    $("#cd-s").textContent = pad(Math.floor((diff / 1e3) % 60));
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Maps links ---------- */
  $$("[data-maps]").forEach((a) => (a.href = CONFIG.mapsLink));

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastT;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ---------- RSVP sheet → WhatsApp ---------- */
  const wa = (text) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  const sheet = $("#rsvpSheet");
  const form = $("#rsvpForm");
  let choice = "yes", choiceBtn = null;

  function openSheet(btn) {
    choice = btn.dataset.rsvp; choiceBtn = btn;
    $("#sheetTitle").textContent = choice === "yes" ? "Yes, I’ll be there" : "Sorry, can’t attend";
    $("#sheetKicker").textContent = choice === "yes" ? "Wonderful! Your response" : "We’ll miss you";
    form.classList.toggle("no-guests", choice !== "yes");
    sheet.classList.add("show");
    sheet.setAttribute("aria-hidden", "false");
    setTimeout(() => form.name.focus(), 350);
  }
  const closeSheet = () => { sheet.classList.remove("show"); sheet.setAttribute("aria-hidden", "true"); };
  $$("[data-rsvp]").forEach((btn) => btn.addEventListener("click", () => openSheet(btn)));
  $(".sheet-close").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
  $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
    const n = Math.min(20, Math.max(1, (parseInt(form.guests.value, 10) || 1) + Number(b.dataset.step)));
    form.guests.value = n;
  }));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) { form.name.focus(); return; }
    const note = form.note.value.trim();
    let msg;
    if (choice === "yes") {
      msg = `Hello! RSVP for the wedding of ${CONFIG.coupleNames} 💐\n\nName: ${name}\nResponse: Yes, I'll be there!\nGuests: ${form.guests.value}`;
    } else {
      msg = `Hello! RSVP for the wedding of ${CONFIG.coupleNames}\n\nName: ${name}\nResponse: Sorry, I can't attend, but I'll celebrate with you in my thoughts. 💛`;
    }
    if (note) msg += `\n\nMessage: ${note}`;
    window.open(wa(msg), "_blank");
    closeSheet();
    if (choiceBtn) choiceBtn.classList.add("sent");
    showToast("Thank you! Your response is ready to send ✨");
    if (choice === "yes") petals.start(3500, 30);
  });
  $$("[data-help]").forEach((a) => (a.href = wa(`Hi! I need help planning my travel for ${CONFIG.coupleNames}'s wedding.`)));

  /* ---------- Gallery: polaroid stack carousel ---------- */
  const stack = $("#stack");
  const cards = $$("figure", stack);
  cards.forEach((fig) => {
    const img = $("img", fig);
    const photo = document.createElement("div");
    photo.className = "photo";
    fig.insertBefore(photo, img);
    photo.appendChild(img);
    const cap = document.createElement("figcaption");
    cap.textContent = fig.dataset.caption || "";
    fig.appendChild(cap);
  });
  let current = 0;
  $("#photoTotal").textContent = pad(cards.length);

  function layout() {
    const n = cards.length;
    cards.forEach((fig, i) => {
      let d = i - current;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const abs = Math.abs(d);
      const tilt = [0, 5, 8][Math.min(abs, 2)] * Math.sign(d);
      fig.style.transform = `translateX(calc(-50% + ${d * 18}%)) translateY(${Math.min(abs, 2) * 10}px) rotate(${tilt}deg) scale(${1 - Math.min(abs, 2) * 0.08})`;
      fig.style.zIndex = 10 - abs;
      fig.style.opacity = abs > 2 ? 0 : abs === 0 ? 1 : 0.92 - abs * 0.12;
      fig.style.pointerEvents = abs === 0 ? "auto" : "none";
    });
    $("#photoNow").textContent = pad(current + 1);
    $("#photoBar").style.width = ((current + 1) / n) * 100 + "%";
  }
  const go = (step) => { current = (current + step + cards.length) % cards.length; layout(); };
  $("#prevPhoto").addEventListener("click", () => go(-1));
  $("#nextPhoto").addEventListener("click", () => go(1));
  layout();

  let sx = 0, moved = false;
  stack.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; moved = false; }, { passive: true });
  stack.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { moved = true; go(dx < 0 ? 1 : -1); }
  });

  const lb = $("#lightbox");
  cards.forEach((fig, i) => fig.addEventListener("click", () => {
    const img = $("img", fig);
    if (moved || i !== current || img.classList.contains("no-img")) return;
    $("#lbImg").src = img.src;
    $("#lbImg").alt = img.alt;
    $("#lbCap").textContent = fig.dataset.caption || "";
    lb.classList.add("show");
    lb.setAttribute("aria-hidden", "false");
  }));
  const closeLb = () => { lb.classList.remove("show"); lb.setAttribute("aria-hidden", "true"); };
  $(".lb-close").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeLb(); closeSheet(); }
    if (lb.classList.contains("show") || sheet.classList.contains("show")) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });
});
