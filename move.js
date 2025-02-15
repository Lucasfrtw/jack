document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const pullSound = new Audio("Audio/cards.mp3");

    cards.forEach((card, index) => {
        card.addEventListener("click", (event) => {
            event.preventDefault();
            const link = card.querySelector(".card-link").getAttribute("href");
            pullSound.play();

            const timeline = gsap.timeline();
            
            timeline.to(card, {
                y: 0,
                duration: 0,
                ease: "none"
            });

            cards.forEach((otherCard, i) => {
                if (i > index) {
                    timeline.to(otherCard, {
                        y: 50 * (i - index),
                        duration: 0.3,
                        ease: "power2.out",
                        onStart: () => pullSound.play()
                    }, "+=0.1");
                }
            });

            timeline.to(card, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    window.location.href = link;
                }
            });
        });
    });
});