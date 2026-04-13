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


function askAi() {
  const question = prompt('What would you like to ask AI?');

  fetch('/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log(data);
        alert(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
}

if (sessionStorage.getItem('loggedIn') == 'true') {
  document.getElementById('name').innerHTML =
    `<span style="font-weight: bold">Welcome: </span>${sessionStorage.getItem('name')}`;

  document.getElementById('accountBtn').innerHTML = 'Log Out';
  document.getElementById('accountBtn').href = '';
  document.getElementById('accountBtn').onclick = logOut;
}
