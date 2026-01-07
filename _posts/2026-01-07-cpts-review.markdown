---
layout: post
title:  "HTB CPTS Exam Tips"
date:   2026-01-07 12:59:00 +0000
categories: tips
---

## Introduction
There is no shortage of excellent reviews covering the HTB CPTS certification. Rather than repeating what has already been said, this post focuses on **practical strategies for passing the exam** while deliberately using the course material to become a **more effective and methodical penetration tester**.

The CPTS is not just a test of tool usage or following an enumeration checklist. It evaluates your ability to think critically, enumerate thoroughly, and produce a professional-quality report under exam conditions. The tips below are drawn from my hands-on experience with the CPTS learning path and are intended to help you approach both the exam and real-world engagements with greater confidence and efficiency.

## Notetaking

Effective CPTS notetaking isn’t just about documenting every exploit or command, but about building structured, methodology-focused notes that guide what to enumerate next at each stage when your memory fails.

The CPTS path contains 28 modules, and it is extremely difficult to retain everything while progressing through the material. Notetaking is essential not only to reinforce understanding, but also to serve as a reference when you inevitably forget an attack, enumeration technique, or decision point.

Most advice I found online around CPTS notetaking emphasizes writing everything down, especially during practice labs. I followed that advice during my first pass through the path. I documented every attack and carefully wrote out the exploit steps for each vulnerability. My notes were pretty thorough, but in practice, they were still lacking.

Despite having detailed notes on how to execute attacks, I often struggled with how to find them. Even after adding enumeration steps, I found myself getting stuck at key checkpoints, such as after gaining an initial foothold (i.e. obtaining credentials for a domain user). At that stage, I would fall back on a short mental list of enumeration steps I was comfortable with, usually the ones that most often led to “low-hanging fruit.” If those didn’t produce results, I stalled.

The problem wasn’t a lack of notes. It was a lack of structure.

I realized that my notes were organized around tools and exploits, not around a centralized methodology. I knew what attacks existed, but I hadn’t trained myself on when and why to look for them. To fix this, I started creating methodology note sheets that outlined all enumeration paths I knew, grouped by context (e.g., initial access, post-domain user, post-domain compromise). I bolded the enumeration steps that frequently led to quick wins, but I also listed the less common paths. I would go through the bolded enumeration steps first before going back and exhausting all the less common paths as well.

This shift made a huge difference. Instead of asking, “What exploit am I missing?”, I could ask, “Which enumeration category have I not exhausted yet?” 

My methodology notes eventually resembled a rough decision tree, but the exact structure can be whatever works best for you. Don’t be afraid to continuously refactor your notes as you progress through the path. Doing so helps you understand how you think and ensures your notes evolve into a tool that actively supports your workflow rather than just storing information.

#### Record commands and terminal outputs in code blocks instead of images
Code blocks improve the quality of your reports by preserving exact commands that security teams can easily copy and paste for reproduction. They also make it far easier to cleanly redact or trim sensitive output without degrading readability. Finally, text-based commands remain searchable, allowing you to quickly find past techniques or interactions during future labs or engagements.

It's also a good idea to make sure your terminal output is saved in a log in case a terminal goes down. Tmux and Kali's default terminal both capabilities to store the terminal log, allowing you to go back and find any commands you might have missed in your notes. 

## Practice Labs
When reading CPTS reviews online, you’ll often see wildly different advice. Some people claim “the course is all you need,” while others recommend completing 100+ boxes and multiple Pro Labs before attempting the exam.

Overall, I think the CPTS exam is fair, and I do believe that the HTB Academy CPTS modules teach all the attack paths, or at least the enumeration skills needed to discover them. Some people disagree and argue that certain exam attack paths are out of scope. While I understand that perspective, I still think the Academy material provides the enumeration logic required to identify those paths, keeping them reasonably within scope.

That said, everyone learns differently and comes from different backgrounds, so simply completing the coursework alone will likely not be enough for most people. Additionally, practicing other boxes will not only help you with the CPTS exam, but also help hone your skills as a pentester by refining your methodology and learning new exploit techniques.

For context, before taking the CPTS exam I completed:
- 120 HTB boxes
    - ~70 mostly with walkthroughs
    - ~50 largely on my own
- IppSec’s unofficial CPTS preparation list
- Dante Pro Lab
- ~Half of the Zephyr Pro Lab
- Various HTB Challenges

I did not complete HTB’s official CPTS Preparation Track at the time. In hindsight, I would recommend completing both Ippsec's and HTB's preparation lists, but prioritizing HTB’s CPTS Preparation Track first, as it aligns more closely with the exam’s intent. I also had next to nothing prior pentesting experience before starting on my HTB journey.

#### Recommended Practice Strategy
Attempt completing boxes on your own. If you get stuck, make sure you double check your methodology. It is okay to look at walkthroughs or ask for hints, but make sure you reflect on why you weren't able to identify the exploit or get it to work. Modify your notes in a way that will help guide you in the future and not repeat the mistake. Early on, you might continuosly repeat the same mistakes despite reflecting and making a note of it. Don't worry about it. As you improve your notetaking and practice on more boxes, it will start coming together.

Take time to struggle on boxes and don't immediately look at a walkthrough when you're stuck. Even for application-based CVEs or unfamiliar exploits, make a genuine attempt to discover them independently before checking a guide. This skill in figuring out what to look for is far more important for CPTS than memorizing/recording all exploits. It will be especially helpful when taking the exam and you are banging your head against a brick wall trying to find the next step in the attack chain.

After finishing the box, consider watching the corresponding Ippsec video since it might point out where your enumeration is lacking. Always ask "why" whenever he is doing something. Understanding how he finds the exploit path is often more important than learning the exploit itself.

#### Recommended Practice Order
If you’re completing boxes after finishing the CPTS modules (excluding AEN), I would approach practice in the following order:

1. HTB CPTS Preparation Track

    Start with HTB’s official CPTS Preparation Track. These boxes are the most directly aligned with the skills and mindset required for the exam.

2. Attacking Enterprise Networks (AEN) module

    Try completing this module completely blind. Just scroll to the bottom to start the environment and avoid even reading the questions. Once you have rooted all the boxes and domains, go back through the questions and answer them. It is ok to look for hints occasionally, but try to do this module on your own as much as possible since it is the best representation of the exam. It is definitely easier than the exam, but don't be afraid if you you needed some hints.

3. Dante

    If you lack experience with pivoting, I highly recommend completing the Dante Pro Lab.

    Dante is easier than the CPTS exam, but it is excellent for smoothing out common pivoting pain points, such as:
    - Creating or cleaning up ligolo-created interfaces and routes
    - Troubleshooting missing or blocked ports on pivot hosts
    - Creating firewall rules to allow traffic flow
    - Debugging traffic with tcpdump or Wireshark to identify where packets are being dropped

    If you have the time and want to maximize a one-month Pro Lab subscription, you can consider Zephyr as well. Just be aware that it contains some out-of-scope attacks and techniques.

4. [Ippsec's Unofficial CPTS Prep Playlist](https://www.youtube.com/playlist?list=PLidcsTyj9JXItWpbRtTg6aDEj10_F17x5)

    This playlist tackles many web exploitation and local privilege escalation techniques. It will also help further improve enumeration discipline and identifying subtle foothold paths. The playlist feels slightly out of date, but the boxes are still helpful for refining your methodology.

5. [HTB Labs Season 8 Boxes](https://app.hackthebox.com/seasonal?tab=overview&season_id=8)

    If Active Directory is a weak point, complete the Windows boxes from Season 8. Some of these boxes involve ADCS techniques, which are technically out of scope for CPTS. However, I still recommend completing those portions as ADCS knowledge is extremely valuable long-term and strengthens your AD fundamentals.

## Tooling

The CPTS modules will walk you through a multitude of tools, and it is important to understand the nuances of each tool and to practice using multiple tools for the same enumeration tasks. Sometimes, tools will fail but knowing multiple tools for the job will allow you to switch to a tool that works. Understanding the limitation and backend of the tools will also help you identify what certain errors mean and if some defense is blocking the attack. There are also some tools that the CPTS doesn't cover extensively but is very useful for both the exam as well as pentesting in general. I will go over the tools that I personally find to be the most helpful.

#### NetExec
This is my goto tool for many protocols and network related exploits. It is actively maintained and has a large user base, making it a reliable and well tested tool. When performing a network pentest from a remote host, there is a good chance that NetExec already includes a module or workflow for the enumeration or attack technique you’re looking for.

Common use cases include:
1. Protocol Enumeration (SMB, RPC, LDAP, etc)
2. Password Spraying
3. DCSync Attack
4. PetitPotam
5. NTLM Reflection
6. Generating KRB5 configuration files
7. Collecting BloodHound data


#### BloodHound
BloodHound is one of the most powerful tools for enumerating Active Directory and identifying potential privilege escalation paths, including DACL abuse and other misconfigurations. I strongly recommend becoming comfortable with both BloodHound Legacy and BloodHound-CE, and using whichever interface you prefer.

It's also important to understand the data collectors that feed information into BloodHound. Common collectors include SharpHound, rusthound, bloodhound-python, and NetExec. While all of these tools serve the same high-level purpose in collecting Active Directory data, their capabilities, tradeoffs, and ideal use cases differ.

SharpHound.exe is executed directly on a Windows host and leverages the full .NET framework to query Active Directory. Because of this, it is generally the most complete and reliable collector, capable of gathering the richest dataset. Whenever you have execution on a domain-joined Windows system, SharpHound should be your first choice.

RustHound, written in Rust, is designed to run remotely from a Linux system. This makes it extremely useful when you lack interactive access to a Windows host or want to avoid dropping binaries on disk. However, due to language and API limitations, RustHound cannot perform every query that SharpHound can, and its output may be less comprehensive.

bloodhound-python and NetExec collectors are similar to RustHound. They are convenient for remote enumeration using domain credentials and are especially useful early in an engagement, but they may miss certain relationships or edge cases that SharpHound captures more reliably.

I often start with RustHound or NetExec and supplement the collection with SharpHound once I have a foothold on a domain-joined Windows host.

Finally, it’s important to become comfortable navigating the BloodHound interface and understanding its edges and built-in queries. While BloodHound often explains how to abuse specific edges, knowing alternative tools and techniques beyond the ones it suggests can be extremely valuable. I often use BloodyAD or NetExec instead of the tooling that BloodHound suggests. Noting down the steps you take to abuse a type of edge will be useful for when you encounter the same edge in a future engagement or exam.

#### BloodyAD
This is my goto tool for performing Active Directory object manipulations. BloodyAD interacts with Active Directory objects over LDAP, allowing you to perform operations from a remote linux host. Many of the overly permissive rights you manually discover or edges shown on BloodHound can be abused using BloodyAD. 

Common use cases include:
1. Modifying ACLs and ownership on users, groups, and computers
2. Adding users to privileged groups when permissions allow
3. Resetting passwords or forcing password changes
4. Abusing delegated rights such as GenericWrite, WriteDACL, or WriteOwner

#### ffuf
This is my goto tool for web enumeration and content discovery.

Common use cases include:
1. Directory and file brute-forcing
2. Virtual host (vhost) discovery
3. Parameter fuzzing (GET, POST, JSON bodies)
4. API endpoint enumeration
5. Bypassing weak filtering by manipulating headers and extensions

#### ligolo-ng
ligolo-ng makes pivoting significantly easier for exams like CPTS or OSCP. Unlike traditional SOCKS-based tunneling alone, ligolo-ng creates a full layer-3 VPN-like tunnel, allowing most tools to work natively without additional proxy configurations. It has an autoroute feature, but I recommend manually setting up the interfaces, routes, and listeners. It helps you learn pivoting better and also gives you more control over the routes. Become familiar with the tool and learn how to use it with and without the web UI.

#### Impacket
The Impacket suite is a collection of Python tools for interacting with Windows protocols and Active Directory environments. Many higher-level tools such as NetExec and BloodHound collectors are built on top of Impacket. It is important to understand what the tools we use are doing on the backend so we can not only diagnose errors more easily, but also avoid performing restricted exploits. For the most part, NetExec has a wrapper around the Impacket executables, but if you are more familiar with using the impacket suite directly, it can be more convenient to use Impacket directly.

Common use cases include:
1. Remote command execution (psexec, wmiexec, smbexec, atexec)
2. Credential validation and reuse across services
3. Kerberos-based attacks (ticket requests, pass-the-ticket, pass-the-hash)
4. DCSync and directory replication abuse
5. NTLM relay and authentication testing
6. Interacting with SMB and RPC services at a low level

#### SecLists
Although not a tool itself, SecLists is an essential collection of curated wordlists used for fuzzing passwords, directories, virtual hosts, and more. While the CPTS path provides example wordlists for each fuzzing scenario, I recommended experimenting with different lists to identify the ones that best fit your workflow.

For example, during virtual host discovery, I like to start with bitquark-subdomains-top100000.txt, followed by subdomains-top1million-110000.txt. When time is a concern, you could begin with a smaller list such as subdomains-top1million-5000.txt.

If you end up stuck in an engagement or exam, try switching to alternative wordlists. SecLists also offers consolidated wordlists for each category, prefixed with "combined_". As an example, for subdomain enumeration, combined_subdomains.txt provides broad coverage by merging multiple popular lists into a single file.

## Reporting
Everyone recommends SysReptor, and I strongly agree. It automates report formatting and organization, removing a significant amount of overhead during both labs and the CPTS exam. More importantly, it helps prevent common mistakes, such as forgetting required sections or inconsistently structuring findings.

I highly recommend practicing with SysReptor during the Attacking Enterprise Networks (AEN) module, as it most closely simulates the CPTS exam reporting workflow. Becoming comfortable with SysReptor ahead of time will significantly speed up report writing during the exam. You could also further streamline your workflow, by creating custom templates for common CWEs or recurring findings. 

In addition to using SysReptor, I recommend writing findings and walkthroughs in a style consistent with HTB’s provided sample penetration testing [report](https://www.hackthebox.com/storage/press/samplereport/sample-penetration-testing-report-template.pdf).

When possible, prefer code blocks over images. Code blocks reduce report file size, improve readability, and make it easier for reviewers to copy, paste, and validate commands. They also allow for cleaner and more consistent redaction.

Make sure you document every step in the walkthrough, including how you got a foothold in the domain.

Finally, don’t hesitate to use AI-assisted tooling on exams to help systematically redact passwords, hashes, and other sensitive data within code blocks. In a real engagement, you probably wouldn't want to do this, but on the CPTS exam, it will help save you time.

## Mentality
#### Going through the CTPS Path
The CPTS learning path can feel long and information-dense, and it is easy to become mentally fatigued from reading the material, completing skill assessments, and constantly refactoring notes. It led me to take shortcuts in my note-taking and, worse, to undermine the value of the skill assessments by searching for hints instead of methodically working through my full approach.

Rushing through the material ultimately worked against me. I ended up having to revist all the modules, likely extending my overall study timeline rather than shortening it. If I were to do it again, I would have alternated between CPTS modules and hands-on HTB Labs machines. While I may not have immediately known every exploit required to complete those boxes, the experience would have strengthened my ability to research and adapt and would have provided additional motivation to return to the CPTS material with clearer purpose.

#### Taking the CPTS Exam
The CPTS exam provides 10 days per attempt, and since you receive two attempts within the same environment, the exam effectively spans 20 days. While an experienced penetration tester might complete it in just a few days, everyone’s methodology and pace are different, so don’t stress if certain sections take longer than expected. Getting stuck multiple times during the exam is normal and should be anticipated.

Taking regular breaks is essential. Whenever I hit a wall, I stepped away, often to watch some TV. It helped reset my thinking, and I would frequently return and find the next step in the exploit chain. In fact, I probably watched more TV during the exam than during the rest of the month combined. Personally, I found it helpful to completely avoid thinking about the exam during breaks, but you should do whatever allows you to mentally reset. Ippsec has mentioned in the past that it is common to get stuck on an initial foothold for a while and then find yourself blazing through after eventually overcoming the foothold.

Finally, don’t be afraid of failing. It’s far more common than many people admit. Although I was fortunate enough to pass on my first attempt, I approached the exam with the mindset of simply securing an initial foothold and treating the rest as a learning opportunity. As with any engagement, view the CPTS exam as another chance to sharpen your skills, and make sure to reflect on your approach and improve your notes afterward, regardless of the outcome.

## When are you ready to take the exam?
It's pretty difficult to gauge when someone is ready for the exam. Because you do have two attempts in the same environment, many people say to view the first attempt as a trial run and to not procrastinate taking the exam. If you have the time, I would at least try to complete the suggested practice labs above and use the following bullet points as a rough guide for when you are ready.

1. Can complete AEN completely blind on the first run through with only a few hints.
2. Can complete HTB boxes (maybe around user rated difficulty 4.0) on your own unless there is a new enumeration or exploit technique to learn.
3. Comfortable with pivoting.
4. Comfortable with using BloodHound to discover abuse paths and exploiting them.
5. Practiced the various web attacks mentioned in the CPTS path on HTB Labs.

## Conclusion
I hope this blog post was helpful for your CPTS journey. I wrote a previous blog post on the HTB box [Fluffy]({% post_url 2025-12-23-fluffy-walkthrough %}) (the first box in the HTB CPTS Preparation track) if you would like further insight on how I tackled boxes in preparation for the CPTS exam. If you have questions, feel free to ping me on Discord or discuss with me in the HTB official discord.
