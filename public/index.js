/** @format */

function fetchData() {
	document
		.getElementById("event-table")
		.getElementsByTagName("tbody")[0].innerHTML = "";
	// Fetch event data from API
	fetch("http://localhost:3000/events")
		.then((response) => response.json())
		.then((data) => populateTable(data))
		.catch((error) => console.error("Error:", error));

	function populateTable(data) {
		var table = document
			.getElementById("event-table")
			.getElementsByTagName("tbody")[0];

		data.forEach((event) => {
			var newRow = table.insertRow();
			var nameCell = newRow.insertCell(0);
			var startDateCell = newRow.insertCell(1);
			var endDateCell = newRow.insertCell(2);
			var actionsCell = newRow.insertCell(3);

			nameCell.textContent = event.eventName;
			startDateCell.textContent = event.startDate;
			endDateCell.textContent = event.endDate;

			actionsCell.innerHTML = `
      <button onclick="editEvent(${event.id})">Edit</button>
      <button onclick="deleteEvent(${event.id})">Delete</button>
    `;
		});
	}
}

function addNewEvent() {
	var table = document
		.getElementById("event-table")
		.getElementsByTagName("tbody")[0];
	var newRow = table.insertRow();
	var nameCell = newRow.insertCell(0);
	var startDateCell = newRow.insertCell(1);
	var endDateCell = newRow.insertCell(2);
	var actionsCell = newRow.insertCell(3);

	nameCell.innerHTML = '<input type="text" id="eventNameInput">';
	startDateCell.innerHTML = '<input type="date" id="startDateInput">';
	endDateCell.innerHTML = '<input type="date" id="endDateInput">';

	actionsCell.innerHTML = `
    <button onclick="addRecord()">Add Record</button>
    <button onclick="cancelAdd()">Cancel</button>
  `;
}

function addRecord() {
	var eventNameInput = document.getElementById("eventNameInput");
	var startDateInput = document.getElementById("startDateInput");
	var endDateInput = document.getElementById("endDateInput");

	var eventName = eventNameInput.value.trim();
	var startDate = startDateInput.value.trim();
	var endDate = endDateInput.value.trim();

	// Check if any input field is blank
	if (eventName === "" || startDate === "" || endDate === "") {
		alert("Input not valid");
		return;
	}

	var newEvent = {
		eventName: eventName,
		startDate: startDate,
		endDate: endDate,
	};

	fetch("http://localhost:3000/events", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newEvent),
	})
		.then((response) => response.json())
		.then((data) => {
			fetchData();
		})
		.catch((error) => console.error("Error:", error));
}

function cancelAdd() {
	var table = document
		.getElementById("event-table")
		.getElementsByTagName("tbody")[0];
	table.deleteRow(table.rows.length - 1);
}

function deleteEvent(eventId) {
	fetch(`http://localhost:3000/events/${eventId}`, {
		method: "DELETE",
	})
		.then((response) => {
			if (response.ok) {
				fetchData();
			} else {
				console.error("Error:", response.status);
			}
		})
		.catch((error) => console.error("Error:", error));
}

function editEvent(eventId) {
	var table = document
		.getElementById("event-table")
		.getElementsByTagName("tbody")[0];
	var rows = table.getElementsByTagName("tr");

	// Find the row with the matching event ID
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var actionsCell = row.cells[row.cells.length - 1];
		var editButton = actionsCell.getElementsByTagName("button")[0];
		var editButtonId = editButton.getAttribute("onclick").match(/\d+/)[0];

		if (eventId === parseInt(editButtonId)) {
			var nameCell = row.cells[0];
			var startDateCell = row.cells[1];
			var endDateCell = row.cells[2];

			// Replace labels with input boxes
			nameCell.innerHTML =
				'<input type="text" id="eventNameInput" value="' +
				nameCell.textContent +
				'">';
			startDateCell.innerHTML =
				'<input type="date" id="startDateInput" value="' +
				startDateCell.textContent +
				'">';
			endDateCell.innerHTML =
				'<input type="date" id="endDateInput" value="' +
				endDateCell.textContent +
				'">';

			// Update the actions cell with Save and Cancel buttons
			actionsCell.innerHTML = `
      <button onclick="saveEvent(${eventId})">Save</button>
      <button onclick="cancelEdit(${eventId}, '${nameCell.textContent}', '${startDateCell.textContent}', '${endDateCell.textContent}')">Cancel</button>
    `;
			break;
		}
	}
}

function cancelEdit(eventId, eventName, startDate, endDate) {
	fetchData();
}

function saveEvent(eventId) {
	var table = document
		.getElementById("event-table")
		.getElementsByTagName("tbody")[0];
	var rows = table.getElementsByTagName("tr");

	// Find the row with the matching event ID
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var actionsCell = row.cells[row.cells.length - 1];
		var saveButton = actionsCell.getElementsByTagName("button")[0];
		var saveButtonId = saveButton.getAttribute("onclick").match(/\d+/)[0];

		if (eventId === parseInt(saveButtonId)) {
			var nameInput = row.cells[0].getElementsByTagName("input")[0];
			var startDateInput = row.cells[1].getElementsByTagName("input")[0];
			var endDateInput = row.cells[2].getElementsByTagName("input")[0];

			var eventName = nameInput.value.trim();
			var startDate = startDateInput.value.trim();
			var endDate = endDateInput.value.trim();

			// Check if any input field is blank
			if (eventName === "" || startDate === "" || endDate === "") {
				alert("Input not valid");
				return;
			}

			// Get the values from the input boxes
			var updatedEvent = {
				eventName: eventName,
				startDate: startDate,
				endDate: endDate,
			};

			// Make a PUT request to update the event on the server
			fetch(`http://localhost:3000/events/${eventId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedEvent),
			})
				.then((response) => {
					if (response.ok) {
						fetchData();
					} else {
						console.error("Error:", response.status);
					}
				})
				.catch((error) => console.error("Error:", error));
			break;
		}
	}
}

fetchData();
