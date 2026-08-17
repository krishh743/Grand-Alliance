// ==============------- LENIS SETUP -----------================
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);




/* ============------------ SERVICES TAB GSAP ---------------================== */

document.addEventListener("DOMContentLoaded", () => {

    const tabItems = document.querySelectorAll(".tab-item");
    const tabPanels = document.querySelectorAll(".tab-panel");
    const indicator = document.querySelector(".tab-indicator");

    // Set indicator initial height to match first tab
    const firstTab = tabItems[0];
    gsap.set(indicator, {
        height: firstTab.offsetHeight,
        top: firstTab.offsetTop,
    });

    // Animate first panel in on load
    animatePanelIn(document.querySelector(".tab-panel.active"));

    tabItems.forEach((tab) => {
        tab.addEventListener("click", () => {

            const targetId = tab.dataset.tab;
            const activePanel = document.querySelector(".tab-panel.active");
            const targetPanel = document.querySelector(`.tab-panel[data-panel="${targetId}"]`);

            if (tab.classList.contains("active")) return;

            // Move indicator
            gsap.to(indicator, {
                top: tab.offsetTop,
                height: tab.offsetHeight,
                duration: 0.4,
                ease: "power3.inOut",
            });

            // Update active tab
            tabItems.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Animate out current panel
            gsap.to(activePanel, {
                opacity: 0,
                y: 16,
                duration: 0.25,
                ease: "power2.in",
                onComplete: () => {
                    activePanel.classList.remove("active");
                    gsap.set(activePanel, { y: 0 });

                    // Animate in new panel
                    targetPanel.classList.add("active");
                    animatePanelIn(targetPanel);
                }
            });
        });
    });

    function animatePanelIn(panel) {
        const heading = panel.querySelector(".panel-heading");
        const desc = panel.querySelector(".panel-desc");
        const items = panel.querySelectorAll(".panel-list li");
        const image = panel.querySelector(".panel-image");

        gsap.set(panel, { opacity: 0, y: 20 });
        gsap.set(image, { clipPath: "inset(0 100% 0 0)" });

        const tl = gsap.timeline();

        tl.to(panel, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
        })
        .from(heading, {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
        }, "-=0.2")
        .from(desc, {
            y: 16,
            opacity: 0,
            duration: 0.35,
            ease: "power3.out",
        }, "-=0.25")
        .from(items, {
            y: 12,
            opacity: 0,
            duration: 0.3,
            stagger: 0.06,
            ease: "power2.out",
        }, "-=0.2")
        .to(image, {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.6,
            ease: "power3.inOut",
        }, "-=0.4");
    }

    // ScrollTrigger — section fade in
    gsap.from(".services-header", {
        scrollTrigger: {
            trigger: ".services",
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
    });

    gsap.from(".services-tab-list", {
        scrollTrigger: {
            trigger: ".services-tabs-wrap",
            start: "top 80%",
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
    });

});


/* ============------------ INDUSTRIES MARQUEE GSAP ---------------================== */

function initMarquee() {

    const ltrTrack = document.querySelector(".track-ltr");
    const rtlTrack = document.querySelector(".track-rtl");

    // LTR — left to right
    const ltrTween = gsap.to(ltrTrack, {
        x: "-50%",
        duration: 28,
        ease: "none",
        repeat: -1,
    });

    // RTL — right to left (starts from -50% back to 0)
    gsap.set(rtlTrack, { x: "-50%" });
    const rtlTween = gsap.to(rtlTrack, {
        x: "0%",
        duration: 24,
        ease: "none",
        repeat: -1,
    });

    // Hover pause on each marquee-wrap
    document.querySelectorAll(".marquee-wrap").forEach((wrap, i) => {
        const tween = i === 0 ? ltrTween : rtlTween;

        wrap.addEventListener("mouseenter", () => {
            gsap.to(tween, { timeScale: 0, duration: 0.4, ease: "power2.out" });
        });

        wrap.addEventListener("mouseleave", () => {
            gsap.to(tween, { timeScale: 1, duration: 0.6, ease: "power2.inOut" });
        });
    });

    // ScrollTrigger — section header reveal
    gsap.from(".industries-header", {
        scrollTrigger: {
            trigger: ".industries",
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
    });

    // Marquee fade in on scroll
    gsap.from(".marquee-wrap", {
        scrollTrigger: {
            trigger: ".industries",
            start: "top 75%",
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
    });
}

initMarquee();





/* ============------------ WHY US HORIZONTAL SCROLL GSAP ---------------================== */

function initWhyUs() {

    const track = document.querySelector(".why-cards-track");
    const cards = document.querySelectorAll(".why-card");
    // const progressFill = document.querySelector(".why-us-progress-fill");
    // const progressCurrent = document.querySelector(".progress-current");
    const totalCards = cards.length;

    // Total scroll distance
    const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const rightPanel = document.querySelector(".why-us-right");
        return -(trackWidth - rightPanel.offsetWidth + 80);
    };

    // Pin + horizontal scroll
    const whyTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".why-us",
            start: "top top",
            end: () => `+=${Math.abs(getScrollAmount()) + 200}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            // onUpdate: (self) => {
                // Progress bar
                // const progress = self.progress;
                // progressFill.style.width = `${progress * 100}%`;

                // Current card number
                // const currentIndex = Math.min(
                //     Math.ceil(progress * totalCards) || 1,
                //     totalCards
                // );
                // progressCurrent.textContent = String(currentIndex).padStart(2, "0");
            // }
        }
    });

    whyTl.to(track, {
        x: getScrollAmount,
        ease: "none",
    });

    // Section header reveal
    gsap.from(".why-us-left > *", {
        scrollTrigger: {
            trigger: ".why-us",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
    });

    // Cards initial reveal — first few visible cards
    gsap.from(cards, {
        scrollTrigger: {
            trigger: ".why-us",
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
    });

}

initWhyUs();




/* ============------------ CONTACT + FOOTER GSAP ---------------================== */

function initContact() {

    // Left panel slide in
    gsap.from(".contact-left-content > *", {
        scrollTrigger: {
            trigger: ".contact",
            start: "top 75%",
        },
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
    });

    // Right form slide in
    gsap.from(".contact-form-wrap", {
        scrollTrigger: {
            trigger: ".contact",
            start: "top 75%",
        },
        x: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
    });

    // Form fields stagger
    gsap.from(".form-group", {
        scrollTrigger: {
            trigger: ".contact-form",
            start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
    });

    // Decorative GA text parallax
    gsap.to(".contact-deco-text", {
        scrollTrigger: {
            trigger: ".contact",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
        },
        y: -60,
        ease: "none",
    });

    // Footer reveal
    gsap.from(".footer-in > *", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
    });

}

initContact();



/* ============------------ CUSTOM JS ---------------================== */

function mobileMenu(){
    let menuBtn = document.getElementById("navMenu_btn");
    let mobileNavContainer = document.getElementById("mobileNav-container");
    let closeNavBtn = document.querySelectorAll(".closeNav");

    menuBtn.addEventListener('click', ()=>{
        menuBtn.classList.toggle("menuActive");
        mobileNavContainer.classList.toggle("mobileNavActive");
    })
    closeNavBtn.forEach((closeBtn)=>{
        closeBtn.addEventListener("click", ()=>{
            menuBtn.classList.remove("menuActive");
            mobileNavContainer.classList.remove("mobileNavActive");
        })
    })
    document.getElementById("bgFade").addEventListener("click", ()=>{
        menuBtn.classList.remove("menuActive");
        mobileNavContainer.classList.remove("mobileNavActive");
    })
}

mobileMenu();