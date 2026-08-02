const path = require("path");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const fsExtra = require("fs")

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

// Redirect homepage to login.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

const PORT = 3000;
const FILE = "users.json";

function logActivity(description, username, status = "SUCCESSFUL") {

  const FILE = "activity.json";

  let activities = [];

  if (fs.existsSync(FILE)) {
    activities = JSON.parse(fs.readFileSync(FILE));
  }

  const now = new Date();

  activities.push({
      id: "#" + String(activities.length + 1).padStart(4, "0"),
      description: username + " " + description,
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString(),
      status: status
    });

  fs.writeFileSync(FILE, JSON.stringify(activities, null, 2));
}


// Create file if not exists
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(FILE));

  // check duplicate
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email already exists!" });
  }

  users.push({ 
    id: String(users.length + 1).padStart(4, "0"),
    email, 
    username, 
    password,
    status: "ACTIVE",
    created: new Date().toLocaleDateString(),
    lastActivity: "-"
  });

  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
  logActivity("registered", username);

  res.json({ message: "Registration successful!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/run-inactive-check", (req, res) => {

  let users = JSON.parse(fs.readFileSync("users.json"));
  const now = new Date();

  users = users.map(user => {

    if (user.lastActivityISO) {
      const last = new Date(user.lastActivityISO);
      const diffDays = (now - last) / (1000 * 60 * 60 * 24);

      if (diffDays > 1) {
        user.status = "INACTIVE";
      } else {
        user.status = "ACTIVE";
      }
    }

    return user;
  });

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Inactive check completed" });
});

const cron = require("node-cron");

// run every day at midnight
cron.schedule("0 0 * * *", () => {

  let users = JSON.parse(fs.readFileSync("users.json"));

  const now = new Date();

  users = users.map(user => {

    if (user.lastActivity) {
      const last = new Date(user.lastActivity);
      const diffDays = (now - last) / (1000 * 60 * 60 * 24);

      if (diffDays > 2) {
        return { ...user, status: "INACTIVE" };
      } else {
        user.status = "ACTIVE";
      }
    }

    return user;
  });

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  console.log("✔ Inactive users updated");
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // ADMIN LOGIN
  if (username === "admin" && password === "admin123") {
    return res.json({ role: "admin", message: "Admin login success" });
  }

  // USER LOGIN
  const users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  user.lastActivityISO = new Date().toISOString();
  user.lastActivity = new Date().toLocaleString();
  user.status = "ACTIVE"; 

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  logActivity("logged in", username, "SUCCESSFUL");

  res.json({ 
    role: "user", 
    message: "User login success",
    userId: user.id
  });
});


app.post("/save-history", (req, res) => {
  const { userId, username, district, property_type, tenure, month_year_of_transaction_date, main_floor_area, price, date } = req.body;

  const FILE = "history.json";

  let history = [];

  if (fs.existsSync(FILE)) {
    history = JSON.parse(fs.readFileSync(FILE));
  }

  history.push({
    userId,
    district,
    property_type,
    tenure,
    month_year_of_transaction_date,
    main_floor_area,
    price,
    date
  });

  fs.writeFileSync(FILE, JSON.stringify(history, null, 2));
  logActivity("saved to history", username);

  res.json({ message: "Saved!" });
});

app.post("/update-username", (req, res) => {
  const { userId, username, newUsername } = req.body;

  let users = JSON.parse(fs.readFileSync("users.json"));

  // update user
  const user = users.find(u => String(u.id) === String(userId));

  if (!user) {
    logActivity("updated username", username, "UNSUCCESSFUL");
    return res.status(400).json({ message: "User not found" });
  }

  if (users.find(u => u.username === newUsername)) {
    logActivity("updated username", username, "UNSUCCESSFUL");
    return res.status(400).json({ message: "Username already taken!" });
  }

  user.username = newUsername;

  res.json({ message: "Username updated successfully" });

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  logActivity("updated username", newUsername, "SUCCESSFUL");
});


app.post("/change-password", (req, res) => {
  const { userId, username, oldPassword, newPassword } = req.body;

  let users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find(u => u.id === userId);

  if (!user || user.password !== oldPassword) {
    logActivity("changed password", username, "UNSUCCESSFUL");
    return res.status(400).json({ message: "Wrong password" });
  } else {

  user.password = newPassword;

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  logActivity("changed password", username, "SUCCESSFUL");

  res.json({ message: "Password updated" });
  }
});

app.get("/get-history", (req, res) => {
  const FILE = "history.json";

  if (!fs.existsSync(FILE)) {
    return res.json([]);
  }

  const history = JSON.parse(fs.readFileSync(FILE));
  res.json(history);
});

app.get("/get-messages", (req, res) => {
  const FILE = "inbox.json";

  if (!fs.existsSync(FILE)) {
    return res.json([]);
  }

  const messages = JSON.parse(fs.readFileSync(FILE));
  res.json(messages);
});

app.post("/mark-read", (req, res) => {
  const { username } = req.body;

  let messages = JSON.parse(fs.readFileSync("inbox.json"));

  messages = messages.map(msg => {
    if (msg.username === username) {
      return { ...msg, read: true }; // mark read
    }
    return msg;
  });

  fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2));
  logActivity("opened inbox", username);

  res.json({ message: "Marked as read" });
});

app.post("/send-message", (req, res) => {
  const { userId, message } = req.body;

  const FILE = "inbox.json";

  let messages = [];

  if (fs.existsSync(FILE)) {
    messages = JSON.parse(fs.readFileSync(FILE));
  }

  messages.push({
    userId,
    message,
    date: new Date().toLocaleString(),
    read: false
  });

  fs.writeFileSync(FILE, JSON.stringify(messages, null, 2));

  res.json({ message: "Message sent!" });
});

app.get("/get-users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  res.json(users);
});

app.delete("/delete-user/:username", (req, res) => {
  const username = req.params.username;

  let users = JSON.parse(fs.readFileSync("users.json"));

  users = users.filter(u => u.username !== username);

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "User deleted" });
});

app.get("/get-activity", (req, res) => {
  const FILE = "activity.json";

  if (!fs.existsSync(FILE)) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

app.get("/get-datasets", (req, res) => {
  if (!fs.existsSync("datasets.json")) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync("datasets.json"));
  res.json(data);
});

app.post("/upload-dataset", upload.single("file"), (req, res) => {

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  let datasets = [];

  if (fs.existsSync("datasets.json")) {
    datasets = JSON.parse(fs.readFileSync("datasets.json"));
  }

  const now = new Date();

  datasets.push({
    name: file.originalname,
    file: file.filename, // stored file
    uploaded: now.toLocaleString(),
    updated: now.toLocaleString(),
    status: "SUCCESSFUL"
  });

  fs.writeFileSync("datasets.json", JSON.stringify(datasets, null, 2));

  res.json({ message: "File uploaded successfully ✅" });
});

app.delete("/delete-dataset/:name", (req, res) => {
  const name = req.params.name;

  let datasets = JSON.parse(fs.readFileSync("datasets.json"));

  datasets = datasets.filter(d => d.name !== name);

  fs.writeFileSync("datasets.json", JSON.stringify(datasets, null, 2));

  res.json({ message: "Deleted" });
});

app.get("/preview/:file", (req, res) => {

  const filepath = "uploads/" + req.params.file;

  const data = fsExtra.readFileSync(filepath, "utf-8");

  const rows = data.split("\n").slice(0, 1000);

  res.json(rows);
});

const axios = require("axios");
