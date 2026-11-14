const TOTAL_SEATS = 20;
let selectedSeat = null;
let bookings = JSON.parse(localStorage.getItem("libraryBookings") || "[]");

const dateInput = document.getElementById("bookingDate");

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

dateInput.min = getToday();
dateInput.value = getToday();

function saveBookings() {
  localStorage.setItem("libraryBookings", JSON.stringify(bookings));
}

function releaseExpiredBookings() {
  const now = new Date();
  let changed = false;
  bookings.forEach(booking => {
    if (booking.status !== "Active") return;
    const endTime = new Date(`${booking.date}T${booking.slot.split("-")[1]}:00`);
    if (now >= endTime) {
      booking.status = "Expired";
      changed = true;
    }
  });
  if (changed) saveBookings();
}

function renderSeats() {
  releaseExpiredBookings();
  const seatMap = document.getElementById("seatMap");
  const date = dateInput.value;
  const slot = document.getElementById("timeSlot").value;
  seatMap.innerHTML = "";

  for (let i = 1; i <= TOTAL_SEATS; i++) {
    const seatName = "S" + i;
    const isBooked = bookings.some(booking =>
      booking.seat === seatName && booking.date === date &&
      booking.slot === slot && booking.status === "Active"
    );
    const button = document.createElement("button");
    button.type = "button";
    button.className = "seat";
    button.textContent = seatName;
    button.setAttribute("aria-label", `${seatName} ${isBooked ? "booked" : "available"}`);

    if (isBooked) {
      button.classList.add("booked-seat");
      button.disabled = true;
    }
    if (selectedSeat === seatName) button.classList.add("selected-seat");

    button.addEventListener("click", () => {
      selectedSeat = seatName;
      document.getElementById("selectedSeat").textContent = seatName;
      renderSeats();
    });
    seatMap.appendChild(button);
  }
  updateStats();
}

function updateStats() {
  const date = dateInput.value;
  const slot = document.getElementById("timeSlot").value;
  const occupied = bookings.filter(booking =>
    booking.date === date && booking.slot === slot && booking.status === "Active"
  ).length;
  document.getElementById("total").textContent = TOTAL_SEATS;
  document.getElementById("booked").textContent = occupied;
  document.getElementById("available").textContent = TOTAL_SEATS - occupied;
}

function confirmBooking() {
  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("rollNumber").value.trim();
  const date = dateInput.value;
  const slot = document.getElementById("timeSlot").value;
  const message = document.getElementById("message");

  if (!name || !roll || !date) {
    alert("Please enter all student details.");
    return;
  }
  if (!selectedSeat) {
    alert("Please select a seat first.");
    return;
  }
  if (date < getToday()) {
    alert("Please select a valid date.");
    return;
  }

  const startTime = new Date(`${date}T${slot.split("-")[0]}:00`);
  if (startTime <= new Date()) {
    alert("This time slot has already started.");
    return;
  }

  releaseExpiredBookings();
  const alreadyBooked = bookings.some(booking =>
    booking.seat === selectedSeat && booking.date === date &&
    booking.slot === slot && booking.status === "Active"
  );

  if (alreadyBooked) {
    alert("Sorry! This seat is already booked.");
    selectedSeat = null;
    document.getElementById("selectedSeat").textContent = "None";
    renderSeats();
    return;
  }

  bookings.push({
    id: Date.now(),
    name, roll, seat: selectedSeat, date, slot, status: "Active"
  });

  saveBookings();
  message.textContent = `Booking successful! Your seat is ${selectedSeat}.`;
  message.style.color = "green";
  selectedSeat = null;
  document.getElementById("selectedSeat").textContent = "None";
  renderSeats();
  showHistory();
}

function showHistory() {
  const history = document.getElementById("bookingHistory");
  const roll = document.getElementById("rollNumber").value.trim();
  history.innerHTML = "";

  if (!roll) {
    history.textContent = "Enter your registration number to view bookings.";
    return;
  }

  const myBookings = bookings.filter(booking => booking.roll === roll);
  if (myBookings.length === 0) {
    history.textContent = "No bookings found.";
    return;
  }

  myBookings.forEach(booking => {
    const item = document.createElement("div");
    item.className = "history-item";
    const details = document.createElement("p");
    details.textContent =
      `Student: ${booking.name} | Seat: ${booking.seat} | Date: ${booking.date} | Slot: ${booking.slot} | Status: ${booking.status}`;
    item.appendChild(details);

    if (booking.status === "Active") {
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancel Booking";
      cancelButton.addEventListener("click", () => {
        booking.status = "Cancelled";
        saveBookings();
        renderSeats();
        showHistory();
      });
      item.appendChild(cancelButton);
    }
    history.appendChild(item);
  });
}

document.getElementById("bookButton").addEventListener("click", confirmBooking);

document.getElementById("timeSlot").addEventListener("change", () => {
  selectedSeat = null;
  document.getElementById("selectedSeat").textContent = "None";
  renderSeats();
});

dateInput.addEventListener("change", () => {
  selectedSeat = null;
  document.getElementById("selectedSeat").textContent = "None";
  renderSeats();
});

document.getElementById("rollNumber").addEventListener("input", showHistory);

setInterval(() => {
  releaseExpiredBookings();
  renderSeats();
  showHistory();
}, 10000);

renderSeats();
showHistory();
