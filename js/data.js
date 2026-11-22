/**
 * Datos estructurados de Club Leganés Club
 * Nota antispam: el correo NO se almacena en texto plano para evitar scrapers/bots.
 */
window.CLC_DATA = {
  club: {
    nombre: "Club Leganés Club",
    anioFundacion: 1994,
    telefono: "641 889 825",
    telefonoHref: "tel:+34641889825",
    whatsappHref:
      "https://wa.me/34641889825?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20horarios%20y%20plazas%20en%20Club%20Legan%C3%A9s%20Club.",
    direccionSede: "Avda. Alemania, 2 · 28915 Leganés, Madrid (Pabellón Europa)",
    // Códigos ASCII divididos (anti-scraping): solo se reconstruye tras clic humano
    contactUserCodes: [105, 110, 102, 111],
    contactHostCodes: [99, 108, 117, 98, 108, 101, 103, 97, 110, 101, 115, 99, 108, 117, 98, 46, 101, 115],
    // Pega aquí tu Access Key gratuita de Web3Forms (https://web3forms.com con info@clubleganesclub.es) para envío desde Render Static Site
    web3formsAccessKey: "",
    // Pega aquí tu Site Key gratuita de Cloudflare Turnstile al subir al hosting
    turnstileSiteKey: ""
  },

  actividades: [
    {
      id: "gimnasia-artistica",
      num: "01",
      destacada: true,
      nombre: "Gimnasia Artística y Trampolín",
      categoria: "gimnasia",
      etiqueta: "Gimnasia y Agua",
      imagen: "assets/img/act-gimnasia.jpg",
      alt: "Clases de Gimnasia Artística y Trampolín en Club Leganés Club",
      nivel: "Escuelas base y adultos",
      descripcion:
        "Disciplina fundacional del club desde 1994. Desarrolla fuerza, coordinación, agilidad, flexibilidad y acrobacia sobre aparatos y cama elástica con progresiones seguras guiadas por técnicos especializados.",
      detalle: "Grupos organizados por edad y nivel · Técnicas de base y perfeccionamiento."
    },
    {
      id: "pilates",
      num: "02",
      nombre: "Pilates",
      categoria: "cuerpo-mente",
      etiqueta: "Cuerpo y Mente",
      imagen: "assets/img/act-pilates.jpg",
      alt: "Sesión de Pilates en pabellón municipal de Leganés",
      nivel: "Iniciación y perfeccionamiento",
      descripcion:
        "Entrenamiento físico y mental centrado en el fortalecimiento del core, la estabilidad lumbar, la respiración y el control corporal. Ideal para cuidar la espalda y prevenir lesiones.",
      detalle: "Suelo y control postural · Atención directa al ritmo de cada alumno."
    },
    {
      id: "yoga",
      num: "03",
      nombre: "Yoga",
      categoria: "cuerpo-mente",
      etiqueta: "Cuerpo y Mente",
      imagen: "assets/img/act-yoga.jpg",
      alt: "Clase dirigida de Yoga en Club Leganés Club",
      nivel: "Todas las edades y niveles",
      descripcion:
        "Sesiones de una hora combinando calentamiento articular, asanas armonizadas con la respiración y relajación final para mejorar la movilidad, el equilibrio y el bienestar diario.",
      detalle: "Adaptable desde principiantes hasta practicantes con experiencia."
    },
    {
      id: "interval-fitness",
      num: "04",
      nombre: "Interval Fitness",
      categoria: "fitness",
      etiqueta: "Fitness y Cardio",
      imagen: "assets/img/act-interval.jpg",
      alt: "Entrenamiento de Interval Fitness en Leganés",
      nivel: "Intensidad adaptable",
      descripcion:
        "Entrenamiento metabólico y funcional por intervalos con movimientos naturales para mejorar la condición física, tonificar y elevar el gasto energético siempre supervisado.",
      detalle: "Clases dirigidas y supervisadas · Progresión adaptada."
    },
    {
      id: "spinning",
      num: "05",
      nombre: "Spinning / Ciclo Indoor",
      categoria: "fitness",
      etiqueta: "Fitness y Cardio",
      imagen: "assets/img/act-spinning.jpg",
      alt: "Clase de Spinning y Ciclo Indoor en Club Leganés Club",
      nivel: "Resistencia regulable",
      descripcion:
        "Ciclismo indoor al ritmo de la música para potenciar la capacidad cardiovascular, fortalecer el tren inferior y liberar estrés, ajustando la resistencia a tu nivel en cada sesión.",
      detalle: "Alto trabajo aeróbico con mínimo impacto articular."
    },
    {
      id: "aerobic",
      num: "06",
      nombre: "Aeróbic",
      categoria: "fitness",
      etiqueta: "Fitness y Cardio",
      imagen: "assets/img/act-aerobic.jpg",
      alt: "Clase grupal de Aeróbic en pabellón de Leganés",
      nivel: "Todos los niveles",
      descripcion:
        "Coreografías dinámicas y trabajo cardiovascular en grupo que mejoran la coordinación, la resistencia y la vitalidad en un ambiente cercano y motivador.",
      detalle: "Sesiones enérgicas y accesibles para disfrutar entrenando."
    },
    {
      id: "aquagym",
      num: "07",
      nombre: "Aquagym / Aquaerobic",
      categoria: "gimnasia",
      etiqueta: "Gimnasia y Agua",
      imagen: "assets/img/act-aquagym.jpg",
      alt: "Actividad de Aquagym y Aquaerobic en piscina municipal",
      nivel: "Bajo impacto articular",
      descripcion:
        "Acondicionamiento físico completo en el medio acuático que aprovecha la resistencia del agua para tonificar y mejorar el sistema cardiorrespiratorio protegiendo las articulaciones.",
      detalle: "Apto para todas las edades y excelente para recuperación activa."
    }
  ],

  pabellones: [
    {
      id: "europa",
      num: "01",
      nombre: "Pabellón Europa",
      zona: "El Carrascal · Sede principal",
      imagen: "assets/img/pab-europa.jpg",
      direccion: "Avda. Alemania, 2 · 28915 Leganés, Madrid",
      lineas: ["Bus 432", "Bus 481", "Bus L1"],
      telefonoPabellon: "912 489 517",
      coordinadora: "Yolanda García y Noelia Igareta",
      horarioLV: "09:00 – 23:00 h",
      horarioSD: "08:00 – 22:00 h",
      pdfUrl: "assets/docs/europa.pdf",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pabellon+Europa+Avda+Alemania+2+Leganes+Madrid"
    },
    {
      id: "blanca-ares",
      num: "02",
      nombre: "Pabellón Blanca Ares",
      zona: "Centro · Plaza Mayor",
      imagen: "assets/img/pab-blanca-ares.jpg",
      direccion: "Plaza Mayor, 17 · 28911 Leganés, Madrid",
      lineas: ["Bus 484", "Bus 485", "Bus 486", "MetroSur L12 · Renfe Leganés Central"],
      telefonoPabellon: "912 510 092",
      coordinadora: "Yolanda García y Noelia Igareta",
      horarioLV: "09:00 – 23:00 h",
      horarioSD: "08:00 – 22:00 h",
      pdfUrl: "assets/docs/pzmayor.pdf",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pabellon+Blanca+Ares+Plaza+Mayor+17+Leganes+Madrid"
    },
    {
      id: "fortuna",
      num: "03",
      nombre: "Pabellón La Fortuna",
      zona: "Barrio de La Fortuna",
      imagen: "assets/img/pab-fortuna.jpg",
      direccion: "C/ Castelo Branco, s/n · 28917 Leganés, Madrid",
      lineas: ["Bus L1", "Bus 483", "Bus 486", "Bus 487"],
      telefonoPabellon: "641 889 825 (Club)",
      coordinadora: "Yolanda García y Noelia Igareta",
      horarioLV: "09:00 – 23:00 h",
      horarioSD: "08:00 – 22:00 h",
      pdfUrl: "assets/docs/fortuna.pdf",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pabellon+La+Fortuna+Calle+Castelo+Branco+Leganes+Madrid"
    },
    {
      id: "olimpia",
      num: "04",
      nombre: "Pabellón Olimpia",
      zona: "Barrio de San Nicasio",
      imagen: "assets/img/pab-olimpia.jpg",
      direccion: "C/ del Cobre, 12 · 28914 Leganés, Madrid",
      lineas: ["Bus 482", "Bus 432", "Bus 480", "Bus 484"],
      telefonoPabellon: "641 889 825 (Club)",
      coordinadora: "Yolanda García y Noelia Igareta",
      horarioLV: "08:30 – 23:00 h",
      horarioSD: "08:00 – 22:00 h",
      pdfUrl: "assets/docs/olimpia.pdf",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pabellon+Olimpia+Calle+del+Cobre+12+Leganes+Madrid"
    }
  ],

  normativa: [
    {
      num: "01",
      titulo: "Acuerdo municipal y gestión del club",
      texto:
        "El Ayuntamiento de Leganés y el Club Leganés Club mantienen un acuerdo de cesión para la gestión de las actividades. Cualquier consulta o sugerencia debe dirigirse al profesor y/o coordinador del curso. La inscripción implica la aceptación de esta normativa."
    },
    {
      num: "02",
      titulo: "Inscripciones y formalización de plaza",
      texto:
        "El alumno/a se considerará inscrito con plaza confirmada una vez formalizado el pago en la mesa del Club Leganés Club situada en el hall del centro. Los pagos fuera de fecha mediante ingreso bancario requieren autorización previa del coordinador."
    },
    {
      num: "03",
      titulo: "Renovaciones y pagos bimensuales",
      texto:
        "Los pagos son bimensuales (excepto octubre, que es mensual). Las renovaciones se efectúan la tercera semana del mes previo al inicio, en horario de mañana y tarde en la mesa del centro. Fuera de plazo por banco requieren autorización y conllevan 1,5 € de gastos de gestión."
    },
    {
      num: "04",
      titulo: "Cambios de grupo",
      texto:
        "Quien desee cambiar de grupo o franja horaria deberá comunicarlo a su profesor o coordinador, cumplimentar la solicitud de cambio y esperar confirmación de disponibilidad de plaza."
    },
    {
      num: "05",
      titulo: "Bajas y devoluciones",
      texto:
        "Para tramitar la baja hay que comunicarlo al profesor y firmar el parte de baja (con efecto el día de la firma). No se devuelve el importe en metálico salvo causa justificada, pudiendo ceder la plaza o pedir abono. No abonar el bimestre en plazo supone la pérdida de la plaza."
    },
    {
      num: "06",
      titulo: "Asistencia, profesorado y calendario",
      texto:
        "Cada socio asiste al aula, días y horario reservados. Solo se recuperan sesiones suspendidas por el club o el Ayuntamiento. El calendario sigue el oficial del Ayuntamiento de Leganés (Navidad y Semana Santa), pudiendo el club ofrecer servicios mínimos adicionales."
    }
  ],

  equipo: [
    { cargo: "Presidente y socio fundador", nombre: "Jaime Castillejo" },
    { cargo: "Gestores del Club", nombre: "Francisco Liébana · Román Illescas" },
    { cargo: "Coordinadora de pabellones", nombre: "Yolanda García" },
    { cargo: "Coordinadora de pabellones", nombre: "Noelia Igareta" }
  ]
};
