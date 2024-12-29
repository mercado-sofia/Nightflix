const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollPosition = window.scrollY;

    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight; 

        if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionTop + sectionHeight - 50) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

updateActiveLink();



document.addEventListener('DOMContentLoaded', () => {
    const calendarDates = document.getElementById('calendar-dates');
    const monthYear = document.getElementById('month-year');
    const prevYear = document.getElementById('prev-year');
    const nextYear = document.getElementById('next-year');
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    const modal = document.getElementById('calendar-modal');
    const modalDate = document.getElementById('modal-date');
    const modalCancel = document.getElementById('modal-cancel');
    const saveButton = document.getElementById('modal-save');
    const addAnotherBtn = document.getElementById('modal-add-another');
    const movieSeriesEntries = document.getElementById('movie-series-entries');

    let currentDate = new Date();
    let selectedDate = null;

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Set header
        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        // Clear existing dates
        calendarDates.innerHTML = '';

        // Get first day of month
        const firstDay = new Date(year, month, 1).getDay();

        // Get days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Get days from previous month
        const prevDays = new Date(year, month, 0).getDate();

        // Populate calendar
        for (let i = firstDay - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell inactive';
            cell.textContent = prevDays - i;
            calendarDates.appendChild(cell);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            cell.textContent = i;
            cell.addEventListener('click', () => openModal(i));
            calendarDates.appendChild(cell);
        }

        // Fill next month's days
        const totalCells = calendarDates.children.length;
        for (let i = 1; totalCells + i <= 42; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell inactive';
            cell.textContent = i;
            calendarDates.appendChild(cell);
        }
    }

    function openModal(day) {
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        modalDate.textContent = `${monthName} ${day}, ${year}`;
        modal.style.display = 'flex';
        resetEntries();
    }

    function resetEntries() {
        movieSeriesEntries.innerHTML = '';
        addEntryForm();
    }

    function addEntryForm() {
        const newForm = document.createElement('form');
        newForm.classList.add('entry-form');

        newForm.innerHTML = `
            <label for="type">Type:</label>
            <select class="type">
                <option value="movie">Movie</option>
                <option value="series">Series</option>
            </select>
            <label for="title">Title:</label>
            <input type="text" class="title" placeholder="Enter movie or series title">
            <label for="notes">Notes:</label>
            <textarea class="notes" placeholder="Enter additional details (e.g., seasons, episodes, genres, snacks)"></textarea>
        `;

        movieSeriesEntries.appendChild(newForm);
    }

    // Handle "+ Add Another" button click
    addAnotherBtn.addEventListener('click', () => {
        addEntryForm();
    });

    // Handle "Save" button click
    saveButton.addEventListener('click', () => {
        const entries = document.querySelectorAll('.entry-form');
        const data = Array.from(entries).map(entry => {
            return {
                type: entry.querySelector('.type').value,
                title: entry.querySelector('.title').value,
                notes: entry.querySelector('.notes').value,
            };
        });

        console.log(`Entries for ${selectedDate.toDateString()}:`, data);
        alert("Entries saved successfully!");
        modal.style.display = 'none';
    });

    modalCancel.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    prevYear.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        renderCalendar();
    });

    nextYear.addEventListener('click', () => {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        renderCalendar();
    });

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});

// myList section
const addListBtn = document.getElementById('mylist-add-list-btn');
const addListModal = document.getElementById('mylist-add-list-modal');
const saveListBtn = document.getElementById('mylist-save-list-btn');
const cancelListBtn = document.getElementById('mylist-cancel-list-btn');
const categoryFilter = document.getElementById('mylist-category-filter');

const newCard = document.getElementById('mylist-new-card');
const addItemModal = document.getElementById('mylist-add-item-modal');
const saveItemBtn = document.getElementById('mylist-save-item-btn');
const cancelItemBtn = document.getElementById('mylist-cancel-item-btn');

addListBtn.addEventListener('click', () => {
  addListModal.style.display = 'flex';
});

saveListBtn.addEventListener('click', () => {
  const newListName = document.getElementById('mylist-new-list-name').value;
  if (newListName) {
    const option = document.createElement('option');
    option.value = newListName.toLowerCase();
    option.textContent = newListName;
    categoryFilter.appendChild(option);
    addListModal.style.display = 'none';
  }
});

cancelListBtn.addEventListener('click', () => {
  addListModal.style.display = 'none';
});

newCard.addEventListener('click', () => {
  addItemModal.style.display = 'flex';
});

saveItemBtn.addEventListener('click', () => {
  const posterInput = document.getElementById('mylist-item-poster');
  const title = document.getElementById('mylist-item-title').value;
  const rating = document.getElementById('mylist-item-rating').value;

  if (posterInput.files.length > 0 && title && rating) {
    const file = posterInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const card = document.createElement('div');
      card.className = 'mylist-card';
      card.innerHTML = `
        <img src="${e.target.result}" alt="${title}">
        <div class="mylist-card-content">
          <h2>${title}</h2>
          <p>Rating: ${rating}/10</p>
        </div>`;
      document.querySelector('.mylist-content').appendChild(card);
      addItemModal.style.display = 'none';
    };

    reader.readAsDataURL(file);
  }
});

cancelItemBtn.addEventListener('click', () => {
  addItemModal.style.display = 'none';
});

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('mylist-modal')) {
    event.target.style.display = 'none';
  }
});