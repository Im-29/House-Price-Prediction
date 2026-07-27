if (localStorage.getItem("username") !== "admin") {
  window.location.href = "login.html";
}

const username = localStorage.getItem("username");

// logout
document.getElementById("logout").addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "login.html";
});