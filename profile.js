if (!localStorage.getItem("userId")) {
  window.location.href = "login.html";
}

document.getElementById("logout").addEventListener("click", function() {
  localStorage.clear();
  window.location.href = "login.html";
});

document.getElementById("user").textContent =
  localStorage.getItem("username");

document.querySelectorAll(".link").forEach(el => {
    el.addEventListener("click", () => {
        window.location.href = el.dataset.page;
    });
});

const username = localStorage.getItem("username");
const userId = localStorage.getItem("userId")

fetch("https://house-price-prediction-1943.onrender.com/")
  .then(res => res.json())
  .then(data => {

    const unreadCount = data.filter(
      msg => msg.userId === userId && !msg.read
    ).length;

    const badge = document.getElementById("badge");

    if (unreadCount > 0) {
      badge.style.display = "inline-block";
      badge.textContent = unreadCount;
    } else {
      badge.style.display = "none";
    }
  });
