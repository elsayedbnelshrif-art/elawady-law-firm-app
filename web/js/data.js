// بيانات تجريبية وهمية بالكامل (أسماء وأرقام قضايا مش حقيقية). التواريخ نسبية لليوم.
(function () {
  const at = (n, h, m) => {
    const d = new Date();
    d.setHours(h || 9, m || 0, 0, 0);
    d.setDate(d.getDate() + n);
    return d.getTime();
  };

  const STAGES = ['قيد الدعوى', 'تداول بالجلسات', 'حجز للحكم', 'الطعن', 'التنفيذ'];

  const CASES = [
    {
      id: 'c1', number: '1245 لسنة 2025', title: 'دعوى مطالبة مالية', type: 'مدني',
      court: 'محكمة شمال القاهرة الابتدائية', circuit: 'الدائرة 12 مدني كلي',
      client: 'محمد أحمد علي', opponent: 'شركة النور للمقاولات', lawyer: 'أ. العوضي',
      status: 'نشطة', stage: 1,
      fees: { total: 40000, paid: 25000, installments: [
        { label: 'الدفعة الأولى', amount: 15000, paid: true },
        { label: 'الدفعة الثانية', amount: 10000, paid: true },
        { label: 'الدفعة الثالثة', amount: 15000, paid: false, due: at(12) } ] },
      sessions: [
        { date: at(-45), decision: 'التأجيل لتقديم المستندات' },
        { date: at(-21), decision: 'التأجيل لإعلان الخصم' },
        { date: at(0, 10, 30), decision: '' },
        { date: at(19), decision: '' } ],
      documents: [
        { name: 'صحيفة الدعوى', date: at(-60) },
        { name: 'عقد المقاولة الأصلي', date: at(-58) },
        { name: 'إيصالات السداد', date: at(-40) } ],
      clientNote: 'القضية قيد النظر أمام المحكمة. الجلسة القادمة لعرض المستندات.',
      needed: ['صورة بطاقة الرقم القومي', 'أصل إيصالات السداد']
    },
    {
      id: 'c2', number: '388 لسنة 2025', title: 'قضية شيك بدون رصيد', type: 'جنائي',
      court: 'محكمة جنح مدينة نصر', circuit: 'الدائرة 4 جنح',
      client: 'سامي حسن إبراهيم', opponent: 'النيابة العامة', lawyer: 'أ. محمود',
      status: 'نشطة', stage: 1,
      fees: { total: 25000, paid: 25000, installments: [
        { label: 'أتعاب كاملة', amount: 25000, paid: true } ] },
      sessions: [
        { date: at(-14), decision: 'التأجيل لسماع الشهود' },
        { date: at(1, 9, 0), decision: '' } ],
      documents: [{ name: 'صورة الشيك', date: at(-30) }, { name: 'محضر الشرطة', date: at(-29) }],
      clientNote: 'الجلسة غدًا. نرجو الحضور قبل الموعد بنصف ساعة.',
      needed: []
    },
    {
      id: 'c3', number: '902 لسنة 2025', title: 'دعوى نفقة وحضانة', type: 'أسرة',
      court: 'محكمة الأسرة بمدينة نصر', circuit: 'الدائرة 7 أسرة',
      client: 'منى خالد فؤاد', opponent: 'طرف آخر', lawyer: 'أ. العوضي',
      status: 'نشطة', stage: 1,
      fees: { total: 18000, paid: 9000, installments: [
        { label: 'الدفعة الأولى', amount: 9000, paid: true },
        { label: 'الدفعة الثانية', amount: 9000, paid: false, due: at(5) } ] },
      sessions: [
        { date: at(-30), decision: 'إحالة للخبراء' },
        { date: at(3, 11, 0), decision: '' } ],
      documents: [{ name: 'وثيقة الزواج', date: at(-50) }, { name: 'شهادات ميلاد الأبناء', date: at(-50) }],
      clientNote: 'القضية في مرحلة تقرير الخبراء. هنبلغك فور صدور التقرير.',
      needed: ['أصل شهادات الميلاد']
    },
    {
      id: 'c4', number: '77 لسنة 2024', title: 'نزاع عمالي - فصل تعسفي', type: 'عمل',
      court: 'محكمة شمال القاهرة الابتدائية', circuit: 'الدائرة 3 عمالي',
      client: 'هاني سعيد عبد الله', opponent: 'شركة المستقبل', lawyer: 'أ. محمود',
      status: 'محجوزة للحكم', stage: 2,
      fees: { total: 22000, paid: 22000, installments: [{ label: 'أتعاب كاملة', amount: 22000, paid: true }] },
      sessions: [
        { date: at(-70), decision: 'التأجيل للمرافعة' },
        { date: at(-9), decision: 'حجز الدعوى للحكم' },
        { date: at(11, 9, 0), decision: '' } ],
      documents: [{ name: 'عقد العمل', date: at(-120) }, { name: 'مذكرة الدفاع', date: at(-20) }],
      clientNote: 'القضية محجوزة للحكم. موعد النطق بالحكم محدد في الجلسة القادمة.',
      needed: []
    },
    {
      id: 'c5', number: '5120 لسنة 2025', title: 'طعن على قرار إداري', type: 'إداري',
      court: 'محكمة القضاء الإداري', circuit: 'الدائرة الأولى',
      client: 'شركة الرواد للتجارة', opponent: 'جهة إدارية', lawyer: 'أ. العوضي',
      status: 'نشطة', stage: 0,
      fees: { total: 60000, paid: 20000, installments: [
        { label: 'الدفعة الأولى', amount: 20000, paid: true },
        { label: 'الدفعة الثانية', amount: 20000, paid: false, due: at(-3) },
        { label: 'الدفعة الثالثة', amount: 20000, paid: false, due: at(30) } ] },
      sessions: [{ date: at(8, 10, 0), decision: '' }],
      documents: [{ name: 'القرار المطعون عليه', date: at(-10) }],
      clientNote: 'تم قيد الدعوى وننتظر تحديد أول جلسة.',
      needed: ['صورة السجل التجاري']
    },
    {
      id: 'c6', number: '210 لسنة 2025', title: 'منازعة تجارية بين شركاء', type: 'اقتصادي',
      court: 'المحكمة الاقتصادية بالقاهرة', circuit: 'الدائرة 2 اقتصادي',
      client: 'شركة الأمل للاستثمار', opponent: 'شريك سابق', lawyer: 'أ. محمود',
      status: 'نشطة', stage: 1,
      fees: { total: 90000, paid: 45000, installments: [
        { label: 'الدفعة الأولى', amount: 45000, paid: true },
        { label: 'الدفعة الثانية', amount: 45000, paid: false, due: at(20) } ] },
      sessions: [{ date: at(-5), decision: 'التأجيل للرد على المذكرات' }, { date: at(14, 10, 30), decision: '' }],
      documents: [{ name: 'عقد تأسيس الشركة', date: at(-80) }],
      clientNote: 'تبادل المذكرات جارٍ بين الطرفين.',
      needed: []
    }
  ];

  const DEADLINES = [
    { text: 'ميعاد الطعن بالاستئناف', caseId: 'c4', date: at(9) },
    { text: 'ميعاد إعلان الصحيفة', caseId: 'c5', date: at(4) }
  ];

  const TASKS = [
    { id: 't1', text: 'تجهيز مذكرة الدفاع', caseId: 'c1', due: at(0), done: false },
    { id: 't2', text: 'سحب صورة رسمية من محضر الجلسة', caseId: 'c2', due: at(1), done: false },
    { id: 't3', text: 'تسليم الإعلان للمحضر', caseId: 'c5', due: at(2), done: false },
    { id: 't4', text: 'مراجعة تقرير الخبير', caseId: 'c3', due: at(4), done: false },
    { id: 't5', text: 'تحصيل الدفعة الثانية', caseId: 'c5', due: at(-3), done: false },
    { id: 't6', text: 'أرشفة مستندات القضية', caseId: 'c4', due: at(-6), done: true }
  ];

  window.DEMO = { STAGES, CASES, DEADLINES, TASKS };
})();
