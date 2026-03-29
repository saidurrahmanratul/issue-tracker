const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const u = username.value.trim();
  const p = password.value.trim();

  if (u === "admin" && p === "admin123") {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "app.html";
  } else {
    alert("Invalid credentials");
  }
});
