if (localStorage.getItem("username") !== "admin") {
  window.location.href = "login.html";
}

const table = document.getElementById("table");

fetch("http://localhost:3000/get-users")
  .then(res => res.json())
  .then(data => {

    data.forEach(user => {
      const row = table.insertRow();

      row.insertCell(0).innerText = user.id;
      row.insertCell(1).innerText = user.username;
      row.insertCell(2).innerText = user.email;

      // status color
      const statusCell = row.insertCell(3);
      statusCell.innerText = user.status;
      statusCell.style.color =
        user.status === "ACTIVE" ? "green" : "red";

      row.insertCell(4).innerText = user.created;
      row.insertCell(5).innerText = user.lastActivity || "-";

      // DELETE BUTTON
      const actionCell = row.insertCell(6);
      const btn = document.createElement("button");

      btn.textContent = "Delete";

      btn.onclick = async function () {

        if (!confirm("Delete this user?")) return;

        await fetch(
          `http://localhost:3000/delete-user/${encodeURIComponent(user.username)}`,
          { method: "DELETE" }
        );

        row.remove();
      };

      actionCell.appendChild(btn);
    });

  });