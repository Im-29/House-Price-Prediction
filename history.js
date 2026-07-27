const table = document.getElementById("table");
const userId = localStorage.getItem("userId")

fetch("http://localhost:3000/get-history")
  .then(res => res.json())
  .then(data => {

    const userData = data.filter(item => item.userId === userId);

    userData.forEach(item => {
      const row = table.insertRow();

      row.insertCell(0).innerText = item.district;
      row.insertCell(1).innerText = item.property_type;
      row.insertCell(2).innerText = item.tenure;
      row.insertCell(3).innerText = item.month_year_of_transaction_date;
      row.insertCell(4).innerText = item.main_floor_area;
      row.insertCell(5).innerText = "RM " + item.price;
      row.insertCell(6).innerText = item.date;
    });

  })
  .catch(err => {
    console.error(err);
  });