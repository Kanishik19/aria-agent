// ============================================================
// agent.js — The ReAct-style reasoning engine (runs in browser)
// Parses user queries, calls mock tools, scores and ranks results
// ============================================================

const Agent = (() => {

  // ── PARSE QUERY ────────────────────────────────────────────
  function parseQuery(q) {
    const lq = q.toLowerCase();
    const areas = [];
    if (lq.includes("whitefield") || lq.includes("itpl"))     areas.push("whitefield");
    if (lq.includes("koramangala") || lq.includes("kormang")) areas.push("koramangala");
    if (lq.includes("hsr"))                                    areas.push("hsr");
    if (lq.includes("hebbal"))                                 areas.push("hebbal");

    // If "compare" or "vs" and only one area found, add a second
    if ((lq.includes("compare") || lq.includes(" vs ")) && areas.length < 2) {
      if (!areas.includes("whitefield"))   areas.push("whitefield");
      if (!areas.includes("koramangala"))  areas.push("koramangala");
    }
    if (areas.length === 0) areas.push("whitefield");

    // Budget
    let budget = 8000000;
    const cr = lq.match(/(\d+(?:\.\d+)?)\s*cr/);
    const lk = lq.match(/(\d+(?:\.\d+)?)\s*l(?:akh|akhs?)?/);
    if (cr) budget = parseFloat(cr[1]) * 10000000;
    else if (lk) budget = parseFloat(lk[1]) * 100000;

    // Apply filter overrides from filter bar
    const activeFilters = Array.from(document.querySelectorAll(".fbtn.active")).map(b => b.dataset.val);
    if (activeFilters.includes("under80")  && !cr && !lk) budget = 8000000;
    if (activeFilters.includes("under1cr") && !cr && !lk) budget = 10000000;

    // Bedrooms
    let br = 2;
    const bm = lq.match(/(\d)\s*bhk/);
    if (bm) br = parseInt(bm[1]);
    if (activeFilters.includes("3BHK") && !bm) br = 3;
    if (activeFilters.includes("2BHK") && !bm) br = 2;

    // Commute destination
    let dest = null;
    if (lq.includes("mg road"))         dest = "mg road";
    else if (lq.includes("electronic city")) dest = "electronic city";
    else if (lq.includes("manyata"))    dest = "manyata";
    else if (lq.includes("marathahalli")) dest = "marathahalli";
    else if (lq.includes("office") || lq.includes("work") || lq.includes("commute")) dest = "mg road";

    const school = lq.includes("school") || lq.includes("kids") || lq.includes("children") ||
                   lq.includes("family") || activeFilters.includes("schools");
    const safe   = lq.includes("safe") || lq.includes("crime") || lq.includes("security") ||
                   activeFilters.includes("safe");

    return { areas, budget, br, dest, school, safe };
  }

  // ── TOOL: GET COMMUTE ──────────────────────────────────────
  function getCommute(propId, dest) {
    if (!dest) return null;
    const map = DB.commute[propId] || {};
    for (const k of Object.keys(map)) {
      if (dest.includes(k) || k.includes(dest.split(" ")[0])) return map[k];
    }
    return 35; // fallback estimate
  }

  // ── SCORING — holistic, not hardcoded filters ──────────────
  function scoreProperty(p, area, params) {
    const { budget, dest, school, safe } = params;
    let s = 0;

    // Price fit (cheaper relative to budget = more headroom = better)
    s += Math.min(1, Math.max(0, 1 - (p.price / budget) * 0.5)) * 2;

    // Space efficiency
    s += Math.min(1, (p.sqft / (p.price / 100000)) / 16) * 1.5;

    // School quality (weight 2x if user cares)
    const sd = DB.schools[area] || { r: 7 };
    s += (sd.r / 10) * (school ? 2 : 1);

    // Safety (weight 2x if user cares)
    const cd = DB.crime[area] || { safety: 6.5 };
    s += (cd.safety / 10) * (safe ? 2 : 1);

    // Commute (if destination provided)
    if (dest) {
      const mn = getCommute(p.id, dest);
      if (mn) s += Math.max(0, 1 - (mn - 10) / 60) * 1.5;
    }

    // Amenity richness
    s += Math.min(1, p.am.length / 5) * 0.8;

    // Trust signals
    if (p.rera) s += 0.3;
    if (p.age <= 3) s += 0.3;

    return Math.min(10, Math.round(s * 10) / 10);
  }

  // ── REASON BUILDER ─────────────────────────────────────────
  function buildReason(p, area, params, rank) {
    const sd  = DB.schools[area] || { r: 7 };
    const cd  = DB.crime[area]   || { safety: 6.5, trend: "stable", note: "" };
    const spl = (p.sqft / (p.price / 100000)).toFixed(1);
    const gap = Math.round((params.budget - p.price) / 100000);
    const mn  = params.dest ? getCommute(p.id, params.dest) : null;

    let r = "";
    if (rank === 0) r += "Top recommendation. ";
    r += `Offers ${p.sqft} sqft at ₹${(p.price / 100000).toFixed(0)}L — ${spl} sqft per lakh, `;
    r += parseFloat(spl) > 13 ? "above the area average. " : "competitive for this locality. ";
    r += `School quality in ${area.charAt(0).toUpperCase() + area.slice(1)} averages ${sd.r}/10`;
    r += params.school ? " — strong match for your family priority. " : ". ";
    r += `Safety score ${cd.safety}/10 with a ${cd.trend.toLowerCase()} crime trend. ${cd.note} `;
    if (mn)  r += `Commute to ${params.dest}: ~${mn} min peak hour. `;
    if (gap > 0) r += `₹${gap}L within your budget. `;
    if (p.rera) r += "RERA registered. ";
    return r.trim();
  }

  // ── FORMAT HELPERS ─────────────────────────────────────────
  function fp(p) { return "₹" + (p / 100000).toFixed(0) + "L"; }

  // ── MAIN RUN ───────────────────────────────────────────────
  function run(query) {
    const params = parseQuery(query);
    const trace  = [];
    const all    = [];

    trace.push({ t:"think", m:`Understood: ${params.br}BHK · budget ${fp(params.budget)} · areas: ${params.areas.join(", ")}${params.dest ? " · commute to " + params.dest : ""}` });

    for (const area of params.areas) {

      // Tool 1: properties
      trace.push({ t:"tool", m:`get_properties("${area}", ${fp(params.budget)}, ${params.br}BHK)` });
      const props = (DB.props[area] || []).filter(p =>
        p.price <= params.budget && p.br >= params.br && p.br <= params.br + 1
      );
      trace.push({ t:"res", m:`← ${props.length} properties found` });

      // Tool 2: schools
      trace.push({ t:"tool", m:`get_school_ratings("${area}")` });
      const sd = DB.schools[area] || { r: 7.0 };
      trace.push({ t:"res", m:`← avg ${sd.r}/10` });

      // Tool 3: crime
      trace.push({ t:"tool", m:`get_crime_data("${area}")` });
      const cd = DB.crime[area] || { safety: 6.5 };
      trace.push({ t:"res", m:`← safety ${cd.safety}/10 · trend: ${cd.trend || "stable"}` });

      // Tool 4: commute for top candidates
      if (params.dest && props.length > 0) {
        for (const p of props.slice(0, 3)) {
          trace.push({ t:"tool", m:`get_commute_time("${p.id}", "${params.dest}")` });
          const mn = getCommute(p.id, params.dest);
          trace.push({ t:"res", m:`← ${mn} min to ${params.dest}` });
        }
      }

      for (const p of props) {
        const sc = scoreProperty(p, area, params);
        all.push({ p, area, sc, sd, cd });
      }
    }

    // Sort by score descending, take top 5
    all.sort((a, b) => b.sc - a.sc);
    const top = all.slice(0, 5);

    // Attach reasons
    top.forEach((r, i) => {
      r.reason   = buildReason(r.p, r.area, params, i);
      r.commuteMn = params.dest ? getCommute(r.p.id, params.dest) : null;
    });

    return { trace, top, params, areas: params.areas };
  }

  return { run, fp };
})();
