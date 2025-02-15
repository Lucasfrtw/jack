function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  
  function generateBrainfuckCode(str) {
    let code = '';
    for (let i = 0; i < str.length; i++) {
      const ascii = str.charCodeAt(i);
      code += '+'.repeat(ascii) + '.' + '[-]';
    }
    return code;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    const password = generateRandomPassword(8);
    const bfCode = generateBrainfuckCode(password);
    
    document.getElementById("bf-code").textContent = bfCode;
    
    localStorage.setItem("phase3Password", password);
    
    document.getElementById("submit-btn").addEventListener("click", function() {
      const userInput = document.getElementById("password-input").value;
      const challengeContainer = document.querySelector(".challenge");
      
      if (userInput === password) {
        gsap.to(challengeContainer, {
          duration: 0.5,
          backgroundColor: "#2ecc71",
          onComplete: () => {
            localStorage.setItem("phase3Complete", "true");
            gsap.to(challengeContainer, { duration: 0.5, opacity: 0, onComplete: () => {
              window.location.href = "phases.html";
            }});
          }
        });
      } else {
        gsap.fromTo("#password-input",
          { borderColor: "#fff" },
          { borderColor: "#e74c3c", duration: 0.2, yoyo: true, repeat: 3 }
        );
        gsap.fromTo("#password-input", { x: -10 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true });
      }
    });
    
    document.getElementById("hint-btn").addEventListener("click", function() {
      const hintDiv = document.getElementById("hint-text");
      if (hintDiv.style.display === "none" || hintDiv.style.display === "") {
        hintDiv.style.display = "block";
        hintDiv.textContent = "Dica: É ora foder o cérebro!";
      } else {
        hintDiv.style.display = "none";
      }
    });

    gsap.fromTo(".challenge", { opacity: 0, scale: 0.8 }, { duration: 1, opacity: 1, scale: 1, ease: "power2.out" });
    
    const bgElement = document.getElementById("bg-animation");
    
    function generateBackgroundText(lines = 100) {
      let text = "";
      for (let i = 0; i < lines; i++) {
        text += generateBrainfuckCode(generateRandomPassword(6)) + "\n";
      }
      return text;
    }
    
    bgElement.textContent = generateBackgroundText(100);
    
    gsap.to(bgElement, {
      y: -bgElement.offsetHeight,
      duration: 360,
      ease: "linear",
      repeat: -1,
      onRepeat: function() {
        bgElement.textContent = generateBackgroundText(100);
        gsap.set(bgElement, { y: 0 });
      }
    });
  });
  