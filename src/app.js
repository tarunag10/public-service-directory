import { buildActionPlan, findEscalationRoutes, sectors } from './directory.js';

const input = document.querySelector('#query');
const sectorSelect = document.querySelector('#sector');
const results = document.querySelector('#results');
const reset = document.querySelector('#reset');

sectorSelect.innerHTML = '<option value="">All sectors</option>' + sectors
  .map((sector) => `<option value="${sector}">${sector}</option>`)
  .join('');

function renderEvidence(items) {
  return items.map((item) => `<li>${item}</li>`).join('');
}

function renderActionPlan(plan) {
  return `<article class="card action-plan">
    <p class="tag">${plan.sector}</p>
    <h2>Action plan: ${plan.routeName}</h2>
    <p><strong>First step:</strong> ${plan.firstStep}</p>
    <div>
      <strong>Evidence to gather</strong>
      <ul>${renderEvidence(plan.evidenceToGather)}</ul>
    </div>
    <p><strong>Escalation path:</strong> ${plan.escalationPath}</p>
    <a class="button" href="${plan.officialUrl}" rel="noreferrer">Open official route</a>
  </article>`;
}

function renderRoute(route) {
  return `<article class="card">
    <p class="tag">${route.sector}</p>
    <h2>${route.name}</h2>
    <p><strong>First step:</strong> ${route.firstStep}</p>
    <p><strong>Next:</strong> ${route.nextStep}</p>
    <div>
      <strong>Evidence to keep</strong>
      <ul>${renderEvidence(route.evidence)}</ul>
    </div>
    <p class="keywords"><strong>Keywords:</strong> ${route.keywords.join(', ')}</p>
    <a class="button secondary" href="${route.officialUrl}" rel="noreferrer">Official route</a>
  </article>`;
}

function update() {
  const hits = findEscalationRoutes(input.value, { sector: sectorSelect.value });
  const plan = buildActionPlan(input.value, { sector: sectorSelect.value });
  results.innerHTML = hits.length
    ? renderActionPlan(plan) + hits.map(renderRoute).join('')
    : '<article class="card"><h2>No direct match yet</h2><p>Try a sector filter or words like council, bank, rail, energy, broadband, data, care, university, housing, or consumer refund.</p></article>';
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
