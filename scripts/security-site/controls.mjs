// Les commandes statiques emploient les classes exportées du site principal.
const esc = (value) => String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
export function renderControls(locale, langLinks, themes) {
  const t={lang:locale,langLabel:locale==='fr'?'Langue':'Language',themeLabel:locale==='fr'?'Thème':'Theme'};
  const isFr = t.lang === "fr";
  const modeLabels = themes.modeLabels;
  const options = themes.themes.map((m) => {
    return `<button type="button" role="option" class="theme-card-option" data-theme-value="${m.id}" data-label="${esc(m.label)}" aria-selected="false"><span class="theme-card-option__swatch-wrapper"><span class="theme-card-option__swatch" data-theme="${m.id}" aria-hidden="true"></span></span><span class="theme-card-option__info"><span class="theme-card-option__name">${esc(m.label)}</span></span></button>`;
  }).join("");
  const modes = ["auto", "light", "dark"].map((mode) => `<button type="button" role="tab" class="theme-segment-btn${mode === themes.defaultMode ? " is-active" : ""}" data-theme-mode="${mode}" aria-selected="${mode === themes.defaultMode}">${esc(modeLabels[mode])}</button>`).join("");
  const controls = `
          <div class="header-controls">
            <nav class="locale-switcher" aria-label="Langue / Language">
              <a class="locale-switcher__link${t.lang === "en" ? " is-active" : ""}" href="${langLinks[0]}" ${t.lang === "en" ? 'aria-current="true"' : ""}>EN</a>
              <a class="locale-switcher__link${isFr ? " is-active" : ""}" href="${langLinks[1]}" ${isFr ? 'aria-current="true"' : ""}>FR</a>
            </nav>
            <div class="theme-switcher-wrapper" id="themePicker">
              <div class="theme-switcher-pill-group">
                <button type="button" class="theme-switcher-btn" id="themeCycle" aria-label="${isFr ? "Thème suivant" : "Next theme"}"><span class="theme-swatch-icon" data-theme="${themes.defaultTheme}" aria-hidden="true"></span><span class="theme-switcher-btn__label">${esc(themes.themes.find((m) => m.id === themes.defaultTheme).label)}</span></button>
                <button type="button" class="theme-switcher-arrow-btn" id="themeToggle" aria-label="${isFr ? "Ouvrir les thèmes et choisir le mode" : "Open the themes and choose the mode"}" aria-expanded="false" aria-haspopup="dialog" aria-controls="themePalette"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="chevron-flip" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
              </div>
              <div class="theme-dropdown-modal" id="themePalette" role="dialog" aria-label="${isFr ? "Palette des thèmes" : "Theme palette"}" hidden>
                <div class="theme-segmented-control" role="tablist" aria-label="${isFr ? "Mode" : "Mode"}">${modes}</div>
                <div class="theme-grid" role="listbox" aria-label="${esc(t.themeLabel)}">${options}</div>
              </div>
            </div>
          </div>`;
  return controls;
}
