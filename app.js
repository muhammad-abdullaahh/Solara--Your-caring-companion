/* app.js - simple, clear, viva-friendly
   - localStorage stores conversation
   - minimal functions and clear names
*/

const SELECTORS = {
  messages: document.getElementById('messages'),
  input: document.getElementById('input'),
  send: document.getElementById('send'),
  newBtn: document.getElementById('new'),
  clearBtn: document.getElementById('clear'),
  openReport: document.getElementById('openReport'),
  backToChat: document.getElementById('backToChat'),
  reportPanel: document.getElementById('reportPanel'),
  chatPanel: document.getElementById('chatPanel'),
  freqList: document.getElementById('freqList'),
  wheel: document.getElementById('wheel'),
  exportBtn: document.getElementById('export'),
  clearAllBtn: document.getElementById('clearAll'),
  empty: document.getElementById('empty')
};

const RESPONSES = {
  sad: { text: "I hear you're sad. It's okay — would you like to share what's on your mind?", emotion: 'Sadness' },
  anxious: { text: "Feeling anxious is tough. Try a slow breath: in 4, hold 4, out 4. Want to talk more?", emotion: 'Anxiety' },
  happy: { text: "That's wonderful! What made your day brighter?", emotion: 'Joy' },
  stressed: { text: "Stress can pile up fast. What's the main pressure right now?", emotion: 'Stress' },
  lonely: { text: "Loneliness is real. Thanks for sharing — want to tell me more?", emotion: 'Loneliness' },
  neutral: { text: "Thanks for sharing. I'm here to listen.", emotion: 'Neutral' }
};

let conversation = []; // array of {role:'user'|'assistant', text, emotion?, time }

// ----- storage helpers -----
function loadConversation() {
  try {
    const raw = localStorage.getItem('solara-convo');
    if (!raw) return;
    conversation = JSON.parse(raw);
  } catch (e) {
    console.error('load err', e);
  }
}

function saveConversation() {
  localStorage.setItem('solara-convo', JSON.stringify(conversation));
}

// ----- rendering -----
function renderMessages() {
  SELECTORS.messages.innerHTML = '';
  if (conversation.length === 0) {
    SELECTORS.empty.style.display = 'block';
    return;
  }
  SELECTORS.empty.style.display = 'none';

  conversation.forEach(msg => {
    const row = document.createElement('div');
    row.className = 'row';
    const bubble = document.createElement('div');
    bubble.className = msg.role === 'user' ? 'user' : 'ai';
    bubble.innerHTML = `<div>${escapeHtml(msg.text)}</div><div class="meta">${new Date(msg.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>`;
    if (msg.role === 'user') row.style.justifyContent = 'flex-end';
    else row.style.justifyContent = 'flex-start';
    row.appendChild(bubble);
    SELECTORS.messages.appendChild(row);
  });

  SELECTORS.messages.scrollTop = SELECTORS.messages.scrollHeight;
}

function escapeHtml(s = '') {
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

// ----- simple NLP (keyword match) -----
function detectEmotion(text) {
  text = text.toLowerCase();
  if (text.includes('sad') || text.includes('depress')) return 'sad';
  if (text.includes('anx') || text.includes('nerv')) return 'anxious';
  if (text.includes('happy') || text.includes('joy')) return 'happy';
  if (text.includes('stress') || text.includes('overwhelm')) return 'stressed';
  if (text.includes('alone') || text.includes('lonely')) return 'lonely';
  return 'neutral';
}

// ----- core actions -----
function sendMessage() {
  const text = SELECTORS.input.value.trim();
  if (!text) return;
  const now = Date.now();

  // add user message
  conversation.push({ role: 'user', text, time: now });
  saveConversation();
  renderMessages();
  SELECTORS.input.value = '';

  // simulate thinking -> then assistant reply
  showTypingIndicator();
  setTimeout(() => {
    const key = detectEmotion(text);
    const res = RESPONSES[key] || RESPONSES.neutral;
    conversation.push({ role: 'assistant', text: res.text, emotion: res.emotion, time: Date.now() });
    saveConversation();
    renderMessages();
    updateReport(); // update report visuals
  }, 700);
}

function showTypingIndicator() {
  const row = document.createElement('div');
  row.className = 'row';
  row.style.justifyContent = 'flex-start';
  const bubble = document.createElement('div');
  bubble.className = 'ai';
  bubble.innerHTML = `<div class="loading"><span></span><span></span><span></span></div>`;
  row.appendChild(bubble);
  SELECTORS.messages.appendChild(row);
  SELECTORS.messages.scrollTop = SELECTORS.messages.scrollHeight;
}

// ----- report (simple frequency percent) -----
function updateReport() {
  // count emotions from assistant replies
  const counts = { Joy:0, Sadness:0, Anxiety:0, Stress:0, Loneliness:0, Neutral:0 };
  conversation.forEach(m => {
    if (m.role === 'assistant' && m.emotion) {
      if (counts[m.emotion] !== undefined) counts[m.emotion]++;
      else counts.Neutral++;
    }
  });

  const total = Object.values(counts).reduce((a,b) => a+b, 0);
  const data = total === 0 ? [
    {name:'Joy', v:30},{name:'Sadness', v:20},{name:'Anxiety', v:15},{name:'Stress', v:25},{name:'Loneliness', v:10}
  ] : Object.keys(counts).map(k => ({ name: k, v: Math.round((counts[k]/total)*100) }));

  // render list
  SELECTORS.freqList.innerHTML = '';
  data.forEach(d => {
    const item = document.createElement('div');
    item.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--muted);margin-bottom:6px"><span>${d.name}</span><span>${d.v}%</span></div>
                      <div class="bar"><div class="fill" style="width:${d.v}%"></div></div>`;
    SELECTORS.freqList.appendChild(item);
  });

  // render simple wheel: place nodes in a circle-like flex
  SELECTORS.wheel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexWrap = 'wrap';
  wrap.style.justifyContent = 'center';
  wrap.style.gap = '10px';
  data.forEach(d => {
    const n = document.createElement('div');
    n.className = 'node';
    n.innerHTML = `<div style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid rgba(15,118,110,0.06)">${d.name.charAt(0)}</div>
                   <div>${d.name}</div>
                   <div style="font-size:12px;color:#0ea5a0">${d.v}%</div>`;
    wrap.appendChild(n);
  });
  const center = document.createElement('div');
  center.className = 'center';
  center.innerHTML = '<div style="text-align:center">❤<div style="font-size:12px">Balanced</div></div>';
  SELECTORS.wheel.appendChild(wrap);
  SELECTORS.wheel.appendChild(center);
}

// ----- utilities -----
function exportConversation() {
  const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'solara-conversation.json';
  a.click();
  URL.revokeObjectURL(url);
}

function clearConversation() {
  conversation = [];
  saveConversation();
  renderMessages();
  updateReport();
  showChat();
}

// ----- navigation -----
function showReportPanel() {
  SELECTORS.chatPanel.classList.add('hidden');
  SELECTORS.reportPanel.classList.remove('hidden');
  updateReport();
}
function showChat() {
  SELECTORS.reportPanel.classList.add('hidden');
  SELECTORS.chatPanel.classList.remove('hidden');
}

// ----- events -----
SELECTORS.send.addEventListener('click', sendMessage);
SELECTORS.input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }});
SELECTORS.newBtn.addEventListener('click', () => { clearConversation(); });
SELECTORS.clearBtn.addEventListener('click', () => { clearConversation(); });
SELECTORS.openReport.addEventListener('click', showReportPanel);
SELECTORS.backToChat.addEventListener('click', showChat);
SELECTORS.exportBtn?.addEventListener('click', exportConversation);
SELECTORS.clearAllBtn?.addEventListener('click', clearConversation);

// ----- init -----
loadConversation();
renderMessages();
updateReport();
