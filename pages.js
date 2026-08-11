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
  ["attire", "Attire"],
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
    <div class="story-chapters">
      ${storyChapter("01", "Before We Were Dating", "Antes de Ser Novios", "San Diego State University",
        "Long before it was a love story, it was just two names that kept turning up on the same rosters. Three-plus years of student government and executive boards, Camp Kesem, Dance Marathon, Rotaract, Associated Students, meant late nights on campus and no version of college life that didn't include the other one. We shared a fence on Dorothy Lane, a COVID pod, and a trip halfway around the world to the Middle East and Turkey. We even had a plan, half joke and half serious, to move to South America together after graduation. Just friends, we said. Just friends who couldn't stay out of each other's plans.",
        "Mucho antes de ser una historia de amor, éramos solo dos nombres que aparecían una y otra vez en las mismas listas. Más de tres años en gobierno estudiantil y juntas directivas, Camp Kesem, Dance Marathon, Rotaract, Associated Students, significaban noches largas en el campus y ninguna versión de la universidad que no incluyera al otro. Compartimos una cerca en Dorothy Lane, un pod de COVID y un viaje al otro lado del mundo, a Medio Oriente y Turquía. Incluso teníamos un plan, mitad broma y mitad en serio, de mudarnos juntos a Sudamérica después de graduarnos. Solo amigos, decíamos. Solo amigos que no podían mantenerse fuera de los planes del otro.",
        [
          ["stone", "Camp Kesem", "story/beforedating/Kesem.jpeg", "tall"],
          ["cement", "Rotaract", "story/beforedating/Rotaract.jpeg", "tall"],
          ["warm", "Associated Students", "story/beforedating/AssociatedStudents.jpeg", "portrait"],
          ["green", "Snow Days", "story/beforedating/snowdays.jpeg", "portrait"],
          ["cement", "The Middle East", "story/beforedating/MiddleEast.jpeg", "tall"],
          ["warm", "The SoCal Challenge", "story/beforedating/SoCalChallenge.jpeg", "portrait"],
          ["stone", "The COVID pod", "story/beforedating/CovidPod.jpeg", "tall"]
        ],
        "For three years, everyone could see it. It took us three years to catch up.",
        "Durante tres años, todos lo veían venir. A nosotros nos tomó tres años darnos cuenta."
      )}
      ${storyChapter("02", "The Trial Period", "El Período de Prueba", "Tulum → April 3, 2021",
        "Three years of “are you two together yet?” finally caught up with us on a trip to Tulum: twenty-some friends, one all-inclusive, and a newlywed discount that gave Ubaldo an idea. “What if we just got a marriage certificate?” he said. “We're not even dating,” I laughed. “Maybe we should try,” he said back. So we did: five days, no promises, friendship fully protected in case it all went wrong. It didn't. Three weeks later, on the very last day of the trip, Ubaldo asked me to be his girlfriend. Twelve days after that, we said I love you for the first time. That spring, we graduated from San Diego State together. Four months after Ubaldo asked, we were living in Mexico City, knowing no one in the whole city but each other.",
        "Tres años de “¿ustedes ya andan?” finalmente nos alcanzaron en un viaje a Tulum: más de veinte amigos, un todo incluido, y un descuento de recién casados que le dio una idea a Ubaldo. “¿Qué tal si sacamos un acta de matrimonio?”, dijo. “Ni siquiera estamos saliendo”, me reí. “Tal vez deberíamos intentarlo”, respondió. Así que lo hicimos: cinco días, sin promesas, con la amistad totalmente protegida por si todo salía mal. No salió mal. Tres semanas después, el último día del viaje, Ubaldo me pidió ser su novia. Doce días después, nos dijimos te amo por primera vez. Esa primavera, nos graduamos juntos de San Diego State. Cuatro meses después de que Ubaldo me lo pidiera, vivíamos en Ciudad de México, sin conocer a nadie más que el uno al otro.",
        [
          ["warm", "Tulum", "story/trial/Tulum.jpeg", "portrait"],
          ["green", "The trial", "story/trial/TrialDates.jpeg", "portrait"],
          ["warm", "I love you", "story/trial/ILoveYou.jpeg", "portrait"],
          ["stone", "Graduation", "story/trial/Graduation.jpeg", "portrait"]
        ],
        "Six years to the day, we chose that date again, this time to say “I do.”",
        "Seis años después, el mismo día exacto, elegimos esa fecha otra vez, esta vez para decir “sí, acepto.”"
      )}
      ${storyChapter("03", "Home Is Wherever", "El Hogar Es Donde Estemos", "Nine Months, Seven Countries",
        "We spent our first year of dating with no fixed address and no complaints. Mexico City was home base, but home also looked like Michoacán, meeting Ubaldo's family for the first time; Oaxaca, for a Thanksgiving that didn't need a table full of relatives to feel like one; and Sayulita, where the ocean did most of the talking. Then came Chile, Ecuador, Peru, Colombia, and Honduras (that last one with fifteen friends who somehow found their way into the story too) while we worked remotely from wherever we'd landed that week. Nine months later, we came back to Bird Rock, San Diego, and a month after that, Mia came home with us. Not long after, Sophie bought and renovated a condo in Mission Valley, the first place that was really, fully, just ours.",
        "Pasamos nuestro primer año de novios sin dirección fija y sin ninguna queja. Ciudad de México era nuestra base, pero el hogar también se veía como Michoacán, conociendo a la familia de Ubaldo por primera vez; Oaxaca, para un Día de Acción de Gracias que no necesitó una mesa llena de parientes para sentirse como tal; y Sayulita, donde el mar hablaba por nosotros. Después llegaron Chile, Ecuador, Perú, Colombia y Honduras (este último con quince amigos que de alguna manera también encontraron su lugar en la historia) mientras trabajábamos remotamente desde donde fuera que estuviéramos esa semana. Nueve meses después, regresamos a Bird Rock, San Diego, y un mes más tarde, Mia llegó a casa con nosotros. Poco después, Sophie compró y remodeló un condominio en Mission Valley, el primer lugar que fue de verdad, completamente, solo nuestro.",
        [
          ["green", "Mexico City", "story/travel/Mexico.jpeg", "portrait"],
          ["warm", "Michoacán", "story/travel/Michoacan.jpeg", "tall"],
          ["cement", "Sayulita", "story/travel/Sayulita.jpeg", "tall"],
          ["green", "Chile · Ecuador · Peru", "story/travel/Chile.jpeg", "portrait"],
          ["warm", "Colombia", "story/travel/Columbia.jpeg", "portrait"],
          ["green", "Mia", "story/travel/WelcomeMia.jpeg", "portrait"],
          ["warm", "Mission Valley", "story/travel/MissionValleyHome.jpeg", "portrait"]
        ],
        "Nine months, seven countries, one very good dog.",
        "Nueve meses, siete países y una perrita maravillosa."
      )}
      ${storyChapter("04", "To Today", "Hasta Hoy", "2023 – 2026",
        "Grad school brought hackathons and a new network across the Bay Area, which brought Sophie a job at a San Francisco AI startup, which brought us both back up the coast: closer to family, closer to work, closer, it turned out, to everything we didn't know was coming. On September 27, 2025, Ubaldo got down on one knee at the Palace of Fine Arts in San Francisco. Sixty of our favorite people were already there, hiding in plain sight, waiting to turn the moment into a party the second Sophie said yes. In May 2026, we bought a house in Walnut Creek, the kind of home you buy when you already know where the rest of your life is headed.",
        "La maestría trajo hackathons y una nueva red de contactos por toda el Área de la Bahía, lo que le trajo a Sophie un trabajo en una startup de IA en San Francisco, lo que nos trajo de regreso a la costa: más cerca de la familia, más cerca del trabajo, más cerca, resultó ser, de todo lo que no sabíamos que se aproximaba. El 27 de septiembre de 2025, Ubaldo se arrodilló en el Palace of Fine Arts en San Francisco. Sesenta de nuestras personas favoritas ya estaban ahí, escondidas a plena vista, esperando para convertir el momento en una fiesta en cuanto Sophie dijo que sí. En mayo de 2026, compramos una casa en Walnut Creek, el tipo de casa que compras cuando ya sabes hacia dónde va el resto de tu vida.",
        [
          ["stone", "Grad school", "story/today/graduation.jpeg", "tall"],
          ["warm", "Palace of Fine Arts", "story/today/Proposal.jpeg", "portrait"],
          ["green", "Walnut Creek", "story/today/WalnutCreekHome.jpeg", "portrait"]
        ],
        "And now, in Walnut Creek, for our next chapter, in our new home.",
        "Y ahora, en Walnut Creek, para nuestro próximo capítulo, en nuestro nuevo hogar."
      )}
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
    <div class="venue-inline reveal"><figure class="venue-photo"><img src="/images/venue/TheLane.webp" alt="The Lane, the wedding ceremony and reception venue in San Diego" loading="lazy"></figure></div>
    <div class="sub-heading reveal"><p class="kicker">Stay / Hospedaje</p><h2>Make a weekend<br>of it.</h2></div>
    <div class="hotel-list">
      ${hotel("A", "InterContinental<br>San Diego")}
      ${hotel("B", "Residence Inn<br>San Diego Downtown")}
    </div>
    `, "section-cement"),

  "wedding-party": page("05", "Wedding Party / Cortejo", "Our people.", `
    <p class="translation page-intro">Introductions coming soon.<br>Presentaciones próximamente.</p>
    <div class="party-grid">
      <div class="party-column"><h3>Bridesmaids</h3><div class="portrait-grid" data-party="bridesmaids"></div></div>
      <div class="party-column"><h3>Groomsmen</h3><div class="portrait-grid" data-party="groomsmen"></div></div>
    </div>`),

  attire: page("06", "What to Wear / Qué Ponerse", "Funky<br>Formal.", `
    <div class="attire-copy reveal">
      <p>Bring the color. Wear something that feels like you—and feels ready for a very good dance floor.</p>
      <p>Traigan el color. Usen algo que se sienta auténtico y listo para una gran pista de baile.</p>
      <div class="attire-rule"><span>Please reserve white for the bride.</span><span>Por favor, reserven el blanco para la novia.</span></div>
    </div>
    <div class="mood-board">
      ${moodPhoto("1.png", -3, "Lavender pleated ruffle gown")}
      ${moodPhoto("2.png", 2, "Coral tiered ruffle gown")}
      ${moodPhoto("3.png", -2, "Chartreuse feather-trimmed cape gown")}
      ${moodPhoto("4.png", 3, "Olive suit with floral embroidered cuffs")}
      ${moodPhoto("5.png", -1, "Light blue three-piece suit with patterned lining")}
      ${moodPhoto("6.png", 2, "Cream linen suit with a floral shirt")}
    </div>`, "section-green"),

  registry: page("07", "Registry / Mesa de Regalos", "Your presence<br>is the present.", `
    <div class="bilingual-copy reveal page-intro">
      <p>We’re still putting the finishing touches on our registry. More soon.</p>
      <p>Aún estamos preparando nuestra mesa de regalos. Más información pronto.</p>
    </div>`, "registry"),

  faq: page("08", "Good to Know / Información Útil", "Questions,<br>answered.", `
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
    "05": ["wedding-party.jpg", "An intimate portrait of Sophie and Ubaldo"],
    "06": ["attire.jpg", "A fashion-forward black and white portrait of Sophie and Ubaldo"],
    "07": ["registry.jpg", "Sophie and Ubaldo in a black and white architectural portrait"],
    "08": ["faq.jpg", "A close portrait of Sophie and Ubaldo smiling together"]
  };
  const photo = pagePhotos[number];
  return `<main id="main" class="inner-page ${extra}">
    <section class="page-masthead section-grid"><div class="section-number">${number}</div><div class="section-heading reveal"><p class="kicker">${kicker}</p><h1>${title}</h1></div></section>
    ${photo ? `<figure class="page-photo reveal"><img src="/images/engagement/selected/${photo[0]}" alt="${photo[1]}"></figure>` : ""}
    <section class="page-content section-grid"><div class="section-number"></div><div>${content}</div></section>
    ${closing()}</main>`;
}

function storyChapter(number, titleEn, titleEs, date, introEn, introEs, moments, noteEn, noteEs) {
  const sizePattern = ["tall", "normal", "normal", "wide", "normal", "tall", "normal", "wide", "normal", "normal"];
  return `<article class="story-chapter">
    <div class="story-chapter-head">
      <span class="story-chapter-number">${number}</span>
      <h2>${titleEn}</h2>
      <span class="story-chapter-date">${date}</span>
      <p class="story-chapter-es">${titleEs}</p>
    </div>
    <div class="bilingual-copy reveal story-chapter-intro">
      <p>${introEn}</p>
      <p class="translation">${introEs}</p>
    </div>
    <div class="story-moments">
      ${moments.map(([tone, caption, photo, size], i) => storyMoment(tone, caption, size || sizePattern[i % sizePattern.length], photo)).join("")}
    </div>
    <p class="story-note reveal">${noteEn}<span class="translation">${noteEs}</span></p>
  </article>`;
}
function storyMoment(tone, caption, size, photo) {
  const media = photo
    ? `<figure class="story-photo"><img src="/images/${photo}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption></figure>`
    : `<div class="placeholder-photo tone-${tone}"><span>${caption}</span></div>`;
  return `<div class="story-moment story-moment--${size} reveal">${media}</div>`;
}
function event(day, title, en, es, date) { return `<article class="event reveal"><p class="event-day">${day}</p><div><h3>${title}</h3><p>${en}</p><p class="translation">${es}</p></div><span>${date}</span></article>`; }
function info(n, title, en, es) { return `<article class="info-card reveal"><span>${n}</span><h3>${title}</h3><p>${en}</p><p class="translation">${es}</p></article>`; }
function hotel(letter, name) { return `<article class="hotel reveal"><div class="hotel-index">${letter}</div><div><h3>${name}</h3><p>Downtown San Diego</p><p class="translation">Booking details coming soon.<br>Detalles de reservación próximamente.</p></div><button class="circle-link" disabled>↗</button></article>`; }
function place(art, type, title) { return `<article class="place-card reveal"><div class="place-art ${art}"></div><span>${type}</span><h3>${title}</h3><p>Recommendation coming soon.</p></article>`; }
function moodPhoto(file, rotation, alt) { return `<figure class="mood-photo reveal" style="--rotate:${rotation}deg"><img src="/images/attire/${file}" alt="${alt}" loading="lazy"></figure>`; }
function faq(question, en, es) { return `<details class="reveal"><summary>${question}<span>+</span></summary><div class="answer"><p>${en}</p><p>${es}</p></div></details>`; }
function easterEgg() { return `<div class="easter-egg" data-easter-panel aria-hidden="true"><button data-close-easter aria-label="Close Mexico City note">×</button><p class="kicker">Psst...</p><h2>Mexico City<br>is calling.</h2><p>A post-wedding buddymoon is quietly taking shape. More soon—for those who find their way here.</p><p class="translation">Un viaje con amigos después de la boda está tomando forma. Más información pronto.</p></div>`; }
function rsvpForms() {
  return `<div class="rsvp-form-area">
    <form class="rsvp-step is-active" data-rsvp-lookup><label for="guest-name">Guest name / Nombre del invitado</label><input id="guest-name" name="guestName" type="text" placeholder="First and last name" autocomplete="name" required><p class="form-note">Enter the name of anyone in your invited group.<br>Ingresen el nombre de cualquier persona de su grupo invitado.</p><p class="form-error" data-lookup-error></p><button class="primary-button" type="submit">Find invitation / Buscar invitación</button></form>
    <form class="rsvp-step" data-rsvp-response><div class="response-heading"><p class="kicker">Your household / Su familia</p></div><div data-guest-responses></div><label for="rsvp-email">Email for confirmation / Correo electrónico</label><input id="rsvp-email" name="email" type="email" required><label for="song-request">Song request / Canción que quieren escuchar</label><input id="song-request" name="songRequest" type="text"><button class="primary-button" type="submit">Send RSVP / Enviar RSVP</button></form>
    <div class="rsvp-step rsvp-success" data-rsvp-success><p class="kicker">Thank you / Gracias</p><h2>Your response<br>is in.</h2><p>We can’t wait to celebrate with you.<br><span>Estamos felices de celebrar con ustedes.</span></p><button class="text-button" data-edit-rsvp>Edit response / Editar respuesta</button></div>
  </div>`;
}
