document.addEventListener("DOMContentLoaded", function() {
  const qrText = "http://192.168.18.32:5500/scanned.html";
  var qr = qrcode(0, 'H');
  qr.addData(qrText);
  qr.make();
  
  const size = qr.getModuleCount();
  const noiseChars = ["░", "▒", "▓", "◘", "○", "●"];
  const qrPre = document.getElementById("qr-ascii");

  function initAnimations() {
    gsap.fromTo(".main-container", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }
    );

    gsap.fromTo("#qr-ascii",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        onComplete: () => {
          gsap.to("#qr-ascii", {
            duration: 3,
            scale: 1.02,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });
        }
      }
    );

    gsap.fromTo(".hint-btn",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, delay: 1, duration: 1, ease: "back.out(1.7)" }
    );
  }

  function getNoiseLevel() {
    const maxWidth = 1000;
    const minWidth = 600;
    let width = window.innerWidth;
    if (width >= maxWidth) return 0.3;
    if (width <= minWidth) return 0;
    return 0.3 * ((width - minWidth) / (maxWidth - minWidth));
  }

  function generateASCII(noiseLevel) {
    let ascii = "";
    const maxOffset = 20;
    for (let row = 0; row < size; row++) {
      let offset = Math.random() < noiseLevel ? Math.floor(Math.random() * maxOffset) : 0;
      ascii += " ".repeat(offset);
      
      for (let col = 0; col < size; col++) {
        let char = qr.isDark(row, col) ? "█" : " ";
        if (noiseLevel > 0 && Math.random() < noiseLevel) {
          char = noiseChars[Math.floor(Math.random() * noiseChars.length)];
        }
        ascii += char;
        if (noiseLevel > 0 && Math.random() < (noiseLevel * 0.8)) {
          ascii += (Math.random() < 0.5 ? " " : "  ");
        }
      }
      ascii += "\n";
    }
    return ascii;
  }

  function updateQRCodeDisplay() {
    const noiseLevel = getNoiseLevel();
    qrPre.textContent = generateASCII(noiseLevel);
    
    let desiredWidth = window.innerWidth * 0.4;
    desiredWidth = Math.max(desiredWidth, 600);
    
    const newFontSize = desiredWidth / size;
    qrPre.style.fontSize = newFontSize + "px";
    qrPre.style.lineHeight = newFontSize + "px";
  }

  function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  function handleMobile() {
    const overlay = document.getElementById("mobile-overlay");
    if (isMobile()) {
      overlay.style.display = "flex";
      gsap.fromTo(overlay, 
        { opacity: 0, scale: 0.8 },
        {
          duration: 1,
          opacity: 1,
          scale: 1,
          ease: "back.out(3)",
          onComplete: () => {
            gsap.to(".mobile-message", {
              duration: 0.5,
              scale: 1.1,
              repeat: 3,
              yoyo: true,
              ease: "power1.inOut"
            });
          }
        }
      );
      return true;
    }
    return false;
  }

  if (!handleMobile()) {
    updateQRCodeDisplay();
    initAnimations();


    let lastInnerWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      if (window.innerWidth !== lastInnerWidth) {
        lastInnerWidth = window.innerWidth;
        updateQRCodeDisplay();
      }
    });

    document.getElementById("hint-btn").addEventListener("click", function() {
      const hintDiv = document.getElementById("hint-text");
      if (hintDiv.style.display === "none" || hintDiv.style.display === "") {
        hintDiv.style.display = "block";
        hintDiv.textContent = "É como ver no celular...";
        gsap.fromTo(hintDiv, 
          { opacity: 0, y: 10 },
          { duration: 0.5, opacity: 1, y: 0 }
        );
      } else {
        gsap.to(hintDiv, {
          duration: 0.5,
          opacity: 0,
          y: 10,
          onComplete: () => {
            hintDiv.style.display = "none";
          }
        });
      }
    });

    setInterval(() => {
      fetch('http://192.168.18.32:3000/api/qrstatus')
        .then(response => response.json())
        .then(data => {
          if (data.scanned) {
            localStorage.setItem("phase2Complete", "true");
            window.location.href = "phases.html";
          }
        });
    }, 3000);
  }
});
