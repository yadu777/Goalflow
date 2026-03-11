import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0F1117", card: "#1A1D27", cardHover: "#1F2335",
  accent: "#6EE7B7", accentSoft: "#6EE7B720", accentBorder: "#6EE7B740",
  warn: "#FBBF24", danger: "#F87171",
  text: "#E2E8F0", muted: "#64748B", border: "#2D3148",
};
const CATEGORIES = ["Health", "Work", "Learning", "Personal", "Finance"];
const CAT_COLORS = { Health: "#6EE7B7", Work: "#818CF8", Learning: "#FCD34D", Personal: "#F472B6", Finance: "#34D399" };

const generateId = () => Math.random().toString(36).slice(2, 9);
const getTodayKey = () => new Date().toISOString().slice(0, 10);

const MOTIV_MSGS = [
  "Rise & shine — Sunday reset time!",
  "New week, new wins. Let's go!",
  "Tuesday momentum — keep building!",
  "Midweek magic — you've got this!",
  "Thursday strong — almost there!",
  "Friday fire — finish the week!",
  "Saturday grind — weekends count too!",
];
const MOTIV_ICONS = ["🌅", "🚀", "⚡", "🎯", "💪", "🔥", "🌟"];

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)); }, [key, val]);
  return [val, setVal];
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const uRef = useRef();

  useEffect(() => { uRef.current?.focus(); }, [mode]);

  function getUsers() {
    try { return JSON.parse(localStorage.getItem("goalflow_users") || "{}"); } catch { return {}; }
  }
  function saveUsers(u) { localStorage.setItem("goalflow_users", JSON.stringify(u)); }

  function handle() {
    setError("");
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) { setError("Please fill in both fields."); setShakeKey(k => k + 1); return; }
    if (p.length < 4) { setError("Password must be at least 4 characters."); setShakeKey(k => k + 1); return; }
    const users = getUsers();
    if (mode === "register") {
      if (users[u]) { setError("Username already taken. Try another."); setShakeKey(k => k + 1); return; }
      users[u] = { password: p };
      saveUsers(users);
      setAnimating(true);
      setTimeout(() => onLogin(u), 500);
    } else {
      if (!users[u] || users[u].password !== p) { setError("Wrong username or password."); setShakeKey(k => k + 1); return; }
      setAnimating(true);
      setTimeout(() => onLogin(u), 500);
    }
  }

  function switchMode() { setError(""); setUsername(""); setPassword(""); setMode(m => m === "login" ? "register" : "login"); }

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'DM Sans', sans-serif",
      opacity: animating ? 0 : 1, transition: "opacity 0.5s ease", padding: 20,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes popIn { from { opacity:0; transform:scale(.94) translateY(24px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-7px)} 40%,80%{transform:translateX(7px)} }
        @keyframes tickDraw { from { stroke-dashoffset: 30 } to { stroke-dashoffset: 0 } }
        @keyframes checkPop { 0% { transform:scale(0.6) } 60% { transform:scale(1.25) } 100% { transform:scale(1) } }
        @keyframes ripple { 0% { transform:scale(0.8); opacity:0.6 } 100% { transform:scale(2.2); opacity:0 } }
        @keyframes slideLeft { from { opacity:0; transform:translateX(40px) } to { opacity:1; transform:translateX(0) } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:translateX(0) } }
        .auth-input:focus { border-color: #6EE7B7 !important; outline: none; }
        .auth-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .switch-link:hover { color: #6EE7B7 !important; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #2D3148; border-radius: 4px; }
        .task-card:hover { background: #1F2335 !important; transform: translateY(-1px); }
        .tab-btn:hover { color: #E2E8F0 !important; }
        .add-btn:hover { transform: scale(1.05); }
        .check-btn:hover { transform: scale(1.1); }
        .show-pass:hover { color: #E2E8F0 !important; }
      `}</style>

      <div style={{ position: "fixed", top: "5%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, #6EE7B712 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 400, animation: "popIn 0.4s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 68, height: 68, borderRadius: 22, background: `linear-gradient(135deg, #6EE7B730, #6EE7B710)`, border: `1.5px solid #6EE7B740`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>✦</div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 800, color: COLORS.text }}>GoalFlow</h1>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 6 }}>
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your free account to begin."}
          </p>
        </div>

        <div key={shakeKey} style={{ background: COLORS.card, borderRadius: 24, padding: 32, border: `1px solid ${COLORS.border}`, animation: shakeKey > 0 ? "shake 0.35s ease" : "none" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </h2>

          <label style={lbl}>Username</label>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>👤</span>
            <input ref={uRef} className="auth-input" value={username} onChange={e => { setUsername(e.target.value); setError(""); }}
              placeholder="Enter your username" onKeyDown={e => e.key === "Enter" && handle()}
              style={{ ...authInp, paddingLeft: 40 }} />
          </div>

          <label style={lbl}>Password</label>
          <div style={{ position: "relative", marginBottom: error ? 14 : 24 }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔒</span>
            <input className="auth-input" type={showPass ? "text" : "password"} value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter your password" onKeyDown={e => e.key === "Enter" && handle()}
              style={{ ...authInp, paddingLeft: 40, paddingRight: 46 }} />
            <button className="show-pass" onClick={() => setShowPass(s => !s)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: COLORS.muted,
              fontSize: 15, padding: 4, transition: "color 0.2s",
            }}>{showPass ? "🙈" : "👁️"}</button>
          </div>

          {error && (
            <div style={{ background: "#F8717115", border: "1px solid #F8717140", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: COLORS.danger, fontSize: 13, fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <button className="auth-btn" onClick={handle} style={{
            width: "100%", padding: "14px 0", background: COLORS.accent, color: "#0F1117",
            border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s", boxShadow: `0 4px 20px #6EE7B735`,
          }}>
            {mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: COLORS.muted }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span className="switch-link" onClick={switchMode} style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600, transition: "color 0.2s" }}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: COLORS.muted }}>🔐 Data stored locally — no server needed</p>
      </div>
    </div>
  );
}

// ─── Shared form styles ───────────────────────────────────────────────
const lbl = { display: "block", color: COLORS.muted, fontSize: 11, marginBottom: 7, letterSpacing: 1, textTransform: "uppercase" };
const authInp = { width: "100%", background: COLORS.bg, border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 14px", color: COLORS.text, fontSize: 15, transition: "border-color 0.2s" };
const inp = { width: "100%", background: COLORS.bg, border: `1.5px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 15, marginBottom: 16, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
const btn = { padding: "12px 0", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none", transition: "all 0.2s" };

// ─── Reusable Components ──────────────────────────────────────────────
function CircleProgress({ pct, size = 100, stroke = 8, color = COLORS.accent, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
      {data.map((d, i) => {
        const pct = d.total ? (d.done / d.total) * 100 : 0;
        const h = Math.max((d.total / max) * 80, 4);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: h, borderRadius: 6, background: COLORS.border, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 0, width: "100%", height: (pct / 100) * h, background: COLORS.accent, borderRadius: 6, transition: "height 0.7s cubic-bezier(.4,0,.2,1)" }} />
            </div>
            <span style={{ fontSize: 10, color: COLORS.muted }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: COLORS.accent, color: "#0F1117", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, zIndex: 1000, animation: "slideUp 0.3s ease", boxShadow: `0 8px 32px #6EE7B740`, whiteSpace: "nowrap" }}>{msg}</div>
  );
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function isGoalActiveOnDate(goal, dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  const dayNum = d.getDay(); // 0=Sun..6=Sat
  if (goal.recurrence === "once") return dateKey === goal.createdAt;
  if (goal.recurrence === "everyday") return true;
  if (goal.recurrence === "custom") return (goal.recurrenceDays || []).includes(dayNum);
  return true; // default
}

function AddGoalModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Health");
  const [deadline, setDeadline] = useState("");
  const [daily, setDaily] = useState("");
  const [recurrence, setRecurrence] = useState("everyday");
  const [recDays, setRecDays] = useState([1, 2, 3, 4, 5]); // Mon–Fri default for custom
  const inputRef = useRef();
  useEffect(() => { inputRef.current?.focus(); }, []);

  function toggleDay(d) {
    setRecDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  function submit() {
    if (!title.trim()) return;
    if (recurrence === "custom" && recDays.length === 0) return;
    onAdd({
      id: generateId(), title: title.trim(), category: cat, deadline,
      dailyTask: daily.trim(), createdAt: getTodayKey(), completedDays: {},
      recurrence, recurrenceDays: recurrence === "custom" ? recDays : [],
    });
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000090", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, backdropFilter: "blur(6px)", overflowY: "auto", padding: "20px 0" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: COLORS.card, borderRadius: 20, padding: 28, width: "90%", maxWidth: 420, border: `1px solid ${COLORS.border}`, animation: "popIn 0.25s cubic-bezier(.4,0,.2,1)", margin: "auto" }}>
        <h2 style={{ color: COLORS.text, marginBottom: 20, fontSize: 20, fontFamily: "'Sora', sans-serif" }}>✦ New Goal</h2>

        <label style={lbl}>Goal Title</label>
        <input ref={inputRef} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Run 5km daily" style={inp} onKeyDown={e => e.key === "Enter" && submit()} />

        <label style={lbl}>Daily Task Description</label>
        <input value={daily} onChange={e => setDaily(e.target.value)} placeholder="e.g. Complete 30-min run" style={inp} />

        <label style={lbl}>Category</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", border: `1.5px solid ${cat === c ? CAT_COLORS[c] : COLORS.border}`, background: cat === c ? CAT_COLORS[c] + "20" : "transparent", color: cat === c ? CAT_COLORS[c] : COLORS.muted, transition: "all 0.2s" }}>{c}</button>
          ))}
        </div>

        {/* Recurrence */}
        <label style={lbl}>Schedule</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[
            { val: "once", label: "Once", icon: "1️⃣" },
            { val: "everyday", label: "Every Day", icon: "🔁" },
            { val: "custom", label: "Custom", icon: "📅" },
          ].map(r => (
            <button key={r.val} onClick={() => setRecurrence(r.val)} style={{
              flex: 1, padding: "9px 4px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: `1.5px solid ${recurrence === r.val ? COLORS.accent : COLORS.border}`,
              background: recurrence === r.val ? COLORS.accent + "18" : "transparent",
              color: recurrence === r.val ? COLORS.accent : COLORS.muted,
              transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 18 }}>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* Custom day picker */}
        {recurrence === "custom" && (
          <div style={{ marginBottom: 16, animation: "fadeIn 0.2s ease" }}>
            <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>Pick which days this task appears:</p>
            <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
              {DAY_LABELS.map((d, i) => (
                <button key={i} onClick={() => toggleDay(i)} style={{
                  flex: 1, padding: "8px 2px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  border: `1.5px solid ${recDays.includes(i) ? COLORS.accent : COLORS.border}`,
                  background: recDays.includes(i) ? COLORS.accent : "transparent",
                  color: recDays.includes(i) ? "#0F1117" : COLORS.muted,
                  transition: "all 0.18s",
                }}>{d}</button>
              ))}
            </div>
            {recDays.length === 0 && <p style={{ fontSize: 11, color: COLORS.danger, marginTop: 6 }}>⚠️ Select at least one day</p>}
          </div>
        )}

        {recurrence === "once" && (
          <div style={{ background: COLORS.border + "60", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 13, color: COLORS.muted }}>
            📌 This task will only appear today
          </div>
        )}

        <label style={lbl}>Deadline (optional)</label>
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={onClose} style={{ ...btn, flex: 1, background: COLORS.border, color: COLORS.text }}>Cancel</button>
          <button onClick={submit} style={{ ...btn, flex: 2, background: COLORS.accent, color: "#0F1117", opacity: recurrence === "custom" && recDays.length === 0 ? 0.5 : 1 }}>Add Goal</button>
        </div>
      </div>
    </div>
  );
}

// ─── GOALS APP (after login) ──────────────────────────────────────────
function GoalsApp({ user, onLogout }) {
  const [goals, setGoals] = useLocalStorage(`goals_v2_${user}`, []);
  const [tab, setTab] = useState("today");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null);
  const today = getTodayKey();
  const TABS = ["today", "analytics", "all"];
  const touchStartX = useRef(null);

  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) < 45) { touchStartX.current = null; return; }
    const curIdx = TABS.indexOf(tab);
    if (dx > 0 && curIdx < TABS.length - 1) {
      // Swipe left → go to next tab
      setSwipeDir("left"); setTab(TABS[curIdx + 1]);
    } else if (dx < 0 && curIdx > 0) {
      // Swipe right → go to previous tab
      setSwipeDir("right"); setTab(TABS[curIdx - 1]);
    }
    touchStartX.current = null;
    setTimeout(() => setSwipeDir(null), 350);
  }

  useEffect(() => {
    const check = () => {
      if (new Date().getHours() >= 20) {
        const undone = goals.filter(g => !g.completedDays?.[today]);
        if (undone.length > 0) setToast(`⏰ ${undone.length} task${undone.length > 1 ? "s" : ""} still pending!`);
      }
    };
    const t = setInterval(check, 60000); check(); return () => clearInterval(t);
  }, [goals, today]);

  const addGoal = g => { setGoals(p => [g, ...p]); setToast("🎯 Goal added!"); };
  const toggleToday = id => setGoals(p => p.map(g => {
    if (g.id !== id) return g;
    const done = { ...g.completedDays };
    if (done[today]) { delete done[today]; setToast("Task unchecked"); }
    else { done[today] = true; setToast("✅ Task done! Great job!"); }
    return { ...g, completedDays: done };
  }));
  const deleteGoal = id => { setGoals(p => p.filter(g => g.id !== id)); setToast("Goal removed"); };

  const todayGoals = goals.filter(g => isGoalActiveOnDate(g, today));
  const totalGoals = todayGoals.length;
  const doneToday = todayGoals.filter(g => g.completedDays?.[today]).length;
  const pct = totalGoals ? Math.round((doneToday / totalGoals) * 100) : 0;
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { label: ["Su","Mo","Tu","We","Th","Fr","Sa"][d.getDay()], done: goals.filter(g => g.completedDays?.[key]).length, total: goals.length };
  });
  const catStats = CATEGORIES.map(c => {
    const cGoals = goals.filter(g => g.category === c);
    return { cat: c, total: cGoals.length, done: cGoals.filter(g => g.completedDays?.[today]).length };
  }).filter(c => c.total > 0);
  const overdueDays = g => g.deadline ? Math.ceil((new Date(g.deadline) - new Date()) / 86400000) : null;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', sans-serif", color: COLORS.text, paddingBottom: 40 }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Sticky header */}
      <div style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: "16px 24px 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800 }}>✦ GoalFlow</h1>
              <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                👋 <span style={{ color: COLORS.accent, fontWeight: 600 }}>{user}</span> · {new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="add-btn" onClick={() => setShowAdd(true)} style={{ background: COLORS.accent, color: "#0F1117", border: "none", borderRadius: 12, padding: "9px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 16px #6EE7B740`, transition: "all 0.2s" }}>+ Goal</button>
              <button onClick={() => setShowLogout(true)} title="Sign out" style={{ background: "#F8717122", color: COLORS.danger, border: `1.5px solid #F8717145`, borderRadius: 10, padding: "9px 13px", fontSize: 15, cursor: "pointer", transition: "all 0.2s", fontWeight: 700 }}>⇥</button>
            </div>
          </div>
          {/* Motivational banner — just above tabs */}
          <div style={{ background: `linear-gradient(135deg, #6EE7B712, #818CF808)`, border: `1px solid #6EE7B720`, borderRadius: 12, padding: "9px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{MOTIV_ICONS[new Date().getDay()]}</span>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 13, color: COLORS.text }}>{MOTIV_MSGS[new Date().getDay()]}</p>
          </div>

          <div style={{ display: "flex" }}>
            {["today", "analytics", "all"].map(t => (
              <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: tab === t ? COLORS.accent : COLORS.muted, borderBottom: `2px solid ${tab === t ? COLORS.accent : "transparent"}`, transition: "all 0.2s" }}>
                {t === "all" ? "All Goals" : t === "today" ? "Today" : "Analytics"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px" }}>

        {/* TODAY */}
        {tab === "today" && (
          <div style={{ animation: swipeDir === "left" ? "slideLeft 0.3s ease" : swipeDir === "right" ? "slideRight 0.3s ease" : "fadeIn 0.3s ease" }}>
            <div style={{ background: COLORS.card, borderRadius: 20, padding: 24, marginTop: 20, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 24 }}>
              <CircleProgress pct={pct}>
                <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: COLORS.accent }}>{pct}%</span>
              </CircleProgress>
              <div>
                <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 4 }}>Today's Progress</p>
                <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>
                  {doneToday}<span style={{ fontSize: 16, color: COLORS.muted, fontWeight: 500 }}>/{totalGoals}</span>
                </p>
                <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>
                  {pct === 100 ? "🎉 All done! Amazing!" : pct >= 50 ? "💪 Keep going!" : totalGoals === 0 ? "Add your first goal!" : "🚀 Let's get started!"}
                </p>
              </div>
            </div>
            {todayGoals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>{goals.length === 0 ? "No goals yet" : "No tasks for today"}</p>
                <p style={{ fontSize: 14, marginTop: 4 }}>{goals.length === 0 ? "Tap \"+ Goal\" to begin your journey" : "Enjoy your free day! 🌴"}</p>
              </div>
            ) : (
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {todayGoals.map((g, i) => {
                  const done = !!g.completedDays?.[today];
                  const days = overdueDays(g);
                  const streak = calcStreak(g);
                  const schedLabel = g.recurrence === "once" ? "Once" : g.recurrence === "everyday" ? "Daily" : g.recurrenceDays?.map(d => DAY_LABELS[d]).join(" · ");
                  return (
                    <div key={g.id} className="task-card" style={{ background: COLORS.card, borderRadius: 16, padding: "16px 18px", border: `1.5px solid ${done ? COLORS.accentBorder : COLORS.border}`, display: "flex", alignItems: "center", gap: 14, transition: "all 0.3s", animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                      {/* Animated check button */}
                      <button className="check-btn" onClick={() => toggleToday(g.id)} style={{ width: 34, height: 34, borderRadius: "50%", border: `2px solid ${done ? COLORS.accent : COLORS.border}`, background: done ? COLORS.accent : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.25s, background 0.25s", position: "relative", overflow: "visible", animation: done ? "checkPop 0.35s cubic-bezier(.34,1.56,.64,1)" : "none" }}>
                        {done && <span style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `2px solid ${COLORS.accent}`, animation: "ripple 0.5s ease forwards", pointerEvents: "none" }} />}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ overflow: "visible" }}>
                          {done && <path d="M3.5 8.5 L6.5 11.5 L12.5 5" stroke="#0F1117" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset="0" style={{ animation: "tickDraw 0.3s ease forwards" }} />}
                        </svg>
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <p style={{ fontWeight: 600, fontSize: 15, color: done ? COLORS.muted : COLORS.text, textDecoration: done ? "line-through" : "none" }}>{g.title}</p>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: CAT_COLORS[g.category] + "20", color: CAT_COLORS[g.category] }}>{g.category}</span>
                        </div>
                        {g.dailyTask && <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>📌 {g.dailyTask}</p>}
                        <div style={{ display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
                          {streak > 0 && <span style={{ fontSize: 12, color: COLORS.warn }}>🔥 {streak} day streak</span>}
                          {days !== null && <span style={{ fontSize: 12, color: days < 3 ? COLORS.danger : COLORS.muted }}>{days < 0 ? "⚠️ Overdue" : days === 0 ? "📅 Due today" : `📅 ${days}d left`}</span>}
                          <span style={{ fontSize: 11, color: COLORS.muted, background: COLORS.border, padding: "1px 7px", borderRadius: 8 }}>
                            {g.recurrence === "once" ? "1️⃣ Once" : g.recurrence === "everyday" ? "🔁 Daily" : `📅 ${schedLabel}`}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => deleteGoal(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 18, padding: 4 }}
                        onMouseEnter={e => e.target.style.color = COLORS.danger} onMouseLeave={e => e.target.style.color = COLORS.muted}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div style={{ animation: swipeDir === "left" ? "slideLeft 0.3s ease" : swipeDir === "right" ? "slideRight 0.3s ease" : "fadeIn 0.3s ease", marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: COLORS.card, borderRadius: 20, padding: 24, border: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.muted, fontSize: 11, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Overall Summary</p>
              <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                {[{ label: "Total Goals", val: totalGoals, icon: "🎯" }, { label: "Done Today", val: doneToday, icon: "✅" }, { label: "Remaining", val: totalGoals - doneToday, icon: "⏳" }].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 26 }}>{s.icon}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: COLORS.accent }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: COLORS.card, borderRadius: 20, padding: 24, border: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.muted, fontSize: 11, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Last 7 Days</p>
              <BarChart data={last7} />
            </div>
            {catStats.length > 0 && (
              <div style={{ background: COLORS.card, borderRadius: 20, padding: 24, border: `1px solid ${COLORS.border}` }}>
                <p style={{ color: COLORS.muted, fontSize: 11, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>By Category</p>
                {catStats.map(c => {
                  const p = c.total ? Math.round((c.done / c.total) * 100) : 0;
                  return (
                    <div key={c.cat} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: CAT_COLORS[c.cat] }}>{c.cat}</span>
                        <span style={{ fontSize: 13, color: COLORS.muted }}>{c.done}/{c.total}</span>
                      </div>
                      <div style={{ height: 8, background: COLORS.border, borderRadius: 8, overflow: "hidden" }}>
                        <div style={{ width: `${p}%`, height: "100%", background: CAT_COLORS[c.cat], borderRadius: 8, transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {goals.length > 0 && (
              <div style={{ background: COLORS.card, borderRadius: 20, padding: 24, border: `1px solid ${COLORS.border}` }}>
                <p style={{ color: COLORS.muted, fontSize: 11, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>🔥 Streaks</p>
                {goals.map(g => {
                  const s = calcStreak(g);
                  return (
                    <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 14, flex: 1 }}>{g.title}</span>
                      <span style={{ fontWeight: 700, color: s > 0 ? COLORS.warn : COLORS.muted, fontSize: 14 }}>{s > 0 ? `🔥 ${s} days` : "–"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ALL GOALS */}
        {tab === "all" && (
          <div style={{ animation: swipeDir === "right" ? "slideRight 0.3s ease" : "slideLeft 0.3s ease" }}>
            {goals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>No goals yet</p>
              </div>
            ) : (
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {goals.map((g, i) => {
                  const totalDays = Object.keys(g.completedDays || {}).length;
                  const streak = calcStreak(g);
                  return (
                    <div key={g.id} className="task-card" style={{ background: COLORS.card, borderRadius: 16, padding: 18, border: `1px solid ${COLORS.border}`, animation: `fadeIn 0.3s ease ${i * 0.05}s both`, transition: "all 0.2s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <p style={{ fontWeight: 700, fontSize: 15 }}>{g.title}</p>
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: CAT_COLORS[g.category] + "20", color: CAT_COLORS[g.category] }}>{g.category}</span>
                          </div>
                          {g.dailyTask && <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>📌 {g.dailyTask}</p>}
                          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                            <span style={{ fontSize: 12, color: COLORS.muted }}>📆 {totalDays} days completed</span>
                            {streak > 0 && <span style={{ fontSize: 12, color: COLORS.warn }}>🔥 {streak} streak</span>}
                            {g.deadline && <span style={{ fontSize: 12, color: COLORS.muted }}>⏰ Due {g.deadline}</span>}
                          </div>
                        </div>
                        <button onClick={() => deleteGoal(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 20, padding: "0 4px" }}
                          onMouseEnter={e => e.target.style.color = COLORS.danger} onMouseLeave={e => e.target.style.color = COLORS.muted}>×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout modal */}
      {showLogout && (
        <div style={{ position: "fixed", inset: 0, background: "#00000090", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, backdropFilter: "blur(6px)" }}>
          <div style={{ background: COLORS.card, borderRadius: 20, padding: 32, width: "90%", maxWidth: 340, border: `1px solid ${COLORS.border}`, animation: "popIn 0.25s ease", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Sora', sans-serif", marginBottom: 8 }}>Sign out?</h3>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Your progress is saved. Sign back in anytime.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowLogout(false)} style={{ ...btn, flex: 1, background: COLORS.border, color: COLORS.text }}>Cancel</button>
              <button onClick={onLogout} style={{ ...btn, flex: 1, background: COLORS.danger, color: "#fff" }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && <AddGoalModal onAdd={addGoal} onClose={() => setShowAdd(false)} />}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── SPLASH SCREEN ───────────────────────────────────────────────────
function SplashScreen() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: COLORS.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", zIndex: 9999,
      animation: "splashOut 0.6s ease 2.5s forwards",
    }}>
      {/* Ambient glow rings */}
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, #6EE7B718 0%, transparent 70%)`, animation: "pulseGlow 2s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, #6EE7B725 0%, transparent 70%)`, animation: "pulseGlow 2s ease-in-out infinite 0.4s" }} />

      {/* Logo SVG */}
      <div style={{ animation: "logoIn 0.7s cubic-bezier(.34,1.56,.64,1) both", marginBottom: 28 }}>
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer ring */}
          <circle cx="55" cy="55" r="50" stroke="#6EE7B740" strokeWidth="1.5" />
          <circle cx="55" cy="55" r="42" stroke="#6EE7B725" strokeWidth="1" />
          {/* Arc progress */}
          <circle cx="55" cy="55" r="46" stroke="#6EE7B7" strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray="180 289" strokeDashoffset="72" style={{ filter: "drop-shadow(0 0 6px #6EE7B780)" }} />
          {/* Center star / diamond shape */}
          <path d="M55 35 L61 51 L77 55 L61 59 L55 75 L49 59 L33 55 L49 51 Z" fill="#6EE7B7" style={{ filter: "drop-shadow(0 0 8px #6EE7B7)" }} />
          {/* Checkmark dot */}
          <circle cx="55" cy="55" r="5" fill="#0F1117" />
          <path d="M52 55 L54.2 57.2 L58 53" stroke="#6EE7B7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Orbit dot */}
          <circle cx="55" cy="9" r="3.5" fill="#6EE7B7" style={{ filter: "drop-shadow(0 0 4px #6EE7B7)" }} />
        </svg>
      </div>

      {/* Brand name */}
      <div style={{ animation: "textIn 0.6s ease 0.3s both", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 34, fontWeight: 800, color: COLORS.text, letterSpacing: -1 }}>
          Goal<span style={{ color: COLORS.accent }}>Flow</span>
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 8, letterSpacing: 2, textTransform: "uppercase" }}>
          Your Daily Growth Engine
        </p>
      </div>

      {/* Loading dots */}
      <div style={{ display: "flex", gap: 7, marginTop: 48, animation: "textIn 0.5s ease 0.7s both" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.accent, animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.7 }} />
        ))}
      </div>

      <style>{`
        @keyframes splashOut { to { opacity: 0; pointer-events: none; transform: scale(1.04); } }
        @keyframes logoIn { from { opacity:0; transform:scale(0.5) rotate(-15deg) } to { opacity:1; transform:scale(1) rotate(0deg) } }
        @keyframes textIn { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulseGlow { 0%,100% { transform:scale(1); opacity:0.6 } 50% { transform:scale(1.08); opacity:1 } }
        @keyframes dotBounce { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px); opacity:1 } }
      `}</style>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(() => {
    try { return localStorage.getItem("goalflow_session") || null; } catch { return null; }
  });

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3100);
    return () => clearTimeout(t);
  }, []);

  const login = u => { localStorage.setItem("goalflow_session", u); setUser(u); };
  const logout = () => { localStorage.removeItem("goalflow_session"); setUser(null); };

  return (
    <>
      {showSplash && <SplashScreen />}
      {user ? <GoalsApp user={user} onLogout={logout} /> : <AuthScreen onLogin={login} />}
    </>
  );
}

function calcStreak(goal) {
  let streak = 0; const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (goal.completedDays?.[key]) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  return streak;
}
