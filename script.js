document.addEventListener("DOMContentLoaded", function () {
    const page = document.body;

    if (page.classList.contains("catalogue-page")) {
        const searchInput = document.getElementById("bookSearch");
        const books = document.querySelectorAll(".book");
        const searchButton = document.getElementById("searchButton");

        function searchBooks() {
            const searchText = searchInput.value.toLowerCase();

            books.forEach(function (book) {
                const bookText = book.textContent.toLowerCase();

                if (bookText.includes(searchText)) {
                    book.style.display = "block";
                } else {
                    book.style.display = "none";
                }
            });
        }

        searchButton.addEventListener("click", function (event) {
            event.preventDefault();
            searchBooks();
        });

        searchInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                searchBooks();
            }
        });

        const bookButtons = document.querySelectorAll(".book-btn");

        bookButtons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();

                const book = button.closest(".book");
                const title = book.querySelector("h3").textContent;

                alert("Selected book: " + title);
            });
        });
    }

    if (page.classList.contains("booking-page")) {
        const seats = document.querySelectorAll(".seat.available");
        const seatSummary = document.getElementById("seatSummary");
        const dateInput = document.getElementById("date");
        const timeInput = document.getElementById("time");
        const resourceInput = document.getElementById("resource");
        const dateSummary = document.getElementById("dateSummary");
        const timeSummary = document.getElementById("timeSummary");
        const confirmButton = document.getElementById("confirmBooking");
        const bookingMessage = document.getElementById("bookingMessage");

        let selectedSeat = "";

        seats.forEach(function (seat) {
            seat.addEventListener("click", function () {
                seats.forEach(function (item) {
                    item.classList.remove("selected");
                });

                seat.classList.add("selected");
                selectedSeat = seat.textContent;
                seatSummary.textContent = selectedSeat;
            });
        });

        dateInput.addEventListener("change", function () {
            dateSummary.textContent = dateInput.value || "Select a date";
        });

        timeInput.addEventListener("change", function () {
            timeSummary.textContent = timeInput.value;
        });

        confirmButton.addEventListener("click", function (event) {
            event.preventDefault();

            if (selectedSeat === "") {
                bookingMessage.textContent = "Please select a seat.";
                bookingMessage.className = "message error";
                return;
            }

            if (dateInput.value === "") {
                bookingMessage.textContent = "Please select a date.";
                bookingMessage.className = "message error";
                return;
            }

            const booking = {
                seat: selectedSeat,
                date: dateInput.value,
                time: timeInput.value,
                resource: resourceInput.value
            };

            localStorage.setItem("libraryBooking", JSON.stringify(booking));

            bookingMessage.textContent =
                "Booking confirmed for seat " +
                selectedSeat +
                " on " +
                dateInput.value +
                ".";

            bookingMessage.className = "message success";
        });
    }

    const pageLinks = document.querySelectorAll(".Menu a");

    pageLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            localStorage.setItem("lastPage", link.textContent);
        });
    });
});
