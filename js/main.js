/**
 * Interacción y protección antispam silenciosa — Club Leganés Club
 */
(function () {
  const data = window.CLC_DATA;
  if (!data) return;

  // 1. Reconstrucción del correo solo tras clic humano (sin mailto en HTML)
  function buildProtectedEmail() {
    const user = String.fromCharCode(...data.club.contactUserCodes);
    const host = String.fromCharCode(...data.club.contactHostCodes);
    return `${user}@${host}`;
  }

  document.querySelectorAll('[data-reveal-email]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = buildProtectedEmail();
      const wrap = btn.parentElement;
      if (!wrap) return;
      const link = document.createElement('a');
      link.href = 'mai' + 'lto:' + email;
      link.className = 'revealed-email';
      link.textContent = email;
      wrap.replaceChild(link, btn);
    });
  });

  // 2. Renderizado de Actividades (7 disciplinas + tarjeta de orientación para cerrar 3x3 sin huecos)
  const activitiesGrid = document.getElementById('activities-grid');
  const filterButtons = document.querySelectorAll('.filter-tab');

  function renderActivities(categoria = 'todas') {
    if (!activitiesGrid) return;
    const filtered =
      categoria === 'todas'
        ? data.actividades
        : data.actividades.filter((item) => item.categoria === categoria);

    const cardsHtml = filtered
      .map(
        (act) => `
      <article class="card" data-category="${act.categoria}">
        <figure class="card-media">
          <img src="${act.imagen}" alt="${act.alt}" loading="lazy" width="600" height="375">
        </figure>
        <div class="card-body">
          <span class="card-cat">${act.etiqueta}</span>
          <h3>${act.nombre}</h3>
          <p class="card-level">${act.nivel}</p>
          <p class="card-desc">${act.descripcion}</p>
          <p class="card-detail">${act.detalle}</p>
          <a href="#contacto" class="card-link" data-select-activity="${act.nombre}">
            Consultar horarios y plazas <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </article>
    `
      )
      .join('');

    const extraCard =
      categoria === 'todas'
        ? `
      <aside class="card card--orientacion">
        <div class="card-body">
          <span class="card-cat" style="color: #9ed4f5;">Te ayudamos a elegir</span>
          <h3>¿No sabes qué grupo encaja mejor contigo?</h3>
          <p class="card-desc">Escríbenos y te indicamos los horarios con plaza libre en tu pabellón más cercano en Leganés.</p>
          <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem;">
            <a href="${data.club.whatsappHref}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
              Preguntar por WhatsApp
            </a>
            <a href="#pabellones" class="btn btn-light btn-sm">
              Ver PDFs por pabellón
            </a>
          </div>
        </div>
      </aside>
    `
        : '';

    activitiesGrid.innerHTML = cardsHtml + extraCard;

    activitiesGrid.querySelectorAll('[data-select-activity]').forEach((link) => {
      link.addEventListener('click', () => {
        const select = document.getElementById('actividad');
        const chosen = link.getAttribute('data-select-activity');
        if (select && chosen) {
          for (const opt of select.options) {
            if (opt.value === chosen) {
              select.value = chosen;
              break;
            }
          }
        }
      });
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      renderActivities(btn.dataset.filter || 'todas');
    });
  });

  // 3. Renderizado de los 4 Pabellones
  const venuesGrid = document.getElementById('venues-grid');
  function renderVenues() {
    if (!venuesGrid) return;
    venuesGrid.innerHTML = data.pabellones
      .map((pab) => {
        const chips = pab.lineas.map((l) => `<span class="transit-chip">${l}</span>`).join('');
        return `
      <article class="card">
        <figure class="venue-media">
          <img src="${pab.imagen}" alt="${pab.nombre} en Leganés" loading="lazy" width="640" height="360">
          <span class="venue-zone">${pab.zona}</span>
        </figure>
        <div class="venue-body">
          <h3>${pab.nombre}</h3>
          <p class="venue-address">${pab.direccion}</p>
          <ul class="venue-meta">
            <li><strong>Lunes a viernes:</strong> ${pab.horarioLV}</li>
            <li><strong>Fines de semana y festivos:</strong> ${pab.horarioSD}</li>
            <li><strong>Teléfono:</strong> ${pab.telefonoPabellon} · <strong>Coord.:</strong> ${pab.coordinadora}</li>
          </ul>
          <div class="transit-list">${chips}</div>
          <div class="venue-actions">
            <a href="${pab.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-blue btn-sm">
              Ver PDF actividades
            </a>
            <a href="${pab.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              Cómo llegar
            </a>
          </div>
        </div>
      </article>
    `;
      })
      .join('');
  }

  // 4. Normativa & Equipo
  const rulesList = document.getElementById('rules-list');
  if (rulesList && Array.isArray(data.normativa)) {
    rulesList.innerHTML = data.normativa
      .map(
        (item, idx) => `
      <details class="rule-row" ${idx === 0 ? 'open' : ''}>
        <summary>${item.titulo}</summary>
        <div class="rule-body"><p>${item.texto}</p></div>
      </details>
    `
      )
      .join('');
  }

  const teamGrid = document.getElementById('team-grid');
  if (teamGrid && Array.isArray(data.equipo)) {
    teamGrid.innerHTML = data.equipo
      .map(
        (m) => `
      <div class="team-card">
        <span class="team-role">${m.cargo}</span>
        <h4 class="team-name">${m.nombre}</h4>
      </div>
    `
      )
      .join('');
  }

  // 5. Selects del formulario
  const activitySelect = document.getElementById('actividad');
  if (activitySelect) {
    data.actividades.forEach((act) => {
      const opt = document.createElement('option');
      opt.value = act.nombre;
      opt.textContent = act.nombre;
      activitySelect.appendChild(opt);
    });
  }

  const venueSelect = document.getElementById('pabellon');
  if (venueSelect) {
    data.pabellones.forEach((pab) => {
      const opt = document.createElement('option');
      opt.value = pab.nombre;
      opt.textContent = pab.nombre;
      venueSelect.appendChild(opt);
    });
  }

  document.querySelectorAll('[data-select-motivo]').forEach((el) => {
    el.addEventListener('click', () => {
      const motivoSelect = document.getElementById('motivo');
      if (motivoSelect) {
        motivoSelect.value = el.getAttribute('data-select-motivo') || 'Consulta general';
      }
    });
  });

  // 6. Menú móvil
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 7. Formulario blindado silenciosamente contra spam (Honeypot + Time-Trap + Comprobación + Turnstile + api/contacto.php)
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const formLoadedInput = document.getElementById('form_loaded_at');
  const challengeLabel = document.getElementById('human-challenge-label');
  const challengeInput = document.getElementById('human-challenge');
  const turnstileBox = document.getElementById('turnstile-box');

  let expectedSum = 0;

  function initChallenge() {
    if (formLoadedInput) formLoadedInput.value = String(Date.now());
    const a = Math.floor(Math.random() * 6) + 2;
    const b = Math.floor(Math.random() * 5) + 1;
    expectedSum = a + b;
    if (challengeLabel) {
      challengeLabel.textContent = `Comprobación: ¿cuánto es ${a} + ${b}? *`;
    }
    if (challengeInput) challengeInput.value = '';
  }

  if (data.club.turnstileSiteKey && turnstileBox) {
    turnstileBox.innerHTML = `<div class="cf-turnstile" data-sitekey="${data.club.turnstileSiteKey}" data-theme="light"></div>`;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  initChallenge();

  function showFeedback(type, htmlMsg) {
    if (!formFeedback) return;
    formFeedback.innerHTML = htmlMsg;
    formFeedback.className = `form-feedback is-${type}`;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const hp1 = (contactForm.website_url?.value || '').trim();
      const hp2 = (contactForm.fax_number?.value || '').trim();
      if (hp1 !== '' || hp2 !== '') {
        showFeedback('success', 'Mensaje enviado correctamente.');
        contactForm.reset();
        initChallenge();
        return;
      }

      const loadedAt = Number(formLoadedInput?.value || 0);
      if (Date.now() - loadedAt < 3000) {
        showFeedback('error', 'Espera unos segundos antes de enviar el formulario.');
        return;
      }

      const userAnswer = Number((challengeInput?.value || '').trim());
      if (userAnswer !== expectedSum) {
        showFeedback('error', 'El resultado de la comprobación no es correcto. Inténtalo de nuevo.');
        initChallenge();
        return;
      }

      const payload = {
        nombre: contactForm.nombre.value.trim(),
        email: contactForm.email.value.trim(),
        telefono: contactForm.telefono.value.trim(),
        motivo: contactForm.motivo.value,
        actividad: contactForm.actividad.value,
        pabellon: contactForm.pabellon.value,
        mensaje: contactForm.mensaje.value.trim(),
        privacidad: contactForm.privacidad.checked,
        website_url: hp1,
        fax_number: hp2,
        form_loaded_at: loadedAt,
        cf_turnstile_response: contactForm.querySelector('[name="cf-turnstile-response"]')?.value || ''
      };

      if (payload.nombre.length < 3 || !payload.email.includes('@')) {
        showFeedback('error', 'Revisa tu nombre y correo electrónico.');
        return;
      }
      if (payload.mensaje.length < 6) {
        showFeedback('error', 'Escribe un mensaje breve con tu consulta.');
        return;
      }
      if (!payload.privacidad) {
        showFeedback('error', 'Debes aceptar la política de privacidad.');
        return;
      }

      const urlCount = (payload.mensaje.match(/(https?:\/\/|www\.)/gi) || []).length;
      if (urlCount >= 2) {
        showFeedback('error', 'El mensaje no puede incluir múltiples enlaces web.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      try {
        const isLocalStatic =
          location.protocol === 'file:' ||
          location.hostname === 'localhost' ||
          location.hostname === '127.0.0.1';
        const isRenderStatic = location.hostname.endsWith('.onrender.com');
        const web3Key = (data.club.web3formsAccessKey || '').trim();
        const waText = encodeURIComponent(
          `Hola, soy ${payload.nombre}. Motivo: ${payload.motivo}. Actividad: ${payload.actividad || 'Por definir'}. Pabellón: ${payload.pabellon || 'Por definir'}. ${payload.mensaje}`
        );

        if (web3Key !== '') {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              access_key: web3Key,
              subject: `[Web Club Leganés] ${payload.motivo} - ${payload.nombre}`,
              from_name: payload.nombre,
              replyto: payload.email,
              Nombre: payload.nombre,
              Email: payload.email,
              Teléfono: payload.telefono || 'No indicado',
              Motivo: payload.motivo,
              Actividad: payload.actividad || 'No especificada',
              Pabellón: payload.pabellon || 'No especificado',
              Mensaje: payload.mensaje
            })
          });
          const json = await res.json();
          if (res.ok && json.success) {
            showFeedback('success', '¡Mensaje enviado correctamente! Te responderemos lo antes posible.');
            contactForm.reset();
            initChallenge();
          } else {
            showFeedback(
              'error',
              `No se pudo enviar en este momento. Puedes escribirnos directamente por <a href="https://wa.me/34641889825?text=${waText}" target="_blank" rel="noopener noreferrer">WhatsApp (641 889 825)</a>.`
            );
          }
        } else if (!isLocalStatic && !isRenderStatic) {
          const res = await fetch('api/contacto.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const json = await res.json();
          if (res.ok && json.ok) {
            showFeedback('success', json.message);
            contactForm.reset();
            initChallenge();
          } else {
            showFeedback('error', json.message || 'No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.');
          }
        } else {
          showFeedback(
            'success',
            `¡Consulta lista! Envíanosla directamente en 1 clic por <a href="https://wa.me/34641889825?text=${waText}" target="_blank" rel="noopener noreferrer">WhatsApp al 641 889 825</a>.`
          );
          contactForm.reset();
          initChallenge();
        }
      } catch {
        showFeedback(
          'error',
          'No se pudo enviar en este momento. Puedes escribirnos por <a href="https://wa.me/34641889825" target="_blank" rel="noopener noreferrer">WhatsApp al 641 889 825</a>.'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar mensaje';
        }
      }
    });
  }

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  renderActivities('todas');
  renderVenues();
})();
