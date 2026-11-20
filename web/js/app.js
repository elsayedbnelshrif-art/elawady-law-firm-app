(function () {
  'use strict';

  const { STAGES, CASES, DEADLINES } = window.DEMO;
  const CLIENT_NAME = 'محمد أحمد علي';
  const OFFICE = 'مكتب الأستاذ العوضي عبد الخالق الشريف';

  /* ---------- أدوات ---------- */
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const num = (n) => Number(n).toLocaleString('ar-EG');
  const money = (n) => num(n) + ' ج.م';
  const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const dayDiff = (t) => Math.round((startOfDay(t) - startOfDay(Date.now())) / 86400000);
  const fmtDate = (t) => new Date(t).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtShort = (t) => new Date(t).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  const fmtTime = (t) => new Date(t).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' });
  const rel = (t) => {
    const n = dayDiff(t);
    if (n === 0) return 'اليوم';
    if (n === 1) return 'غدًا';
    if (n === 2) return 'بعد يومين';
    if (n > 2 && n <= 10) return 'بعد ' + num(n) + ' أيام';
    if (n > 10) return 'بعد ' + num(n) + ' يومًا';
    if (n === -1) return 'أمس';
    return 'منذ ' + num(-n) + ' يومًا';
  };
  const ICONS = {
    home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    briefcase: 'M3 7h18v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 13h18',
    calendar: 'M4 6h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM3 10h18M8 3v4M16 3v4',
    check: 'M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
    wallet: 'M3 7a2 2 0 0 1 2-2h14v4M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2zM16 14h2',
    back: 'M9 6l6 6-6 6',
    info: 'M12 8v5M12 16.5v.5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
    scale: 'M12 3v18M5 21h14M4 8h16M6 8l-3 7a3 3 0 0 0 6 0zM18 8l-3 7a3 3 0 0 0 6 0z'
  };
  const icon = (n) => '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[n] + '"/></svg>';

  /* ---------- الحالة ---------- */
  const state = {
    role: store.get('role', null),
    type: 'الكل',
    query: '',
    sessTab: 'up',
    tasks: store.get('tasks', null) || JSON.parse(JSON.stringify(window.DEMO.TASKS))
  };
  const caseById = (id) => CASES.find((c) => c.id === id);
  const allSessions = () => {
    const out = [];
    CASES.forEach((c) => c.sessions.forEach((s) => out.push({ date: s.date, decision: s.decision, c })));
    return out;
  };
  const today0 = () => startOfDay(Date.now());
  const upcoming = () => allSessions().filter((s) => s.date >= today0()).sort((a, b) => a.date - b.date);
  const past = () => allSessions().filter((s) => s.date < today0()).sort((a, b) => b.date - a.date);
  const clientCases = () => CASES.filter((c) => c.client === CLIENT_NAME);

  /* ---------- مكونات ---------- */
  const statusBadge = (c) => {
    const cls = c.status === 'محجوزة للحكم' ? 'warn' : c.status === 'منتهية' ? 'ok' : 'gold';
    return '<span class="badge ' + cls + '">' + esc(c.status) + '</span>';
  };
  const dateBox = (t) => {
    const d = new Date(t);
    return '<div class="datebox' + (dayDiff(t) === 0 ? ' today' : '') + '"><b>' +
      d.toLocaleDateString('ar-EG', { day: 'numeric' }) + '</b><span>' +
      d.toLocaleDateString('ar-EG', { month: 'short' }) + '</span></div>';
  };
  const sessionRow = (s) =>
    '<a class="row" href="#/case/' + s.c.id + '">' + dateBox(s.date) +
    '<div class="grow"><div class="t">' + esc(s.c.title) + '</div><div class="s">' +
    esc(s.c.court) + ' • ' + fmtTime(s.date) + '</div></div>' +
    '<span class="badge ' + (dayDiff(s.date) <= 1 ? 'warn' : '') + '">' + rel(s.date) + '</span></a>';
  const caseRow = (c) =>
    '<a class="row" href="#/case/' + c.id + '"><div class="grow"><div class="t">' + esc(c.title) +
    '</div><div class="s">' + esc(c.client) + ' • ' + esc(c.number) + '</div></div>' +
    '<div style="text-align:left"><span class="badge">' + esc(c.type) + '</span></div></a>';
  const stepper = (stage) =>
    '<div class="steps">' + STAGES.map((n, i) =>
      '<div class="step ' + (i < stage ? 'done' : i === stage ? 'now' : '') + '"><i></i>' + esc(n) + '</div>').join('') + '</div>';

  function layout(o) {
    const nav = o.nav ? '<nav class="nav">' + o.nav.map((n) =>
      '<a href="' + n.href + '" class="' + (n.on ? 'on' : '') + '">' + icon(n.icon) + n.label + '</a>').join('') + '</nav>' : '';
    const lead = o.back
      ? '<button class="icon-btn" data-act="back" data-fallback="' + o.back + '" aria-label="رجوع">' + icon('back') + '</button>'
      : '<img src="icons/icon-192.png" alt="">';
    return '<header class="topbar">' + lead + '<h2>' + esc(o.title) + '</h2></header>' +
      '<main class="content">' + o.body + '</main>' + nav;
  }
  const staffNav = (on) => [
    { href: '#/home', icon: 'home', label: 'الرئيسية', on: on === 'home' },
    { href: '#/cases', icon: 'briefcase', label: 'القضايا', on: on === 'cases' },
    { href: '#/sessions', icon: 'calendar', label: 'الجلسات', on: on === 'sessions' },
    { href: '#/tasks', icon: 'check', label: 'المهام', on: on === 'tasks' },
    { href: '#/more', icon: 'user', label: 'حسابي', on: on === 'more' }
  ];
  const clientNav = (on) => [
    { href: '#/c/home', icon: 'briefcase', label: 'قضيتي', on: on === 'home' },
    { href: '#/c/pay', icon: 'wallet', label: 'الأتعاب', on: on === 'pay' },
    { href: '#/c/contact', icon: 'chat', label: 'تواصل معنا', on: on === 'contact' },
    { href: '#/c/more', icon: 'user', label: 'حسابي', on: on === 'more' }
  ];

  /* ---------- شاشات الموظفين ---------- */
  function vLogin() {
    return '<div class="login"><img class="logo" src="icons/logo-full.jpg" alt="' + esc(OFFICE) + '">' +
      '<h1>أهلًا بك</h1><p class="sub">اختر طريقة الدخول</p>' +
      '<button class="role-btn" data-act="role" data-role="staff"><span class="ic">' + icon('scale') + '</span>' +
      '<span><b>دخول المحامين والموظفين</b><span>القضايا والجلسات والمهام</span></span></button>' +
      '<button class="role-btn client" data-act="role" data-role="client"><span class="ic">' + icon('user') + '</span>' +
      '<span><b>دخول الموكلين</b><span>متابعة قضيتك والتواصل مع المكتب</span></span></button>' +
      '<button class="link-btn" data-act="install">تثبيت التطبيق على جهازك</button>' +
      '<div class="demo-note">نسخة تجريبية للمراجعة — كل البيانات وهمية وليست بيانات عملاء حقيقيين.</div></div>';
  }

  function vHome() {
    const up = upcoming();
    const todayN = up.filter((s) => dayDiff(s.date) === 0).length;
    const soon = up.filter((s) => dayDiff(s.date) <= 2).length;
    const openTasks = state.tasks.filter((t) => !t.done).length;
    const due = CASES.reduce((a, c) => a + (c.fees.total - c.fees.paid), 0);
    const h = new Date().getHours();
    const body =
      '<div class="hello"><b>' + (h < 12 ? 'صباح الخير' : 'مساء الخير') + '، أستاذ العوضي</b><div>' + fmtDate(Date.now()) + '</div></div>' +
      (soon ? '<div class="alert">' + icon('info') + '<div>عندك <b>' + num(soon) + '</b> جلسات خلال 48 ساعة القادمة.</div></div>' : '') +
      '<div class="grid2">' +
      '<div class="stat gold"><b>' + num(todayN) + '</b><span>جلسات اليوم</span></div>' +
      '<div class="stat"><b>' + num(CASES.filter((c) => c.status !== 'منتهية').length) + '</b><span>قضايا نشطة</span></div>' +
      '<div class="stat"><b>' + num(openTasks) + '</b><span>مهام مفتوحة</span></div>' +
      '<div class="stat"><b style="font-size:19px">' + money(due) + '</b><span>أتعاب مستحقة</span></div></div>' +
      '<div class="sec-title">الجلسات القادمة <small><a href="#/sessions" style="color:inherit">عرض الكل</a></small></div>' +
      up.slice(0, 4).map(sessionRow).join('') +
      '<div class="sec-title">مواعيد قانونية قريبة</div>' +
      DEADLINES.map((d) => {
        const c = caseById(d.caseId);
        return '<a class="row" href="#/case/' + c.id + '"><div class="grow"><div class="t">' + esc(d.text) + '</div><div class="s">' +
          esc(c.title) + ' • ' + fmtShort(d.date) + '</div></div><span class="badge bad">' + rel(d.date) + '</span></a>';
      }).join('') +
      '<div class="footer-note">المواعيد القانونية المعروضة تجريبية. الحساب النهائي يراجعه المحامي المسؤول.</div>';
    return layout({ title: 'مكتب العوضي', body, nav: staffNav('home') });
  }

  function caseListHtml() {
    const q = state.query.trim();
    const list = CASES.filter((c) =>
      (state.type === 'الكل' || c.type === state.type) &&
      (!q || [c.title, c.client, c.number, c.opponent].some((x) => x.includes(q))));
    return list.length ? list.map(caseRow).join('') : '<div class="empty">مفيش قضايا مطابقة للبحث.</div>';
  }
  function vCases() {
    const types = ['الكل', 'مدني', 'جنائي', 'أسرة', 'عمل', 'إداري', 'اقتصادي'];
    const body =
      '<input class="search" id="q" type="search" placeholder="ابحث باسم الموكل أو رقم القضية" value="' + esc(state.query) + '">' +
      '<div class="chips">' + types.map((t) =>
        '<button class="chip ' + (t === state.type ? 'on' : '') + '" data-act="chip" data-type="' + t + '">' + t + '</button>').join('') + '</div>' +
      '<div id="caselist">' + caseListHtml() + '</div>';
    return layout({ title: 'القضايا', body, nav: staffNav('cases') });
  }

  function sessionsHistory(c) {
    return c.sessions.slice().sort((a, b) => b.date - a.date).map((s) =>
      '<div class="row" style="cursor:default">' + dateBox(s.date) + '<div class="grow"><div class="t">' + fmtDate(s.date) + '</div><div class="s">' +
      (s.date >= today0() ? 'جلسة قادمة • ' + fmtTime(s.date) : esc(s.decision || 'لم يُسجّل القرار')) + '</div></div></div>').join('');
  }
  function vCase(id) {
    const c = caseById(id);
    if (!c) return vNotFound();
    const pct = Math.round((c.fees.paid / c.fees.total) * 100);
    const body =
      '<div class="card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h3>' + esc(c.title) + '</h3>' + statusBadge(c) + '</div>' +
      '<dl class="kv"><dt>رقم القضية</dt><dd>' + esc(c.number) + '</dd><dt>النوع</dt><dd>' + esc(c.type) + '</dd>' +
      '<dt>المحكمة</dt><dd>' + esc(c.court) + '</dd><dt>الدائرة</dt><dd>' + esc(c.circuit) + '</dd>' +
      '<dt>الموكل</dt><dd>' + esc(c.client) + '</dd><dt>الخصم</dt><dd>' + esc(c.opponent) + '</dd>' +
      '<dt>المحامي</dt><dd>' + esc(c.lawyer) + '</dd></dl></div>' +
      '<div class="card"><h3>مرحلة القضية</h3>' + stepper(c.stage) + '</div>' +
      '<div class="sec-title">الجلسات</div>' + sessionsHistory(c) +
      '<div class="sec-title">المستندات <small>' + num(c.documents.length) + '</small></div>' +
      c.documents.map((d) => '<div class="row" style="cursor:default"><div class="grow"><div class="t">' + esc(d.name) + '</div><div class="s">' + fmtShort(d.date) + '</div></div></div>').join('') +
      '<div class="sec-title">الأتعاب</div><div class="card"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="money"><span>المدفوع <b>' + money(c.fees.paid) + '</b></span><span>الإجمالي <b>' + money(c.fees.total) + '</b></span></div></div>';
    return layout({ title: c.title, back: '#/cases', body, nav: staffNav('cases') });
  }

  function vSessions() {
    const list = state.sessTab === 'up' ? upcoming() : past();
    const body =
      '<div class="seg"><button class="' + (state.sessTab === 'up' ? 'on' : '') + '" data-act="seg" data-tab="up">القادمة</button>' +
      '<button class="' + (state.sessTab === 'past' ? 'on' : '') + '" data-act="seg" data-tab="past">السابقة</button></div>' +
      (list.length ? list.map((s) => state.sessTab === 'up' ? sessionRow(s) :
        '<a class="row" href="#/case/' + s.c.id + '">' + dateBox(s.date) + '<div class="grow"><div class="t">' + esc(s.c.title) +
        '</div><div class="s">' + esc(s.decision || 'لم يُسجّل القرار') + '</div></div></a>').join('') : '<div class="empty">مفيش جلسات.</div>');
    return layout({ title: 'الجلسات', body, nav: staffNav('sessions') });
  }

  function vTasks() {
    const sorted = state.tasks.slice().sort((a, b) => a.done - b.done || a.due - b.due);
    const body =
      '<form class="add-task" data-form="task"><input name="text" placeholder="أضف مهمة جديدة" required maxlength="120" autocomplete="off"><button class="btn">إضافة</button></form>' +
      sorted.map((t) => {
        const c = t.caseId ? caseById(t.caseId) : null;
        const late = !t.done && dayDiff(t.due) < 0;
        return '<label class="task ' + (t.done ? 'done' : '') + '"><input type="checkbox" data-task="' + esc(t.id) + '" ' + (t.done ? 'checked' : '') + '>' +
          '<span class="grow"><span class="t" style="display:block">' + esc(t.text) + '</span><span class="s" style="font-size:13px;color:var(--muted)">' +
          (c ? esc(c.title) + ' • ' : '') + rel(t.due) + '</span></span>' + (late ? '<span class="badge bad">متأخرة</span>' : '') + '</label>';
      }).join('');
    return layout({ title: 'المهام', body, nav: staffNav('tasks') });
  }

  function installButton() {
    return isStandalone() ? '<div class="card"><b>التطبيق مثبّت على جهازك ✓</b></div>' :
      '<button class="btn gold block" data-act="install" style="margin-bottom:12px">تثبيت التطبيق على جهازك</button>';
  }
  function vMore(client) {
    const body =
      '<div class="card" style="text-align:center"><img src="icons/icon-192.png" alt="" style="width:72px;border-radius:16px">' +
      '<h3 style="margin-top:8px">' + (client ? esc(CLIENT_NAME) : 'أ. العوضي') + '</h3><div class="s" style="color:var(--muted)">' +
      (client ? 'حساب موكل (تجريبي)' : 'حساب محامٍ (تجريبي)') + '</div></div>' + installButton() +
      '<button class="btn ghost block" data-act="logout" style="margin-bottom:10px">تبديل الحساب / تسجيل الخروج</button>' +
      (client ? '' : '<button class="btn ghost block" data-act="reset">إعادة ضبط البيانات التجريبية</button>') +
      '<div class="footer-note">' + esc(OFFICE) + '<br>نسخة تجريبية — الإصدار 0.1</div>';
    return layout({ title: 'حسابي', body, nav: client ? clientNav('more') : staffNav('more') });
  }

  /* ---------- شاشات الموكلين ---------- */
  function vClientHome() {
    const cs = clientCases();
    const body = '<div class="hello"><b>أهلًا بك، ' + esc(CLIENT_NAME.split(' ')[0]) + '</b><div>متابعة قضيتك لحظة بلحظة</div></div>' +
      cs.map((c) => {
        const next = c.sessions.filter((s) => s.date >= today0()).sort((a, b) => a.date - b.date)[0];
        return '<div class="card"><div style="display:flex;justify-content:space-between;gap:8px"><h3>' + esc(c.title) + '</h3>' + statusBadge(c) + '</div>' +
          '<div class="s" style="color:var(--muted);font-size:13.5px;margin-bottom:10px">' + esc(c.court) + ' • ' + esc(c.number) + '</div>' + stepper(c.stage) +
          (next ? '<div class="alert" style="margin:14px 0 0">' + icon('calendar') + '<div>الجلسة القادمة: <b>' + fmtDate(next.date) + '</b> الساعة ' + fmtTime(next.date) + ' (' + rel(next.date) + ')</div></div>' : '') +
          '<p style="margin:12px 0 0"><b>آخر مستجد:</b> ' + esc(c.clientNote) + '</p></div>' +
          (c.needed.length ? '<div class="card"><h3>المطلوب منك</h3>' + c.needed.map((n) =>
            '<div class="row" style="cursor:default"><div class="grow"><div class="t">' + esc(n) + '</div></div>' +
            '<button class="btn sm" data-act="upload">رفع</button></div>').join('') + '</div>' : '');
      }).join('') +
      '<input type="file" id="file" hidden>';
    return layout({ title: 'قضيتي', body, nav: clientNav('home') });
  }
  function vClientPay() {
    const cs = clientCases();
    const body = cs.map((c) => {
      const pct = Math.round((c.fees.paid / c.fees.total) * 100);
      return '<div class="card"><h3>' + esc(c.title) + '</h3><div class="bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="money"><span>المدفوع <b>' + money(c.fees.paid) + '</b></span><span>المتبقي <b>' + money(c.fees.total - c.fees.paid) + '</b></span></div></div>' +
        '<div class="sec-title">الدفعات</div>' + c.fees.installments.map((i) =>
          '<div class="row" style="cursor:default"><div class="grow"><div class="t">' + esc(i.label) + '</div><div class="s">' +
          (i.paid ? 'تم السداد' : 'مستحقة ' + fmtShort(i.due)) + '</div></div><b>' + money(i.amount) + '</b>' +
          (i.paid ? '<span class="badge ok">مدفوعة</span>' : '<button class="btn gold sm" data-act="pay">ادفع</button>') + '</div>').join('');
    }).join('');
    return layout({ title: 'الأتعاب والدفعات', body, nav: clientNav('pay') });
  }
  function vClientContact() {
    const body =
      '<div class="card"><h3>تواصل مع المكتب</h3>' +
      '<button class="btn block" data-act="soon" data-msg="التواصل عبر واتساب سيُفعّل عند ربط رقم المكتب" style="margin-bottom:8px">مراسلة على واتساب</button>' +
      '<button class="btn ghost block" data-act="soon" data-msg="الاتصال المباشر سيُفعّل عند إضافة رقم المكتب">اتصال بالمكتب</button></div>' +
      '<form class="card" data-form="book"><h3>حجز استشارة</h3>' +
      '<label class="field">نوع الاستشارة<select name="kind"><option>بالمكتب</option><option>مكالمة هاتفية</option><option>مكالمة فيديو</option></select></label>' +
      '<label class="field">اليوم المناسب<input type="date" name="day" required></label>' +
      '<label class="field">الوقت<select name="time"><option>صباحًا</option><option>بعد الظهر</option><option>مساءً</option></select></label>' +
      '<button class="btn gold block">إرسال طلب الحجز</button></form>' +
      '<div class="card"><h3>عن المكتب</h3><p style="margin:0">' + esc(OFFICE) + ' للمحاماة والاستشارات القانونية.</p></div>';
    return layout({ title: 'تواصل معنا', body, nav: clientNav('contact') });
  }
  function vNotFound() {
    return layout({ title: 'غير موجود', back: '#/home', body: '<div class="empty">الصفحة دي مش موجودة.</div>' });
  }

  /* ---------- التوجيه ---------- */
  function route() {
    const h = location.hash || '';
    const app = $('#app');
    if (!state.role) { app.innerHTML = vLogin(); return; }
    const client = state.role === 'client';
    const isClientHash = h.indexOf('#/c/') === 0;
    if (client && !isClientHash) { location.replace('#/c/home'); return; }
    if (!client && isClientHash) { location.replace('#/home'); return; }
    let html;
    if (client) {
      html = h === '#/c/pay' ? vClientPay() : h === '#/c/contact' ? vClientContact() : h === '#/c/more' ? vMore(true) : vClientHome();
    } else if (h.indexOf('#/case/') === 0) html = vCase(h.slice(7));
    else if (h === '#/cases') html = vCases();
    else if (h === '#/sessions') html = vSessions();
    else if (h === '#/tasks') html = vTasks();
    else if (h === '#/more') html = vMore(false);
    else html = vHome();
    app.innerHTML = html;
    const c = $('.content');
    if (c) c.scrollTop = 0;
  }

  /* ---------- إشعار صغير ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- التثبيت ---------- */
  let deferred = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const hideInstall = () => { const b = $('#install'); b.hidden = true; b.innerHTML = ''; };

  function maybeShowInstall() {
    if (isStandalone()) return;
    const dismissed = store.get('installDismissed', 0);
    if (Date.now() - dismissed < 86400000) return;
    if (!deferred && !isIOS()) return;
    const b = $('#install');
    b.innerHTML = '<img src="icons/icon-192.png" alt=""><div class="tx"><b>ثبّت تطبيق المكتب</b>افتحه بضغطة واحدة من الشاشة الرئيسية مثل أي تطبيق.</div>' +
      '<div class="acts"><button class="btn sm" data-act="install">تثبيت</button><button class="link-btn" data-act="dismiss" style="padding:2px;font-size:13px">لاحقًا</button></div>';
    b.hidden = false;
  }
  function openSheet(html) {
    const s = $('#sheet');
    s.innerHTML = '<div class="panel">' + html + '<button class="btn block" data-act="closesheet">تمام</button></div>';
    s.hidden = false;
  }
  async function doInstall() {
    if (isStandalone()) { toast('التطبيق مثبّت بالفعل'); return; }
    if (deferred) {
      deferred.prompt();
      try { await deferred.userChoice; } catch (e) { /* ignore */ }
      deferred = null;
      hideInstall();
      return;
    }
    hideInstall();
    if (isIOS()) {
      openSheet('<h3>التثبيت على iPhone</h3><ol><li>افتح الرابط من متصفح <b>Safari</b>.</li><li>اضغط زر <b>المشاركة</b> (المربع والسهم لأعلى).</li><li>اختر <b>إضافة إلى الشاشة الرئيسية</b>.</li></ol>');
    } else {
      openSheet('<h3>تثبيت التطبيق</h3><ol><li>في <b>Chrome</b> على أندرويد: افتح قائمة ⋮ ثم <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b>.</li><li>على الكمبيوتر: اضغط أيقونة التثبيت في شريط العنوان.</li></ol>');
    }
  }
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; maybeShowInstall(); });
  window.addEventListener('appinstalled', () => { deferred = null; hideInstall(); toast('تم تثبيت التطبيق ✓'); });

  /* ---------- الأحداث ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const a = el.dataset.act;
    if (a === 'role') { state.role = el.dataset.role; store.set('role', state.role); location.hash = state.role === 'client' ? '#/c/home' : '#/home'; route(); }
    else if (a === 'logout') { state.role = null; store.del('role'); location.hash = ''; route(); }
    else if (a === 'back') { if (history.length > 1) history.back(); else location.hash = el.dataset.fallback; }
    else if (a === 'chip') { state.type = el.dataset.type; route(); }
    else if (a === 'seg') { state.sessTab = el.dataset.tab; route(); }
    else if (a === 'install') doInstall();
    else if (a === 'dismiss') { store.set('installDismissed', Date.now()); hideInstall(); }
    else if (a === 'closesheet') { $('#sheet').hidden = true; }
    else if (a === 'upload') { const f = $('#file'); if (f) f.click(); }
    else if (a === 'pay') toast('الدفع الإلكتروني (فوري / إنستاباي) قيد التطوير');
    else if (a === 'soon') toast(el.dataset.msg);
    else if (a === 'reset') { state.tasks = JSON.parse(JSON.stringify(window.DEMO.TASKS)); store.del('tasks'); toast('تمت إعادة ضبط البيانات'); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'q') { state.query = e.target.value; const l = $('#caselist'); if (l) l.innerHTML = caseListHtml(); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset && t.dataset.task) {
      const task = state.tasks.find((x) => x.id === t.dataset.task);
      if (task) { task.done = t.checked; store.set('tasks', state.tasks); route(); }
    } else if (t.id === 'file' && t.files && t.files[0]) {
      toast('تم استلام الملف (تجريبي، لم يُرسل لأي جهة)');
      t.value = '';
    }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    if (f.dataset.form === 'task') {
      const text = f.elements.text.value.trim();
      if (!text) return;
      state.tasks.push({ id: 't' + Date.now(), text, caseId: null, due: Date.now() + 86400000, done: false });
      store.set('tasks', state.tasks);
      route();
    } else if (f.dataset.form === 'book') {
      toast('تم إرسال طلب الحجز (تجريبي)');
      f.reset();
    }
  });
  window.addEventListener('hashchange', route);

  /* ---------- التشغيل ---------- */
  function start() {
    route();
    maybeShowInstall();
  }
  if (!sessionStorage.getItem('splashSeen')) {
    $('#app').innerHTML = '<div class="splash"><img src="icons/logo-full.jpg" alt="' + esc(OFFICE) + '"></div>';
    setTimeout(() => { try { sessionStorage.setItem('splashSeen', '1'); } catch (e) { /* ignore */ } start(); }, 1300);
  } else start();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ignore */ });
  }
})();
