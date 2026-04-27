/*
  This file was created with assistance from ChatGPT (GPT-5.4 Thinking, OpenAI)
  and then reviewed and modified by the repository author.
*/

(() => {
    const input = document.getElementById("glossarySearch");
    const meta = document.getElementById("glossarySearchMeta");
    const list = document.querySelector(".glossary-list");
    if (!input || !list) return;
  
    const items = Array.from(list.querySelectorAll(".glossary-item"));
  
    // Normalize for case-insensitive search + accent-insensitive search
    const norm = (s) =>
      (s || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
  
    // Cache term strings once (term-only)
    const terms = items.map((el) => norm(el.getAttribute("data-term") || el.querySelector(".glossary-term")?.textContent || ""));
  
    let timer = null;
  
    const apply = () => {
      const q = norm(input.value);
      let shown = 0;
  
      if (!q) {
        for (const el of items) el.hidden = false;
        shown = items.length;
      } else {
        for (let i = 0; i < items.length; i++) {
          const match = terms[i].includes(q);
          items[i].hidden = !match;
          if (match) shown++;
        }
      }
  
      if (meta) {
        meta.textContent = q
          ? `Showing ${shown} of ${items.length}`
          : `Showing all ${items.length}`;
      }
    };
  
    const schedule = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(apply, 60); // small debounce
    };
  
    input.addEventListener("input", schedule);
  
    // Optional: ESC clears search
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        input.value = "";
        apply();
        input.blur();
      }
    });
  
    apply();
  })();