// Navigation functionality
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

// Calendar functionality
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
    const calendarEntriesContainer = document.getElementById('calendar-entries');

    let currentDate = new Date();
    let selectedDate = null;

    function loadCalendarEntries() {
        const savedEntries = JSON.parse(localStorage.getItem('calendarEntries')) || [];
        savedEntries.forEach(entry => addEntryToTable(entry.date, entry));
    }

    function saveCalendarEntries() {
        const entries = Array.from(calendarEntriesContainer.children).map(entryRow => ({
            date: entryRow.children[0].textContent,
            type: entryRow.children[1].textContent,
            title: entryRow.children[2].textContent,
            notes: entryRow.children[3].textContent,
        }));
        localStorage.setItem('calendarEntries', JSON.stringify(entries));
    }

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

    function addEntryToTable(date, entry) {
        const entryRow = document.createElement('div');
        entryRow.className = 'entry-row';
        entryRow.innerHTML = `
            <div>${date}</div>
            <div>${entry.type}</div>
            <div>${entry.title}</div>
            <div>${entry.notes}</div>
            <div>
                <button class="entry-delete-btn">Delete</button>
            </div>
        `;

        const deleteBtn = entryRow.querySelector('.entry-delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this entry?')) {
                entryRow.remove();
                saveCalendarEntries();
            }
        });

        calendarEntriesContainer.appendChild(entryRow);
    }

    saveButton.addEventListener('click', () => {
        const entries = document.querySelectorAll('.entry-form');
        const data = Array.from(entries).map(entry => ({
            type: entry.querySelector('.type').value,
            title: entry.querySelector('.title').value,
            notes: entry.querySelector('.notes').value,
        }));

        if (selectedDate) {
            const dateString = selectedDate.toLocaleDateString('default', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            data.forEach(entry => addEntryToTable(dateString, entry));
        }

        modal.style.display = 'none';
        saveCalendarEntries();
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
    loadCalendarEntries();
});