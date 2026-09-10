import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHoverPreview } from '../lib/hover-preview.ts';

test('shows only after the complete 1.5-second dwell', (t) => {
  t.mock.timers.enable({apis:['setTimeout']});
  const shown=[];const hover=createHoverPreview(part=>shown.push(part));
  hover.move(2);t.mock.timers.tick(1499);assert.deepEqual(shown,[null]);
  t.mock.timers.tick(1);assert.deepEqual(shown,[null,2]);hover.dispose();
});
test('movement hides the preview and restarts the dwell timer', (t) => {
  t.mock.timers.enable({apis:['setTimeout']});
  const shown=[];const hover=createHoverPreview(part=>shown.push(part));
  hover.move(2);t.mock.timers.tick(1500);assert.equal(shown.at(-1),2);
  hover.move(3);assert.equal(shown.at(-1),null);
  t.mock.timers.tick(1000);hover.move(4);t.mock.timers.tick(1499);assert.equal(shown.at(-1),null);
  t.mock.timers.tick(1);assert.equal(shown.at(-1),4);hover.dispose();
});
test('leaving, clicking, and cleanup cancel pending hover callbacks', (t) => {
  t.mock.timers.enable({apis:['setTimeout']});
  const shown=[];const hover=createHoverPreview(part=>shown.push(part));
  hover.move(2);t.mock.timers.tick(1000);hover.cancel();t.mock.timers.tick(2000);
  assert.deepEqual(shown,[null,null]);
  hover.move(1);hover.dispose();t.mock.timers.tick(2000);assert.deepEqual(shown,[null,null,null]);
  hover.move(null);t.mock.timers.tick(2000);assert.equal(shown.at(-1),null);
});
