---
layout: page
title: Glossary
permalink: /glossary/
---

<strong>
  This page is under construction. The start of this glossary is in tandem with my capstone project at Georgia Tech. The page will be finished by the end of the semester with 300 cybersecurity terms. Following the semester, I will continue adding new terms.
</strong>

<h2>Overview</h2>

<p>
  This cybersecurity glossary is designed to support communication among technical security professionals or between
  technical security professionals and non-technical stakeholders.
  Each term includes two definitions:
</p>

<ul>
  <li><strong>Technical</strong> — A precise definition aligned with professional cybersecurity terminology.</li>
  <li><strong>Layman</strong> — A simplified explanation intended for general audiences.</li>
</ul>

<p>
  As of right now, the glossary focuses on terms found in penetration testing reports. In the future, more terms will be added to expand past the pentesting context.
</p>

<h2>Download</h2>

<p>
  Download options are available below for reference or offline use.
</p>

<div class="glossary-download">
  <a class="glossary-download-link"
    href="{{ '/assets/data/glossary.json' | relative_url }}"
    download="laymansec-glossary.json">
    Download Glossary (JSON)
  </a>
  <a class="glossary-download-link"
    href="{{ '/assets/data/glossary.csv' | relative_url }}"
    download="laymansec-glossary.csv">
    Download Glossary (CSV)
  </a>
  <a href="#"
    class="glossary-download-link"
    onclick="window.print(); return false;">
    Print / Save as PDF
  </a>
</div>

<h2>Terms</h2>

<p>
  Use the View: dropdown to switch between definitions,
  or view both definitions simultaneously.
</p>

<div class="glossary-controls">
  <label class="glossary-mode-label" for="glossaryModeSelect">View:</label>

  <select id="glossaryModeSelect" class="glossary-mode-select">
    <option value="2" selected>Technical + Layman</option>
    <option value="0">Technical</option>
    <option value="1">Layman</option>
  </select>
</div>

<div class="glossary-list" data-mode="2">
  {% for item in site.data.glossary_processed %}
    <section class="glossary-item" id="{{ item.id }}">
      <h4 class="glossary-term">{{ item.term }}</h4>

      <div class="glossary-def glossary-def--technical">
        <span class="glossary-badge glossary-badge--technical">Technical</span>
        {{ item.technical }}
      </div>

      <div class="glossary-def glossary-def--layman">
        <span class="glossary-badge glossary-badge--layman">Layman</span>
        {{ item.layman }}
      </div>

    </section>
  {% endfor %}
</div>

<script defer src="{{ '/assets/js/glossary.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/glossary-tooltips.js' | relative_url }}"></script>
