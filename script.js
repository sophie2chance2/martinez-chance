const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $("[data-menu-toggle]");
const menu = $("[data-menu]");
menuToggle?.addEventListener("click", () => {
  const open = !menu.classList.contains("is-open");
  menu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

$$(".site-nav a").forEach((item) => item.addEventListener("click", () => {
  menu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
$$(".reveal").forEach((element) => revealObserver.observe(element));

const BRIDESMAIDS = [
  { name: "Alexis", file: "Alexis.jpeg" },
  { name: "Cami", file: "Cami.jpeg" },
  { name: "Faith", file: "Faith.jpeg" },
  { name: "Landon", file: "Landon.jpeg" },
  { name: "Maddy", file: "Maddy.jpeg" },
  { name: "Madelyn", file: "Madelyn.jpeg" },
  { name: "Paris", file: "Paris.PNG" },
  { name: "Rachael", file: "Rachael.JPG" },
  { name: "Rocio", file: "Rocio.jpeg" },
  { name: "Setareh", file: "Setareh.jpg" },
];

function renderParty(selector, label, people) {
  const container = $(selector);
  if (!container) return;
  container.innerHTML = people
    ? people.map((person) => `
      <article class="portrait reveal">
        <div class="portrait-art portrait-art--photo"><img src="/images/bridesmaids/${person.file}" alt="${person.name}" loading="lazy"></div>
        <strong>${person.name}</strong>
      </article>
    `).join("")
    : Array.from({ length: 10 }, (_, index) => `
      <article class="portrait reveal">
        <div class="portrait-art" aria-hidden="true"></div>
        <strong>${label} ${String(index + 1).padStart(2, "0")}</strong>
        <span>Introduction coming soon</span>
      </article>
    `).join("");
  $$(".reveal", container).forEach((element) => revealObserver.observe(element));
}
renderParty('[data-party="bridesmaids"]', "Bridesmaid", BRIDESMAIDS);
renderParty('[data-party="groomsmen"]', "Groomsman");

const easterPanel = $("[data-easter-panel]");
$("[data-easter-egg]")?.addEventListener("click", () => {
  easterPanel.classList.add("is-open");
  easterPanel.setAttribute("aria-hidden", "false");
});
$("[data-close-easter]")?.addEventListener("click", () => {
  easterPanel.classList.remove("is-open");
  easterPanel.setAttribute("aria-hidden", "true");
});

const lookupForm = $("[data-rsvp-lookup]");
const responseForm = $("[data-rsvp-response]");
const steps = $$(".rsvp-step");
let activeHousehold = null;

function showStep(selector) {
  steps.forEach((step) => step.classList.toggle("is-active", step.matches(selector)));
}

lookupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const guestName = new FormData(lookupForm).get("guestName").trim();
  const error = $("[data-lookup-error]");
  error.textContent = "";
  try {
    const apiResponse = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lookup", guestName })
    });
    const payload = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(payload.error);
    if (!payload.households?.length) {
      error.textContent = "We couldn’t find that name. Please enter the first and last name exactly as listed on the invitation. / No encontramos ese nombre. Ingresen el nombre y apellido tal como aparecen en la invitación.";
      return;
    }
    activeHousehold = payload.households[0];
  } catch (apiError) {
    error.textContent = apiError.message || "We couldn’t connect to the guest list. Please try again.";
    return;
  }
  renderHousehold(activeHousehold);
  showStep("[data-rsvp-response]");
});

function renderHousehold(household) {
  $("[data-guest-responses]").innerHTML = household.guests.map((guest, index) => `
    <section class="guest-response" data-guest="${index}">
      <h4>${escapeHtml(guest.name)}</h4>
      <div class="guest-row">
        <label>Saturday · Wedding<br><span class="translation">Sábado · Boda</span>
          <select name="attending-${index}" required><option value="">Select / Seleccionar</option><option value="Attending">Joyfully attending / Sí asistiré</option><option value="Declined">Unable to attend / No podré asistir</option></select>
        </label>
        ${guest.welcomeDinnerInvited ? `<label>Friday · Welcome dinner<br><span class="translation">Viernes · Cena de bienvenida</span>
          <select name="welcome-${index}" required><option value="">Select / Seleccionar</option><option value="Attending">Joyfully attending / Sí asistiré</option><option value="Declined">Unable to attend / No podré asistir</option></select>
        </label>` : ""}
        ${guest.brunchInvited ? `<label>Sunday · Brunch<br><span class="translation">Domingo · Brunch</span>
          <select name="brunch-${index}" required><option value="">Select / Seleccionar</option><option value="Attending">Joyfully attending / Sí asistiré</option><option value="Declined">Unable to attend / No podré asistir</option></select>
        </label>` : ""}
      </div>
      <label>Dietary needs / Necesidades alimentarias<input name="dietary-${index}" type="text"></label>
      <label>Birthday (month &amp; day, optional) / Cumpleaños (mes y día, opcional)</label>
      <div class="guest-row birthday-row">
        <select name="birthday-month-${index}" aria-label="Birthday month / Mes de cumpleaños"><option value="">Month / Mes</option><option value="01">January / Enero</option><option value="02">February / Febrero</option><option value="03">March / Marzo</option><option value="04">April / Abril</option><option value="05">May / Mayo</option><option value="06">June / Junio</option><option value="07">July / Julio</option><option value="08">August / Agosto</option><option value="09">September / Septiembre</option><option value="10">October / Octubre</option><option value="11">November / Noviembre</option><option value="12">December / Diciembre</option></select>
        <input name="birthday-day-${index}" type="number" min="1" max="31" placeholder="Day / Día" aria-label="Birthday day / Día de cumpleaños">
      </div>
    </section>`).join("");
}

responseForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(responseForm);
  const responses = activeHousehold.guests.map((guest, index) => {
    const birthdayMonth = form.get(`birthday-month-${index}`);
    const birthdayDay = form.get(`birthday-day-${index}`);
    return {
      household: activeHousehold.household,
      guestName: guest.name,
      attending: form.get(`attending-${index}`),
      dietary: form.get(`dietary-${index}`),
      birthday: birthdayMonth && birthdayDay ? `${birthdayMonth}/${String(birthdayDay).padStart(2, "0")}` : "",
      welcomeDrinks: guest.welcomeDinnerInvited ? form.get(`welcome-${index}`) : "",
      wedding: form.get(`attending-${index}`),
      brunch: guest.brunchInvited ? form.get(`brunch-${index}`) : ""
    };
  });
  const submission = {
    action: "submit",
    email: form.get("email"),
    addressStreet: form.get("addressStreet"),
    addressCity: form.get("addressCity"),
    addressState: form.get("addressState"),
    addressZip: form.get("addressZip"),
    responses
  };
  try {
    const apiResponse = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submission) });
    if (!apiResponse.ok) throw new Error("Preview mode");
  } catch {
    localStorage.setItem(`rsvp-${activeHousehold.household.toLowerCase()}`, JSON.stringify(submission));
  }
  showStep("[data-rsvp-success]");
});

$("[data-edit-rsvp]")?.addEventListener("click", () => showStep("[data-rsvp-lookup]"));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}
