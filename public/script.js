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

const calendarDates = document.querySelector('.calendarDates');
const monthYear = document.getElementById('monthYear');
const prevDateBtn = document.getElementById('prevDateButton');
const nextDateBtn = document.getElementById('nextDateButton');
const daysOfWeek = document.getElementById('daysOfWeek');
const dayView = document.getElementById('dayView');
const markDoneButton = document.getElementById('markAsDone');
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const tasks = [
  'Drink water!',
  'Check in with a friend!',
  'Visit a park!',
  'Pet your cat!',
  'Give your cat a treat!',
  'Hang out with your friends!',
  'Get some exercise!',
  'Eat a healthy snack!',
];

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
const dailyTasks = document.querySelector('.dailyTasks');

renderCalendar(month, year);
getDailyTask();

const calendarDay = document.getElementsByClassName('.calendar-day');

function renderCalendar(month, year) {
  calendarDates.innerHTML = '';
  daysOfWeek.innerHTML =
    '<div>Sun</div>\n<div>Mon</div>\n<div>Tue</div>\n<div>Wed</div>\n<div>Thu</div>\n<div>Fri</div>\n<div>Sat</div>';
  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarDates.appendChild(empty);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.classList.add('calendar-day');
    day.textContent = i;
    day.addEventListener('click', function (e) {
      renderDayView(day);
    });
    calendarDates.appendChild(day);
  }
}
prevDateBtn.onclick = function () {
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  renderCalendar(month, year);
};

nextDateBtn.onclick = function () {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  renderCalendar(month, year);
};

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

function renderDayView(day) {
  daysOfWeek.innerHTML = '';
  calendarDates.innerHTML = '';
  const leave = document.createElement('div');
  leave.textContent = 'x';
  leave.addEventListener('click', function (e) {
    renderCalendar(month, year);
  });
  dayView.appendChild(leave);
  for (let i = 1; i <= 48; i++) {
    const halfHour = document.createElement('div');
    time = Math.floor(i / 2) + ':';
    if (i % 2 == 0) {
      time += '00';
    } else {
      time += '30';
    }
    halfHour.textContent = time;
    dayView.appendChild(halfHour);
  }
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
