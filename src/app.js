import {
  buildActionPlan,
  buildEscalationChecklist,
  buildEscalationHandoffPack,
  buildEscalationReadinessReport,
  clearSavedActionPlans,
  currentGuidance,
  findEscalationRoutes,
  loadSavedActionPlans,
  saveActionPlan,
  sectors,
} from './directory.js';

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
      <button id="copy-handoff-pack" type="button" class="secondary">Copy handoff pack</button>
    </div>
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
