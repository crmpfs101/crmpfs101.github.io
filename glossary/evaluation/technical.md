---
layout: page
permalink: /glossary/evaluation/technical/
---

<h1>Technical User Study</h1>

<div class="evaluation-page">

  <p>
    <a class="evaluation-back-link" href="{{ '/glossary/evaluation/' | relative_url }}">
      ← Back to Study Selection
    </a>
  </p>

  <div class="evaluation-banner">
    <strong>Instructions:</strong>
    Read the sample penetration testing walkthrough below. Hover over highlighted
    glossary terms to view definitions. After reading, complete the questionnaire
    at the bottom of the page.
  </div>

  <h2>Sample Report</h2>
  <h3>Internal Penetration Test Walkthrough</h3>

  {% capture report %}
  <p>
    During the assessment, the tester obtained a low-privileged foothold within the domain and began
    [[enumeration]]
    of accessible systems and services.
  </p>
  {% endcapture %}

  {% include glossaryify.html content=report %}

  <div class="evaluation-questionnaire-box">
    <h2>Questionnaire</h2>
    <p>
      After reading the sample report, please submit your responses using the form below.
    </p>

    <a
      class="evaluation-button"
      href="TECHNICAL_GOOGLE_FORM_LINK"
      target="_blank"
      rel="noopener">
      Open Technical Questionnaire
    </a>
  </div>
</div>

<script defer src="{{ '/assets/js/glossary-tooltips.js' | relative_url }}"></script>