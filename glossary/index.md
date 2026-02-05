---
layout: page
title: Glossary
permalink: /glossary/
---

<div class="glossary-download">
  <a class="glossary-download_btn"
     href="{{ '/assets/data/glossary.json' | relative_url }}"
     download="laymansec-glossary.json">
    Download Glossary (JSON)
  </a>
</div>

<div class="glossary-controls">
  <button
    id="glossaryToggle"
    class="glossary-toggle"
    type="button"
    aria-pressed="false"
  >
    <span class="mode mode-layman active">Layman</span>
    <span class="divider">|</span>
    <span class="mode mode-technical">Technical</span>
  </button>
</div>

<div class="glossary-list" data-mode="layman">
  {% for item in site.data.glossary %}
    <section class="glossary-item" id="{{ item.id }}">
      <h3 class="glossary-term">{{ item.term }}</h3>

      <div class="glossary-def glossary-def--layman">
        {{ item.layman }}
      </div>

      <div class="glossary-def glossary-def--technical">
        {{ item.technical }}
      </div>
    </section>
  {% endfor %}
</div>

<script defer src="{{ '/assets/js/glossary.js' | relative_url }}"></script>
