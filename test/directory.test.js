import test from 'node:test';
import assert from 'node:assert/strict';
import { buildActionPlan, findEscalationRoutes, routes, sectors } from '../src/directory.js';

test('finds escalation routes by issue and sector', () => {
  const results = findEscalationRoutes('council housing repair');
  assert.ok(results.some((route) => route.name.includes('Local Government')));
});

test('covers core UK escalation bodies with official URLs and evidence notes', () => {
  for (const expected of ['Financial Ombudsman Service', 'Rail Ombudsman', 'Ofgem', 'Ofcom', 'Information Commissioner', 'Care Quality Commission', 'University complaints', 'Housing Ombudsman', 'Consumer complaints']) {
    assert.ok(routes.some((route) => route.name.includes(expected)), `missing ${expected}`);
  }

  for (const route of routes) {
    assert.match(route.officialUrl, /^https:\/\//);
    assert.ok(route.firstStep.length > 20);
    assert.ok(route.evidence.length >= 3);
  }
});

test('filters by sector and searches evidence fields', () => {
  assert.ok(sectors.includes('Housing'));
  const housing = findEscalationRoutes('', { sector: 'Housing' });
  assert.deepEqual(housing.map((route) => route.name), ['Housing Ombudsman']);

  const evidenceSearch = findEscalationRoutes('deadlock letter');
  assert.ok(evidenceSearch.some((route) => route.name.includes('Financial Ombudsman')));
  assert.ok(evidenceSearch.some((route) => route.name.includes('Ofgem')));
});

test('builds an action plan from the strongest query match', () => {
  const plan = buildActionPlan('bank fraud refund');

  assert.equal(plan.routeName, 'Financial Ombudsman Service');
  assert.equal(plan.sector, 'Financial services');
  assert.match(plan.firstStep, /Complain to the firm first/);
  assert.ok(plan.evidenceToGather.includes('final response letter'));
  assert.match(plan.escalationPath, /ombudsman/i);
  assert.equal(plan.officialUrl, 'https://www.financial-ombudsman.org.uk/');
});

test('builds an action plan for a selected sector when the query is broad', () => {
  const plan = buildActionPlan('repair complaint', { sector: 'Housing' });

  assert.equal(plan.routeName, 'Housing Ombudsman');
  assert.equal(plan.sector, 'Housing');
  assert.ok(plan.evidenceToGather.includes('repair logs'));
  assert.match(plan.escalationPath, /landlord final response/i);
});

test('returns a fallback action plan when no route matches', () => {
  const plan = buildActionPlan('something unusual');

  assert.equal(plan.routeName, 'General escalation preparation');
  assert.match(plan.firstStep, /Start with the organisation/i);
  assert.ok(plan.evidenceToGather.includes('complaint reference'));
  assert.match(plan.escalationPath, /sector filter/i);
  assert.equal(plan.officialUrl, 'https://www.gov.uk/complain');
});
