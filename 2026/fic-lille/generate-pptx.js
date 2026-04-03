#!/usr/bin/env node
// Range42 FIC Lille 2026 — PPTX Generator
// Faithful recreation of the LaTeX beamer presentation + 2 new slides + screenshots

const path = require("path");
const pptxgen = require("pptxgenjs");

// --- PALETTE (matches LaTeX cyber theme exactly) ---
const C = {
  bg:     "0B0F14",  // cyber-bg
  ink:    "E6EEF5",  // cyber-ink
  accent: "217EAA",  // cyber-accent
  mid:    "7D9CB7",  // cyber-mid
  soft:   "8CA4AC",  // cyber-soft
  green:  "2ECC71",
  red:    "E74C3C",
  orange: "F39C12",
  white:  "FFFFFF",
  box:    "141A22",  // tcolorbox background
  boxBdr: "8CA4AC",  // tcolorbox border (cyber-soft)
};

// --- FONTS (IBM Plex Sans fallback to Calibri) ---
const FONT = "Calibri";

// --- IMAGE PATHS ---
const IMG = path.join(__dirname, "../../images");
const LOCAL = path.join(__dirname, "images");

// -- Slide dimensions: 10" x 5.625" (16:9) --
// Beamer-style margins: 0.5" left/right, title area at top

// =========================================================================
// HELPER: Standard slide with beamer-style frame title and progress bar
// =========================================================================
function makeSlide(pres, title, opts = {}) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Progress bar at very top (like metropolis theme)
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.accent } });

  if (title) {
    s.addText(title, {
      x: 0.5, y: 0.15, w: 9, h: 0.5,
      fontSize: opts.titleSize || 26, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    // Thin line under title (like metropolis)
    s.addShape(pres.shapes.LINE, {
      x: 0.5, y: 0.68, w: 9, h: 0,
      line: { color: C.soft, width: 0.5 },
    });
  }

  // TLP footer
  s.addText("TLP:CLEAR — Information may be shared freely without restriction.", {
    x: 0.3, y: 5.3, w: 9.4, h: 0.25,
    fontSize: 7, fontFace: FONT, color: C.accent, bold: true, align: "left",
  });

  return s;
}

// =========================================================================
// HELPER: Section divider slide (like \section{} in metropolis beamer)
// =========================================================================
function sectionSlide(pres, title) {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.accent } });
  s.addText(title, {
    x: 0.5, y: 2.0, w: 9, h: 1.2,
    fontSize: 34, fontFace: FONT, color: C.ink, bold: true, valign: "middle",
    margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.5, y: 3.2, w: 9, h: 0,
    line: { color: C.soft, width: 0.5 },
  });
  s.addText("TLP:CLEAR — Information may be shared freely without restriction.", {
    x: 0.3, y: 5.3, w: 9.4, h: 0.25,
    fontSize: 7, fontFace: FONT, color: C.accent, bold: true, align: "left",
  });
  return s;
}

// =========================================================================
// HELPER: tcolorbox-style info box
// =========================================================================
function infoBox(s, x, y, w, text) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h: 0.55,
    fill: { color: C.box },
    line: { color: C.boxBdr, width: 1 },
  });
  s.addText(text, {
    x: x + 0.15, y, w: w - 0.3, h: 0.55,
    fontSize: 12, fontFace: FONT, color: C.ink, italic: true, valign: "middle",
  });
}

// =========================================================================
// HELPER: Bullet list (like beamer itemize)
// =========================================================================
function bulletList(s, x, y, w, items, opts = {}) {
  const parts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (typeof item === "string") {
      return { text: item, options: { bullet: true, breakLine: !isLast, fontSize: opts.fontSize || 14, color: C.ink } };
    }
    // Rich item: { text, bold, color, accent }
    const textOpts = { bullet: true, breakLine: !isLast, fontSize: opts.fontSize || 14, color: item.color || C.ink };
    if (item.bold) textOpts.bold = true;
    return { text: item.text, options: textOpts };
  });
  s.addText(parts, {
    x, y, w, h: opts.h || (items.length * 0.42 + 0.2),
    fontFace: FONT, color: C.ink, paraSpaceAfter: opts.spacing || 6, valign: "top",
  });
}

// --- GLOBAL ---
let pres;

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "NC3 / Range42 Team";
  pres.title = "Range42 — Progress & Showcase — FIC Lille 2026";

  // =========================================================================
  // 1. TITLE SLIDE
  // =========================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.accent } });
    s.addText("Range42 — Progress & Showcase", {
      x: 0.5, y: 1.5, w: 9, h: 0.9,
      fontSize: 36, fontFace: FONT, color: C.ink, bold: true, align: "center",
    });
    s.addText("Open Cyber Range Platform for Collaborative Security Training", {
      x: 1, y: 2.5, w: 8, h: 0.5,
      fontSize: 16, fontFace: FONT, color: C.mid, align: "center",
    });
    s.addText("NC3 / Range42 Team", {
      x: 1, y: 3.3, w: 8, h: 0.4,
      fontSize: 14, fontFace: FONT, color: C.soft, align: "center",
    });
    s.addText("FIC Lille 2026", {
      x: 1, y: 3.7, w: 8, h: 0.4,
      fontSize: 14, fontFace: FONT, color: C.soft, align: "center",
    });
    s.addText("Proxmox   |   Ansible   |   Orchestration   |   Telemetry", {
      x: 1, y: 4.4, w: 8, h: 0.3,
      fontSize: 11, fontFace: FONT, color: C.soft, align: "center",
    });
    s.addText("TLP:CLEAR — Information may be shared freely without restriction.", {
      x: 0.3, y: 5.3, w: 9.4, h: 0.25,
      fontSize: 7, fontFace: FONT, color: C.accent, bold: true,
    });
    s.addNotes("Goal: 20-minute overview of Range42's progress since 2025 with screenshots of the deployer UI.\nAudience: cybersecurity professionals, government, European ecosystem partners.");
  }

  // =========================================================================
  // 2. WHY AN OPEN-SOURCE CYBER RANGE? (NEW — above Public Money Public Code)
  // =========================================================================
  {
    const s = makeSlide(pres, "Why an Open-Source Cyber Range?");
    s.addText("The case for SMEs, integrators, and service providers", {
      x: 0.5, y: 0.75, w: 9, h: 0.35,
      fontSize: 13, fontFace: FONT, color: C.mid, italic: true, margin: 0,
    });

    bulletList(s, 0.5, 1.2, 9, [
      { text: "Reduced costs: freely available tools lower the investment for security testing and training — no licence fees", bold: false },
      { text: "Empowers integrators & MSSPs: service providers can build tailored solutions for SME clients without vendor lock-in", bold: false },
      { text: "Accessible compliance: SMEs can conduct vulnerability assessments, penetration tests, and compliance drills at a fraction of the cost", bold: false },
      { text: "Workforce development: training providers can deploy realistic labs for students and employees without expensive infrastructure", bold: false },
      { text: "Community-driven quality: open-source contributions from the security community continuously expand scenario coverage", bold: false },
      { text: "Sovereignty & control: organisations keep full control over sensitive training data — no cloud dependency", bold: false },
    ], { fontSize: 13, h: 3.0, spacing: 8 });

    infoBox(s, 0.5, 4.5, 9, "Open-source cyber ranges make professional-grade security training economically viable for organisations of all sizes.");
    s.addNotes("Key message: Open-source dramatically lowers the cost of entry for cyber range capabilities.\n\n- SMEs typically can't afford commercial cyber range platforms (50k-500k EUR/year)\n- Service providers (MSSPs, integrators) can build on Range42 without licensing overhead\n- Training institutions can deploy realistic labs for students\n- Keeps sensitive training data sovereign — no cloud dependency\n- Community contributions improve quality continuously");
  }

  // =========================================================================
  // 3. PUBLIC MONEY, PUBLIC CODE
  // =========================================================================
  {
    const s = makeSlide(pres, "Public Money, Public Code. Let's go all the way, shall we?", { titleSize: 22 });

    // Two-column layout
    s.addText("Team & Funding", {
      x: 0.5, y: 0.85, w: 5.5, h: 0.4,
      fontSize: 18, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.3, 5.5, [
      "Core team of 3 — InfoSec & DevOps engineers",
      "Collaboration model with NC3 & ecosystem partners",
      "Public grant for cyber training infrastructure",
      { text: "FOSS model: no licensing costs, transparent development", color: C.ink },
    ], { fontSize: 13, h: 2.5, spacing: 8 });

    // Right side — PMPC concept
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.5, y: 1.0, w: 3, h: 2.8,
      fill: { color: C.box },
      line: { color: C.boxBdr, width: 1 },
    });
    s.addText("PUBLIC MONEY\nPUBLIC CODE", {
      x: 6.5, y: 1.3, w: 3, h: 1.2,
      fontSize: 20, fontFace: FONT, color: C.accent, bold: true, align: "center",
      charSpacing: 2,
    });
    s.addText("publiccode.eu", {
      x: 6.5, y: 2.6, w: 3, h: 0.3,
      fontSize: 10, fontFace: FONT, color: C.soft, align: "center",
    });
    s.addText("If it is public money,\nit should be public code.", {
      x: 6.5, y: 3.0, w: 3, h: 0.6,
      fontSize: 11, fontFace: FONT, color: C.mid, italic: true, align: "center",
    });

    s.addNotes("Emphasize public funding = public ownership = public benefit.\nThe FSFE 'Public Money, Public Code' campaign advocates that publicly funded software should be Free and Open Source.");
  }

  // =========================================================================
  // 4. AGENDA
  // =========================================================================
  {
    const s = makeSlide(pres, "Agenda");
    const items = [
      "Why open-source cyber ranges matter",
      "Public Money, Public Code",
      "What is a cyber range & what is Range42",
      "Progress since 2025: what's new",
      "Architecture & Deployer UI in action",
      "What's coming: Reporting Tool & Exercise Management Platform",
      "Today vs. tomorrow & development roadmap",
      "Key repositories, lessons learned & how to get involved",
    ];
    const parts = items.map((item, i) => {
      const isLast = i === items.length - 1;
      const text = typeof item === "string" ? item : item.text;
      const color = typeof item === "string" ? C.ink : item.color;
      const bold = typeof item === "string" ? false : item.bold;
      return { text: `${i + 1}.  ${text}`, options: { breakLine: !isLast, fontSize: 15, color, bold } };
    });
    s.addText(parts, {
      x: 1.0, y: 0.9, w: 8, h: 4.0,
      fontFace: FONT, paraSpaceAfter: 8,
    });
    s.addNotes("Highlight the deployer UI screenshots as the centerpiece of this talk (item 6).\nThe agenda now reflects the two new slides: open-source rationale and cyber range definition.");
  }

  // =========================================================================
  // 5. WHAT IS A CYBER RANGE? (NEW — above What is Range42?)
  // =========================================================================
  {
    const s = makeSlide(pres, "What is a Cyber Range?");

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 0.85, w: 9, h: 0.65,
      fill: { color: C.box },
      line: { color: C.accent, width: 1 },
    });
    s.addText("A simulated, isolated environment where cybersecurity professionals practice attack and defence techniques, test tools, and train for real-world incidents — without risk to production systems.", {
      x: 0.65, y: 0.85, w: 8.7, h: 0.65,
      fontSize: 12, fontFace: FONT, color: C.ink, italic: true, valign: "middle",
    });

    s.addText("Common use cases:", {
      x: 0.5, y: 1.7, w: 9, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });

    bulletList(s, 0.5, 2.1, 4.3, [
      { text: "Penetration testing — practice offensive techniques against realistic targets", bold: false },
      { text: "Incident response — train blue teams to detect, contain, and remediate attacks", bold: false },
      { text: "Red vs. Blue exercises — adversarial team drills with live attack and defence", bold: false },
    ], { fontSize: 12, h: 1.8, spacing: 6 });

    bulletList(s, 5.2, 2.1, 4.3, [
      { text: "Vulnerability assessment — scan and evaluate systems for known weaknesses (CVEs)", bold: false },
      { text: "Malware analysis — safely detonate and study malware in sandboxed environments", bold: false },
      { text: "Security training — structured courses for students, employees, and certification prep", bold: false },
    ], { fontSize: 12, h: 1.8, spacing: 6 });

    infoBox(s, 0.5, 4.2, 9, "Think of it as a flight simulator for cybersecurity — real tools, real techniques, zero production risk.");
    s.addNotes("A cyber range is essentially a 'flight simulator for cybersecurity'.\n\nExamples:\n- Military/government: simulate nation-state attacks, test critical infrastructure defences\n- Enterprise: train SOC analysts on real incident scenarios\n- Education: hands-on labs for cybersecurity students\n- Compliance: validate security controls and incident response procedures");
  }

  // =========================================================================
  // 6. WHAT IS RANGE42?
  // =========================================================================
  {
    const s = makeSlide(pres, "What is Range42?");
    bulletList(s, 0.5, 0.85, 9, [
      { text: "Open cyber range platform for offensive, defensive, and hybrid training", bold: true },
      { text: "Reproducible Infrastructure-as-Code: Proxmox, Ansible, Docker", bold: true },
      { text: "Flexible & extensible: supports CVE labs, misconfigurations, forensics, malware analysis", bold: true },
    ], { fontSize: 14, h: 2.0, spacing: 10 });
    infoBox(s, 0.5, 3.0, 9, "Built to simulate real-world incidents safely, with isolation, snapshots, and telemetry.");
    s.addNotes("Anchor on 'safe realism' and extensibility.\n\nRange42 is not just a tool — it's a modular platform.\n- Built on Proxmox (hypervisor), Ansible (automation), Docker (containers), FastAPI (backend), Vue 3 (frontend).\n- Every component is open-source and replaceable.\n- The IaC approach means entire lab environments are reproducible and version-controlled.\n- Snapshots allow instant reset between training sessions.");
  }

  // =========================================================================
  // SECTION: Progress Since 2025
  // =========================================================================
  sectionSlide(pres, "Progress Since 2025").addNotes("Transition to the progress update section.\n\nSince the 2025 OSCL presentation, Range42 has seen significant development across all repositories.\nThe next few slides show concrete numbers and milestones.");

  // =========================================================================
  // 7. PROGRESS SINCE 2025 — BY THE NUMBERS
  // =========================================================================
  {
    const s = makeSlide(pres, "Progress Since 2025");
    s.addText("By the Numbers", {
      x: 0.5, y: 0.85, w: 9, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.25, 9, [
      { text: "520+ total commits across 14 repositories (up from 400+)", color: C.accent, bold: true },
      "Backend API: 156 commits — major refactor (86 routes -> 10 modules)",
      "Deployer UI: 74 commits — from prototype to functional tool",
      "Proxmox controller: 112 commits — cloud-init, VM templates, storage",
    ], { fontSize: 13, h: 1.8 });

    s.addText("Key Milestones", {
      x: 0.5, y: 3.15, w: 9, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 3.55, 9, [
      { text: "Docker deployment for the backend API", color: C.accent },
      { text: "Real-time VM status via WebSocket on the canvas", color: C.accent },
      { text: "Comprehensive test suite and Sphinx documentation", color: C.accent },
      { text: "CyCon 2026 paper submitted — academic publication", color: C.accent },
    ], { fontSize: 13, h: 1.6 });
    s.addNotes("Concrete, measurable progress. This is not vaporware.\n\n- 520+ total commits across 14 repositories (up from 400+ in 2025).\n- Backend API: major refactor consolidated 86 route files into 10 clean domain modules.\n- Deployer UI went from early prototype to a functional, daily-use tool.\n- Proxmox controller handles cloud-init, VM templates, storage management.\n- Docker deployment and WebSocket real-time status are key new capabilities.\n- CyCon 2026 paper: first academic publication about Range42.");
  }

  // =========================================================================
  // 8. CURRENT ACHIEVEMENTS
  // =========================================================================
  {
    const s = makeSlide(pres, "Current Achievements");
    s.addText("What's Working Today", {
      x: 0.5, y: 0.85, w: 9, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.25, 9, [
      { text: "~100 CVEs & misconfigurations identified, ~20 deployable scenarios", color: C.accent },
      { text: "Automated provisioning on Proxmox with networking, VPN, firewalling", bold: true },
      { text: "Visual lab designer with drag-and-drop infrastructure composition", bold: true },
      { text: "Integrated monitoring via Wazuh for telemetry and alerting", bold: true },
      { text: "14 repositories managing automation, content, and tooling", bold: true },
    ], { fontSize: 13, h: 2.2, spacing: 8 });

    // Key milestone info box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.7, w: 9, h: 0.6,
      fill: { color: C.box },
      line: { color: C.boxBdr, width: 1 },
    });
    s.addText("Key Milestone: Backend is production-ready. The visual designer is now functional and actively used.", {
      x: 0.65, y: 3.7, w: 8.7, h: 0.6,
      fontSize: 13, fontFace: FONT, color: C.ink, bold: true, valign: "middle",
    });
    s.addNotes("Emphasize: both backend AND frontend are operational now.\n\n- ~100 CVEs and misconfigurations have been catalogued, ~20 are fully deployable as lab scenarios.\n- Provisioning is fully automated: VMs, LXC containers, network segments, VPN tunnels, firewall rules.\n- The visual lab designer lets users drag-and-drop infrastructure components and deploy with one click.\n- Wazuh provides SIEM-level monitoring for training environments.\n- This is real, working software — not a prototype or concept.");
  }

  // =========================================================================
  // 9. RANGE42 VS OTHER CYBER RANGES
  // =========================================================================
  {
    const s = makeSlide(pres, "Range42 vs. Other Cyber Ranges");

    const check = "\u2713", cross = "\u2717", tilde = "~";
    const hdrOpts = { bold: true, color: C.ink, fill: { color: C.box }, fontSize: 10, fontFace: FONT, align: "center" };
    const cellOpts = (val) => {
      const color = val === check ? C.green : val === cross ? C.red : C.orange;
      return { color, fontSize: 11, fontFace: FONT, align: "center", fill: { color: C.bg } };
    };
    const featOpts = (highlight) => ({
      color: highlight ? C.accent : C.ink, bold: highlight, fontSize: 10, fontFace: FONT, fill: { color: C.bg },
    });

    const headers = [
      { text: "Feature", options: { ...hdrOpts, align: "left" } },
      { text: "Range42", options: { ...hdrOpts, color: C.accent } },
      { text: "Commercial SaaS", options: hdrOpts },
      { text: "Cloud Native", options: hdrOpts },
      { text: "Traditional", options: hdrOpts },
    ];
    const row = (feat, hl, r42, saas, cloud, trad) => [
      { text: feat, options: featOpts(hl) },
      { text: r42, options: cellOpts(r42) },
      { text: saas, options: cellOpts(saas) },
      { text: cloud, options: cellOpts(cloud) },
      { text: trad, options: cellOpts(trad) },
    ];

    s.addTable([
      headers,
      row("Open Architecture", true, check, cross, cross, cross),
      row("IaC / GitOps", true, check, tilde, check, cross),
      row("Private Deployment", false, check, cross, tilde, check),
      row("Cost Control", false, check, cross, tilde, check),
      row("Full Data Custody", false, check, cross, cross, check),
      row("API Orchestration", false, check, check, check, cross),
      row("Rapid Reset / Snapshots", false, check, check, tilde, tilde),
      row("Custom Scenarios", false, check, cross, tilde, check),
      row("Visual Lab Designer", true, check, check, cross, cross),
    ], {
      x: 0.5, y: 0.85, w: 9,
      colW: [2.5, 1.5, 1.7, 1.5, 1.8],
      border: { pt: 0.5, color: C.soft },
      rowH: [0.38, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32],
    });

    infoBox(s, 0.5, 4.35, 9, "Range42's Edge: Full control, reproducibility, and cost-effectiveness without vendor lock-in.");
    s.addNotes("Added visual lab designer row — new differentiator since 2025.\n\nRange42 uniquely combines:\n- Open architecture (no vendor lock-in, full source access)\n- Visual lab designer (only open-source range with this)\n- Full data sovereignty (on-premise, no cloud dependency)\n- IaC/GitOps approach (reproducible, version-controlled environments)\n\nCommercial SaaS platforms cost 50k-500k EUR/year and lock you in.\nTraditional ranges lack automation and modern UX.\nCloud-native solutions sacrifice data custody.");
  }

  // =========================================================================
  // 10. ARCHITECTURE AT A GLANCE
  // =========================================================================
  {
    const s = makeSlide(pres, "Architecture at a Glance");
    bulletList(s, 0.5, 0.85, 9, [
      { text: "Hypervisor layer: Proxmox VMs/LXCs; snapshots; network segments", bold: true },
      { text: "Automation layer: Ansible roles orchestrate lifecycle, network, firewall, images", bold: true },
      { text: "Control plane: Backend API (FastAPI) with Docker deployment; WebSocket for live status", bold: true },
      { text: "UX layer: Deployer UI (visual designer), Exercise Management Platform (in development)", bold: true },
      { text: "Observability: Wazuh for logs/alerts; structured telemetry", bold: true },
    ], { fontSize: 13, h: 2.8, spacing: 10 });
    s.addNotes("Highlight WebSocket and Docker as new additions to the architecture.\n\n- Hypervisor layer: Proxmox manages VMs, LXC containers, snapshots, and isolated network segments.\n- Automation layer: Ansible roles handle the full lifecycle — provisioning, configuration, network setup, firewall rules, image management.\n- Control plane: FastAPI backend deployed via Docker; WebSocket provides real-time VM status updates to the UI.\n- UX layer: Deployer UI is the visual lab designer; Exercise Management Platform (EMP) is planned for scoring and reporting.\n- Observability: Wazuh SIEM provides log collection, alerting, and structured telemetry for training environments.");
  }

  // =========================================================================
  // 11. ARCHITECTURE — REPOSITORY MAPPING (IMAGE)
  // =========================================================================
  {
    const s = makeSlide(pres, "Architecture: Logical Components \u2192 Repository Mapping", { titleSize: 20 });
    s.addImage({
      path: path.join(IMG, "diagrams/architecture.png"),
      x: 0.5, y: 0.8, w: 9, h: 3.8,
      sizing: { type: "contain", w: 9, h: 3.8 },
    });
    infoBox(s, 0.5, 4.75, 9, "Left: Logical architecture flow.  Right: Actual GitHub repository structure.");
    s.addNotes("Left side shows logical architecture; right side shows actual GitHub repos.");
  }

  // =========================================================================
  // SECTION: Deployer UI in Action
  // =========================================================================
  sectionSlide(pres, "Deployer UI in Action").addNotes("Transition to the Deployer UI showcase.\n\nThe next slides show actual screenshots of the Deployer UI — the visual lab designer that makes Range42 accessible to users who don't want to write Ansible playbooks manually.");

  // =========================================================================
  // 12. DEPLOYER UI — OVERVIEW (text + features)
  // =========================================================================
  {
    const s = makeSlide(pres, "Deployer UI: Visual Lab Designer");

    // Two-column layout like the LaTeX version
    s.addText("Design", {
      x: 0.5, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.3, 4.3, [
      "Drag-and-drop VMs, LXC, networks, routers, firewalls",
      "Configure CPU, memory, disk, ISO per node",
      "Proxmox template selection with auto-fill",
      "Connect nodes to define topology",
    ], { fontSize: 12, h: 2.0, spacing: 6 });

    s.addText("Deploy", {
      x: 5.2, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.3, 4.3, [
      "Pre-deploy reconciliation and validation",
      "Ordered: networks \u2192 routers \u2192 VMs \u2192 config \u2192 start",
      "Real-time status via WebSocket",
      "Start, stop, restart, delete from the UI",
    ], { fontSize: 12, h: 2.0, spacing: 6 });

    s.addNotes("Set up context before showing the screenshots.\nThe UI is the most visual and impressive part of the platform.");
  }

  // =========================================================================
  // 13. DEPLOYER UI — CANVAS SCREENSHOT
  // =========================================================================
  {
    const s = makeSlide(pres, "Deployer UI: Canvas Overview");
    s.addImage({
      path: path.join(LOCAL, "deployer-ui.png"),
      x: 0.3, y: 0.8, w: 9.4, h: 4.5,
      sizing: { type: "contain", w: 9.4, h: 4.5 },
    });
    s.addNotes("The deployer UI canvas: drag-and-drop infrastructure design.\nLeft sidebar: component types (VM, LXC, Network, Router, Firewall).\nResources section: inventory browser, templates, import/export.\nCanvas shows connected nodes with real-time status colours.");
  }

  // =========================================================================
  // 14. DEPLOYER UI — VM CONFIG SCREENSHOT
  // =========================================================================
  {
    const s = makeSlide(pres, "Deployer UI: VM Configuration");

    // Left: screenshot
    s.addImage({
      path: path.join(LOCAL, "deployer-ui-vm-config.png"),
      x: 0.3, y: 0.8, w: 4.5, h: 4.5,
      sizing: { type: "contain", w: 4.5, h: 4.5 },
    });

    // Right: description
    s.addText("Configure each node:", {
      x: 5.2, y: 0.9, w: 4.3, h: 0.35,
      fontSize: 15, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.35, 4.3, [
      "Select Proxmox template with auto-fill",
      "Fine-tune CPU, RAM, storage",
      "Set IP addresses or use DHCP/cloud-init",
      "Add tags for organisation and filtering",
      "Attach description and metadata",
    ], { fontSize: 12, h: 2.5, spacing: 6 });

    s.addNotes("The configuration panel opens when clicking a node on the canvas.\nTemplate selection auto-fills resource values.\nTags are synced to Proxmox for deployed VMs.");
  }

  // =========================================================================
  // 15. DEPLOYER UI — RECONCILIATION + DEPLOYMENT
  // =========================================================================
  {
    const s = makeSlide(pres, "Deploy: Reconciliation & Progress");

    // Left: pre-deploy
    s.addText("Pre-Deploy Reconciliation", {
      x: 0.3, y: 0.85, w: 4.5, h: 0.3,
      fontSize: 13, fontFace: FONT, color: C.accent, bold: true, margin: 0,
    });
    s.addImage({
      path: path.join(LOCAL, "deployer-ui-predeployment.png"),
      x: 0.3, y: 1.2, w: 4.5, h: 2.5,
      sizing: { type: "contain", w: 4.5, h: 2.5 },
    });
    s.addText("Detect VMs on Proxmox not in your canvas — keep or remove.", {
      x: 0.3, y: 3.8, w: 4.5, h: 0.3,
      fontSize: 9, fontFace: FONT, color: C.soft, italic: true,
    });

    // Right: deployment
    s.addText("Deployment Progress", {
      x: 5.2, y: 0.85, w: 4.5, h: 0.3,
      fontSize: 13, fontFace: FONT, color: C.accent, bold: true, margin: 0,
    });
    s.addImage({
      path: path.join(LOCAL, "deployer-ui-deployment.png"),
      x: 5.2, y: 1.2, w: 4.5, h: 2.5,
      sizing: { type: "contain", w: 4.5, h: 2.5 },
    });
    s.addText("Ordered deployment with real-time progress and per-VM feedback.", {
      x: 5.2, y: 3.8, w: 4.5, h: 0.3,
      fontSize: 9, fontFace: FONT, color: C.soft, italic: true,
    });

    infoBox(s, 0.3, 4.25, 9.4, "Full workflow: Design \u2192 Reconcile \u2192 Deploy in order (networks \u2192 routers \u2192 VMs \u2192 config \u2192 start) \u2192 Monitor via WebSocket");
    s.addNotes("Pre-deploy reconciliation detects VMs existing on Proxmox but not on the canvas.\nDeployment follows strict order: networks, routers, VMs, configuration, start.\nReal-time logs show progress per VM.");
  }

  // =========================================================================
  // 16. PROXMOX — SCREENSHOT
  // =========================================================================
  {
    const s = makeSlide(pres, "Proxmox: The Hypervisor Backend");
    s.addText("Range42 provisions and manages VMs directly through the Proxmox API", {
      x: 0.5, y: 0.75, w: 9, h: 0.3,
      fontSize: 12, fontFace: FONT, color: C.mid, italic: true, margin: 0,
    });
    s.addImage({
      path: path.join(LOCAL, "proxmox.png"),
      x: 0.3, y: 1.1, w: 9.4, h: 4.2,
      sizing: { type: "contain", w: 9.4, h: 4.2 },
    });
    s.addNotes("Proxmox VE is the hypervisor that Range42 automates.\nShows management UI with deployed VMs, CPU/memory graphs, and task logs.\nRange42 interacts entirely via REST API — no manual intervention.");
  }

  // =========================================================================
  // 17. BACKEND API: PRODUCTION-READY
  // =========================================================================
  {
    const s = makeSlide(pres, "Backend API: Production-Ready");

    // Two columns
    s.addText("Major Refactoring", {
      x: 0.5, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.3, 4.3, [
      "86 route files \u2192 10 domain modules",
      "52 schema files \u2192 grouped modules",
      "Application factory pattern",
      "Structured logging throughout",
      "Centralised secret management",
    ], { fontSize: 12, h: 2.5, spacing: 6 });

    s.addText("New Capabilities", {
      x: 5.2, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.3, 4.3, [
      { text: "Docker deployment (compose)", color: C.accent },
      { text: "WebSocket API for live status", color: C.accent },
      { text: "Test suite: unit + integration", color: C.accent },
      { text: "Sphinx documentation", color: C.accent },
    ], { fontSize: 12, h: 2.0, spacing: 6 });

    s.addNotes("Backend went from prototype-quality to production-grade.\n\n- Major refactoring: 86 route files consolidated into 10 clean domain modules (auth, deployment, monitoring, etc.).\n- 52 Pydantic schema files grouped into coherent modules.\n- Application factory pattern for clean startup and testing.\n- Structured logging with correlation IDs for debugging.\n- Centralised secret management via Ansible Vault integration.\n- New: Docker Compose deployment makes setup trivial.\n- New: WebSocket API pushes real-time VM status changes to connected UI clients.\n- New: Comprehensive test suite covers both unit and integration testing.\n- New: Sphinx-generated API documentation.");
  }

  // =========================================================================
  // SECTION: What's Coming Next
  // =========================================================================
  sectionSlide(pres, "What's Coming Next").addNotes("Transition to the two major platforms under development: the Situational Reporting Tool and the Exercise Management Platform.\n\nThese represent the next evolution of Range42 — moving beyond infrastructure provisioning into exercise orchestration, evaluation, and scoring.");

  // =========================================================================
  // NEW: SITUATIONAL REPORTING TOOL
  // =========================================================================
  {
    const s = makeSlide(pres, "Situational Reporting Tool");
    s.addText("Managing the full report lifecycle during cyber range exercises", {
      x: 0.5, y: 0.75, w: 9, h: 0.3,
      fontSize: 13, fontFace: FONT, color: C.mid, italic: true, margin: 0,
    });

    // Left column — What it does
    s.addText("Report Lifecycle", {
      x: 0.5, y: 1.15, w: 4.3, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.55, 4.3, [
      "Template library: reusable, per-exercise report templates",
      "Multi-type reports: situational, CTI, incident, and spot reports",
      "Rich text editing with attachments and inline images",
      "Approval workflow: write \u2192 approve \u2192 submit \u2192 evaluate",
      "Campaign mode: track report evolution over time",
    ], { fontSize: 11, h: 2.3, spacing: 4 });

    // Right column — Roles & Scoring
    s.addText("Roles & Evaluation", {
      x: 5.2, y: 1.15, w: 4.3, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.55, 4.3, [
      "5 roles: Admin, BT Admin, Writer, Approver, Evaluator",
      "Per-section grading with configurable scales",
      "Evaluator view: compare teams side-by-side",
      "Scoring dashboard with granular access controls",
      "REST API for exporting scores to external systems",
    ], { fontSize: 11, h: 2.3, spacing: 4 });

    infoBox(s, 0.5, 4.1, 9, "Designed for blue team reporting today \u2014 architecture supports future red team engagement reports, attack logs, and findings.");
    s.addNotes("The Situational Reporting Tool is a web application for managing reports during cyber exercises.\n\nKey concepts:\n- Template library: admins create reusable report templates scoped per exercise.\n- Multi-section reports: each section has a free-text field, evaluator feedback field, and configurable grade.\n- Campaign mode: group reports of the same type to track evolution across multiple deadlines.\n- Approval workflow: optional — writers submit, approvers validate, then reports go to evaluators.\n- Evaluator views: campaign mode (section-by-section with history) and exercise mode (compare teams).\n\n5 roles:\n1. Global Admin — defines exercises, assigns users, creates templates\n2. BT Admin — assigns reports to team members, activates approval\n3. BT Report Writer — writes and submits reports\n4. BT Report Approver — approves before submission (optional)\n5. Report Evaluator — grades submitted reports\n\nScoring dashboard: per-team counts, grades, optional leaderboard.\nREST API enables integration with external scoring systems.\n\nFuture scope: red team reporting (engagement reports, attack timelines, vulnerability findings).\n\nStatus: concept document (v0.1, Feb 2026) — awaiting stakeholder review and tech stack decision.");
  }

  // =========================================================================
  // NEW: EXERCISE MANAGEMENT PLATFORM (EMP)
  // =========================================================================
  {
    const s = makeSlide(pres, "Exercise Management Platform");
    s.addText("Beyond CTFd \u2014 a full exercise orchestration and scoring platform", {
      x: 0.5, y: 0.75, w: 9, h: 0.3,
      fontSize: 13, fontFace: FONT, color: C.mid, italic: true, margin: 0,
    });

    // Left column — Platform features
    s.addText("Platform Capabilities", {
      x: 0.5, y: 1.15, w: 4.3, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.55, 4.3, [
      "Student portal: access exercises, view progress, leaderboards",
      "Scenario-driven: learning objectives, dependencies, timelines",
      "Gamified themes: hospital, bank, newsroom skins",
      "Multi-language support (i18n: EN, FR, DE, \u2026)",
      "LLM-assisted scenario generation (with human validation)",
    ], { fontSize: 11, h: 2.3, spacing: 4 });

    // Right column — Integration
    s.addText("Connecting the Dots", {
      x: 5.2, y: 1.15, w: 4.3, h: 0.35,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.55, 4.3, [
      "Deployer UI: provisions the lab infrastructure",
      "Backend API: orchestrates deployment and VM lifecycle",
      "Wazuh: feeds real-time security telemetry to exercises",
      "Reporting Tool: blue team reports scored alongside challenges",
      "Catalogue: exercise metadata, difficulty, prerequisites",
    ], { fontSize: 11, h: 2.3, spacing: 4 });

    infoBox(s, 0.5, 4.1, 9, "EMP ties the entire Range42 ecosystem together \u2014 from infrastructure provisioning to exercise delivery, monitoring, scoring, and reporting.");
    s.addNotes("The Exercise Management Platform (EMP) is the student-facing portal and exercise orchestration layer.\n\nHow it extends beyond CTFd:\n- Not just a flag-submission platform — integrates with the full Range42 ecosystem.\n- Deployer UI provisions the lab; EMP delivers the exercises on top.\n- Wazuh feeds real-time security telemetry into exercises (detect the attack, write the report).\n- Reporting Tool handles blue team reports; EMP handles challenge scoring.\n- Gamification layer provides themed skins: hospital, bank, mechanic, newsroom, classic.\n- Exercises have learning objectives, dependencies, timelines, and difficulty metadata from the catalogue.\n- LLM-assisted scenario generation can produce exercise content with human validation.\n\nArchitecture integration:\n- Backend API provides REST + WebSocket endpoints for deployment status, scoring, submissions.\n- Catalogue provides exercise metadata (CVE info, difficulty, prerequisites).\n- Wazuh streams security events for detection-based challenges.\n- Gamification layer wraps the UI in themed skins per exercise context.\n\nCurrent status:\n- Vue 3 mockup exists (range42-emp-mockup/)\n- Infrastructure slot prepared in deployment playbooks (web_emp.yml, VMID 1022)\n- Detailed specification not yet written — concept phase.\n- Related to Axis 2 (End-User Interfaces) and Axis 3 (Student-Facing Services) in the roadmap.");
  }

  // =========================================================================
  // SECTION: Today & Tomorrow
  // =========================================================================
  sectionSlide(pres, "Today & Tomorrow").addNotes("Transition to the comparison of what works today versus what's planned.\n\nThis section covers the current capabilities, the development roadmap with 6 strategic axes, and the 50 work blocks planned across quarterly milestones.");

  // =========================================================================
  // 18. TODAY VS TOMORROW
  // =========================================================================
  {
    const s = makeSlide(pres, "Today vs. Tomorrow");

    s.addText("Operational Today", {
      x: 0.5, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.3, 4.3, [
      "Full Proxmox automation (VMs, LXC, network, firewall, VPN)",
      "Visual lab designer with drag-and-drop",
      "Real-time VM status via WebSocket",
      "Template provisioning + reconciliation",
      "Docker-based API deployment",
      "Wazuh monitoring integration",
    ], { fontSize: 11, h: 2.8, spacing: 4 });

    s.addText("Coming Next", {
      x: 5.2, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.3, 4.3, [
      { text: "Situational Reporting Tool (blue team reports & evaluation)", color: C.accent },
      { text: "Exercise Management Platform (scoring, gamification, student portal)", color: C.accent },
      "LLM-assisted scenario generation",
      "Declarative Live State Engine",
      "ICS / IoT training scenarios",
      "Federated catalogue exchange",
    ], { fontSize: 11, h: 2.8, spacing: 4 });

    s.addNotes("Left = operational today. Right = roadmap items in development or planned.");
  }

  // =========================================================================
  // 19. DEVELOPMENT ROADMAP: 6 STRATEGIC AXES
  // =========================================================================
  {
    const s = makeSlide(pres, "Development Roadmap: 6 Strategic Axes");

    // Two columns of 3 axes each (like LaTeX)
    const axes = [
      ["Axis 0", "Core Stabilisation & Hardening", "Lock architecture, expand catalogue to 50+ labs"],
      ["Axis 1", "State Management (DLSE)", "Declarative Live State Engine for reconciliation"],
      ["Axis 2", "End-User Interfaces", "Deployer UI, EMP with scoring dashboards"],
      ["Axis 3", "Student-Facing Services", "Portals, guided workflows, self-service access"],
      ["Axis 4", "Industrial & IoT", "ICS/SCADA and IoT training scenarios"],
      ["Axis 5", "Open-Source Ecosystem", "NGSOTI synergy, federated catalogues, community"],
    ];

    for (let i = 0; i < 6; i++) {
      const col = i < 3 ? 0 : 1;
      const row = i % 3;
      const x = col === 0 ? 0.5 : 5.2;
      const y = 0.85 + row * 1.05;

      s.addText(`${axes[i][0]} — ${axes[i][1]}`, {
        x, y, w: 4.3, h: 0.35,
        fontSize: 13, fontFace: FONT, color: C.ink, bold: true, margin: 0,
      });
      s.addText(axes[i][2], {
        x, y: y + 0.35, w: 4.3, h: 0.35,
        fontSize: 11, fontFace: FONT, color: C.mid, margin: 0,
      });
    }

    infoBox(s, 0.5, 4.15, 9, "Based on the Range42 Execution Framework v0.8 — 50 work blocks across 6 axes with quarterly sequencing.");
    s.addNotes("These axes come from the official Range42 execution framework v0.8.\n\n- Axis 0: Foundation — stabilise the core architecture, expand the scenario catalogue to 50+ deployable labs.\n- Axis 1: DLSE (Declarative Live State Engine) — enable declarative state management so environments auto-reconcile to their desired state.\n- Axis 2: End-user interfaces — continue evolving the Deployer UI and build the Exercise Management Platform with scoring dashboards.\n- Axis 3: Student-facing services — self-service portals and guided workflows for trainees.\n- Axis 4: Industrial & IoT — ICS/SCADA and IoT training scenarios for critical infrastructure security.\n- Axis 5: Open-source ecosystem — NGSOTI collaboration, federated catalogue exchange, community growth.\n\n50 work blocks total, sequenced across quarterly milestones.");
  }

  // =========================================================================
  // SECTION: Key Repositories
  // =========================================================================
  sectionSlide(pres, "Key Repositories").addNotes("Transition to repository overview.\n\nRange42 is organised as 14 separate Git repositories under the github.com/range42 organisation.\n10 are public, 4 are private (deployment configs and sensitive playbooks).");

  // =========================================================================
  // 20. GITHUB ORGANISATION (screenshot)
  // =========================================================================
  {
    const s = makeSlide(pres, "GitHub: github.com/range42");
    s.addText("14 repositories  |  10 public, 4 private  |  520+ commits  |  Zero high-severity findings", {
      x: 0.5, y: 0.75, w: 9, h: 0.3,
      fontSize: 12, fontFace: FONT, color: C.mid, italic: true, margin: 0,
    });
    s.addImage({
      path: path.join(LOCAL, "github-repo-range42-page.png"),
      x: 0.3, y: 1.1, w: 9.4, h: 4.2,
      sizing: { type: "contain", w: 9.4, h: 4.2 },
    });
    s.addNotes("The Range42 GitHub organisation hosts all project repositories.\n14 repos total, 520+ commits.");
  }

  // =========================================================================
  // 21. ORGANISATION OVERVIEW (table)
  // =========================================================================
  {
    const s = makeSlide(pres, "Organisation Overview");

    s.addText("14 Repositories (10 public, 4 private) — 520+ commits, zero high-severity findings", {
      x: 0.5, y: 0.85, w: 9, h: 0.3,
      fontSize: 12, fontFace: FONT, color: C.accent, bold: true, margin: 0,
    });

    const hdr = (t, opts = {}) => ({ text: t, options: { bold: true, color: C.ink, fill: { color: C.box }, fontSize: 11, fontFace: FONT, ...opts } });
    const cell = (t, opts = {}) => ({ text: t, options: { color: C.ink, fill: { color: C.bg }, fontSize: 11, fontFace: FONT, ...opts } });

    s.addTable([
      [hdr("Repository"), hdr("Commits", { align: "center" }), hdr("Language"), hdr("Status", { align: "center" })],
      [cell("backend-api"), cell("156", { color: C.accent, bold: true, align: "center" }), cell("Python / FastAPI", { color: C.mid }), cell("Active", { color: C.green, align: "center" })],
      [cell("proxmox_controller"), cell("112", { color: C.accent, bold: true, align: "center" }), cell("Ansible / YAML", { color: C.mid }), cell("Active", { color: C.green, align: "center" })],
      [cell("catalog"), cell("97", { color: C.accent, bold: true, align: "center" }), cell("Ansible / Docker", { color: C.mid }), cell("Stable", { color: C.green, align: "center" })],
      [cell("playbooks"), cell("81", { color: C.accent, bold: true, align: "center" }), cell("Ansible / YAML", { color: C.mid }), cell("Active", { color: C.green, align: "center" })],
      [cell("deployer-ui"), cell("74", { color: C.accent, bold: true, align: "center" }), cell("Vue 3 / TypeScript", { color: C.mid }), cell("Active", { color: C.green, align: "center" })],
    ], {
      x: 0.5, y: 1.35, w: 9,
      colW: [3.0, 1.5, 2.5, 2.0],
      border: { pt: 0.5, color: C.soft },
      rowH: [0.42, 0.38, 0.38, 0.38, 0.38, 0.38],
    });

    s.addNotes("Updated commit counts as of March 2026.\n\n- backend-api (156 commits): Python/FastAPI — the orchestration engine. Major refactor completed.\n- proxmox_controller (112 commits): Ansible role for Proxmox API — handles VM creation, networking, templates, cloud-init.\n- catalog (97 commits): Ansible roles + Docker containers for CVE labs, misconfigurations, forensics, malware.\n- playbooks (81 commits): Deployment bundles and full scenario definitions (demo_lab, forensics_lab, etc.).\n- deployer-ui (74 commits): Vue 3 visual lab designer — newest but fastest-growing repo.\n\nHighlight the velocity in backend-api and deployer-ui — most active development areas.");
  }

  // =========================================================================
  // SECTION: Lessons Learned
  // =========================================================================
  sectionSlide(pres, "Lessons Learned").addNotes("Transition to lessons learned.\n\nBe honest about what worked and what was harder than expected. This builds credibility with the audience.");

  // =========================================================================
  // 22. LESSONS LEARNED
  // =========================================================================
  {
    const s = makeSlide(pres, "Lessons Learned");

    s.addText("Technical", {
      x: 0.5, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.3, 4.3, [
      { text: "Ansible + Proxmox API = powerful IaC combo", color: C.accent },
      "Snapshots are critical for training resets",
      { text: "Early refactoring pays off (86 \u2192 10 route files)", color: C.accent },
      "WebSocket enables compelling real-time UX",
    ], { fontSize: 12, h: 2.0, spacing: 6 });

    s.addText("Process", {
      x: 5.2, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.3, 4.3, [
      { text: "Governance overhead is real but unlocks collaboration", color: C.accent },
      "6-axis framework aligns a small team",
      "Documentation lags code — a universal pattern",
      "Docker simplifies cross-environment deployment",
    ], { fontSize: 12, h: 2.0, spacing: 6 });

    s.addNotes("Be honest about challenges. It builds trust with the audience.\n\nTechnical:\n- Ansible + Proxmox API is an extremely powerful combination for Infrastructure-as-Code.\n- Snapshots are essential — trainees break things, and instant reset is a must.\n- The early decision to refactor the backend from 86 files to 10 modules paid off enormously in maintainability.\n- WebSocket for real-time VM status makes the UI feel alive and responsive.\n\nProcess:\n- Governance (code review, documentation, planning) takes time but enables collaboration across the team.\n- The 6-axis framework helps a small team (3 people) stay aligned on priorities.\n- Documentation always lags behind code — this is universal, not unique to Range42.\n- Docker deployment removed the 'works on my machine' problem for the backend.");
  }

  // =========================================================================
  // 23. OPEN CHALLENGES & OPPORTUNITIES
  // =========================================================================
  {
    const s = makeSlide(pres, "Open Challenges & Opportunities");

    s.addText("Content & Coverage", {
      x: 0.5, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.3, 4.3, [
      "Expand to 50+ deployable scenarios",
      "ICS/IoT and forensics content",
      "Standardised scenario format",
    ], { fontSize: 12, h: 1.5, spacing: 6 });

    s.addText("Platform Maturity", {
      x: 5.2, y: 0.85, w: 4.3, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 5.2, 1.3, 4.3, [
      "CI/CD across all repositories",
      "Exercise Management Platform",
      "Federated catalogue exchange (NGSOTI)",
    ], { fontSize: 12, h: 1.5, spacing: 6 });

    // Call to action box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.3, w: 9, h: 0.6,
      fill: { color: C.box },
      line: { color: C.boxBdr, width: 1 },
    });
    s.addText("Your Expertise Matters: Every contribution — code, docs, testing, scenarios — moves the platform forward.", {
      x: 0.65, y: 3.3, w: 8.7, h: 0.6,
      fontSize: 13, fontFace: FONT, color: C.ink, bold: true, valign: "middle",
    });

    s.addNotes("Frame challenges as opportunities for impactful contributions.\n\nContent & Coverage:\n- Currently ~20 deployable scenarios out of ~100 identified CVEs/misconfigs. Goal is 50+.\n- ICS/IoT and forensics are high-demand areas with limited open-source content.\n- A standardised scenario format would enable community contributions and catalogue exchange.\n\nPlatform Maturity:\n- CI/CD pipelines needed across all 14 repositories for automated testing and deployment.\n- Exercise Management Platform (EMP) will add scoring, reporting, and student progress tracking.\n- Federated catalogue exchange (via NGSOTI) would let organisations share scenarios securely.\n\nEvery type of contribution matters: security researchers can add scenarios, developers can improve infrastructure, designers can enhance the UI.");
  }

  // =========================================================================
  // SECTION: Wrap-up
  // =========================================================================

  // =========================================================================
  // 24. GET INVOLVED
  // =========================================================================
  {
    const s = makeSlide(pres, "Get Involved");

    // Contribute
    s.addText("Contribute", {
      x: 0.5, y: 0.85, w: 5.5, h: 0.4,
      fontSize: 16, fontFace: FONT, color: C.ink, bold: true, margin: 0,
    });
    bulletList(s, 0.5, 1.3, 5.5, [
      { text: "Scenarios: CVE research, automation, gamification", bold: true },
      { text: "Infrastructure: Ansible roles, backend API, CI/CD", bold: true },
      { text: "UI/UX: Lab designer, Exercise Management Platform", bold: true },
    ], { fontSize: 13, h: 1.5, spacing: 8 });

    // Contact
    s.addText([
      { text: "range42.lu", options: { breakLine: true, fontSize: 14, color: C.accent, bold: true } },
      { text: "github.com/range42", options: { breakLine: true, fontSize: 14, color: C.accent, bold: true } },
      { text: "info@nc3.lu", options: { fontSize: 14, color: C.accent, bold: true } },
    ], {
      x: 0.5, y: 3.2, w: 5.5, h: 1.2,
      fontFace: FONT, paraSpaceAfter: 6,
    });

    // Contribute image on right
    s.addImage({
      path: path.join(IMG, "contribute.png"),
      x: 7.0, y: 1.0, w: 2.5, h: 2.5,
      sizing: { type: "contain", w: 2.5, h: 2.5 },
    });

    s.addNotes("Final call to action with clear next steps and contact information.\n\nThree main areas for contribution:\n- Scenarios: security researchers can contribute CVE labs, automation playbooks, gamified exercises.\n- Infrastructure: Ansible roles, backend API features, CI/CD pipelines.\n- UI/UX: the Deployer UI lab designer and the upcoming Exercise Management Platform.\n\nContact:\n- Website: range42.lu\n- GitHub: github.com/range42 (10 public repos, open issues, contribution guide)\n- Email: info@nc3.lu\n\nEmphasize that contributions of all sizes are welcome — from fixing a typo in documentation to building a complete training scenario.");
  }

  // =========================================================================
  // WRITE FILE
  // =========================================================================
  const outPath = path.join(__dirname, "Range42_FIC_Lille_2026.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX written to:", outPath);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
