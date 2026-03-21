const changePasswordButton = document.getElementById("changepassword-button") as HTMLButtonElement;
const emailInput = document.getElementById("changepassword-email") as HTMLInputElement;
const passwordInput = document.getElementById("changepassword-password") as HTMLInputElement;
const confirmPasswordInput = document.getElementById("changepassword-confirm-password") as HTMLInputElement;

const currentURL = new URL(window.location.href);
const code = currentURL.searchParams.get("code") as string;
const email = currentURL.searchParams.get("email") as string;
if (!code || !email) {
    window.Notify("error", "Invalid or missing code or email");
    window.location.href = "/";
}

emailInput.value = email;
emailInput.disabled = true;

changePasswordButton.addEventListener("click", async () => {
  if (!code) {
    window.Notify("error", "Invalid or missing code");
    return;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    window.Notify("error", "Passwords do not match");
    return;
  }

  const response = await fetch("/update-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
      password2: confirmPasswordInput.value,
      code: code,
    }),
  });

  if (response.ok) {
    window.Notify("success", "Password changed successfully. Redirecting to login...");

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } else {
    const data = await response.json();
    const responseMessage = data.message || "Failed to change password";
    window.Notify("error", responseMessage, 7000);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    changePasswordButton.click();
  }
});