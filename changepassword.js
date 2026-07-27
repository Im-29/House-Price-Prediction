// if (!localStorage.getItem("userId")) {
//   window.location.href = "login.html";
// }

// async function changePassword() {
//   const userId = localStorage.getItem("userId");
//   const username = localStorage.getItem("username");
//   const oldPassword = document.getElementById("oldPassword").value;
//   const newPassword = document.getElementById("newPassword").value;

//   if (!oldPassword || !newPassword) {
//     alert("Please fill all fields");
//     return;
//   }

//   if (newPassword.length < 6) {
//     alert("Password must be at least 6 characters!");
//     return;
//   }

//   const res = await fetch("http://localhost:3000/change-password", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       userId,
//       username,
//       oldPassword,
//       newPassword
//     })
//   });

//   const data = await res.json();

//   document.getElementById("msg").textContent = data.message;

//   if (res.ok) {
//     alert("Password updated!")

//   fetch("http://localhost:3000/send-message", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//       userId,
//       message: "✅ Your password has changed!"
//       })
//     });
//   }
// }




// const form = document.getElementById("changePassword");
// const message = document.getElementById("message");

// // protect page
// if (!localStorage.getItem("userId")) {
//   window.location.href = "login.html";
// }

// form.addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const userId = localStorage.getItem("userId");
//   const username = localStorage.getItem("username");

//   const oldPassword = document.getElementById("oldPassword").value;
//   const newPassword = document.getElementById("newPassword").value;

//   if (!oldPassword || !newPassword) {
//     message.textContent = "Please fill all fields";
//     message.style.color = "red";
//     return;
//   }

//   if (newPassword.length < 6) {
//     message.textContent = "Password must be at least 6 characters!";
//     message.style.color = "red";
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:3000/change-password", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         userId,
//         username,
//         oldPassword,
//         newPassword
//       })
//     });

//     const data = await res.json();

//     const res = await fetch("http://localhost:3000/change-password", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     userId,
//     username,
//     oldPassword,
//     newPassword
//   })
// });

//     const data = await res.json();

//     // 👇 PUT YOUR CODE HERE
//     msg.textContent = data.message;
//     msg.style.color = res.ok ? "green" : "red";

//     msg.style.transition = "opacity 1s";
//     msg.style.opacity = "1";

//     setTimeout(() => {
//       msg.style.opacity = "0";
//     }, 3000);

//     setTimeout(() => {
//       msg.textContent = "";
//       msg.style.opacity = "1";
//     }, 4000);

//     if (res.ok) {

//       // 🟢 SUCCESS
//       // message.style.color = "green";

//       await fetch("http://localhost:3000/send-message", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           userId,
//           message: "✅ Your password has changed!"
//         })
//       });

//       message.style.color = "green";

//     } else {

//       // 🔴 ERROR
//       message.style.color = "red";
//     }

//   } catch (err) {
//     console.error(err);
//     message.textContent = "Server error!";
//     message.style.color = "red";
//   }
// });


const form = document.getElementById("changePassword");
const message = document.getElementById("message");

// protect page
if (!localStorage.getItem("userId")) {
  window.location.href = "login.html";
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  if (!oldPassword || !newPassword) {
    message.textContent = "Please fill in all fields";
    message.style.color = "red";
    return;
  }

  if (newPassword.length < 6) {
    message.textContent = "Password must be at least 6 characters!";
    message.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        username,
        oldPassword,
        newPassword
      })
    });

    const data = await res.json();

    // ✅ MESSAGE DISPLAY
    message.textContent = data.message;
    message.style.color = res.ok ? "green" : "red";

    message.style.transition = "opacity 1s";
    message.style.opacity = "1";

    setTimeout(() => {
      message.style.opacity = "0";
    }, 5000);

    setTimeout(() => {
      message.textContent = "";
      message.style.opacity = "1";
    }, 5000);

    // ✅ SUCCESS ONLY
    if (res.ok) {
      await fetch("http://localhost:3000/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          message: "✅ Your password has changed!"
        })
      });
    }

  } catch (err) {
    console.error(err);
    message.textContent = "Server error!";
    message.style.color = "red";
  }
});