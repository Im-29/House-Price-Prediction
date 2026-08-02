if (!localStorage.getItem("userId")) {
  window.location.href = "login.html";
}

const userId = localStorage.getItem("userId");
const container = document.getElementById("messages");

fetch("http://localhost:3000/get-messages")
  .then(res => res.json())
  .then(data => {

    const userMessages = data.filter(m => m.userId === userId);

    userMessages.forEach(msg => {
      const div = document.createElement("div");

      div.style.border = "1px solid #43A047";
      div.style.borderRadius = "10px";
      div.style.padding = "10px";
      div.style.margin = "15px";

      div.innerHTML = `
        <p>${msg.message}</p>
        <small>${msg.date}</small>
      `;

      container.appendChild(div);
    });

  });

  // mark messages as read
fetch("https://house-price-prediction-1943.onrender.com/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username: localStorage.getItem("username")
  })
});
