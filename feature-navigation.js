/* Navigate only the documented, fictional demonstration controls. */
async function openFeature(win, route) {
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const visible = el => el && el.getClientRects().length && !el.closest('[hidden]');
  async function find(step, optional=false) {
    const end = Date.now() + (optional ? 1200 : 12000);
    while (Date.now() < end) {
      const doc = win.document;
      const nodes = step.selector ? [...doc.querySelectorAll(step.selector)] : [...doc.querySelectorAll('button,a')].filter(el => el.textContent.trim() === step.text);
      const node = nodes.find(visible);
      if (node) return node;
      await pause(100);
    }
    if (!optional) throw new Error('The demonstration control is not available.');
  }
  await find({selector:route.readyBefore || 'main'});
  for (const step of route.steps || []) {
    if (step.action === 'hash') { win.location.hash = step.value; await pause(200); continue; }
    const node = await find(step, step.optional);
    if (!node) continue;
    if (step.action === 'click') { if (!node.disabled) node.click(); }
    else if (step.action === 'fill') {
      const set = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value')?.set;
      set.call(node, step.value); node.dispatchEvent(new win.Event('input',{bubbles:true}));
    }
    await pause(200);
  }
  await find({selector:route.ready || 'main'});
  win.scrollTo(0,0);
  return true;
}
if (typeof window !== 'undefined') window.openFeature = openFeature;
