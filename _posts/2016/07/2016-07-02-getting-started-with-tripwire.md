---
layout: article
title: Getting started with "Tripwire" on Ubuntu
date: 2016-07-02 15:33:00+0200
coverPhoto: /contents/images/2016/07/jekyll.jpg
---

Ensuring security of the IT infrastructure, servers, desktops, directory servers, databases, etc makes a huge difference in any organization or any other setting where data is key. If there is something organizations fear, it is being in a state where they know their data integrity has been tampered with or minimized. As a remedy, there must be need to be aware of what is going on at all times. This article will center on a security tool called Tripwire which one of the new paradigms for DevOps security operations and how it can be used to monitor intrusions on an ubuntu server. It detects, analyzes and reports on change activity across an IT infrastructure.

Tripwire is a popular detection system which can be used with other cyber security measures to effectively ensure attacks are monitored and curbed. It is a host-based intrusion detection system (HIDS) software security and data integration tool for monitoring and alerting that keeps current state of system files and configurations. If changes are detected, it could gather the reports of all modifications which can be used to ascertain if security has been compromised incase the changes are unauthorized. It is used in a number of popular companies e.g Vodafone, Sony etc as a file integrity manager to detects changes to files, manage vulnerabilities, continuous configuration monitoring.
In this tutorial, we will learn how to install and configure tripwire on Ubuntu as an intrusion detection system.

## Installation

```bash
$ sudo apt-get update && sudo apt-get install tripwire
```

The above command gets to install for us tripwire. The installation process has a number of steps that must be configured e.g getting to provide for email notifications, select internet site.
select internet site to configure email notificationsAlso remember to set pass-phrases by selecting yes to the prompt. Note that there are 2 types of keys you'll set, the local key and the site key to ensure our local binaries aren't run with our consent and the secure the configuration files respectively. enter yes to be able to set a passphraseSelect yes to both prompts of rebuilding the configuration file and the policy file. enter yes to be able to rebuild configuration fileenter yes to be able to rebuild tripwire policy fileIt'll prompt you to enter the site-key and local-key passphrase.

## Tripwire setup (Initialization)

After a successful installation, tripwire must be initialized and configured. Next, let us initialize tripwire. It will generate a database file.

```bash
$ sudo tripwire --init
```

Notice the warnings that are in the terminal, it's an indicator for us to adjust the configurations. Scrolling down the terminal, you'll see the line reading The database was successfully generated. It's a nice practice to save that output containing the filenames. Let us grep the output that contains Filename and save them into a file called configfile.

```bash
sudo tripwire --check | grep Filename > configfile
```

Let's check the contents of the file by running this command. Remember to apt-get install less if you didn't have it.
less configfile
configfile content

Customizing the policy file
To configure and customize tripwire to our desired system state, let us open the plain text policy file. Remember to apt-get install vim if you didn't have it before.
sudo vim /etc/tripwire/twpol.txt
You remember our saved configfile, search through the filenames that were returned and comment out all of the lines that you find that match. Let us comment out the following lines.
/etc/rc.boot under rulename "Boot Scripts"
comment out/etc/rc.bootThere were a lot of files in the /root home directory that needed to be commented out on my system. Anything that is not present on your system should be commented out. comment out all lines except /root/.bashrc and /root/.bash_history.
comment out all except /root/.bashrc and /root/.bash_history/proc filesystem. These files change all of the time, so will trigger false positives regularly if we leave the configuration as is. Not the /proc in the "Devices & Kernel information" section. We also want to do something with the /dev/pts filesystem. Tripwire will not check that location by default because it is told to check /dev, and /dev/pts is on a separate filesystem, which it will not enter unless specified. To get tripwire to check this as well, we can explicitly name it here under dev directory.
add /dev/pts file, comment out proc and define other proc filesThe last thing we will comment out are the /var/run and /var/lock lines so that our system does not flag normal filesystem changes by services.
comment out var/lock and var/run filesEnsure all lines we need to comment out done, then Save and close the file when you finish editing. Now that our file is configured, we need to recreate the encrypted policy file that tripwire actually reads.
sudo twadmin -m P /etc/tripwire/twpol.txt
Let us reinitialize the database to implement our policy:
sudo tripwire --init

Configuration check
If no errors were gotten at the previous command of reinitializing the database, it's a sign that all is well. Let us run a check to see how the report looks like and ensure we have no syntax errors.
sudo tripwire --check
check terminal output

Setting up alert notifications (Email)
We need to install mailutils to be able to use the mail functionality. We will use the mail command to send email notifications.
sudo apt-get install mailutils
Let us test our mail functionality. Use the following command to send the check report to your email. Specify your email address where I have used mine.
sudo tripwire --check | mail -s "Tripwire report for `uname -n`" your_email@domain.com
mail containing check reports

Cron Automation checks
Next, we automate the trip wire check by configuring a cronjob to run every morning at 08:00am. We will use root's crontab, reason being changes to the system cronjob can get wiped out with system updates.
Verify if root already has a crontab with the following command
sudo crontab -l
If not, run the following command to install cron
sudo apt-get install cron
Edit the crontab by running the following command. Select the editor you would wish to use.
sudo crontab -e
If you aren't sure how a cron works, I suggest you spend a few minutes looking into the cron declaration syntax. Add the following command to the file which will set it to be run every morning. We are not using sudo since we are running it as root.
0 9 \* \* \* /usr/sbin/tripwire --check | mail -s "Tripwire report for `uname -n`" your_email@domain.com
cron

Conclusion
We have successfully used tripwire to configure an automated intrusion detection system that can send us reports regarding changes on our filesystem. Emailed reports must be studied carefully on a regular basis and take immediate action incase unauthorized changes are detected.

```

```
