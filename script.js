document.addEventListener("DOMContentLoaded", () => {
    const timeline = gsap.timeline();

    timeline
        .set(".balls-container", { visibility: "visible" })
        .to(".red", {
            x: "10%", 
            scale: 1.5, 
            duration: 0.8,
            ease: "power2.out"
        })
        .to(".blue", {
            x: "-10%", 
            scale: 1.5,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.8") 
        .to(".red", {
            x: "0%", 
            scale: 1,  
            duration: 0.5,
            ease: "power2.inOut"
        })
        .to(".blue", {
            x: "0%",
            scale: 1, 
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.5");

    timeline
        .fromTo(
            ".title",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.4"
        )
        .fromTo(
            ".play-btn",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.5"
        );

    document.getElementById("play-btn").addEventListener("click", () => {
        const ballsTimeline = gsap.timeline();

       
        ballsTimeline
            .to(".red", {
                x: "81%",  
                duration: 2,
                ease: "power2.out",
            })
            .to(".blue", {
                x: "-81%",  
                duration: 2,
                ease: "power2.out",
            }, "-=2")
            .to(".red, .blue", {
                scale: 1.2,
                duration: 0.8,
                backgroundColor: "#9b59b6",
                ease: "power2.out",
            })
            .to(".red, .blue", {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    showFusionBall();
                },
            })
            .to("#rising-image", {
                opacity: 1,
                y: -100,   
                duration: 0.5, 
                ease: "linear",
            });
    });

    function showFusionBall() {
        gsap.timeline()
            .to(".fusion-ball", {
                scale: 1.5,
                opacity: 1,
                duration: 1,
                ease: "elastic.out(1, 0.5)",
                onComplete: changeColorAndRedirect, 
            })
            .to(".fusion-ball", {
                scale: 0.5, 
                duration: 0.5,
                ease: "power2.out",
            })
            .to(".fusion-ball", {
                scale: 200, 
                duration: 1, 
                ease: "power2.inOut",
            });
    }

    function changeColorAndRedirect() {
        gsap.to(".fusion-ball", {
            backgroundColor: "#1e272e",
            duration: 2,
            onComplete: () => {
                window.location.href = "./phases.html";
            }
        });
    }
});
