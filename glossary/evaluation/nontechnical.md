---
layout: page
title: Non-Technical User Study
permalink: /glossary/evaluation/nontechnical/
---

<div class="evaluation-page">
  <p>
    <a class="evaluation-back-link" href="{{ '/glossary/evaluation/' | relative_url }}">← Back to Evaluation</a>
  </p>

  <div class="evaluation-banner">
    <strong>Instructions:</strong>
    Read the executive summary below. You may hover over highlighted glossary
    terms to view definitions. After reading, complete the questionnaire at the
    bottom of the page.
  </div>

  <h2>Sample Report</h2>
  <h3>Executive Summary</h3>

  {% capture report %}
  <p>
    This assessment identified multiple weaknesses that could allow an attacker
    to gain unauthorized access to internal systems and expand that access across
    the environment.
  </p>

  <p>
    In one demonstrated scenario, an attacker could begin with limited access and
    then move from one system to another through
    [[lateral movement]].
    From there, the attacker could obtain a higher level of control through
    [[privilege escalation]].
  </p>

  <p>
    The assessment also demonstrated a realistic
    [[attack path]]
    from an initially low-level account to highly sensitive systems. If exploited
    by a real attacker, this could expose sensitive information, disrupt business
    operations, and reduce trust in core enterprise services.
  </p>

  <p>
    Based on the demonstrated access path and the potential business impact, the
    resulting
    [[overall risk]]
    to the organization would be considered significant and would warrant timely
    remediation.
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
      href="NONTECHNICAL_GOOGLE_FORM_LINK"
      target="_blank"
      rel="noopener">
      Open Non-Technical Questionnaire
    </a>
  </div>
</div>

<script defer src="{{ '/assets/js/glossary-tooltips.js' | relative_url }}"></script>