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
      <li>Ensure the Tooltips button is set to Off.</li>
      <li>Read the executive summary below without using the glossary.</li>
      <li>After reading the summary, follow the link to the questionnaire. Feel free to revisit the executive summary while going through the questionnaire. Pause after completing Section 2 of the questionnaire.</li>
      <li>After completing Section 2, leave the questionnaire open but return to the executive summary page (this page). </li>
      <li>Toggle the Tooltips button to On. Now, whenever you hover over a glossary term in the executive summary, the term definition should pop up.</li>
      <li>Read the executive summary again but you can now use the glossary as a reference. You can either have the <a href="/glossary/" target="_blank" rel="noopener noreferrer">glossary</a> pulled up in another tab or just rely on the tooltips when hovering over a term.</li>
      <li>After reading the summary again, return to the questionnaire to complete it. Feel free to revisit the executive summary and glossary while going through the questionnaire.</li>
    </ol>
  </div>

  <button id="tooltipToggle" class="tooltip-toggle-btn" type="button" aria-pressed="false">
    Tooltips: Off
  </button>

  <div class="evaluation-report">
    <h2>Executive Summary</h2>

    {% capture report %}
    <p>
      FakeCompany engaged the tester to perform an [[External Penetration Test|external]] [[Network Penetration Test|network penetration test]] of [[fakecompany.com|fakecompany.com]]. The [[Scope|scope]] included [[fakecompany.com|fakecompany.com]], all [[Subdomain|subdomains]] under fakecompany.com, and the FakeCompany [[Active Directory|Active Directory]] [[Domain|domain]]. The goal of the assessment was to identify security weaknesses, demonstrate the potential [[Impact|impact]] of those weaknesses, and provide [[Remediation|remediation]] recommendations to reduce overall [[Risk|risk]] and improve [[Security Posture|security posture]].
    </p>

    <p>
      Testing was performed using a [[Black Box Test|black box test]] approach during the approved [[Testing Window|testing window]] (03/16/2026 - 03/20/2026). The tester began without credentials or prior knowledge of the environment and evaluated whether an [[external scope|external attacker]] could gain [[Initial Access|initial access]] through the public attack surface and move deeper into FakeCompany’s systems. Over the course of the assessment, the tester identified multiple [[finding|findings]] and fully compromised the FakeCompany [[Active Directory|Active Directory]] [[Domain|domain]].
    </p>

    <p>
      During the assessment, the tester found two [[Subdomain|subdomains]] hosting publicly available websites, tickets.fakecompany.com and dev.fakecompany.com. tickets.fakecompany.com is a help desk website for employees to submit IT tickets. dev.fakecompany.com is a developer version of the main website (fakecompany.com) where software developers seem to be testing new features. The public accessibility of these two websites, increased the [[attack surface]] of FakeCompany by unnecessarily exposing applications reserved for internal use. FakeCompany should restrict public access to tickets.fakecompany.com and dev.fakecompany.com so they are only reachable by authorized internal users.
    </p>

    <p>
      The tester identified a [[Cross Site Scripting (XSS)|cross site scripting (XSS)]] [[vulnerability]] on the help desk website. The website allowed unauthorized users to register a new account and submit tickets without a company login. With a newly registered account, the tester was able to abuse the [[XSS]] [[vulnerability]] in the ticket creation functionality. After creating a malicious ticket and waiting for some time, an administrator opened up the ticket, triggering the tester's malicious [[payload]]. This gave the tester the necessary information to take over the [[session]] and gain administrative access over the help desk website. With that access, the tester was able to view all submitted tickets, including content that revealed internal system details and default credentials. The credentials were later validated against an internal system but provided limited access. The main website and developer website were also affected by [[XSS]], but the [[vulnerability]] only resulted in website defacement. FakeCompany can strengthen the security of the help desk website by only allowing authorized employees to create accounts and submit tickets. To resolve the [[XSS]] vulnerabilities, the websites should ensure that submitted content is safely handled before it is shown to other users.
    </p>

    <p>
      The next [[finding]] involved an insecure file upload functionality on the developer website (dev.fakecompany.com). The website seemed to be testing a new feature where customers are able to upload a picture for their profile. The tester was able to bypass protections and upload a malicious file as the profile picture. Developer comments within the website's [[source code]] revealed where the uploaded files were stored. The tester was able to navigate to the uploaded malicious file, resulting in [[Remote Code Execution (RCE)|remote code execution (RCE)]] on the underlying system. With access to the system, the tester was able to abuse an outdated software package to achieve [[Privilege Escalation|privilege escalation]] and gain administrative access on the compromised system. To [[remediation|remediate]] the developer website weaknesses, FakeCompany should apply stricter controls over the files that can be uploaded, remove internal implementation details from public pages, and prevent uploaded files from being browsed directly. 
    </p>

    <p>
      The compromised system was joined to FakeCompany's [[Active Directory]] [[domain]], enabling the tester to perform [[lateral movement]] and identify additional [[internal scope|internal]] systems within the same environment. On one of these [[internal scope|internal]] systems, the tester found a [[SMB]] share with excessive permissions that gave [[read permission|read access]] to guest users (no password needed). Within the share, the tester was able to find credential [[Hash|hashes]] for three users, which were then cracked offline to obtain three valid user credentials. The recovered credentials allowed the tester to query information from the [[Domain Controller (DC)|domain controller]], revealing that one compromised account had the privileges to perform a [[DCSync|DCSync]] attack and achieve full [[Domain|domain]] compromise. FakeCompany should restrict guest access to internal file shares and strengthen password policies so that credentials are more difficult to crack or guess.
    </p>

    <p>
      From a business perspective, the identified [[finding|findings]] exposed FakeCompany to several forms of [[risk]]. The most serious [[impact]] was full compromise of the FakeCompany [[Active Directory|Active Directory]] [[domain]], but the assessment also showed [[risk]] from unnecessary public exposure of internal services, unauthorized access to trusted functionality, disclosure of internal system details, and weak credential handling. Taken together, these findings increased both the [[Likelihood|likelihood]] and [[Severity|severity]] of broader compromise.
    </p>

    <p>
      FakeCompany should prioritize [[Remediation|remediation]] of the findings that enabled the most severe attack path first. Immediate efforts should focus on removing public access to internal websites (tickets.fakecompany.com and dev.fakecompany.com). This fix should immediately prevent the attack path by denying access to the vulnerable websites. However, FakeCompany should practice [[defense-in-depth]] and continue [[remediation]] by correcting the website [[vulnerability|vulnerabilities]], patching outdated software, enforcing stronger [[authorization]] policies, and rotating exposed passwords while strengthening password policies. FakeCompany should also improve [[Monitoring|monitoring]] and [[Logging|logging]] capabilities so suspicious activity and signs of compromise can be identified and investigated more quickly.
    </p>

    <p>
      Overall, the assessment showed that an external attacker could use a combination of public-facing application weaknesses, outdated software, and weak internal [[access control|access controls]] to move from external access to full [[domain]] compromise.
    </p>
    {% endcapture %}

    {% include glossaryify.html content=report %}
  </div>

  <div class="evaluation-questionnaire-box">
    <h2>Questionnaire</h2>
    <p>
      After reading the sample report, please submit your responses using the form below.
    </p>
    <a
      class="evaluation-button"
      href="https://forms.gle/MVRNjDWeEER1m7Zx6"
      target="_blank"
      rel="noopener">
      Open Questionnaire
    </a>
  </div>
</div>

  

<script defer src="{{ '/assets/js/glossary-tooltips.js' | relative_url }}"></script>