require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const service = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const users = [];
const errors = [];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function createUser(label, admin = false) {
  const email = `eduquery-ui-${label}-${suffix}@example.test`;
  const password = `Ui!${label}${suffix}`;
  const created = await service.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: label } });
  if (created.error) throw created.error;
  users.push(created.data.user.id);
  if (admin) {
    const result = await service.from('profiles').update({ role: 'admin' }).eq('id', created.data.user.id);
    if (result.error) throw result.error;
  }
  return { email, password };
}
async function main() {
  console.log('browser audit: connecting');
  const targets = await (await fetch('http://127.0.0.1:9224/json')).json();
  const target = targets.find(item => item.type === 'page' && item.url.includes('localhost:3000'));
  if (!target) throw new Error('Local frontend Chrome page was not found.');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map(); let id = 0;
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text || message.params.exceptionDetails.exception?.description);
    if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
  };
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  const command = (method, params = {}) => new Promise((resolve, reject) => { const commandId = ++id; pending.set(commandId, response => response.error ? reject(new Error(response.error.message)) : resolve(response.result)); ws.send(JSON.stringify({ id: commandId, method, params })); });
  const evaluate = async expression => (await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;
  await command('Runtime.enable');
  const login = async account => {
    console.log(`browser audit: logging in ${account.email}`);
    await evaluate(`location.assign('http://localhost:3000/auth')`); await wait(700);
    await evaluate(`(() => { const inputs = document.querySelectorAll('input'); const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));}; set(inputs[0], ${JSON.stringify(account.email)}); set(inputs[1], ${JSON.stringify(account.password)}); document.querySelector('form').requestSubmit(); })()`);
    await wait(4500);
    const state = await evaluate(`({ path: location.pathname, text: document.body.innerText, root: document.getElementById('root')?.innerText })`);
    console.log(`browser audit: route ${state.path}`);
    return state;
  };
  console.log('browser audit: creating student');
  const student = await createUser('student');
  let view = await login(student);
  if (view.path !== '/chat' || !view.text.includes('EduQuery AI') || !view.text.includes('AI Chat')) throw new Error(`Student post-login did not render chat: ${JSON.stringify(view)}`);
  const studentButtons = await evaluate(`Array.from(document.querySelectorAll('button')).map(button => button.title || button.innerText).filter(Boolean)`);
  if (!studentButtons.includes('Logout')) throw new Error('Student sidebar logout button did not render.');
  await evaluate(`document.querySelector('button[title="Logout"]').click()`); await wait(900);
  view = await evaluate(`({path: location.pathname, text: document.body.innerText})`);
  if (view.path !== '/auth') throw new Error(`Student logout did not route to auth: ${JSON.stringify(view)}`);
  console.log('browser audit: creating admin');
  const admin = await createUser('admin', true);
  view = await login(admin);
  if (view.path !== '/admin' || !view.text.includes('Admin') || !view.text.includes('Document')) throw new Error(`Admin post-login did not render dashboard: ${JSON.stringify(view)}`);
  const adminButtons = await evaluate(`Array.from(document.querySelectorAll('button')).map(button => button.title || button.innerText).filter(Boolean)`);
  if (!adminButtons.includes('Logout')) throw new Error('Admin sidebar logout button did not render.');
  await evaluate(`document.querySelector('button[title="Logout"]').click()`); await wait(900);
  view = await evaluate(`({path: location.pathname, text: document.body.innerText})`);
  if (view.path !== '/auth') throw new Error(`Admin logout did not route to auth: ${JSON.stringify(view)}`);
  ws.close();
  if (errors.length) throw new Error(`Browser runtime exceptions: ${JSON.stringify(errors)}`);
  console.log(JSON.stringify({ success: true, browserExceptions: errors.length }));
}
main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; }).finally(async () => { console.log('browser audit: cleanup'); for (const userId of users) { try { await Promise.race([service.auth.admin.deleteUser(userId), wait(5000)]); } catch {} } });
