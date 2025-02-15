document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÌÒÙÂÊÎÔÛÃÕÇ0123456789@#$%&*';
    const title = document.querySelector('.hacker-title');
    const text = document.querySelector('.hacker-text');
    const continueBtn = document.querySelector('.continue-btn');
    if (!title || !continueBtn) return;
  
    function scrambleText(element) {
      const originalText = element.dataset.text || "";
      if (!originalText) {
        element.textContent = "";
        return Promise.resolve();
      }
      let currentText = originalText.split('');
      let count = 0;
      return new Promise(resolve => {
        const interval = setInterval(() => {
          element.textContent = currentText
            .map((char, index) =>
              index < count
                ? originalText[index]
                : chars[Math.floor(Math.random() * chars.length)]
            )
            .join('');
          if (count >= originalText.length) {
            clearInterval(interval);
            element.textContent = originalText;
            resolve();
          }
          count += 1/3;
        }, 10);
      });
    }
  
    async function initAnimations() {
      gsap.to('.phase1-container', { duration: 1, opacity: 1, y: 0, ease: 'power4.out' });
      await scrambleText(title);
      await scrambleText(text);
      gsap.to(continueBtn, {
        duration: 1,
        opacity: 1,
        y: -20,
        color: '#fff',
        ease: 'power4.out'
      });
    }
  
    continueBtn.addEventListener('click', () => {
      gsap.to(['.hacker-content', '.continue-btn'], {
        duration: 0.8,
        opacity: 0,
        onComplete: showPasswordScreen
      });
    });
  
    function showPasswordScreen() {
      app.innerHTML = `
        <div class="password-wrapper">
          <div class="password-container">
            <h2>Está na hora de começar</h2>
            <p>Digite a senha:</p>
            <div class="input-container">
              <input type="text" id="password-input" maxlength="4" readonly>
              <button class="delete-btn" title="Apagar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0f0" viewBox="0 0 24 24">
                  <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5c-.1.8-.8 1.5-1.6 1.5H8.1c-.8 0-1.5-.7-1.6-1.5L5 9zm5 2v8h2v-8H10zm4 0v8h2v-8h-2zM9 4V2h6v2h5v2H4V4h5z"/>
                </svg>
              </button>
            </div>
            <!-- Samuel BIXA -->
            <div class="num-grid">
              ${["1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "0", "-"]
                .map(item => `<button class="num-btn">${item}</button>`)
                .join('')}
            </div>
            <button class="submit-btn">Enviar</button>
            <p class="password-hint">A senha é: "agora"</p>
          </div>
        </div>
      `;
  
      const passwordInput = document.getElementById('password-input');
      const numButtons = document.querySelectorAll('.num-btn');
      const deleteBtn = document.querySelector('.delete-btn');
      const submitBtn = document.querySelector('.submit-btn');
      if (!passwordInput || !numButtons || !deleteBtn || !submitBtn) return;
  
      function generatePassword() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}${minutes}`;
      }
  
      let senhaCorreta = generatePassword();
      setInterval(() => {
        senhaCorreta = generatePassword();
      }, 5000);
  
      numButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.textContent.trim() === "-") return;
          if (passwordInput.value.length < 4) {
            passwordInput.value += btn.textContent;
            gsap.fromTo(passwordInput, { scale: 1.1 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
          }
        });
      });
  
      deleteBtn.addEventListener('click', () => {
        passwordInput.value = passwordInput.value.slice(0, -1);
        gsap.fromTo(passwordInput, { scale: 0.9 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
  
      submitBtn.addEventListener('click', () => {
        if (passwordInput.value !== senhaCorreta) {
          const tl = gsap.timeline();
          tl.to('.password-container', { 
            x: 10, duration: 0.05, ease: "power1.inOut", repeat: 5, yoyo: true 
          })
            .to('.password-container', { 
              backgroundColor: "#f00", duration: 0.2, ease: "power1.inOut" 
            })
            .to('.password-container', { 
              x: 0, duration: 0.3, backgroundColor: "#1a1a1a", ease: "power1.inOut",
              onComplete: () => {
                gsap.set('.password-container', { clearProps: "transform,backgroundColor" });
              }
            });
          new Audio("./audio/error.mp3").play();
        } else {
          new Audio("./audio/correct.mp3").play();
          showCryptoChallenge();
        }
      });
  
      gsap.from('.password-wrapper', { duration: 1, opacity: 0, y: 50, ease: 'power4.out' });
      gsap.from('.num-btn, .delete-btn, .submit-btn', { duration: 0.5, opacity: 0, scale: 0.8, stagger: 0.1, ease: 'back.out(1.7)' });
    }
  
    function showCryptoChallenge() {
      const challenges = generateCryptoChallenges();
      const passwordWrapper = document.querySelector('.password-wrapper');
      passwordWrapper.innerHTML = `
        <!-- Timer centralizado no topo -->
        <div id="timer">60</div>
        <div class="crypto-section">
          ${challenges.map((challenge, index) => `
            <div class="crypto-block">
              <!-- Botão de dica em formato de ícone de interrogação -->
              <button class="hint-btn" data-index="${index}">?</button>
              <div class="crypto-box">
                <div class="crypto-text">${challenge.encrypted}</div>
                <input type="text" class="crypto-input" data-index="${index}">
                <button class="submit-crypto-btn" data-index="${index}">Validar</button>
              </div>
            </div>
          `).join('')}
        </div>
        <!-- Caixa para a senha final -->
        <div class="final-overlay">
          <div class="final-box">
            <h2>Digite a Senha Final</h2>
            <input type="text" id="final-password">
            <button id="confirm-final-btn">Confirmar</button>
          </div>
        </div>
      `;
  
      startCryptoTimer();
  
      const cryptoInputs = document.querySelectorAll('.crypto-input');
      const cryptoButtons = document.querySelectorAll('.submit-crypto-btn');
      const hintButtons = document.querySelectorAll('.hint-btn');
      const finalPasswordInput = document.getElementById('final-password');
      const confirmFinalBtn = document.getElementById('confirm-final-btn');
      let answers = new Array(4).fill('');
  
      hintButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.dataset.index;
          const challenge = challenges[index];
          const hintText = document.createElement('span');
          hintText.textContent = `Desafio ${parseInt(index) + 1}: ${challenge.type}`;
          hintText.style.fontSize = '1em';
          hintText.style.color = '#0f0';
          btn.parentNode.insertBefore(hintText, btn);
          btn.remove();
        });
      });
  
      cryptoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.dataset.index;
          const input = cryptoInputs[index];
          const block = btn.closest('.crypto-block');
          const challenge = challenges[index];
          let userAnswer = input.value.trim().toUpperCase();
  
          if (challenge.type === "Binário") {
            try {
              const correctAnswer = String.fromCharCode(parseInt(challenge.encrypted, 2));
              if (userAnswer === correctAnswer.toUpperCase()) {
                gsap.to(block, { duration: 0.3, backgroundColor: "#0f03" });
                input.disabled = true;
                btn.disabled = true;
                answers[index] = correctAnswer;
                checkProgress();
                return;
              }
            } catch {
              userAnswer = 'INVALID';
            }
          }
  
          if (userAnswer === challenge.answer.toUpperCase()) {
            gsap.to(block, { duration: 0.3, backgroundColor: "#0f03" });
            input.disabled = true;
            btn.disabled = true;
            answers[index] = challenge.answer;
            checkProgress();
          } else {
            const tl = gsap.timeline();
            tl.to(block, { 
              x: 10, duration: 0.05, ease: "power1.inOut", repeat: 5, yoyo: true 
            })
              .to(block, { 
                backgroundColor: "#f003", duration: 0.2, ease: "power1.inOut" 
              })
              .to(block, { 
                x: 0, duration: 0.3, backgroundColor: "#1e1e1e", ease: "power1.inOut",
                onComplete: () => {
                  gsap.set(block, { clearProps: "transform,backgroundColor" });
                }
              });
          }
        });
      });
  
      confirmFinalBtn.addEventListener('click', () => {
        const userFinal = finalPasswordInput.value.trim();
        const finalAnswer = answers.join('');
        if (userFinal === finalAnswer) {
          localStorage.setItem('phase1Complete', 'true');
          gsap.to('.final-box', {
            backgroundColor: '#0f0',
            color: '#000',
            duration: 0.5,
            onComplete: () => {
              window.location.href = 'phases.html';
            }
          });
        } else {
          const tl = gsap.timeline();
          tl.to('#final-password', { 
            x: 10, duration: 0.05, ease: "power1.inOut", repeat: 3, yoyo: true 
          })
            .to('#final-password', { 
              x: 0, duration: 0.3, backgroundColor: "#222", ease: "power1.inOut",
              onComplete: () => {
                gsap.set('#final-password', { clearProps: "transform,backgroundColor" });
              }
            });
        }
      });
  
      gsap.to('.crypto-section', { duration: 0.8, opacity: 1, y: 0, ease: 'power4.out' });
  
      function checkProgress() {
        const solved = document.querySelectorAll('.submit-crypto-btn:disabled').length === 4;
        if (solved) {
          const finalOverlay = document.querySelector('.final-overlay');
          finalOverlay.style.display = 'block';
          gsap.from(finalOverlay, { opacity: 0, y: -50, duration: 0.8, ease: 'power4.out' });
        }
      }
  
      function startCryptoTimer() {
        let timerSeconds = 60;
        const existingTimer = document.getElementById('timer');
        if (existingTimer) existingTimer.remove();
  
        const timerElement = document.createElement('div');
        timerElement.id = 'timer';
        timerElement.textContent = timerSeconds;
        document.body.appendChild(timerElement);
  
        const timerInterval = setInterval(() => {
          timerSeconds--;
          timerElement.textContent = timerSeconds;
          if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            resetCryptoChallenge();
          }
        }, 1000);
      }
  
      function resetCryptoChallenge() {
        const timerEl = document.getElementById('timer');
        if (timerEl) timerEl.remove();
        showCryptoChallenge();
      }
    }
  
    function generateCryptoChallenges() {
      const generateRandomChar = () => {
        const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return pool.charAt(Math.floor(Math.random() * pool.length));
      };
  
      const r1 = generateRandomChar();
      const r2 = generateRandomChar();
      const r3 = generateRandomChar();
      const r4 = generateRandomChar();
  
      return [
        {
          title: "Código #1 (SHA256)",
          type: "SHA256",
          encrypted: CryptoJS.SHA256(r1).toString(),
          answer: r1
        },
        {
          title: "Código #2 (MD5)",
          type: "MD5",
          encrypted: CryptoJS.MD5(r2).toString(),
          answer: r2
        },
        {
          title: "Código #3 (Rabbit)",
          type: "Rabbit",
          encrypted: r3.split('').reverse().join(''),
          answer: r3
        },
        {
          title: "Código #4 (Binário)",
          type: "Binário",
          encrypted: r4.charCodeAt(0).toString(2).padStart(8, '0'),
          answer: r4
        }
      ];
    }
  
    setTimeout(initAnimations, 1000);
  });
  