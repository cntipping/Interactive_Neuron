import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHoverPreview } from '../lib/hover-preview.ts';

test('shows only after the complete 600-millisecond dwell', (t) => {
  t.mock.timers.enable({apis:['setTimeout']});
  const shown=[];const hover=createHoverPreview(part=>shown.push(part));
  hover.move(2);t.mock.timers.tick(599);assert.deepEqual(shown,[null]);
  t.mock.timers.tick(1);assert.deepEqual(shown,[null,2]);hover.dispose();
});
test('movement hides the preview and restarts the dwell timer', (t) => {
  t.mock.timers.enable({apis:['setTimeout']});
  const shown=[];const hover=createHoverPreview(part=>shown.push(part));
  hover.move(2);t.mock.timers.tick(600);assert.equal(shown.at(-1),2);
  hover.move(3);assert.equal(shown.at(-1),null);
  t.mock.timers.tick(400);hover.move(4);t.mock.timers.tick(599);assert.equal(shown.at(-1),null);
  t.mock.timers.tick(1);assert.equal(shown.at(-1),4);hover.dispose();
});
test('leaving, clicking, and cleanup cancel pending hover callbacks', (t) => {
  t.mock.timers.enable({apis:['setTimeout']});
  const shown=[];const hover=createHoverPreview(part=>shown.push(part));
  hover.move(2);t.mock.timers.tick(400);hover.cancel();t.mock.timers.tick(2000);
  assert.deepEqual(shown,[null,null]);
  hover.move(1);hover.dispose();t.mock.timers.tick(2000);assert.deepEqual(shown,[null,null,null]);
  hover.move(null);t.mock.timers.tick(2000);assert.equal(shown.at(-1),null);
});
