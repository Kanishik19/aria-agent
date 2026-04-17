// ============================================================
// app.js — Event wiring, filter logic, main send() function
// ============================================================

// ── FILTER BUTTONS ─────────────────────────────────────────
document.getElementById("filters").addEventListener("click", e => {
  if (e.target.classList.contains("fbtn")) {
    e.target.classList.toggle("active");
  }
});

// ── EXAMPLE CHIPS ──────────────────────────────────────────
function chip(el) {
  document.getElementById("qinput").value = el.textContent;
  send();
}

// ── SCROLL TO SEARCH ───────────────────────────────────────
function scrollToSearch() {
  document.getElementById("search").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => document.getElementById("qinput").focus(), 500);
}

// ── ENTER KEY ──────────────────────────────────────────────
document.getElementById("qinput").addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

// ── MAIN SEND ──────────────────────────────────────────────
function send() {
  const inp  = document.getElementById("qinput");
  const btn  = document.getElementById("sendbtn");
  const q    = inp.value.trim();
  if (!q) return;
  inp.value = "";

  // Disable button, show spinner
  btn.disabled = true;
  document.getElementById("btn-text").style.display    = "none";
  document.getElementById("btn-spinner").style.display = "inline-block";

  // Append user message immediately
  UI.appendUserMsg(q);
  UI.showTyping();

  // Simulate agent "thinking" delay (500–900ms)
  setTimeout(() => {
    UI.hideTyping();

    // Run the agent
    const result = Agent.run(q);

    // Render response
    UI.renderAgentResponse(result);

    // Re-enable button
    btn.disabled = false;
    document.getElementById("btn-text").style.display    = "inline";
    document.getElementById("btn-spinner").style.display = "none";
  }, 700 + Math.random() * 300);
}
