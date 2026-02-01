document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");

    const onScrollHeader = () => {
        if (window.scrollY > 40) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
    };

    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add("is-visible");
                else entry.target.classList.remove("is-visible");
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();

            const headerH = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.pageYOffset - (headerH + 18);

            window.scrollTo({ top, behavior: "smooth" });
        });
    });

    const track = document.querySelector(".carousel-track");
    if (track) {
        const cards = Array.from(track.children);
        if (cards.length >= 3) {
            const visible = 3;
            const total = cards.length;

            const intervalTime = 2500;
            const transitionTime = 2;
            const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

            for (let i = 0; i < visible; i++) {
                track.appendChild(cards[i].cloneNode(true));
            }

            const allCards = Array.from(track.children);
            let index = 0;
            let isAnimating = false;

            const getStepWidth = () => {
                const cardWidth = allCards[0].getBoundingClientRect().width;
                const gap = parseFloat(getComputedStyle(track).gap) || 0;
                return cardWidth + gap;
            };

            const goNext = () => {
                if (isAnimating) return;
                isAnimating = true;

                index += visible;

                const step = getStepWidth();
                track.style.transition = `transform ${transitionTime}s ${easing}`;
                track.style.transform = `translateX(-${index * step}px)`;
            };

            track.addEventListener("transitionend", () => {
                if (index >= total) {
                    track.style.transition = "none";
                    index = 0;

                    const step = getStepWidth();
                    track.style.transform = `translateX(-${index * step}px)`;

                    track.offsetHeight;
                }
                isAnimating = false;
            });

            setInterval(goNext, intervalTime);

            window.addEventListener("resize", () => {
                const step = getStepWidth();
                track.style.transition = "none";
                track.style.transform = `translateX(-${index * step}px)`;
                track.offsetHeight;
            });
        }
    }
});
