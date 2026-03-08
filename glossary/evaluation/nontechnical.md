---
layout: page
title: Non-Technical User Study
permalink: /glossary/evaluation/nontechnical/
---

<div class="evaluation-page">
 
  <p>
    <a class="evaluation-back-link" href="{{ '/glossary/evaluation/' | relative_url }}">
      ← Back to Evaluation</a>
  </p>

  <div class="evaluation-banner">
    <h2>Instructions</h2>
    <ol>
      <li>Read the executive summary below without using the glossary.</li>
      <li>After reading the summary, follow the link to the questionnaire. Feel free to revisit the executive summary while going through the questionnaire.</li>
      <li>The questionnaire will have a halfway point to stop at. You will then read the executive summary again but will use the glossary as a reference. For ease of access, there is a copy of the executive summary below the questionnaire link and you can hover the mouse over the terms for a tooltip to pop up with its definition.</li>
      <li>After reading the summary again, return to the questionnaire to complete it. Feel free to revisit the executive summary and glossary while going through the questionnaire.</li>
    </ol>
  </div>

  <h2>First Executive Summary</h2>

  <p>
    This assessment identified multiple weaknesses that could allow an attacker
    to gain unauthorized access to internal systems and expand that access across
    the environment.
  </p>

  <p>
    In one demonstrated scenario, an attacker could begin with limited access and
    then move from one system to another through
    lateral movement.
    From there, the attacker could obtain a higher level of control through
    privilege escalation.
  </p>

  <p>
    The assessment also demonstrated a realistic
    attack path
    from an initially low-level account to highly sensitive systems. If exploited
    by a real attacker, this could expose sensitive information, disrupt business
    operations, and reduce trust in core enterprise services.
  </p>

  <p>
    Based on the demonstrated access path and the potential business impact, the
    resulting
    overall risk
    to the organization would be considered significant and would warrant timely
    remediation.
  </p>

  <div class="evaluation-questionnaire-box">
    <h4>Questionnaire</h4>
    <p>
      After reading the sample report, please submit your responses using the form below.
    </p>

    <a
      class="evaluation-button"
      href="NONTECHNICAL_GOOGLE_FORM_LINK"
      target="_blank"
      rel="noopener">
      Open Questionnaire
    </a>
  </div>

  <h2>Second Executive Summary</h2>

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
</div>

  

<script defer src="{{ '/assets/js/glossary-tooltips.js' | relative_url }}"></script>