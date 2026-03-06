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
<<<<<<< HEAD
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
const tasks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
=======
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const tasks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
>>>>>>> a429d1f175cd1ff3d3aed26414a70d496019d94d
// view[0] = year view, view [1] = week view, view[2] = day view
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
const dailyTasks = document.querySelector('.dailyTasks');

renderCalendar(month, year);
getDailyTask();

const calendarDay = document.getElementsByClassName('.calendar-day');

function renderCalendar(month, year) {
<<<<<<< HEAD
  calendarDates.innerHTML = '';
=======
  calendarDates.innerHTML = "";
  dayView.innerHTML = "";
  daysOfWeek.innerHTML = "<div>Sun</div>\n<div>Mon</div>\n<div>Tue</div>\n<div>Wed</div>\n<div>Thu</div>\n<div>Fri</div>\n<div>Sat</div>";
>>>>>>> a429d1f175cd1ff3d3aed26414a70d496019d94d
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
    day.addEventListener("click", function(e) {
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

<<<<<<< HEAD
function daySetup(day) {
  day.addEventListener('click', function (e) {
    openDayView(day);
  });
}

function openDayView(day) {
  daysOfWeek.innerHTML = '';
  calendarDates.innerHTML = '';
=======
function renderDayView(day) {
  daysOfWeek.innerHTML = "";
  calendarDates.innerHTML = "";
  const leave = document.createElement('div');
  leave.textContent = "x";
  leave.addEventListener("click", function(e) {
    renderCalendar(month, year)
  })
  dayView.appendChild(leave);
  for (let i = 1; i<= 48; i++) {
    const halfHour = document.createElement('div');
    time = Math.floor(i/2) + ":";
    if (i%2 == 0) {
      time += "00";
    }
    else {
      time += "30";
    }
    halfHour.textContent = time;
    dayView.appendChild(halfHour);
  }
>>>>>>> a429d1f175cd1ff3d3aed26414a70d496019d94d
}

if (sessionStorage.getItem('loggedIn') == 'true') {
  document.getElementById('name').innerHTML =
    `<p id="name"><span style="font-weight: bold;">Name: </span>${sessionStorage.getItem('name')}</p>`;
  document.getElementById('loggedIn').innerHTML =
    `<p id="loggedIn"><span style="font-weight: bold;">LoggedIn: </span>${sessionStorage.getItem('loggedIn')}</p>`;

  document.getElementById('accountBtn').innerHTML = 'Log Out';
  document.getElementById('accountBtn').href = '';
  document.getElementById('accountBtn').onclick = logOut;
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
      }
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
}
