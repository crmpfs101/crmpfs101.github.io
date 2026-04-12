(() => {
  const STORAGE_KEY = "glossaryMode"; // 0=technical, 1=layman, 2=both

  const list = document.querySelector(".glossary-list");
  const select = document.getElementById("glossaryModeSelect");
  const searchInput = document.querySelector(".glossary-search-input");
  const searchMeta = document.querySelector(".glossary-search-meta");

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

    // Tooltip follows mode even though it's appended to <body>
    document.documentElement.setAttribute("data-glossary-mode", String(m));
  };

  const applySearch = () => {
    if (!searchInput) return;
  
    const query = searchInput.value.trim().toLowerCase();
    const items = Array.from(list.querySelectorAll(".glossary-item"));
  
    const beforeY = window.scrollY;
    let visibleCount = 0;
  
    for (const item of items) {
      const haystack = item.textContent.toLowerCase();
      const matches = !query || haystack.includes(query);
  
      item.style.display = matches ? "" : "none";
      if (matches) visibleCount++;
    }
  
    if (searchMeta) {
      searchMeta.textContent = `Showing ${visibleCount} of ${items.length}`;
    }
  
    // Restore scroll position after layout changes
    requestAnimationFrame(() => {
      const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
  
      window.scrollTo(0, Math.min(beforeY, maxY));
    });
  };

  setMode(localStorage.getItem(STORAGE_KEY) ?? 2);

  select.addEventListener("change", () => setMode(select.value));

  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
    applySearch();
  }
})();