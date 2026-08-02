const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("https://house-price-prediction-1943.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        username, 
        password 
      })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.textContent = data.message;

      // ✅ REDIRECT BASED ON ROLE
      if (data.role === "admin") {
        window.location.href = "admin.html";   // ✅ admin page
      } else {
        window.location.href = "home.html";    // ✅ normal user
      }

      // ✅ SAVE USER
      localStorage.setItem("username", username);
      localStorage.setItem("userId", data.userId);

    } else {
      message.style.color = "red";
      message.textContent = data.message;
    }

  } catch (err) {
    message.style.color = "red";
    message.textContent = "Server error!";
    console.error(err);
  }
});
