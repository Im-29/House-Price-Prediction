const table = document.getElementById("table");

function loadDatasets() {

  fetch("http://localhost:3000/get-datasets")
    .then(res => res.json())
    .then(data => {

      table.innerHTML = `
        <tr>
          <th></th>
          <th>Name</th>
          <th>Uploaded</th>
          <th>Updated</th>
          <th>Status</th>
        </tr>
      `;

      data.forEach(d => {

        const row = table.insertRow();
        const checkCell = row.insertCell(0);

        checkCell.innerHTML = `
          <input type="checkbox" value="${d.name}" data-file="${d.file}">
        `;

        const checkbox = checkCell.querySelector("input");

        checkbox.addEventListener("change", function (e) {

          e.stopPropagation();

          const preview = document.getElementById("preview");

          if (this.checked) {
            previewDataset(this.dataset.file);
          } else {
            preview.innerHTML = "";
          }

        });

        // name
        row.insertCell(1).innerText = d.name;
        row.insertCell(2).innerText = d.uploaded;
        row.insertCell(3).innerText = d.updated;

        // status with color
        const statusCell = row.insertCell(4);
        statusCell.innerText = d.status;
        statusCell.style.color = "green";

      });

    });
}

loadDatasets();

// Upload
function uploadDataset() {

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://localhost:3000/upload-dataset", {
    method: "POST",
    body: formData
  }).then(() => {
    loadDatasets();
  });
}

// Delete
function deleteDataset() {
  const checkbox = document.querySelector("input[type=checkbox]:checked");

  if (!checkbox) {
    alert("Select a dataset");
    return;
  }

  fetch(`http://localhost:3000/delete-dataset/${encodeURIComponent(checkbox.value)}`, {
    method: "DELETE"
  }).then(() => {
    loadDatasets();
  });
}

// Preview
function previewDataset(file) {
  fetch(`http://localhost:3000/preview/${file}`)
    .then(res => res.json())
    .then(data => {

      const preview = document.getElementById("preview");

      const table = document.createElement("table");
      const rows = data.map(r => r.split(","));

      const head = document.createElement("tr");
      rows[0].forEach(c => {
        const th = document.createElement("th");
        th.textContent = c;
        head.appendChild(th);
      });
      table.appendChild(head);

      for (let i = 1; i < rows.length; i++) {
        const tr = document.createElement("tr");
        rows[i].forEach(c => {
          const td = document.createElement("td");
          td.textContent = c;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      }

      preview.innerHTML = "";
      preview.appendChild(table);
    });
}  
