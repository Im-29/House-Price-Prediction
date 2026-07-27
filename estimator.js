const form = document.getElementById("estimatorForm");
const result = document.getElementById("result");

let lastPrediction = null;

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitbutton = document.activeElement.id;

  const district = document.getElementById("district").value;
  const property_type = document.getElementById("property_type").value;
  const tenure = document.getElementById("tenure").value;
  const month_year_of_transaction_date = document.getElementById("month_year_of_transaction_date").value;
  const main_floor_area = document.getElementById("main_floor_area").value;

  if (submitbutton === "PredictButton") {

    lastPrediction = null;

    const monthYearPattern = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s(202[1-5])$/;

    if (!monthYearPattern.test(month_year_of_transaction_date)) {
        alert("Please enter a valid Month & Year between January 2021 and December 2025.");
        result.textContent = "RM 0";
        return;
    }

      // Validate Size Factor (Main Floor Area)
    if (main_floor_area <= 43) {
      lastPrediction = null; // clear previous prediction
      result.textContent = "RM 0";
      alert("Please enter a valid Size Factor greater than 43.");
      return;
    }

    // Validate Size Factor based on Property Type
    if (property_type === "Condominium/Apartment") {
        if (main_floor_area > 200) {
            alert("Size cannot exceed 200 sqm.");
            result.textContent = "RM 0";
            return;
        }
    }

    // Validate Size Factor based on Property Type
    if (property_type === "Flat" || property_type === "Low-Cost Flat") {
        if (main_floor_area > 200) {
            alert("Size cannot exceed 100 sqm.");
            result.textContent = "RM 0";
            return;
        }
    }

      // Validate Month & Year
    if (!month_year_of_transaction_date) {
      alert("Please enter the Month & Year of Transaction.");
      result.textContent = "RM 0";
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          district,
          property_type,
          tenure,
          month_year_of_transaction_date,
          main_floor_area
        })
      });

      const data = await res.json();

      const priceText = Number(data.price).toLocaleString();

      result.textContent = "RM " + priceText;

      lastPrediction = {
        district,
        property_type,
        tenure,
        month_year_of_transaction_date,
        main_floor_area,
        price: priceText,
        date: new Date().toLocaleString()
      };

          
    } catch (err) {
      console.error(err);
      result.textContent = "ERROR!";
    }
  }

  // SAVE BUTTON
  if (submitbutton === "SaveButton") {

    if (!lastPrediction) {
      alert("Please predict first!");
      return;
    }

    const userId = localStorage.getItem("userId");

    fetch("http://localhost:3000/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      userId,
      message: "✅ Your prediction was successfully generated!"
      })
    });

    const username = localStorage.getItem("username");

    fetch("http://localhost:3000/save-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        username,
        ...lastPrediction,
        date: new Date().toLocaleString()
      })
    })
    .then(() => {
      alert("Saved successfully ✅");
    })
    .catch(err => {
      console.error("Save failed", err);
    });
  }

});
