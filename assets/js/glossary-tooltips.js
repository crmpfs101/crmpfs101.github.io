(() => {
    const list = document.querySelector(".glossary-list");
    if (!list) return;
  
    // Build lookup from DOM
    const byId = new Map();
    document.querySelectorAll(".glossary-item").forEach((item) => {
      const id = item.getAttribute("id");
      const termEl = item.querySelector(".glossary-term");
      const layEl = item.querySelector(".glossary-def--layman");
      const techEl = item.querySelector(".glossary-def--technical");
      if (!id || !termEl) return;
  
      byId.set(String(id), {
        term: termEl.textContent.trim(),
        laymanHTML: layEl ? layEl.innerHTML : "",
        technicalHTML: techEl ? techEl.innerHTML : "",
      });
    });
  
    // Single tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "glossary-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.style.display = "none";
    document.body.appendChild(tooltip);
  
    let currentAnchor = null;
    let hideTimer = null;
  
    const escapeHtml = (s) =>
      String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
  
    const setTooltipContent = (entry) => {
      tooltip.innerHTML = `
        <div class="glossary-tooltip-title">${escapeHtml(entry.term)}</div>
        <div class="glossary-def glossary-def--technical">${entry.technicalHTML || "<em>(Not defined)</em>"}</div>
        <div class="glossary-def glossary-def--layman">${entry.laymanHTML || "<em>(Not defined)</em>"}</div>
      `;
    };
  
    const show = () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      tooltip.style.display = "block";
    };
  
    const hide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      tooltip.style.display = "none";
      currentAnchor = null;
    };
  
    const positionTooltip = (anchor) => {
      if (!anchor || tooltip.style.display === "none") return;
  
      tooltip.style.left = "0px";
      tooltip.style.top = "0px";
  
      const rect = anchor.getBoundingClientRect();
      const tt = tooltip.getBoundingClientRect();
  
      const pad = 10;
      const gap = 10;
  
      let left = rect.left + window.scrollX;
      let top = rect.bottom + window.scrollY + gap;
  
      const maxLeft = window.scrollX + window.innerWidth - tt.width - pad;
      left = Math.min(Math.max(left, window.scrollX + pad), maxLeft);
  
      const overflowBottom =
        top + tt.height > window.scrollY + window.innerHeight - pad;
  
      if (overflowBottom) {
        top = rect.top + window.scrollY - tt.height - gap;
      }
  
      top = Math.max(top, window.scrollY + pad);
  
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };
  
    const showFor = (el) => {
      const id = el?.dataset?.id;
      if (!id) return;
  
      const entry = byId.get(String(id));
      if (!entry) return;
  
      currentAnchor = el;
      setTooltipContent(entry);
      show();
      positionTooltip(el);
    };
  
    document.addEventListener("pointerover", (e) => {
      const ref = e.target.closest?.(".glossary-term--ref");
      if (!ref || ref.classList.contains("glossary-term--missing")) return;
      if (currentAnchor === ref) return;
      showFor(ref);
    });
  
    document.addEventListener("pointerout", (e) => {
      const fromRef = e.target.closest?.(".glossary-term--ref");
      if (!fromRef) return;
  
      const to = e.relatedTarget;
  
      if (to && (tooltip.contains(to) || to.closest?.(".glossary-tooltip")))
        return;
  
      if (to && to.closest?.(".glossary-term--ref")) return;
  
      hideTimer = setTimeout(hide, 60);
    });
  
    tooltip.addEventListener("pointerover", () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    });
  
    tooltip.addEventListener("pointerleave", () => {
      hideTimer = setTimeout(hide, 60);
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hide();
    });
  
    document.addEventListener("pointerdown", (e) => {
      if (
        e.target.closest?.(".glossary-tooltip") ||
        e.target.closest?.(".glossary-term--ref")
      )
        return;
      hide();
    });
  
    window.addEventListener("scroll", () => {
      if (currentAnchor && tooltip.style.display !== "none")
        positionTooltip(currentAnchor);
    }, { passive: true });
  
    window.addEventListener("resize", () => {
      if (currentAnchor && tooltip.style.display !== "none")
        positionTooltip(currentAnchor);
    }, { passive: true });
  })();