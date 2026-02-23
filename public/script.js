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

const calendarDates = document.querySelector(".calendarDates"); 
const monthYear = document.getElementById("monthYear");
const prevDateBtn = document.getElementById('prevDateButton');
const nextDateBtn = document.getElementById('nextDateButton');
const viewSwitchBtn = document.getElementById('viewSwitcher');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const tasks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
let view = [true, false, false]
// view[0] = year view, view [1] = week view, view[2] = day view
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let selectedDay = date.getDate();
const dailyTasks = document.querySelector(".dailyTasks");


function renderCalendar(month, year, selectedDay) {
  calendarDates.innerHTML = "";
  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const week = Math.floor((selectedDay+firstDay)/7);

  if (view[0]) {
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      calendarDates.appendChild(empty);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement('div');
      day.textContent = i;
      calendarDates.appendChild(day);
    }
  }
  else if (view[1]) {
    if (week == 0) {
      let count = 7
      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendarDates.appendChild(empty);
        count--;
      }  
      for (let i = 1; i <= count; i++) {
        const day = document.createElement('div');
        day.textContent = i;
        calendarDates.appendChild(day);
      }
    }
    else {
      shift = firstDay;
      if (firstDay == 0) {
        shift = 7;
      }
      for (let i = week*7-shift+1; i <= week*7-shift+7; i++) {
        if (i <= daysInMonth) {
          const day = document.createElement('div');
          day.textContent = i;
          calendarDates.appendChild(day);   
        } 
      }
    }
  }
  else {
        const day = document.createElement('div');
        day.textContent = selectedDay;
        calendarDates.appendChild(day);     
  }
}
prevDateBtn.onclick = function() {
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  if (view[0]) {
    month--;
  }
  else if (view[1]) {
    selectedDay -= 7;
  }
  else {
    selectedDay --;   
  }
  if (selectedDay <= 0) {
    selectedDay = daysInPrevMonth - selectedDay;
    month--;
  }
  if (month < 0) {
    month = 11;
    year--;
  }   
  renderCalendar(month, year, selectedDay);
};

nextDateBtn.onclick = function() {
  const daysInMonth = new Date(year, month+1, 0).getDate();
  if (view[0]) {
    month++;
  }
  else if (view[1]) {
    selectedDay += 7;
    if (selectedDay > daysInMonth) {
      if (selectedDay - daysInMonth == 7) {
        selectedDay = 1;
        month++;
      }
      else {
        selectedDay = daysInMonth;
      }
    }
  else {
    selectedDay++;
    if (selectedDay > daysInMonth) {
      selectedDay = 1;
      month++;
    }
  }
  }  
  if (month > 11) {
    month = 0;
    year++;
  }
  
  renderCalendar(month, year, selectedDay);
};

viewSwitchBtn.onclick = function () {
  view.push(view.shift());
  console.log
  renderCalendar(month, year, selectedDay);
};

function getDailyTask() {
  let today = new Date()
  let tDay = today.getDay()
  let tMonth = today.getMonth()
  let tYear = today.getFullYear()
  let seed = Math.floor(((tYear*tDay/3**tMonth/2)+tYear+tMonth+tDay)**(1/tMonth)**tDay);
  let taskNumber = seed % tasks.length;
  const task = document.createElement('div');
  task.textContent = "Daily Task: " + `${tasks[taskNumber]}`;
  dailyTasks.appendChild(task);
}

renderCalendar(month, year, selectedDay);
getDailyTask();

if (sessionStorage.getItem('loggedIn') == 'true') {
  document.getElementById('name').innerHTML =
    `<p id="name"><span style="font-weight: bold;">Name: </span>${sessionStorage.getItem('name')}</p>`;
  document.getElementById('loggedIn').innerHTML =
    `<p id="loggedIn"><span style="font-weight: bold;">LoggedIn: </span>${sessionStorage.getItem('loggedIn')}</p>`;

  document.getElementById('accountBtn').innerHTML = 'Log Out';
  document.getElementById('accountBtn').href = '';
  document.getElementById('accountBtn').onclick = logOut;
}
