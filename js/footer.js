(() => {
  const footer = document.querySelector('[data-site-footer]');
  if (!footer) return;

  const iconPath = 'assets/svg/iconos/';
  const officialSite = 'https://enderezandocurvas.com/';
  const externalAttributes = 'target="_blank" rel="noopener noreferrer"';

  footer.classList.add('institutional-footer');
  footer.innerHTML = `
    <div class="institutional-footer__main">
      <section class="institutional-footer__identity" aria-labelledby="footerIdentityTitle">
        <a class="institutional-footer__logo" href="index.html" aria-label="Enderezando Curvas, ir al inicio">
          <img src="assets/svg/logo-ec-blanco.svg" alt="Enderezando Curvas">
        </a>
        <h2 class="sr-only" id="footerIdentityTitle">Enderezando Curvas</h2>
        <p>Trabajamos para impulsar el acceso a cirugías de escoliosis idiopática para niñas, niños y adolescentes en México.</p>
        <p class="institutional-footer__authorized"><img src="${iconPath}donataria-autorizada.svg" alt="" aria-hidden="true"> <span>Donataria autorizada · RFC ECU2401227J8</span></p>
        <a class="institutional-footer__donate" href="index.html#ayudar">Donar ahora</a>
      </section>

      <nav class="institutional-footer__column institutional-footer__useful" aria-labelledby="footerUsefulTitle">
        <h2><button class="institutional-footer__links-toggle" id="footerUsefulTitle" type="button" aria-expanded="true" aria-controls="footerUsefulLinks"><span>Enlaces útiles</span><img src="assets/svg/flecha.svg" alt="" aria-hidden="true"></button></h2>
        <ul id="footerUsefulLinks">
          <li><a href="${officialSite}#nosotros" ${externalAttributes}>Nosotros</a></li>
          <li><a href="${officialSite}#proceso" ${externalAttributes}>Cómo trabajamos</a></li>
          <li><a href="crecimiento.html">Nuestro impacto</a></li>
          <li><a href="crecimiento.html">Bosque de los sueños</a></li>
          <li><a href="${officialSite}#formulario" ${externalAttributes}>Postular un caso</a></li>
          <li><a href="empresas.html">Para empresas</a></li>
          <li><a href="${officialSite}#escoliosis" ${externalAttributes}>Preguntas frecuentes</a></li>
        </ul>
      </nav>

      <section class="institutional-footer__column institutional-footer__contact" aria-labelledby="footerContactTitle">
        <h2 id="footerContactTitle">Contacto</h2>
        <address>
          <a href="mailto:contacto@enderezandocurvas.com"><img src="${iconPath}Mail.svg" alt="" aria-hidden="true"><span>contacto@enderezandocurvas.com</span></a>
          <a href="tel:+525541846939"><img src="${iconPath}Llamar.svg" alt="" aria-hidden="true"><span>+52 55 4184 6939</span></a>
          <a href="https://www.google.com/maps/search/?api=1&amp;query=Homero+440%2C+int.+601%2C+Polanco+V+Secci%C3%B3n%2C+Miguel+Hidalgo%2C+Ciudad+de+M%C3%A9xico%2C+C.P.+11560" ${externalAttributes}><img src="${iconPath}ubicacion.svg" alt="" aria-hidden="true"><span>Homero 440, int. 601, Polanco V Sección, Miguel Hidalgo, Ciudad de México, C.P. 11560</span></a>
        </address>
        <div class="institutional-footer__social">
          <h3>Síguenos</h3>
          <div class="institutional-footer__social-links">
            <a href="https://www.instagram.com/enderezando_curvas/" ${externalAttributes} aria-label="Seguir a Enderezando Curvas en Instagram"><img src="${iconPath}Instagram.svg" alt=""></a>
            <a href="https://www.facebook.com/p/Enderezando-curvas-100084330576642/" ${externalAttributes} aria-label="Seguir a Enderezando Curvas en Facebook"><img src="${iconPath}Facebook.svg" alt=""></a>
            <a href="https://www.linkedin.com/company/enderezando-curvas-a-c/" ${externalAttributes} aria-label="Seguir a Enderezando Curvas en LinkedIn"><img src="${iconPath}Linkedin.svg" alt=""></a>
            <a href="https://www.tiktok.com/@enderezando.curvas" ${externalAttributes} aria-label="Seguir a Enderezando Curvas en TikTok"><img src="${iconPath}tiktok.svg" alt=""></a>
          </div>
        </div>
      </section>
    </div>

    <div class="institutional-footer__legal">
      <p>© <span data-footer-year></span> Enderezando Curvas A.C. Todos los derechos reservados.</p>
      <nav aria-label="Información legal">
        <a href="${officialSite}#legal/terminos" ${externalAttributes}>Términos y condiciones</a>
        <a href="${officialSite}#legal/donativos" ${externalAttributes}>Política de donativos, cancelaciones y reembolsos</a>
        <a href="${officialSite}#legal/privacidad" ${externalAttributes}>Aviso de privacidad</a>
      </nav>
    </div>
  `;

  const year = footer.querySelector('[data-footer-year]');
  if (year) year.textContent = new Date().getFullYear();

  const linksToggle = footer.querySelector('.institutional-footer__links-toggle');
  const usefulLinks = footer.querySelector('#footerUsefulLinks');
  const mobileFooter = window.matchMedia('(max-width: 600px)');

  const setUsefulLinksState = (isMobile) => {
    linksToggle.tabIndex = isMobile ? 0 : -1;
    linksToggle.setAttribute('aria-expanded', String(!isMobile));
    usefulLinks.hidden = isMobile;
  };

  linksToggle.addEventListener('click', () => {
    if (!mobileFooter.matches) return;
    const willOpen = linksToggle.getAttribute('aria-expanded') !== 'true';
    linksToggle.setAttribute('aria-expanded', String(willOpen));
    usefulLinks.hidden = !willOpen;
  });

  setUsefulLinksState(mobileFooter.matches);
  mobileFooter.addEventListener('change', (event) => setUsefulLinksState(event.matches));
})();
