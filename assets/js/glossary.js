(() => {
    const STORAGE_KEY = "glossaryMode"; // 0=technical, 1=layman, 2=both
  
    const list = document.querySelector(".glossary-list");
    const select = document.getElementById("glossaryModeSelect");
  
    if (!list || !select) return;
  
    const normalize = (v) => {
      const n = Number(v);
      return (n === 0 || n === 1 || n === 2) ? n : 2;
    };
  
    const setMode = (mode) => {
      const m = normalize(mode);
      list.setAttribute("data-mode", String(m));
      select.value = String(m);
      localStorage.setItem(STORAGE_KEY, String(m));
    };
  
    // Default to BOTH (2)
    setMode(localStorage.getItem(STORAGE_KEY) ?? 2);
  
    select.addEventListener("change", () => {
      setMode(select.value);
    });
  })();