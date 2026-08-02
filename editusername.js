// if (!localStorage.getItem("userId")) {
//   window.location.href = "login.html";
// }

// const usernameInput = document.getElementById("newUsername");
// const currentUsername = localStorage.getItem("username");

// if (currentUsername) {
//   usernameInput.value = currentUsername;
//   usernameInput.style.color = "#d8d8d8";
// }

// async function updateUsername() {

//   const userId = localStorage.getItem("userId");
//   const newUsername = document.getElementById("newUsername").value.trim();

//   if (!newUsername) {
//     alert("Please enter a new username!");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:3000/update-username", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         userId,
//         newUsername
//       })
//     });

//     const data = await res.json();

//     document.getElementById("message").textContent = data.message;

//     if (res.ok) {

//       alert("Username has successfully updated!");

//       localStorage.setItem("username", newUsername);

//       // alert("Username has updated!");

//       await fetch("http://localhost:3000/send-message", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           userId,
//           message: "✅ Your username has been updated!"
//         })
//       });

//     }

//   } catch (err) {
//     console.error(err);
//     alert("Something went wrong ❌");
//   }
// }






const form = document.getElementById("updateUsername");
const message = document.getElementById("message");

// protect page
if (!localStorage.getItem("userId")) {
  window.location.href = "login.html";
}

// prefill username
const usernameInput = document.getElementById("newUsername");
const currentUsername = localStorage.getItem("username");

if (currentUsername) {
  usernameInput.value = currentUsername;
  usernameInput.style.color = "#d8d8d8";
}

// form submit handler
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const newUsername = usernameInput.value.trim();

  if (!newUsername) {
    alert("Please enter a new username!");
    return;
  }

  try {
    const res = await fetch("https://house-price-prediction-1943.onrender.com/update-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        username,
        newUsername
      })
    });

    const data = await res.json();

    message.textContent = data.message;

    if (res.ok) {

      message.style.color = "green";
      message.textContent = data.message;

      // update localStorage
      localStorage.setItem("username", newUsername);

      alert("Username successfully updated!");

      // send notification
      await fetch("https://house-price-prediction-1943.onrender.com/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          message: "✅ Your username has been updated!"
        })
      });

    } else {
      message.style.color = "red";
    }

  } catch (err) {
    console.error(err);
    alert("Something went wrong ❌");
  }
});
