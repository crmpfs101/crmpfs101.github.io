---
---

(() => {
  const GLOSSARY_URL = "{{ '/assets/data/glossary.json' | relative_url }}";
  const SHOW_DELAY = 300;
  const HIDE_DELAY = 200;

  let glossaryMap = null;
  let glossaryPromise = null;
  let currentAnchor = null;
  let hoverTimer = null;
  let hoverAction = null;

  const tooltip = document.createElement("div");
  tooltip.className = "glossary-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.style.display = "none";
  document.body.appendChild(tooltip);

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  async function loadGlossary() {
    if (glossaryMap) return glossaryMap;
    if (glossaryPromise) return glossaryPromise;

    glossaryPromise = fetch(GLOSSARY_URL, {
      credentials: "same-origin",
      cache: "force-cache",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load glossary data: ${response.status}`);
        }
        return response.json();
      })
      .then((items) => {
        const map = new Map();

        for (const item of items || []) {
          if (!item || !item.id) continue;

          map.set(String(item.id), {
            term: item.term || "",
            technical: item.technical || "",
            layman: item.layman || "",
          });
        }

        glossaryMap = map;
        return glossaryMap;
      })
      .catch((error) => {
        console.error("Glossary tooltip load failed:", error);
        glossaryMap = new Map();
        return glossaryMap;
      });

    return glossaryPromise;
  }

  function clearHoverTimer() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    hoverAction = null;
  }

  function setTooltipContent(entry) {
    const technical = entry.technical?.trim() || "(Not defined)";
    const layman = entry.layman?.trim() || "(Not defined)";

    tooltip.innerHTML = `
      <div class="glossary-tooltip-title">${escapeHtml(entry.term)}</div>
      <div class="glossary-def glossary-def--technical">
        <span class="glossary-badge glossary-badge--technical">Technical</span>
        ${escapeHtml(technical)}
      </div>
      <div class="glossary-def glossary-def--layman">
        <span class="glossary-badge glossary-badge--layman">Layman</span>
        ${escapeHtml(layman)}
      </div>
    `;
  }

  function showTooltip() {
    clearHoverTimer();
    tooltip.style.display = "block";
  }

  function hideTooltip() {
    clearHoverTimer();
    tooltip.style.display = "none";
    currentAnchor = null;
  }

  function positionTooltip(anchor) {
    if (!anchor || tooltip.style.display === "none") return;

    tooltip.style.left = "0px";
    tooltip.style.top = "0px";

    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const padding = 10;
    const gap = 10;

    let left =
      anchorRect.left + window.scrollX +
      (anchorRect.width - tooltipRect.width) / 2;

    let top = anchorRect.top + window.scrollY - tooltipRect.height - gap;

    const overflowTop = top < window.scrollY + padding;
    if (overflowTop) {
      top = anchorRect.bottom + window.scrollY + gap;
    }

    const maxLeft =
      window.scrollX + window.innerWidth - tooltipRect.width - padding;
    left = Math.min(Math.max(left, window.scrollX + padding), maxLeft);

    top = Math.max(top, window.scrollY + padding);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  async function showForReference(ref) {
    const id = ref?.dataset?.id;
    if (!id) return;

    const glossary = await loadGlossary();
    const entry = glossary.get(String(id));

    if (!entry) {
      console.warn(`No glossary entry found for data-id="${id}"`);
      return;
    }

    currentAnchor = ref;
    setTooltipContent(entry);
    showTooltip();
    positionTooltip(ref);
  }

  document.addEventListener("pointerover", (event) => {
    const ref = event.target.closest?.(".glossary-term--ref");
    if (!ref || ref.classList.contains("glossary-term--missing")) return;
    if (currentAnchor === ref) return;

    clearHoverTimer();
    hoverAction = "show";

    hoverTimer = setTimeout(() => {
      if (hoverAction === "show") {
        showForReference(ref);
      }
    }, SHOW_DELAY);
  });

  document.addEventListener("pointerout", (event) => {
    const fromRef = event.target.closest?.(".glossary-term--ref");
    if (!fromRef) return;

    const to = event.relatedTarget;

    if (to && (tooltip.contains(to) || to.closest?.(".glossary-tooltip"))) return;
    if (to && to.closest?.(".glossary-term--ref")) return;

    clearHoverTimer();
    hoverAction = "hide";

    hoverTimer = setTimeout(() => {
      if (hoverAction === "hide") {
        hideTooltip();
      }
    }, HIDE_DELAY);
  });

  tooltip.addEventListener("pointerover", () => {
    clearHoverTimer();
  });

  tooltip.addEventListener("pointerleave", () => {
    clearHoverTimer();
    hoverAction = "hide";

    hoverTimer = setTimeout(() => {
      if (hoverAction === "hide") {
        hideTooltip();
      }
    }, HIDE_DELAY);
  });

  document.addEventListener("pointerdown", (event) => {
    if (
      event.target.closest?.(".glossary-term--ref") ||
      event.target.closest?.(".glossary-tooltip")
    ) {
      return;
    }
    hideTooltip();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideTooltip();
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (currentAnchor && tooltip.style.display !== "none") {
        positionTooltip(currentAnchor);
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "resize",
    () => {
      if (currentAnchor && tooltip.style.display !== "none") {
        positionTooltip(currentAnchor);
      }
    },
    { passive: true }
  );

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      loadGlossary();
    });
  } else {
    window.setTimeout(() => {
      loadGlossary();
    }, 250);
  }
})();