if (localStorage.getItem("username") !== "admin") {
  window.location.href = "login.html";
}

const table = document.getElementById("table");

// fetch activity data
fetch("http://localhost:3000/get-activity")
  .then(res => res.json())
  .then(data => {

    data.forEach(item => {

      const row = table.insertRow();

      // ID
      row.insertCell(0).innerText = item.id;

      // Description
      row.insertCell(1).innerText = item.description;

      // Time
      row.insertCell(2).innerText = item.time;

      // Status (with color)
      const statusCell = row.insertCell(3);
      statusCell.innerText = item.status;

      if (item.status === "SUCCESSFUL") {
        statusCell.style.color = "#8cf28a";
      } else if (item.status === "UNSUCCESSFUL") {
        statusCell.style.color = "red";
      } else {
        statusCell.style.color = "orange"; // PROCESSING
      }

      // Date
      row.insertCell(4).innerText = item.date;

    });

  })
  .catch(err => {
    console.error("Failed to load activity:", err);
  });
