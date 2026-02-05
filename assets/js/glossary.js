(() => {
    const STORAGE_KEY = "glossaryMode"; // 0 = technical, 1 = layman
  
    const list = document.querySelector(".glossary-list");
    const toggleBtn = document.getElementById("glossaryToggle");
    const layman = toggleBtn?.querySelector(".mode-layman");
    const technical = toggleBtn?.querySelector(".mode-technical");
  
    if (!list || !toggleBtn || !layman || !technical) return;
  
    const setMode = (mode) => {
      const m = Number(mode) === 0 ? 0 : 1; // normalize
  
      // data attribute for CSS
      list.setAttribute("data-mode", m === 1 ? "layman" : "technical");
  
      // ARIA
      toggleBtn.setAttribute("aria-pressed", String(m === 0));
  
      // visual state
      layman.classList.toggle("active", m === 1);
      technical.classList.toggle("active", m === 0);
  
      localStorage.setItem(STORAGE_KEY, m);
    };
  
    // initialize
    setMode(localStorage.getItem(STORAGE_KEY) ?? 1);
  
    toggleBtn.addEventListener("click", () => {
      const current = Number(localStorage.getItem(STORAGE_KEY) ?? 1);
      setMode(current ^ 1); // bitwise toggle: 1 -> 0, 0 -> 1
    });
  })();
  