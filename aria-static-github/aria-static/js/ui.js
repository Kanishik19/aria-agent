// ============================================================
// ui.js — All DOM rendering functions
// Builds and injects HTML for messages, cards, traces, etc.
// ============================================================

const UI = (() => {

  function getResultsArea() { return document.getElementById("results-area"); }

  // ── USER MESSAGE ───────────────────────────────────────────
  function appendUserMsg(text) {
    const d = document.createElement("div");
    d.className = "msg-user";
    d.textContent = text;
    getResultsArea().appendChild(d);
    d.scrollIntoView({ behavior: "smooth" });
  }

  // ── TYPING INDICATOR ───────────────────────────────────────
  function showTyping() {
    const d = document.createElement("div");
    d.className = "typing-indicator";
    d.id = "typing-indicator";
    d.innerHTML = `<div class="tdot"></div><div class="tdot"></div><div class="tdot"></div>`;
    getResultsArea().appendChild(d);
    d.scrollIntoView({ behavior: "smooth" });
  }

  function hideTyping() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  // ── TRACE BOX ─────────────────────────────────────────────
  function buildTrace(trace) {
    let html = `<div class="trace-box"><div class="trace-title">Agent reasoning trace</div>`;
    for (const t of trace) {
      const cls = t.t === "tool" ? "tool" : t.t === "res" ? "res" : "think";
      const pre = t.t === "tool" ? "→ "  : t.t === "res" ? "← " : "· ";
      html += `<div class="tline ${cls}">${pre}${escHtml(t.m)}</div>`;
    }
    html += `</div>`;
    return html;
  }

  // ── AREA COMPARE (multi-area search) ──────────────────────
  function buildAreaCompare(top, areas) {
    if (areas.length < 2) return "";
    const seen = {};
    let html = `<div class="area-compare">`;
    for (const { area, sc, sd, cd } of top) {
      if (!seen[area]) {
        seen[area] = true;
        const aLabel = area.charAt(0).toUpperCase() + area.slice(1);
        html += `<div class="acomp">
          <div class="acomp-name">${aLabel}</div>
          <div class="acomp-score">${sc.toFixed(1)}/10</div>
          <div class="acomp-meta">Schools ${sd.r} · Safety ${cd.safety}</div>
        </div>`;
      }
    }
    html += `</div>`;
    return html;
  }

  // ── SINGLE PROPERTY CARD ───────────────────────────────────
  function buildCard(item, rank) {
    const { p, sc, sd, cd, reason, commuteMn } = item;
    const rankLabel = String(rank + 1).padStart(2, "0");
    const pct = Math.round((sc / 10) * 100);

    return `
    <div class="pcard" onclick="this.classList.toggle('open')">
      <div class="pcard-inner">
        <div class="rank-strip">
          <div class="rank-n">${rankLabel}</div>
          <div class="rank-track"><div class="rank-fill" style="height:${pct}%"></div></div>
        </div>
        <div class="pcard-body">
          <div class="pcard-row1">
            <div>
              <div class="pcard-name">${escHtml(p.name)}</div>
              <div class="pcard-addr">${escHtml(p.addr)}</div>
            </div>
            <div class="score-pill">
              <span class="score-val">${sc.toFixed(1)}</span>
              <span class="score-lbl">Score</span>
            </div>
          </div>
          <div class="metrics-row">
            <div class="mtag"><span class="mtag-icon">◆</span>${Agent.fp(p.price)}</div>
            <div class="mtag"><span class="mtag-icon">◆</span>${p.br} BHK · ${p.sqft} sqft</div>
            ${commuteMn ? `<div class="mtag"><span class="mtag-icon">◆</span>${commuteMn} min commute</div>` : ""}
            ${p.rera    ? `<div class="mtag"><span class="mtag-icon">◆</span>RERA ✓</div>` : ""}
          </div>
          <div class="indrow">
            <div class="ind">
              <div class="ind-lbl">School quality</div>
              <div class="ind-bar"><div class="ind-fill-school" style="width:${sd.r * 10}%"></div></div>
              <div class="ind-val">${sd.r}/10</div>
            </div>
            <div class="ind">
              <div class="ind-lbl">Safety score</div>
              <div class="ind-bar"><div class="ind-fill-safety" style="width:${cd.safety * 10}%"></div></div>
              <div class="ind-val">${cd.safety}/10</div>
            </div>
          </div>
          <div class="expand-hint">↓ Tap to see agent's reasoning</div>
          <div class="reason-panel">
            <div class="reason-lbl">Agent's reasoning</div>
            <div class="reason-text">${escHtml(reason)}</div>
            <div class="am-tags">${p.am.map(a => `<span class="amtag">${escHtml(a)}</span>`).join("")}</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  // ── SUMMARY BOX ───────────────────────────────────────────
  function buildSummary(top, params) {
    const best = top[0];
    const aLabel = best.area.charAt(0).toUpperCase() + best.area.slice(1);
    let text = `<strong>${escHtml(best.p.name)}</strong> in ${aLabel} offers the best overall balance`;
    if (params.school) text += ` with top-tier school access (${best.sd.r}/10)`;
    if (params.safe)   text += ` and strong safety credentials (${best.cd.safety}/10)`;
    if (params.dest)   text += `, while keeping your commute manageable`;
    text += `. ${top.length > 1 ? "Tap each card to compare the trade-offs." : ""}`;

    return `<div class="summary-box">
      <div class="summary-icon">◆</div>
      <div class="summary-text"><strong>ARIA's verdict:</strong> ${text}</div>
    </div>`;
  }

  // ── FULL AGENT RESPONSE ───────────────────────────────────
  function renderAgentResponse(data) {
    const { trace, top, params, areas } = data;

    let html = `<div class="agent-block">`;

    // Trace
    html += buildTrace(trace);

    if (top.length === 0) {
      html += `<div class="no-results">
        No properties found within your budget in the requested area.
        Try increasing your budget or selecting a nearby locality.
      </div>`;
    } else {
      // Narrative
      const areaLabels = areas.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(" & ");
      html += `<div class="narrative">
        Analysed <strong>${top.length} properties</strong> across ${areaLabels}.
        <strong>${escHtml(top[0].p.name)}</strong> leads with a ${top[0].sc}/10 score`;
      if (params.school) html += `, strong school access (${top[0].sd.r}/10 avg)`;
      if (params.safe)   html += ` and safety score ${top[0].cd.safety}/10`;
      html += `. Tap any card to read the full reasoning.
      </div>`;

      // Area compare (only for multi-area)
      html += buildAreaCompare(top, areas);

      // Cards
      html += `<div class="cards-list">`;
      top.forEach((item, i) => { html += buildCard(item, i); });
      html += `</div>`;

      // Summary
      html += buildSummary(top, params);
    }

    html += `</div>`;

    const block = document.createElement("div");
    block.innerHTML = html;
    getResultsArea().appendChild(block);
    block.scrollIntoView({ behavior: "smooth" });
  }

  // ── HELPERS ───────────────────────────────────────────────
  function escHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  return { appendUserMsg, showTyping, hideTyping, renderAgentResponse };
})();
