const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "Our Clinic" },
  { href: "services.html", label: "Services" },
  { href: "doctors.html", label: "Doctors" },
  { href: "appointment.html", label: "Appointment" },
  { href: "contact.html", label: "Contact" },
];

const currentPage = location.pathname.split("/").pop() || "index.html";

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const links = NAV_LINKS.map(
    (l) => `<a href="${l.href}" class="${l.href === currentPage ? "active" : ""}">${l.label}</a>`
  ).join("");

  el.outerHTML = `
  <header class="header">
    <div class="container nav">
      <a href="index.html" class="logo">
        <span class="logo-icon"><i class="fa-solid fa-heart-pulse"></i></span>
        <span>MediCare<small>HEALTH CLINIC</small></span>
      </a>
      <nav class="nav-links" id="navLinks">${links}</nav>
      <div class="nav-actions">
        <a href="tel:+971500000000" class="nav-phone"><i class="fa-solid fa-phone"></i> +971 50 000 0000</a>
        <a href="appointment.html" class="btn btn-primary btn-sm">Book Appointment</a>
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.outerHTML = `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a href="index.html" class="logo">
          <span class="logo-icon"><i class="fa-solid fa-heart-pulse"></i></span>
          <span>MediCare<small style="color:#a9b5d1">HEALTH CLINIC</small></span>
        </a>
        <p>Delivering compassionate, high-quality healthcare for you and your family with experienced doctors and modern facilities.</p>
        <div class="socials">
          <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>${NAV_LINKS.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li><a href="services.html">General Checkup</a></li>
          <li><a href="services.html">Cardiology</a></li>
          <li><a href="services.html">Pediatrics</a></li>
          <li><a href="services.html">Dental Care</a></li>
          <li><a href="services.html">Laboratory Tests</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact Us</h4>
        <ul class="footer-contact">
          <li><i class="fa-solid fa-location-dot"></i> 123 Health Street, Dubai, UAE</li>
          <li><i class="fa-solid fa-phone"></i> +971 50 000 0000</li>
          <li><i class="fa-solid fa-envelope"></i> info@medicare.com</li>
          <li><i class="fa-solid fa-clock"></i> Mon - Sat: 8:00 AM - 9:00 PM</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom container">
      &copy; ${new Date().getFullYear()} MediCare Health Clinic. All rights reserved.
    </div>
  </footer>`;
}

function initMenu() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    toggle.innerHTML = links.classList.contains("open")
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
}

function initDoctorFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("[data-dept]");
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        card.style.display = filter === "all" || card.dataset.dept === filter ? "" : "none";
      });
    })
  );
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const group = field.closest(".form-group");
    let ok = field.value.trim() !== "";
    if (ok && field.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    if (ok && field.type === "tel") ok = /^[+\d\s-]{7,}$/.test(field.value);
    group.classList.toggle("error", !ok);
    if (!ok) valid = false;
  });
  return valid;
}

function initForms() {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const data = Object.fromEntries(new FormData(form));
      const key = `medicare_${form.dataset.form}`;
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      saved.push({ ...data, submittedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(saved));

      const success = form.querySelector(".form-success");
      success.classList.add("show");
      form.reset();
      setTimeout(() => success.classList.remove("show"), 6000);
    });

    form.querySelectorAll("input, select, textarea").forEach((field) =>
      field.addEventListener("input", () => field.closest(".form-group")?.classList.remove("error"))
    );
  });

  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  const params = new URLSearchParams(location.search);
  const doctorSelect = document.querySelector('select[name="doctor"]');
  if (doctorSelect && params.get("doctor")) doctorSelect.value = params.get("doctor");
}

renderHeader();
renderFooter();
initMenu();
initReveal();
initDoctorFilter();
initForms();
