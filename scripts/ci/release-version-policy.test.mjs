import assert from 'node:assert/strict';
import test from 'node:test';
import { checkReleaseVersions } from './release-version-policy.mjs';

const stable = { stableTag: 'V5.0.5', taggedVersion: '5.0.5', developmentVersion: '5.0.5', announced: 'V5.0.5' };
test('Stable and its source tag stay aligned', () => {
  assert.equal(checkReleaseVersions(stable), 'aligned');
});
test('a new development cycle can start before the next Stable is published', () => {
  for (const version of ['5.0.6', '5.1.0', '6.0.0', '5.0.10']) {
    assert.equal(checkReleaseVersions({ ...stable, developmentVersion: version }), 'development-ahead');
  }
});
test('source, announcement and version regressions remain blocking', () => {
  for (const overrides of [
    { taggedVersion: '5.0.6' }, { announced: 'V5.0.6' }, { developmentVersion: '5.0.4' },
    { developmentVersion: '4.9.99' }, { developmentVersion: '5.0.6-canary' },
    { stableTag: 'canary' }, { taggedVersion: '' }, { developmentVersion: '5.0.6\n' },
  ]) assert.throws(() => checkReleaseVersions({ ...stable, ...overrides }));
});
