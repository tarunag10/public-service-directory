export const routes = [
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
  },
  {
    name: 'Rail Ombudsman',
    sector: 'Transport',
    keywords: ['rail', 'train', 'accessibility', 'delay repay', 'ticket', 'station', 'passenger assistance'],
    firstStep: 'Contact the train company first and complete its complaint process.',
    evidence: ['ticket or booking reference', 'delay details', 'accessibility booking', 'operator response'],
    officialUrl: 'https://www.railombudsman.org/',
    nextStep: 'Escalate when the operator is deadlocked or has not resolved the complaint.',
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
  },
  {
    name: 'Housing Ombudsman',
    sector: 'Housing',
    keywords: ['housing association', 'social landlord', 'repairs', 'damp', 'mould', 'antisocial behaviour', 'rent'],
    firstStep: 'Complain to the landlord first and complete its complaints process.',
    evidence: ['repair logs', 'photos', 'medical impact notes', 'landlord responses', 'rent account'],
    officialUrl: 'https://www.housing-ombudsman.org.uk/residents/make-a-complaint/',
    nextStep: 'Escalate after the landlord final response or when the complaint is delayed beyond the scheme rules.',
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

const normalize = (value) => value.toLowerCase().trim();
const savedPlansKey = 'open-access-uk:saved-action-plans';

export const sectors = [...new Set(routes.map((route) => route.sector))].sort();

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

export function findEscalationRoutes(query = '', options = {}) {
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

export function buildActionPlan(query = '', options = {}) {
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
  };
}

export function loadSavedActionPlans(storage) {
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

export function saveActionPlan(plan, storage) {
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

export function clearSavedActionPlans(storage) {
  const target = safeStorage(storage);
  if (!target) return [];

  try {
    target.removeItem(savedPlansKey);
  } catch {
    return [];
  }
  return [];
}

export function buildEscalationChecklist(plan) {
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
    `Official route: ${plan.officialUrl}`,
  ].join('\n');
}

function classifyEvidenceItem(item) {
  const value = normalize(item);
  if (/final|deadlock|response|letter|completion/.test(value)) return 'decision';
  if (/date|timeline|log|history|chronology|reference/.test(value)) return 'timeline';
  if (/photo|screenshot|record|invoice|statement|contract|ticket|booking|policy/.test(value)) return 'evidence';
  if (/impact|harm|risk|medical|witness|injustice/.test(value)) return 'impact';
  return 'supporting';
}

export function buildEscalationReadinessReport(plan, options = {}) {
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
