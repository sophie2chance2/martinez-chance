const pageName = document.body.dataset.page || "home";

const SITE_PASSWORD = "mia";
const normalizePassword = (value) => value.trim().toLowerCase().replace(/\s+/g, "");
const siteUnlocked = localStorage.getItem("siteUnlocked") === "true";

function gateScreen() {
  return `<main class="password-gate">
    <form data-site-password>
      <p class="kicker">Sophie <em>&</em> Ubaldo</p>
      <h1>Enter password<br>Ingresen la contraseña</h1>
      <label for="site-password">Invitation password / Contraseña</label>
      <input id="site-password" name="password" type="password" autofocus required>
      <p class="form-error" data-site-password-error></p>
      <button class="primary-button" type="submit">Enter / Entrar</button>
    </form>
  </main>`;
}

const navigation = [
  ["story", "Our Story"],
  ["schedule", "Schedule"],
  ["travel", "Travel"],
  ["stay", "Stay"],
  ["things-to-do", "Things to Do"],
  ["wedding-party", "Wedding Party"],
  ["attire", "Funky Formal"],
  ["registry", "Registry"],
  ["faq", "FAQ"]
];

const pages = {
  home: `
    <main id="main">
      <section class="hero" id="home">
        <div class="hero-art" aria-hidden="true">
          <div class="hero-art__sun"></div>
          <div class="hero-art__frame"><img class="hero-photo" src="/images/engagement/selected/hero.jpg" alt="Sophie and Ubaldo embracing in front of an Art Deco doorway"></div>
          <div class="hero-art__line"></div>
        </div>
        <div class="hero-copy">
          <p class="kicker reveal">San Diego, California</p>
          <h1 class="reveal"><span>Sophie</span><em>&</em><span>Ubaldo</span></h1>
          <div class="hero-details reveal"><p>April 3, 2027</p><p>The Lane</p></div>
          <a class="text-button reveal" href="/rsvp/">RSVP by January 1, 2027 <span>↗</span></a>
        </div>
      </section>
      <section class="welcome section-grid">
        <div class="section-number">01</div>
        <div class="welcome-copy reveal">
          <p class="kicker">You’re invited / Están invitados</p>
          <h2>Come ready to celebrate.</h2>
          <p class="translation">Vengan listos para celebrar.</p>
        </div>
        <div class="bilingual-copy reveal">
          <p>We can’t wait to bring our favorite people together for a weekend of good food, joyful music, and a very full dance floor.</p>
          <p>Estamos felices de reunir a nuestra gente favorita para un fin de semana de buena comida, música alegre y una pista de baile muy llena.</p>
        </div>
      </section>
      <section class="page-directory">
        ${navigation.map(([slug, label], index) => `<a class="directory-link reveal" href="/${slug}/"><span>${String(index + 2).padStart(2, "0")}</span><strong>${label}</strong><i>↗</i></a>`).join("")}
      </section>
      ${closing()}
    </main>`,

  story: page("02", "Our Story / Nuestra Historia", "A few chapters<br>before forever.", `
    <div class="timeline">
      ${timelineCard("01", "Childhood photo", "Two beginnings", "Our stories start here. More soon.", "Nuestras historias comienzan aquí. Más información pronto.", "tone-stone")}
      ${timelineCard("02", "Early days", "The day we met", "A chapter we’ll fill in together.", "Un capítulo que completaremos juntos.", "tone-green")}
      ${timelineCard("03", "Candid photo", "Life, lately", "Trips, ordinary Tuesdays, and Mia.", "Viajes, martes cotidianos y Mia.", "tone-cement")}
      ${timelineCard("04", "Engagement photo", "We said yes", "September 27, 2025.", "27 de septiembre de 2025.", "tone-warm")}
    </div>`, "section-dark"),

  schedule: page("03", "The Weekend / El Fin de Semana", "Three days.<br>One very good time.", `
    <div class="event-list">
      ${event("Friday / Viernes", "Welcome Drinks", "6:00 PM · Location coming soon", "Bebidas de bienvenida · Lugar por confirmar", "04.02")}
      ${event("Saturday / Sábado", "Ceremony & Reception", "Guests arrive at 4:00 PM · The Lane", "Llegada de invitados a las 4:00 PM · The Lane", "04.03")}
      ${event("Sunday / Domingo", "Brunch", "11:00 AM · Location coming soon", "Brunch a las 11:00 AM · Lugar por confirmar", "04.04")}
    </div>
    <p class="private-note reveal">Welcome drinks and brunch details will appear for invited guests during RSVP.<br><span>Los detalles aparecerán para los invitados correspondientes durante el RSVP.</span></p>`),

  travel: page("04", "Getting Here / Cómo Llegar", "Meet us by<br>the water.", `
    <div class="travel-cards">
      ${info("01", "Fly", "San Diego International Airport is about ten minutes from the hotel area.", "El Aeropuerto Internacional de San Diego está a unos diez minutos de los hoteles.")}
      ${info("02", "Arrive", "Rideshare and taxis are readily available. More transportation details are coming soon.", "Hay taxis y transporte por aplicación disponibles. Más detalles pronto.")}
      ${info("03", "Celebrate", "The ceremony, cocktail hour, and reception will all take place at The Lane.", "La ceremonia, el cóctel y la recepción serán en The Lane.")}
    </div>
    <div class="venue-inline reveal"><div class="placeholder-photo placeholder-photo--venue"><span>The Lane · San Diego</span></div></div>`, "section-cement"),

  stay: page("05", "Stay / Hospedaje", "Make a weekend<br>of it.", `
    <div class="hotel-list">
      ${hotel("A", "InterContinental<br>San Diego")}
      ${hotel("B", "Residence Inn<br>San Diego Downtown")}
    </div>`),

  "things-to-do": page("06", "Our San Diego / Nuestro San Diego", "A few places<br>we think you’ll love.", `
    <div class="place-grid">
      ${place("art-coffee", "Eat / Comer", "Our favorite dinner")}
      ${place("art-coast", "See / Ver", "A coastal afternoon")}
      ${place("art-drink", "Drink / Tomar", "One more round")}
    </div>`, "section-dark"),

  "wedding-party": page("07", "Wedding Party / Cortejo", "Our people.", `
    <p class="translation page-intro">Photos and introductions coming soon.<br>Fotos y presentaciones próximamente.</p>
    <div class="party-grid">
      <div class="party-column"><h3>Bridesmaids</h3><div class="portrait-grid" data-party="bridesmaids"></div></div>
      <div class="party-column"><h3>Groomsmen</h3><div class="portrait-grid" data-party="groomsmen"></div></div>
    </div>`),

  attire: page("08", "What to Wear / Qué Ponerse", "Funky<br>Formal.", `
    <div class="attire-copy reveal">
      <p>Bring the color. Wear something that feels like you—and feels ready for a very good dance floor.</p>
      <p>Traigan el color. Usen algo que se sienta auténtico y listo para una gran pista de baile.</p>
      <div class="attire-rule"><span>Please reserve white for the bride.</span><span>Por favor, reserven el blanco para la novia.</span></div>
    </div>
    <div class="outfit-strip">
      <div class="outfit outfit-1"><span>Color</span></div><div class="outfit outfit-2"><span>Texture</span></div>
      <div class="outfit outfit-3"><span>Print</span></div><div class="outfit outfit-4"><span>Personality</span></div>
    </div>`, "section-green"),

  registry: page("09", "Registry / Mesa de Regalos", "Your presence<br>is the present.", `
    <div class="bilingual-copy reveal page-intro">
      <p>We’re still putting the finishing touches on our registry. More soon.</p>
      <p>Aún estamos preparando nuestra mesa de regalos. Más información pronto.</p>
    </div>`, "registry"),

  faq: page("10", "Good to Know / Información Útil", "Questions,<br>answered.", `
    <div class="accordion">
      ${faq("Can I bring a plus-one?", "Plus-ones are invited only when named on your invitation.", "Los acompañantes están invitados únicamente cuando aparecen en la invitación.")}
      ${faq("Are children invited?", "We are selectively inviting children. Your RSVP will show every invited member of your household.", "Algunos niños están invitados. El RSVP mostrará a cada persona invitada de su familia.")}
      ${faq("What is funky formal?", "Formal, expressive, and full of personality. Bring the color and leave white for the bride.", "Formal, expresivo y lleno de personalidad. Traigan el color y reserven el blanco para la novia.")}
      ${faq("When should I arrive?", "Please arrive at The Lane at 4:00 PM on Saturday, April 3.", "Por favor lleguen a The Lane a las 4:00 PM el sábado 3 de abril.")}
      ${faq("Can I update my RSVP?", "Yes. Return to RSVP, search your family name, and submit an updated response.", "Sí. Regresen al RSVP, busquen su apellido y envíen una respuesta actualizada.")}
    </div>`, "section-cement"),

  rsvp: `
    <main id="main" class="rsvp-page">
      <div class="rsvp-shell">
        <header>
          <p class="kicker">RSVP / Confirmar asistencia</p>
          <h1>We hope you’ll<br>join us.</h1>
          <p>Please respond by January 1, 2027.<br><span>Por favor respondan antes del 1 de enero de 2027.</span></p>
        </header>
        ${rsvpForms()}
      </div>
    </main>`
};

document.body.innerHTML = siteUnlocked ? `
  <a class="skip-link" href="#main">Skip to content</a>
  ${header()}
  ${pages[pageName] || pages.home}
  ${pageName === "rsvp" ? "" : footer()}
  ${easterEgg()}
` : gateScreen();

document.querySelector("[data-site-password]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = normalizePassword(new FormData(event.target).get("password") || "");
  if (value !== SITE_PASSWORD) {
    document.querySelector("[data-site-password-error]").textContent = "Please check the password on your invitation. / Revisen la contraseña de su invitación.";
    return;
  }
  localStorage.setItem("siteUnlocked", "true");
  location.reload();
});

function header() {
  return `<header class="site-header ${pageName === "home" ? "" : "page-header"}" data-header>
    <a class="wordmark" href="/" aria-label="Sophie and Ubaldo home">S <span>+</span> U</a>
    <button class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="site-nav"><span>Menu</span><i></i><i></i></button>
    <nav class="site-nav" id="site-nav" data-menu>
      ${navigation.map(([slug, label]) => `<a class="${pageName === slug ? "is-current" : ""}" href="/${slug}/">${label}</a>`).join("")}
      <a class="nav-rsvp ${pageName === "rsvp" ? "is-current" : ""}" href="/rsvp/">RSVP</a>
    </nav>
  </header>`;
}

function footer() {
  return `<footer><a href="mailto:us.martinez.chance@gmail.com">us.martinez.chance@gmail.com</a><p>Made with love in California.</p>
    <button class="mia-mark" data-easter-egg aria-label="A tiny hidden drawing of a Chihuahua"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 27 8 12l17 8M44 27l12-15-17 8M20 27c-3 5-4 12-1 18 3 7 9 11 13 11s10-4 13-11c3-6 2-13-1-18M24 34h.1M40 34h.1M28 43c2 2 6 2 8 0M32 39v4"/></svg></button></footer>`;
}

function closing() {
  return `<section class="closing"><p class="kicker reveal">See you in San Diego / Nos vemos en San Diego</p><h2 class="reveal">Sophie <em>&</em> Ubaldo</h2><a class="primary-button reveal" href="/rsvp/">RSVP / Confirmar asistencia</a><p class="closing-date">04 · 03 · 27</p></section>`;
}

function page(number, kicker, title, content, extra = "") {
  const pagePhotos = {
    "02": ["story.jpg", "Sophie and Ubaldo beneath purple flowering trees"],
    "03": ["schedule.jpg", "Sophie and Ubaldo posing beside a bright red city kiosk"],
    "04": ["travel.jpg", "Sophie and Ubaldo walking hand in hand across a city street"],
    "05": ["stay.jpg", "Sophie and Ubaldo together on architectural steps"],
    "06": ["things-to-do.jpg", "Sophie and Ubaldo sharing a playful restaurant moment"],
    "07": ["wedding-party.jpg", "An intimate portrait of Sophie and Ubaldo"],
    "08": ["attire.jpg", "A fashion-forward black and white portrait of Sophie and Ubaldo"],
    "09": ["registry.jpg", "Sophie and Ubaldo in a black and white architectural portrait"],
    "10": ["faq.jpg", "A close portrait of Sophie and Ubaldo smiling together"]
  };
  const photo = pagePhotos[number];
  return `<main id="main" class="inner-page ${extra}">
    <section class="page-masthead section-grid"><div class="section-number">${number}</div><div class="section-heading reveal"><p class="kicker">${kicker}</p><h1>${title}</h1></div></section>
    ${photo ? `<figure class="page-photo reveal"><img src="/images/engagement/selected/${photo[0]}" alt="${photo[1]}"></figure>` : ""}
    <section class="page-content section-grid"><div class="section-number"></div><div>${content}</div></section>
    ${closing()}</main>`;
}

function timelineCard(n, image, title, en, es, tone) {
  return `<article class="timeline-item reveal"><div class="timeline-year">${n}</div><div class="placeholder-photo placeholder-photo--story ${tone}"><span>${image}</span></div><div><h3>${title}</h3><p>${en}</p><p class="translation">${es}</p></div></article>`;
}
function event(day, title, en, es, date) { return `<article class="event reveal"><p class="event-day">${day}</p><div><h3>${title}</h3><p>${en}</p><p class="translation">${es}</p></div><span>${date}</span></article>`; }
function info(n, title, en, es) { return `<article class="info-card reveal"><span>${n}</span><h3>${title}</h3><p>${en}</p><p class="translation">${es}</p></article>`; }
function hotel(letter, name) { return `<article class="hotel reveal"><div class="hotel-index">${letter}</div><div><h3>${name}</h3><p>Downtown San Diego</p><p class="translation">Booking details coming soon.<br>Detalles de reservación próximamente.</p></div><button class="circle-link" disabled>↗</button></article>`; }
function place(art, type, title) { return `<article class="place-card reveal"><div class="place-art ${art}"></div><span>${type}</span><h3>${title}</h3><p>Recommendation coming soon.</p></article>`; }
function faq(question, en, es) { return `<details class="reveal"><summary>${question}<span>+</span></summary><div class="answer"><p>${en}</p><p>${es}</p></div></details>`; }
function easterEgg() { return `<div class="easter-egg" data-easter-panel aria-hidden="true"><button data-close-easter aria-label="Close Mexico City note">×</button><p class="kicker">Psst...</p><h2>Mexico City<br>is calling.</h2><p>A post-wedding buddymoon is quietly taking shape. More soon—for those who find their way here.</p><p class="translation">Un viaje con amigos después de la boda está tomando forma. Más información pronto.</p></div>`; }
function rsvpForms() {
  return `<div class="rsvp-form-area">
    <form class="rsvp-step is-active" data-rsvp-lookup><label for="guest-name">Guest name / Nombre del invitado</label><input id="guest-name" name="guestName" type="text" placeholder="First and last name" autocomplete="name" required><p class="form-note">Enter the name of anyone in your invited group.<br>Ingresen el nombre de cualquier persona de su grupo invitado.</p><p class="form-error" data-lookup-error></p><button class="primary-button" type="submit">Find invitation / Buscar invitación</button></form>
    <form class="rsvp-step" data-rsvp-response><div class="response-heading"><p class="kicker">Your household / Su familia</p></div><div data-guest-responses></div><label for="rsvp-email">Email for confirmation / Correo electrónico</label><input id="rsvp-email" name="email" type="email" required><label for="song-request">Song request / Canción que quieren escuchar</label><input id="song-request" name="songRequest" type="text"><button class="primary-button" type="submit">Send RSVP / Enviar RSVP</button></form>
    <div class="rsvp-step rsvp-success" data-rsvp-success><p class="kicker">Thank you / Gracias</p><h2>Your response<br>is in.</h2><p>We can’t wait to celebrate with you.<br><span>Estamos felices de celebrar con ustedes.</span></p><button class="text-button" data-edit-rsvp>Edit response / Editar respuesta</button></div>
  </div>`;
}
