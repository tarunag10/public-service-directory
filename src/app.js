// ===== src/theme.js =====
const __m1__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_public_service_directory_src_theme_js = (() => {
// <app>/src/theme.js

function readStored() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(value) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    /* private mode: theme still applies for this session */
  }
}

function apply(theme, toggle) {
  document.documentElement.setAttribute('data-theme', theme);
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
  }
}

function initTheme(toggleSelector = '#theme-toggle') {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  const toggle = document.querySelector(toggleSelector);
  let theme = resolveInitialTheme({ stored: readStored(), prefersDark });
  apply(theme, toggle);

  toggle?.addEventListener('click', () => {
    theme = nextTheme(theme);
    apply(theme, toggle);
    writeStored(theme);
  });
}

return { initTheme };
})();

// ===== ../shared/theme/index.mjs =====
const __m2__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_shared_theme_index_mjs = (() => {
// shared/theme/index.mjs
const THEME_STORAGE_KEY = 'open-access-uk:theme';

const VALID = new Set(['light', 'dark']);

function resolveInitialTheme({ stored, prefersDark } = {}) {
  if (VALID.has(stored)) return stored;
  return prefersDark ? 'dark' : 'light';
}

function nextTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}

return { THEME_STORAGE_KEY, resolveInitialTheme, nextTheme };
})();

// ===== ../shared/calendar/ics.mjs =====
const __m3__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_shared_calendar_ics_mjs = (() => {

function compactDate(dateString) {
  return dateString.replace(/-/g, '');
}

function nextDay(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return null;
  date.setDate(date.getDate() + 1);
  return toLocalDateString(date);
}

function escapeText(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

// RFC 5545 line folding at 75 octets.
function foldIcsLine(line) {
  if (line.length <= 75) return line;
  const segments = [];
  let remaining = line;
  segments.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length) {
    segments.push(' ' + remaining.slice(0, 74));
    remaining = remaining.slice(74);
  }
  return segments.join('\r\n');
}

function createIcsEvent({ title, date, description = '', uid } = {}) {
  const start = parseLocalDate(date);
  if (!start) return '';
  const end = nextDay(date);
  const stamp = `${compactDate(date)}T000000Z`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Open Access UK//Local//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${escapeText(uid || `${compactDate(date)}-${escapeText(title)}`)}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compactDate(date)}`,
    `DTEND;VALUE=DATE:${compactDate(end)}`,
    `SUMMARY:${escapeText(title)}`,
    description ? `DESCRIPTION:${escapeText(description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean);
  return lines.map(foldIcsLine).join('\r\n') + '\r\n';
}

return { foldIcsLine, createIcsEvent };
})();

// ===== ../shared/deadlines/index.mjs =====
const __m4__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_shared_deadlines_index_mjs = (() => {
function parseLocalDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toLocalDateString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

function isWorkingDay(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function addWorkingDays(value, days) {
  const date = parseLocalDate(value);
  if (!date) return null;
  let remaining = Number(days);
  const result = new Date(date);
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result)) remaining -= 1;
  }
  return toLocalDateString(result);
}

function calculateDeadline(startDate, rule) {
  const date = parseLocalDate(startDate);
  if (!date || !rule) return null;

  if (rule.days && rule.day_type === 'working') {
    return {
      ruleId: rule.id,
      targetDate: addWorkingDays(startDate, Number(rule.days)),
      explanation: rule.explanation
    };
  }

  const result = new Date(date);
  if (rule.days) result.setDate(result.getDate() + Number(rule.days));
  if (rule.weeks) result.setDate(result.getDate() + Number(rule.weeks) * 7);
  if (rule.months) result.setMonth(result.getMonth() + Number(rule.months));

  return {
    ruleId: rule.id,
    targetDate: toLocalDateString(result),
    explanation: rule.explanation
  };
}

return { parseLocalDate, toLocalDateString, addWorkingDays, calculateDeadline };
})();

// ===== src/directory.js =====
const __m5__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_public_service_directory_src_directory_js = (() => {
const routes = [
  {
    name: 'Council complaints',
    sector: 'Local government',
    keywords: ['council', 'local authority', 'bins', 'planning', 'parking', 'blue badge', 'homelessness'],
    firstStep: 'Complain to the council first and ask for its final response or stage two decision.',
    evidence: ['complaint reference', 'dates of contact', 'photos', 'letters or emails', 'impact notes'],
    officialUrl: 'https://www.gov.uk/complain-about-your-council',
    nextStep: 'If the council has finished its process or takes too long, check the Local Government and Social Care Ombudsman route.',
  },
  {
    name: 'Local Government and Social Care Ombudsman',
    sector: 'Local government and social care',
    keywords: ['ombudsman', 'lgso', 'council', 'adult social care', 'children services', 'housing allocations'],
    firstStep: 'Use this after the council or care provider has had a chance to answer the complaint.',
    evidence: ['final response letter', 'care assessments', 'care invoices', 'chronology', 'proof of injustice'],
    officialUrl: 'https://www.lgo.org.uk/',
    nextStep: 'Submit the complaint online with a clear timeline and the outcome you want.',
  },
  {
    name: 'Financial Ombudsman Service',
    sector: 'Financial services',
    keywords: ['bank', 'refund', 'credit', 'insurance', 'loan', 'pension', 'mortgage', 'fraud', 'chargeback'],
    firstStep: 'Complain to the firm first; most cases need its final response or eight weeks to pass.',
    evidence: ['final response letter', 'statements', 'policy documents', 'screenshots', 'loss calculation'],
    officialUrl: 'https://www.financial-ombudsman.org.uk/',
    nextStep: 'Raise the case with the ombudsman within the published deadline after the final response.',
    currentNote: 'The Financial Ombudsman says most financial firms should reply within 8 weeks, and the final response normally explains the 6-month referral window.',
  },
  {
    name: 'Rail Ombudsman',
    sector: 'Transport',
    keywords: ['rail', 'train', 'accessibility', 'delay repay', 'ticket', 'station', 'passenger assistance'],
    firstStep: 'Contact the train company first and complete its complaint process.',
    evidence: ['ticket or booking reference', 'delay details', 'accessibility booking', 'operator response'],
    officialUrl: 'https://www.railombudsman.org/',
    nextStep: 'Escalate when the operator is deadlocked or has not resolved the complaint.',
    currentNote: 'The Rail Ombudsman says to come to it after a deadlock/final response or when the provider has not resolved the complaint within 40 working days.',
  },
  {
    name: 'Ofgem energy complaints',
    sector: 'Energy',
    keywords: ['ofgem', 'energy', 'gas', 'electricity', 'meter', 'prepayment', 'billing', 'supplier'],
    firstStep: 'Complain to your energy supplier first and ask for a deadlock letter if unresolved.',
    evidence: ['account number', 'meter readings', 'bills', 'deadlock letter', 'payment history'],
    officialUrl: 'https://www.ofgem.gov.uk/information-consumers/energy-advice-households/complain-about-your-energy-supplier',
    nextStep: 'Ofgem explains the route; unresolved domestic complaints usually go to the Energy Ombudsman.',
  },
  {
    name: 'Ofcom complaints',
    sector: 'Communications',
    keywords: ['ofcom', 'broadband', 'mobile', 'phone', 'tv', 'postal', 'nuisance calls', 'telecoms'],
    firstStep: 'Complain to the provider or broadcaster first unless reporting harmful or illegal content routes.',
    evidence: ['account number', 'contract', 'provider replies', 'speed tests', 'call logs'],
    officialUrl: 'https://www.ofcom.org.uk/make-a-complaint/',
    nextStep: 'Use Ofcom guidance to identify whether the issue goes to an ADR scheme, Ofcom, or another regulator.',
  },
  {
    name: 'Information Commissioner\'s Office',
    sector: 'Data protection',
    keywords: ['ico', 'data', 'privacy', 'subject access', 'sar', 'foi', 'gdpr', 'breach'],
    firstStep: 'Raise the issue with the organisation first and give it a reasonable chance to respond.',
    evidence: ['request copy', 'response dates', 'identity checks', 'screenshots', 'harm or risk notes'],
    officialUrl: 'https://ico.org.uk/make-a-complaint/',
    nextStep: 'Escalate to the ICO when the organisation does not resolve the data protection concern.',
  },
  {
    name: 'Care Quality Commission',
    sector: 'Health and care',
    keywords: ['cqc', 'care home', 'home care', 'gp', 'hospital safety', 'regulated care', 'inspection'],
    firstStep: 'Complain to the provider for personal redress; tell CQC when the information concerns service quality or safety.',
    evidence: ['care records', 'incident dates', 'provider response', 'photos', 'witness details'],
    officialUrl: 'https://www.cqc.org.uk/give-feedback-on-care',
    nextStep: 'CQC does not resolve individual complaints but uses feedback in regulation and inspection.',
  },
  {
    name: 'University complaints and OIA',
    sector: 'Education',
    keywords: ['university', 'student', 'degree', 'academic appeal', 'complaint', 'oia', 'higher education'],
    firstStep: 'Use the university complaints or appeals process and request a Completion of Procedures letter.',
    evidence: ['completion of procedures letter', 'student handbook', 'emails', 'assessment records', 'timeline'],
    officialUrl: 'https://www.oiahe.org.uk/students/how-to-complain-to-us/',
    nextStep: 'Take eligible complaints to the Office of the Independent Adjudicator within its deadline.',
    currentNote: 'The OIA states students have a maximum of 12 months from the Completion of Procedures Letter date to bring a complaint.',
  },
  {
    name: 'Housing Ombudsman',
    sector: 'Housing',
    keywords: ['housing association', 'social landlord', 'repairs', 'damp', 'mould', 'antisocial behaviour', 'rent'],
    firstStep: 'Complain to the landlord first and complete its complaints process.',
    evidence: ['repair logs', 'photos', 'medical impact notes', 'landlord responses', 'rent account'],
    officialUrl: 'https://www.housing-ombudsman.org.uk/residents/make-a-complaint/',
    nextStep: 'Escalate after the landlord final response or when the complaint is delayed beyond the scheme rules.',
    currentNote: 'The Housing Ombudsman says social landlords should acknowledge stage 1 and stage 2 complaints within 5 working days, respond at stage 1 within 10 working days, and respond at stage 2 within 20 working days.',
  },
  {
    name: 'Consumer complaints',
    sector: 'Consumer',
    keywords: ['consumer', 'trader', 'retailer', 'goods', 'services', 'refund', 'faulty', 'citizens advice', 'trading standards'],
    firstStep: 'Ask the trader to put things right and keep the complaint in writing.',
    evidence: ['receipt', 'contract', 'photos', 'delivery tracking', 'messages', 'refund request'],
    officialUrl: 'https://www.citizensadvice.org.uk/consumer/get-more-help/if-you-need-more-help-about-a-consumer-issue/',
    nextStep: 'Citizens Advice can explain consumer rights and pass suitable cases to Trading Standards.',
  },
];

const currentGuidance = [
  {
    title: 'Council complaints usually start locally',
    detail: 'GOV.UK says to complain to the council service provider, then the council complaints officer, before going to the Local Government and Social Care Ombudsman where appropriate.',
    source: 'GOV.UK council complaints',
    url: 'https://www.gov.uk/understand-how-your-council-works/make-a-complaint'
  },
  {
    title: 'Financial complaints have an 8-week marker',
    detail: 'The Financial Ombudsman says firms should respond within 8 weeks at most for many complaints, and final responses normally explain the 6-month referral window.',
    source: 'Financial Ombudsman complaint checker',
    url: 'https://www.financial-ombudsman.org.uk/consumers/how-to-complain/complaint-checker'
  },
  {
    title: 'Student complaints have a 12-month OIA limit',
    detail: 'The OIA says students normally have a maximum of 12 months from the date of the Completion of Procedures Letter to bring a complaint.',
    source: 'OIA time limits',
    url: 'https://www.oiahe.org.uk/about-us/our-scheme/our-rules/guidance-on-the-rules/rule-8/'
  },
  {
    title: 'Rail complaints use 40 working days or deadlock',
    detail: 'The Rail Ombudsman says passengers can complain after a final response/deadlock letter or if the provider has not resolved the complaint within 40 working days.',
    source: 'Rail Ombudsman FAQ',
    url: 'https://www.railombudsman.org/faq'
  }
];

const normalize = (value) => value.toLowerCase().trim();
const savedPlansKey = 'open-access-uk:saved-action-plans';

const sectors = [...new Set(routes.map((route) => route.sector))].sort();

const fallbackActionPlan = {
  routeName: 'General escalation preparation',
  sector: 'General',
  firstStep: 'Start with the organisation responsible for the service and ask for its complaint process in writing.',
  evidenceToGather: ['complaint reference', 'timeline of events', 'copies of messages', 'impact notes'],
  escalationPath: 'Use the search terms or sector filter to find the most relevant regulator, ombudsman, or advice route.',
  officialUrl: 'https://www.gov.uk/complain',
};

function routeScore(route, terms) {
  if (terms.length === 0) return 1;

  const weightedFields = [
    [route.name, 4],
    [route.sector, 3],
    [route.keywords.join(' '), 3],
    [route.evidence.join(' '), 2],
    [route.firstStep, 1],
    [route.nextStep, 1],
  ];

  return terms.reduce((score, term) => {
    const termScore = weightedFields.reduce((total, [value, weight]) => (
      normalize(value).includes(term) ? total + weight : total
    ), 0);
    return score + termScore;
  }, 0);
}

function findEscalationRoutes(query = '', options = {}) {
  const q = normalize(query);
  const sector = normalize(options.sector || '');

  return routes.filter((route) => {
    const sectorMatch = !sector || normalize(route.sector) === sector;
    if (!sectorMatch) return false;
    if (!q) return true;

    const searchable = [
      route.name,
      route.sector,
      route.firstStep,
      route.nextStep,
      route.officialUrl,
      ...route.keywords,
      ...route.evidence,
    ].join(' ').toLowerCase();

    return q.split(/\s+/).some((term) => searchable.includes(term));
  });
}

function buildActionPlan(query = '', options = {}) {
  const matches = findEscalationRoutes(query, options);
  if (matches.length === 0) return fallbackActionPlan;

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const route = matches
    .map((match) => ({ route: match, score: routeScore(match, terms) }))
    .sort((a, b) => b.score - a.score || a.route.name.localeCompare(b.route.name))[0].route;

  return {
    routeName: route.name,
    sector: route.sector,
    firstStep: route.firstStep,
    evidenceToGather: route.evidence,
    escalationPath: route.nextStep,
    officialUrl: route.officialUrl,
    currentNote: route.currentNote || '',
  };
}

function safeStorage(storage) {
  if (storage) return storage;
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return null;
}

function normalizeSavedPlan(plan) {
  if (!plan || typeof plan !== 'object') return null;
  const evidenceToGather = Array.isArray(plan.evidenceToGather)
    ? plan.evidenceToGather.filter((item) => typeof item === 'string' && item.trim())
    : [];

  if (!plan.routeName || !plan.firstStep || evidenceToGather.length === 0) return null;

  return {
    id: typeof plan.id === 'string' ? plan.id : `plan-${Date.now()}`,
    savedAt: typeof plan.savedAt === 'string' ? plan.savedAt : new Date().toISOString(),
    routeName: String(plan.routeName),
    sector: String(plan.sector || 'General'),
    firstStep: String(plan.firstStep),
    evidenceToGather,
    escalationPath: String(plan.escalationPath || ''),
    officialUrl: String(plan.officialUrl || ''),
    currentNote: String(plan.currentNote || ''),
  };
}

function loadSavedActionPlans(storage) {
  const target = safeStorage(storage);
  if (!target) return [];

  try {
    const parsed = JSON.parse(target.getItem(savedPlansKey) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeSavedPlan).filter(Boolean);
  } catch {
    return [];
  }
}

function saveActionPlan(plan, storage) {
  const target = safeStorage(storage);
  const savedPlan = normalizeSavedPlan({
    ...plan,
    id: `plan-${Date.now()}`,
    savedAt: new Date().toISOString(),
  });
  if (!target || !savedPlan) return loadSavedActionPlans(storage);

  const plans = [savedPlan, ...loadSavedActionPlans(target)].slice(0, 12);
  try {
    target.setItem(savedPlansKey, JSON.stringify(plans));
  } catch {
    return loadSavedActionPlans(target);
  }
  return plans;
}

function clearSavedActionPlans(storage) {
  const target = safeStorage(storage);
  if (!target) return [];

  try {
    target.removeItem(savedPlansKey);
  } catch {
    return [];
  }
  return [];
}

function buildEscalationChecklist(plan) {
  const evidence = Array.isArray(plan.evidenceToGather) ? plan.evidenceToGather : [];
  return [
    `Escalation checklist: ${plan.routeName}`,
    `Sector: ${plan.sector}`,
    '',
    `First step: ${plan.firstStep}`,
    '',
    'Evidence to gather:',
    ...evidence.map((item) => `[ ] ${item}`),
    '',
    `Escalation path: ${plan.escalationPath}`,
    plan.currentNote ? `Current note: ${plan.currentNote}` : '',
    `Official route: ${plan.officialUrl}`,
  ].filter((line) => line !== '').join('\n');
}

function classifyEvidenceItem(item) {
  const value = normalize(item);
  if (/final|deadlock|response|letter|completion/.test(value)) return 'decision';
  if (/date|timeline|log|history|chronology|reference/.test(value)) return 'timeline';
  if (/photo|screenshot|record|invoice|statement|contract|ticket|booking|policy/.test(value)) return 'evidence';
  if (/impact|harm|risk|medical|witness|injustice/.test(value)) return 'impact';
  return 'supporting';
}

function buildEscalationReadinessReport(plan, options = {}) {
  const evidence = Array.isArray(plan.evidenceToGather) ? plan.evidenceToGather : [];
  const groups = evidence.reduce((acc, item) => {
    const category = classifyEvidenceItem(item);
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {});
  const missingEvidence = Array.isArray(options.missingEvidence)
    ? options.missingEvidence.filter((item) => evidence.includes(item))
    : [];
  const gathered = Math.max(evidence.length - missingEvidence.length, 0);
  const readinessScore = evidence.length === 0 ? 0 : Math.round((gathered / evidence.length) * 100);
  const blockers = [
    !plan.firstStep ? 'Confirm the organisation first-step complaint route.' : '',
    missingEvidence.length ? `Gather ${missingEvidence.length} remaining evidence item${missingEvidence.length === 1 ? '' : 's'}.` : '',
    !plan.officialUrl ? 'Find the official escalation route before submitting.' : '',
  ].filter(Boolean);
  const nextActions = [
    plan.firstStep,
    missingEvidence.length
      ? `Prioritise: ${missingEvidence.slice(0, 3).join(', ')}.`
      : 'Keep a copy of the complete evidence pack before escalating.',
    plan.escalationPath,
    plan.currentNote,
    `Use the official route: ${plan.officialUrl}`,
  ].filter(Boolean);

  return {
    title: `${plan.routeName} readiness report`,
    routeName: plan.routeName,
    sector: plan.sector,
    readinessScore,
    status: readinessScore >= 80 ? 'ready' : readinessScore >= 50 ? 'nearly-ready' : 'prepare-first',
    evidenceGroups: groups,
    missingEvidence,
    blockers,
    nextActions,
    markdown: [
      `# ${plan.routeName} readiness report`,
      '',
      `Sector: ${plan.sector}`,
      `Readiness: ${readinessScore}%`,
      '',
      '## Evidence checklist',
      ...evidence.map((item) => `- [${missingEvidence.includes(item) ? ' ' : 'x'}] ${item}`),
      '',
      '## Blockers',
      ...(blockers.length ? blockers.map((item) => `- ${item}`) : ['- No obvious blockers in this plan.']),
      '',
      '## Next actions',
      ...nextActions.map((item) => `- ${item}`),
      '',
      'This is public-service information, not legal advice. Check deadlines and scheme rules before submitting.',
    ].join('\n'),
  };
}

function buildEscalationHandoffPack(plan, options = {}) {
  const checklist = buildEscalationChecklist(plan);
  const report = buildEscalationReadinessReport(plan, options);
  const contactLog = buildEscalationContactLog(plan, options.contactLogEntries);

  return {
    title: `${plan.routeName} handoff pack`,
    markdown: [
      `# ${plan.routeName} handoff pack`,
      '',
      'Generated locally in the browser. Nothing was sent to a server.',
      '',
      '## Readiness report',
      report.markdown,
      '',
      '## Checklist',
      '```text',
      checklist,
      '```',
      '',
      '## Contact log',
      contactLog.markdown,
      '',
      '## Current source notes',
      ...currentGuidance.map((item) => `- ${item.title}: ${item.detail} Source: ${item.url}`),
      '',
      'Check official deadlines, scheme rules, and urgent advice routes before submitting.'
    ].join('\n')
  };
}

function buildEscalationContactLog(plan, entries = []) {
  const safeEntries = Array.isArray(entries)
    ? entries
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry) => ({
          date: String(entry.date || ''),
          contact: String(entry.contact || ''),
          reference: String(entry.reference || ''),
          outcome: String(entry.outcome || ''),
          followUp: String(entry.followUp || '')
        }))
    : [];

  const starterRows = safeEntries.length
    ? safeEntries
    : [
        {
          date: '',
          contact: '',
          reference: '',
          outcome: '',
          followUp: ''
        }
      ];

  const rows = starterRows.map((entry, index) => [
    `### Contact ${index + 1}`,
    `- Date contacted: ${entry.date}`,
    `- Person or team: ${entry.contact}`,
    `- Reference number: ${entry.reference}`,
    `- What happened: ${entry.outcome}`,
    `- Follow-up needed: ${entry.followUp}`
  ].join('\n'));

  return {
    title: `${plan.routeName} contact log`,
    routeName: plan.routeName,
    markdown: [
      `# ${plan.routeName} contact log`,
      '',
      `Sector: ${plan.sector}`,
      `Official route: ${plan.officialUrl}`,
      '',
      'Use this to keep a dated record before escalating. Keep sensitive account, health, or identity details out of public copies.',
      '',
      ...rows,
      '',
      'Suggested follow-up checks:',
      '- [ ] Save copies of replies and screenshots.',
      '- [ ] Note any final response, deadlock letter, or missed deadline.',
      '- [ ] Check the official route before sending the next escalation.'
    ].join('\n')
  };
}

return { routes, currentGuidance, sectors, findEscalationRoutes, buildActionPlan, loadSavedActionPlans, saveActionPlan, clearSavedActionPlans, buildEscalationChecklist, buildEscalationReadinessReport, buildEscalationHandoffPack, buildEscalationContactLog };
})();

// ===== generated dependency bindings =====

const { initTheme: initTheme } = __m1__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_public_service_directory_src_theme_js;

const { THEME_STORAGE_KEY: THEME_STORAGE_KEY, resolveInitialTheme: resolveInitialTheme, nextTheme: nextTheme } = __m2__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_shared_theme_index_mjs;

const { foldIcsLine: foldIcsLine, createIcsEvent: createIcsEvent } = __m3__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_shared_calendar_ics_mjs;

const { parseLocalDate: parseLocalDate, toLocalDateString: toLocalDateString, addWorkingDays: addWorkingDays, calculateDeadline: calculateDeadline } = __m4__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_shared_deadlines_index_mjs;

const { routes: routes, currentGuidance: currentGuidance, sectors: sectors, findEscalationRoutes: findEscalationRoutes, buildActionPlan: buildActionPlan, loadSavedActionPlans: loadSavedActionPlans, saveActionPlan: saveActionPlan, clearSavedActionPlans: clearSavedActionPlans, buildEscalationChecklist: buildEscalationChecklist, buildEscalationReadinessReport: buildEscalationReadinessReport, buildEscalationHandoffPack: buildEscalationHandoffPack, buildEscalationContactLog: buildEscalationContactLog } = __m5__Users_tarunagarwal_Documents_1_App_Developement_Tarun_Open_Access_UK_public_service_directory_src_directory_js;

// ===== src/app.js =====
// ===== src/app.js =====

// ===== src/app.js =====

// ===== src/app.js =====




const input = document.querySelector('#query');
const sectorSelect = document.querySelector('#sector');
const results = document.querySelector('#results');
const reset = document.querySelector('#reset');
const savedPlans = document.querySelector('#saved-plans');
const currentGuidanceMount = document.querySelector('#current-guidance');

let currentPlan = null;

sectorSelect.innerHTML = '<option value="">All sectors</option>' + sectors
  .map((sector) => `<option value="${sector}">${sector}</option>`)
  .join('');

function renderEvidence(items) {
  return items.map((item) => `<li>${item}</li>`).join('');
}

function renderActionPlan(plan) {
  const checklist = buildEscalationChecklist(plan);
  const report = buildEscalationReadinessReport(plan);
  return `<article class="card action-plan">
    <p class="tag">${plan.sector}</p>
    <h2>Action plan: ${plan.routeName}</h2>
    <p><strong>First step:</strong> ${plan.firstStep}</p>
    <div>
      <strong>Evidence to gather</strong>
      <ul>${renderEvidence(plan.evidenceToGather)}</ul>
    </div>
    <p><strong>Escalation path:</strong> ${plan.escalationPath}</p>
    ${plan.currentNote ? `<p><strong>Current note:</strong> ${plan.currentNote}</p>` : ''}
    <a class="button" href="${plan.officialUrl}" rel="noreferrer">Open official route</a>
    <button id="save-plan" type="button" class="secondary">Save plan locally</button>
    <div class="checklist-tools">
      <h3>Escalation checklist</h3>
      <textarea id="checklist" readonly>${checklist}</textarea>
      <button id="copy-checklist" type="button" class="secondary">Copy checklist</button>
      <button id="print-checklist" type="button" class="secondary">Print checklist</button>
    </div>
    <div class="checklist-tools">
      <h3>Readiness report: ${report.readinessScore}%</h3>
      <p>Status: ${report.status.replace('-', ' ')}</p>
      <textarea id="readiness-report" readonly>${report.markdown}</textarea>
      <button id="copy-readiness-report" type="button" class="secondary">Copy readiness report</button>
      <button id="copy-contact-log" type="button" class="secondary">Copy contact log</button>
      <button id="copy-handoff-pack" type="button" class="secondary">Copy handoff pack</button>
    </div>
    <ol class="escalation-timeline" aria-label="Escalation journey">
      <li><span class="step-dot"></span>${plan.firstStep || 'Start the organisation complaint process'}</li>
      <li><span class="step-dot"></span>${plan.escalationPath || 'Escalate to the relevant ombudsman or regulator'}</li>
      <li><span class="step-dot"></span>Keep evidence and await the final decision</li>
    </ol>
    <button id="add-escalation-deadline" type="button" class="secondary">Add 8-week reminder to calendar</button>
  </article>`;
}

function renderRoute(route) {
  return `<article class="card">
    <p class="tag">${route.sector}</p>
    <h2>${route.name}</h2>
    <p><strong>First step:</strong> ${route.firstStep}</p>
    <p><strong>Next:</strong> ${route.nextStep}</p>
    ${route.currentNote ? `<p><strong>Current note:</strong> ${route.currentNote}</p>` : ''}
    <div>
      <strong>Evidence to keep</strong>
      <ul>${renderEvidence(route.evidence)}</ul>
    </div>
    <p class="keywords"><strong>Keywords:</strong> ${route.keywords.join(', ')}</p>
    <a class="button secondary" href="${route.officialUrl}" rel="noreferrer">Official route</a>
  </article>`;
}

function renderCurrentGuidance() {
  currentGuidanceMount.innerHTML = currentGuidance.map((item) => `<article class="card">
    <h3>${item.title}</h3>
    <p>${item.detail}</p>
    <a href="${item.url}" rel="noreferrer">${item.source}</a>
  </article>`).join('');
}

function renderSavedPlans() {
  const plans = loadSavedActionPlans();
  savedPlans.innerHTML = `<h2>Saved plans</h2>
    ${plans.length
    ? `<ul>${plans.map((plan) => `<li><strong>${plan.routeName}</strong><br><span>${new Date(plan.savedAt).toLocaleString()}</span></li>`).join('')}</ul>
      <button id="clear-saved-plans" type="button" class="secondary">Clear saved plans</button>`
    : '<p>No saved plans yet.</p>'}`;

  const clear = document.querySelector('#clear-saved-plans');
  if (clear) {
    clear.addEventListener('click', () => {
      clearSavedActionPlans();
      renderSavedPlans();
    });
  }
}

async function copyText(value) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const fallback = document.createElement('textarea');
  fallback.value = value;
  document.body.append(fallback);
  fallback.select();
  document.execCommand('copy');
  fallback.remove();
}

function update() {
  const hits = findEscalationRoutes(input.value, { sector: sectorSelect.value });
  currentPlan = buildActionPlan(input.value, { sector: sectorSelect.value });
  results.innerHTML = hits.length
    ? renderActionPlan(currentPlan) + hits.map(renderRoute).join('')
    : '<article class="card"><h2>No direct match yet</h2><p>Try a sector filter or words like council, bank, rail, energy, broadband, data, care, university, housing, or consumer refund.</p></article>';

  const save = document.querySelector('#save-plan');
  if (save) {
    save.addEventListener('click', () => {
      saveActionPlan(currentPlan);
      renderSavedPlans();
    });
  }

  const copyChecklist = document.querySelector('#copy-checklist');
  if (copyChecklist) {
    copyChecklist.addEventListener('click', async () => {
      await copyText(buildEscalationChecklist(currentPlan));
    });
  }

  const printChecklist = document.querySelector('#print-checklist');
  if (printChecklist) {
    printChecklist.addEventListener('click', () => window.print());
  }

  const copyReadinessReport = document.querySelector('#copy-readiness-report');
  if (copyReadinessReport) {
    copyReadinessReport.addEventListener('click', async () => {
      await copyText(buildEscalationReadinessReport(currentPlan).markdown);
    });
  }

  const copyHandoffPack = document.querySelector('#copy-handoff-pack');
  if (copyHandoffPack) {
    copyHandoffPack.addEventListener('click', async () => {
      await copyText(buildEscalationHandoffPack(currentPlan).markdown);
    });
  }

  const copyContactLog = document.querySelector('#copy-contact-log');
  if (copyContactLog) {
    copyContactLog.addEventListener('click', async () => {
      await copyText(buildEscalationContactLog(currentPlan).markdown);
    });
  }

  const addDeadline = document.querySelector('#add-escalation-deadline');
  if (addDeadline) {
    addDeadline.addEventListener('click', () => {
      const today = new Date();
      const start = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
      const due = addWorkingDays(start, 40);
      const ics = createIcsEvent({
        title: `Escalation follow-up: ${currentPlan?.routeName || 'complaint'}`,
        date: due,
        description: 'Most ombudsman routes allow escalation around 8 weeks after the first complaint.',
        uid: `oauk-escalation-${due}`
      });
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'escalation-reminder.ics';
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}

reset.addEventListener('click', () => {
  input.value = '';
  sectorSelect.value = '';
  update();
  input.focus();
});

input.addEventListener('input', update);
sectorSelect.addEventListener('change', update);
update();
renderSavedPlans();
renderCurrentGuidance();

initTheme('#theme-toggle');

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');
navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  primaryNav?.classList.toggle('is-open', open);
});
