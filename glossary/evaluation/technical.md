---
layout: page
title: Technical User Study
permalink: /glossary/evaluation/technical/
---

<div class="evaluation-page">
 
  <p>
    <a class="evaluation-back-link" href="{{ '/glossary/evaluation/' | relative_url }}">
      ← Back to Evaluation</a>
  </p>

  <div class="evaluation-banner">
    <h2>Instructions</h2>
    <ol>
      <li>Read the penetration test walkthrough below without using the glossary.</li>
      <li>After reading the walkthrough, follow the link to the questionnaire. Feel free to revisit the walkthrough while going through the questionnaire.</li>
      <li>The questionnaire will have a halfway point to stop at. You will then read the second penetration test walkthrough. For ease of access, there is a copy of the walkthrough below the questionnaire link and you can hover the mouse over the terms for a tooltip to pop up with its definition.</li>
      <li>After reading the walkthrough again, return to the questionnaire to complete it. Feel free to revisit the walkthrough and glossary while going through the questionnaire.</li>
    </ol>
  </div>

  <h2>First Penetration Test Walkthrough</h2>

  <p>
    blah blah blah kerberoast blah blah blah
  </p>

  <div class="evaluation-questionnaire-box">
    <h4>Questionnaire</h4>
    <p>
      After reading the sample report, please submit your responses using the form below.
    </p>

    <a
      class="evaluation-button"
      href="TECHNICAL_GOOGLE_FORM_LINK"
      target="_blank"
      rel="noopener">
      Open Questionnaire
    </a>
  </div>

  <h2>Second Penetration Test Walkthrough</h2>

  {% capture report %}
  <p>
    blah blah blah [[kerberoasting|kerberoast]] blah blah blah
  </p>
  {% endcapture %}

  {% include glossaryify.html content=report %}
</div>

<script defer src="{{ '/assets/js/glossary-tooltips.js' | relative_url }}"></script>