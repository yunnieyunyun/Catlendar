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

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,listWeek'
  }})
  calendar.render()
});    
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
  const launcher = document.getElementById('ai-launcher');
  const minimizeBtn = document.getElementById('ai-chat-minimize');
  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-chat-input');
  const messagesEl = document.getElementById('ai-chat-messages');
  const sendBtn = form.querySelector('.ai-chat-send');

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

  function setOpen(open) {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) input.focus();
  }

  launcher.addEventListener('click', () => {
    setOpen(!panel.classList.contains('open'));
  });

  minimizeBtn.addEventListener('click', () => setOpen(false));

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `ai-msg ai-msg--${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    input.value = '';
    appendMessage('user', question);

    const loadingEl = appendMessage('assistant', '…');
    loadingEl.classList.add('ai-msg--loading');

    sendBtn.disabled = true;
    input.disabled = true;

    try {
      const response = await fetch('/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      loadingEl.remove();

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
      loadingEl.remove();
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
