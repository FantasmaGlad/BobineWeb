import test from 'node:test';
import assert from 'node:assert/strict';
import {deploymentOrigin} from './deployment-origin.mjs';
test('origines publiques exactes et sous-domaines Bobine',()=>{
  for(const value of ['https://bobine.fit','https://www.bobine.fit/','https://packages.bobine.fit'])assert.equal(deploymentOrigin(value),value.replace(/\/$/,''));
  assert.equal(deploymentOrigin('https://security.bobine.fit','security'),'https://security.bobine.fit');
});
test('destinations ambiguës ou étrangères refusées',()=>{
  for(const value of ['http://bobine.fit','https://bobine.fit.attacker.test','https://evilbobine.fit','https://bobine.fit@attacker.test','https://user@bobine.fit','https://bobine.fit:8443','https://bobine.fit/path','https://bobine.fit?token=x','https://bobine.fit#x','https://bobine.fit.','file:///etc/passwd','https://127.0.0.1'])assert.throws(()=>deploymentOrigin(value),value);
  assert.throws(()=>deploymentOrigin('https://bobine.fit','security'));
});
test('seuls les déploiements du projet connu reçoivent le jeton Vercel',()=>{
  assert.equal(deploymentOrigin('https://bobine-ly6p47hnm-fantasmaglads-projects.vercel.app','vercel'),'https://bobine-ly6p47hnm-fantasmaglads-projects.vercel.app');
  for(const host of ['other.vercel.app','bobine-x-other.vercel.app','bobine-x-fantasmaglads-projects.vercel.app.attacker.test','bobine-x-fantasmaglads-projects.vercel.app@evil.test'])assert.throws(()=>deploymentOrigin('https://'+host,'vercel'));
});
