const counters = document.querySelectorAll("[data-count]");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const sections = [...document.querySelectorAll("header[id], section[id]")];
const themeButtons = document.querySelectorAll(".theme-swatch");
const billingButtons = document.querySelectorAll("[data-billing]");
const prices = document.querySelectorAll("[data-price]");
const demoForm = document.querySelector("#demoForm");
const formNote = document.querySelector("#formNote");

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach((counter) => counterObserver.observe(counter));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute("id");
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-45% 0px -45% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

const themes = {
  teal: "#114b5f",
  indigo: "#4668ff",
  coral: "#f25f5c"
};

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    themeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.documentElement.style.setProperty("--theme-primary", themes[button.dataset.theme]);
  });
});

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    billingButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const annual = button.dataset.billing === "annual";

    prices.forEach((price) => {
      const monthly = Number(price.dataset.price);
      price.textContent = (annual ? Math.round(monthly * 10) : monthly).toLocaleString();
    });
  });
});

if (demoForm) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Demo brief captured locally.";
    demoForm.reset();
  });
}
