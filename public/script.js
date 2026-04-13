import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function logOut() {
  sessionStorage.setItem('loggedIn', false);
  sessionStorage.setItem('name', null);
  sessionStorage.setItem('email', null);
  sessionStorage.setItem('password', null);

  document.getElementById('accountBtn').innerHTML = 'Login / Create Account';
  //   document.getElementById('accountBtn').href = 'account_page/account.html';
  document.getElementById('accountBtn').onclick = null;
  document.getElementById('accountBtn').href = 'account_page/account.html';
}
const markDoneButton = document.getElementById('markAsDone');


let calendarEl = document.getElementById('calendar');

let calendar = new Calendar(calendarEl, {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
  left: 'prev,next today',
  center: 'title',
  right: 'dayGridMonth,timeGridWeek'
  }
});
calendar.render();

getDailyTask();



markDoneButton.onclick = function () {
  const done = document.createElement('div');
  done.textContent = 'Complete! + 10 points';
  dailyTasks.appendChild(done);
};
/*Eve Ang*/
function getDailyTask() {
  let today = new Date();
  let tDay = today.getDay();
  let tMonth = today.getMonth();
  let tYear = today.getFullYear();
  let seed = Math.floor(
    ((tYear * tDay) / 3 ** tMonth / 2 + tYear + tMonth + tDay) **
      ((1 / tMonth) ** tDay),
  );
  let taskNumber = seed % tasks.length;
  const task = document.createElement('div');
  task.textContent = 'Daily Task: ' + `${tasks[taskNumber]}`;
  dailyTasks.appendChild(task);
}


function initAiChatWidget() {
  const panel = document.getElementById('ai-chat-panel');
  const backdrop = document.getElementById('ai-chat-backdrop');
  const launcher = document.getElementById('ai-launcher');
  const minimizeBtn = document.getElementById('ai-chat-minimize');
  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-chat-input');
  const messagesEl = document.getElementById('ai-chat-messages');
  const sendBtn = form && form.querySelector('.ai-chat-send');

  if (
    !panel ||
    !launcher ||
    !minimizeBtn ||
    !form ||
    !input ||
    !messagesEl ||
    !sendBtn
  )
    return;

  const welcome = document.createElement('div');
  welcome.className = 'ai-chat-welcome';
  welcome.textContent =
    'Meow! I’m your Cat AI — ask me anything. I’ll answer in short, cat-flavored replies.';
  messagesEl.appendChild(welcome);

  function setOpen(open) {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    launcher.classList.toggle('is-open', open);
    launcher.setAttribute(
      'aria-label',
      open ? 'Close Cat AI chat' : 'Open Cat AI chat',
    );
    if (backdrop) {
      backdrop.classList.toggle('is-visible', open);
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    if (open) input.focus();
  }

  launcher.addEventListener('click', () => {
    setOpen(!panel.classList.contains('open'));
  });

  minimizeBtn.addEventListener('click', () => setOpen(false));

  if (backdrop) {
    backdrop.addEventListener('click', () => setOpen(false));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      setOpen(false);
    }
  });

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `ai-msg ai-msg--${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function appendTypingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'ai-typing';
    wrap.setAttribute('role', 'status');
    for (let i = 0; i < 3; i += 1) {
      wrap.appendChild(document.createElement('span'));
    }
    const live = document.createElement('span');
    live.className = 'sr-only';
    live.textContent = 'Cat AI is typing';
    wrap.appendChild(live);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return wrap;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    welcome.remove();

    input.value = '';
    appendMessage('user', question);

    const typingEl = appendTypingIndicator();

    sendBtn.disabled = true;
    input.disabled = true;

    try {
      const response = await fetch('/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      typingEl.remove();

      if (data.error) {
        appendMessage('error', data.error);
      } else {
        const answer =
          typeof data.answer === 'string' && data.answer.length
            ? data.answer
            : 'No reply from the cat right now.';
        appendMessage('assistant', answer);
      }
    } catch (err) {
      console.error('AI chat error:', err);
      typingEl.remove();
      appendMessage('error', 'Something went wrong. Try again in a moment.');
    } finally {
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
}

initAiChatWidget();

if (sessionStorage.getItem('loggedIn') == 'true') {
  document.getElementById('name').innerHTML =
    `<span style="font-weight: bold">Welcome: </span>${sessionStorage.getItem('name')}`;

  document.getElementById('accountBtn').innerHTML = 'Log Out';
  document.getElementById('accountBtn').href = '';
  document.getElementById('accountBtn').onclick = logOut;
}
