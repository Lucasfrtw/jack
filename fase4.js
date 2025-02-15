document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password-input");
  const submitBtn = document.getElementById("submit-btn");
  const hintBtn = document.getElementById("hint-btn");
  const hintText = document.getElementById("hint-text");

  submitBtn.addEventListener("click", () => {
    if (passwordInput.value.trim().toLowerCase() === "lucasgostoso") {
      gsap.to(passwordInput, {
        duration: 0.1,
        x: 10,
        repeat: 3,
        yoyo: true,
        backgroundColor: "#0f0",
        onComplete: () => {
          localStorage.setItem("phase4Complete", "true");
          gsap.to(passwordInput, {
            duration: 0.3,
            x: 0,
            backgroundColor: "#222",
            onComplete: () => {
              window.location.href = "phases.html";
            }
          });
        }
      });
    } else {
      gsap.to(passwordInput, {
        duration: 0.1,
        x: 10,
        repeat: 3,
        yoyo: true,
        backgroundColor: "#f00",
        onComplete: () => {
          gsap.to(passwordInput, { duration: 0.3, x: 0, backgroundColor: "#222" });
        }
      });
    }
  });

  hintBtn.addEventListener("click", () => {
    hintText.classList.toggle("hidden");
  });
});
