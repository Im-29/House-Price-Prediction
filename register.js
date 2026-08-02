const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // ✅ password check
  if (password !== confirmPassword) {
    message.style.color = "red";
    message.textContent = "Passwords do not match!";
    return;
  }

  // ✅ password strength
  if (password.length < 6) {
    message.style.color = "red";
    message.textContent = "Password must be at least 6 characters!";
    return;
  }

  try {
    const res = await fetch("https://house-price-prediction-1943.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, username, password })
    });

    const data = await res.json();

    if (res.ok) {

      setTimeout(() => {
        window.location.href = "login.html";
      }, 10);

    }

      message.style.color = res.ok ? "green" : "red";
      message.textContent = data.message;

  } catch (err) {
    message.style.color = "red";
    message.textContent = "Server error!";
  }
});
