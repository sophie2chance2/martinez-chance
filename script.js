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

function renderParty(selector, label) {
  const container = $(selector);
  if (!container) return;
  container.innerHTML = Array.from({ length: 10 }, (_, index) => `
    <article class="portrait reveal">
      <div class="portrait-art" aria-hidden="true"></div>
      <strong>${label} ${String(index + 1).padStart(2, "0")}</strong>
      <span>Introduction coming soon</span>
    </article>
  `).join("");
  $$(".reveal", container).forEach((element) => revealObserver.observe(element));
}
renderParty('[data-party="bridesmaids"]', "Bridesmaid");
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

const passwordForm = $("[data-rsvp-password]");
const lookupForm = $("[data-rsvp-lookup]");
const responseForm = $("[data-rsvp-response]");
const steps = $$(".rsvp-step");
let rsvpPassword = "";
let activeHousehold = null;

function showStep(selector) {
  steps.forEach((step) => step.classList.toggle("is-active", step.matches(selector)));
}

passwordForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = new FormData(passwordForm).get("password").trim();
  if (value.toLowerCase() !== "mia") {
    $("[data-password-error]").textContent = "Please check the password on your invitation. / Revisen la contraseña de su invitación.";
    return;
  }
  rsvpPassword = value;
  $("[data-password-error]").textContent = "";
  showStep("[data-rsvp-lookup]");
  $("#guest-name")?.focus();
});

lookupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const guestName = new FormData(lookupForm).get("guestName").trim();
  const error = $("[data-lookup-error]");
  error.textContent = "";
  try {
    const apiResponse = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lookup", password: rsvpPassword, guestName })
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
  $("[data-household-name]").textContent = household.household;
  $("[data-guest-responses]").innerHTML = household.guests.map((guest, index) => `
    <section class="guest-response" data-guest="${index}">
      <h4>${escapeHtml(guest.name)}</h4>
      <div class="guest-row">
        <label>Attendance / Asistencia
          <select name="attending-${index}" required><option value="">Select / Seleccionar</option><option value="Attending">Joyfully attending / Sí asistiré</option><option value="Declined">Unable to attend / No podré asistir</option></select>
        </label>
        <label>Meal / Comida
          <select name="meal-${index}"><option value="">Select / Seleccionar</option><option ${guest.mealType === "Carne" ? "selected" : ""}>Carne</option><option ${guest.mealType === "Pollo" ? "selected" : ""}>Pollo</option><option value="Fish" ${guest.mealType === "Fish" ? "selected" : ""}>Fish / Pescado</option><option value="Veggie" ${guest.mealType === "Veggie" ? "selected" : ""}>Veggie / Vegetariano</option></select>
        </label>
      </div>
      <label>Dietary needs / Necesidades alimentarias<input name="dietary-${index}" type="text"></label>
      <div class="event-checks">
        ${guest.welcomeDrinks ? `<label><input type="checkbox" name="welcome-${index}" checked> Welcome drinks</label>` : ""}
        ${guest.wedding ? `<label><input type="checkbox" name="wedding-${index}" checked> Wedding</label>` : ""}
        ${guest.brunch ? `<label><input type="checkbox" name="brunch-${index}" checked> Brunch</label>` : ""}
      </div>
    </section>`).join("");
}

responseForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(responseForm);
  const responses = activeHousehold.guests.map((guest, index) => ({
    household: activeHousehold.household,
    guestName: guest.name,
    attending: form.get(`attending-${index}`),
    meal: form.get(`meal-${index}`),
    dietary: form.get(`dietary-${index}`),
    welcomeDrinks: form.get(`welcome-${index}`) ? "Yes" : "No",
    wedding: form.get(`wedding-${index}`) ? "Yes" : "No",
    brunch: form.get(`brunch-${index}`) ? "Yes" : "No",
    songRequest: form.get("songRequest")
  }));
  const submission = { action: "submit", password: rsvpPassword, email: form.get("email"), responses };
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
