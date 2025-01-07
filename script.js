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

// MyList functionality
const addListBtn = document.getElementById('mylist-add-list-btn');
const addListModal = document.getElementById('mylist-add-list-modal');
const saveListBtn = document.getElementById('mylist-save-list-btn');
const cancelListBtn = document.getElementById('mylist-cancel-list-btn');
const categoryFilter = document.getElementById('mylist-category-filter');
const newCard = document.getElementById('mylist-new-card');
const addItemModal = document.getElementById('mylist-add-item-modal');
const saveItemBtn = document.getElementById('mylist-save-item-btn');
const cancelItemBtn = document.getElementById('mylist-cancel-item-btn');

let currentlyEditingCard = null;

// Load saved categories from localStorage
const loadCategories = () => {
    const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    savedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
};

// Load saved cards from localStorage
const loadCards = () => {
    const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
    savedCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'mylist-card';
        cardElement.innerHTML = `
            <img src="${card.poster}" alt="${card.title}">
            <div class="mylist-card-content">
                <h2>${card.title}</h2>
                <p>Rating: ${card.rating}/10</p>
            </div>
            <div class="mylist-card-overlay">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>`;

        // Add hover functionality
        cardElement.addEventListener('mouseenter', () => {
            cardElement.querySelector('.mylist-card-overlay').style.display = 'flex';
        });

        cardElement.addEventListener('mouseleave', () => {
            cardElement.querySelector('.mylist-card-overlay').style.display = 'none';
        });

        // Edit functionality
        cardElement.querySelector('.edit-btn').addEventListener('click', () => {
            currentlyEditingCard = cardElement;

            document.getElementById('mylist-item-title').value = card.title;
            document.getElementById('mylist-item-rating').value = card.rating;

            const previewImage = document.getElementById('mylist-image-preview');
            previewImage.src = card.poster;
            previewImage.alt = card.title;
            previewImage.style.display = 'block';

            addItemModal.style.display = 'flex';
        });

        // Delete functionality
        cardElement.querySelector('.delete-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            if (confirm('Are you sure you want to delete this?')) {
                cardElement.remove();
                saveCards();
            }
        });

        document.querySelector('.mylist-content').appendChild(cardElement);
    });
};

// Save categories to localStorage
const saveCategories = () => {
    const categories = Array.from(categoryFilter.options).map(option => option.textContent);
    localStorage.setItem('categories', JSON.stringify(categories));
};

// Save cards to localStorage
const saveCards = () => {
    const cards = Array.from(document.querySelectorAll('.mylist-card')).map(card => {
        const img = card.querySelector('img');
        const title = card.querySelector('.mylist-card-content h2').textContent;
        const rating = card.querySelector('.mylist-card-content p').textContent.match(/\d+/)[0]; // Extract the rating value
        return {
            poster: img.src,
            title,
            rating
        };
    });
    localStorage.setItem('cards', JSON.stringify(cards));
};

// Initialize app by loading saved data
loadCategories();
loadCards();

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
        saveCategories();
        addListModal.style.display = 'none';
    }
});

cancelListBtn.addEventListener('click', () => {
    addListModal.style.display = 'none';
});

newCard.addEventListener('click', () => {
    addItemModal.style.display = 'flex';
    currentlyEditingCard = null;

    // Clear input fields
    document.getElementById('mylist-item-poster').value = '';
    document.getElementById('mylist-item-title').value = '';
    document.getElementById('mylist-item-rating').value = '';
    const previewImage = document.getElementById('mylist-image-preview');
    previewImage.src = '';
    previewImage.style.display = 'none';
});

saveItemBtn.addEventListener('click', () => {
    const posterInput = document.getElementById('mylist-item-poster');
    const title = document.getElementById('mylist-item-title').value.trim();
    const rating = document.getElementById('mylist-item-rating').value.trim();

    if (title && rating) {
        if (currentlyEditingCard) {
            // Update existing card
            const img = currentlyEditingCard.querySelector('img');
            const cardTitle = currentlyEditingCard.querySelector('.mylist-card-content h2');
            const cardRating = currentlyEditingCard.querySelector('.mylist-card-content p');

            // Update title and rating
            cardTitle.textContent = title;
            cardRating.textContent = `Rating: ${rating}/10`;

            // Update image only if a new one is uploaded
            if (posterInput.files.length > 0) {
                const file = posterInput.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                    img.alt = title;
                    saveCards(); // Save updated cards to localStorage
                };
                reader.readAsDataURL(file);
            }

            currentlyEditingCard = null;
        } else {
            // Create a new card
            if (posterInput.files.length > 0) {
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
                        </div>
                        <div class="mylist-card-overlay">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>`;

                    // Add hover functionality
                    card.addEventListener('mouseenter', () => {
                        card.querySelector('.mylist-card-overlay').style.display = 'flex';
                    });

                    card.addEventListener('mouseleave', () => {
                        card.querySelector('.mylist-card-overlay').style.display = 'none';
                    });

                    // Edit functionality
                    card.querySelector('.edit-btn').addEventListener('click', () => {
                        currentlyEditingCard = card;

                        const cardTitle = card.querySelector('.mylist-card-content h2').textContent;
                        const cardRating = card.querySelector('.mylist-card-content p').textContent.match(/\d+/)[0]; // Extract the rating value

                        document.getElementById('mylist-item-title').value = cardTitle;
                        document.getElementById('mylist-item-rating').value = cardRating;

                        const previewImage = document.getElementById('mylist-image-preview');
                        previewImage.src = card.querySelector('img').src;
                        previewImage.alt = cardTitle;
                        previewImage.style.display = 'block';

                        addItemModal.style.display = 'flex';
                    });

                    // Delete functionality
                    card.querySelector('.delete-btn').addEventListener('click', (event) => {
                        event.stopPropagation();
                        if (confirm('Are you sure you want to delete this?')) {
                            card.remove();
                            saveCards(); // Save updated cards to localStorage
                        }
                    });

                    document.querySelector('.mylist-content').appendChild(card);
                    saveCards(); // Save new cards to localStorage
                    addItemModal.style.display = 'none';
                };

                reader.readAsDataURL(file);
            }
        }
        addItemModal.style.display = 'none';

        document.getElementById('mylist-item-title').value = '';
        document.getElementById('mylist-item-rating').value = '';
        posterInput.value = '';
        document.getElementById('mylist-image-preview').style.display = 'none';
    }
});

cancelItemBtn.addEventListener('click', () => {
    addItemModal.style.display = 'none';
    currentlyEditingCard = null;
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('mylist-modal')) {
        event.target.style.display = 'none';
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetSection = document.querySelector(link.getAttribute('href'));
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});