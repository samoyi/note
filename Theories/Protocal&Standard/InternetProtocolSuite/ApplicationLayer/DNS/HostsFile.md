# Hosts File


## Purpose
1. The computer file hosts is an operating system file that maps hostnames to IP
addresses.
2. It is a common part of an operating system's Internet Protocol (IP)
implementation, and serves the function of translating human-friendly hostnames
into numeric protocol addresses, called IP addresses, that identify and locate a
host in an IP network.
3. On most operating system the default configuration is that any mappings
contained in the Hosts file overrides any information that would be retrieved
from a DNS server.
4. In fact, if there is a mapping for a domain name in a hosts file, then your
computer will not even bother querying the DNS servers that are authoritative
for that domain, but instead read the IP address directly from the HOSTS file.
5. It is also important to note that when you add entries to your HOSTS file
they automatically start working. There is no need to reboot or enter another
command to start using the entries in the HOSTS file.


## File content
The HOSTS file is a text file that contains IP addresses separated by at least
once space and then a domain name, with each entry on its own line.


## Location in the file system
[Wiki](https://en.wikipedia.org/wiki/Hosts_(file))


## Why would I want to use a HOSTS file
There are a variety reasons as to why you would want to use a HOSTS file and we
will discuss a few examples of them so you can see the versatility of the little
file called the HOSTS file.

### Network Testing
1. I manage a large Internet Data center and many times we need to set up test
machines or set up development servers for our customers applications.
2. When connecting to these development or test machines, you can use the HOSTS
file to test these machines as if they were the real thing and not a development
server.
3. As an example, lets say that you had a domain name for a development computer
called `development.mydomain.com`. When testing this server you want to make
sure it operates correctly if people reference it as the true web server domain
name, `www.mydomain.com`.
4. Since if you change `www.mydomain.com` in the DNS Server to point to the
development server everyone on the Internet would connect to that server,
instead of the real production server. This is where the HOSTS file comes in.
5. You just need to add an entry into your HOSTS file that maps
`www.mydomain.com` to the IP address of the development server on the computers
that you will be testing with, so that the change is local to the testing
machines and not the entire Internet.
6. Now when you connect to `www.mydomain.com` from your computer with the
modified HOSTS file you are really connecting to the development machine, but it
appears to the applications that you are using that you are connecting to
`www.mydomain.com`.

### Potentially Increase Browsing Speed
1. By adding IP address mappings to sites you use a lot into your HOSTS file you
can potentially increase the speed of your browsing.
2. This is because your computer no longer has to ask a DNS server for the IP
address and wait to receive it's response, but instead can quickly query a local
file.
3. Keep in mind that this method is not advised as there is no guarantee that
the IP address you have for that domain name will always stay the same.
Therefore if the web site owner decides to change their IP address you will no
longer be able to connect.

### Block Spyware/Ad Networks
1. By adding large lists of known ad network and Spyware sites into your hosts
file and mapping the domain names to the 127.0.0.1, which is an IP address that
always points back to your own machine, you will block these sites from being
able to be reached.
2. This has two benefits; one being that it can make your browsing speed up as
you no longer have to wait while you download ads from ad network sites and
because your browsing will be more secure as you will not be able to reach known
malicious sites.


## 性能问题
1. It is important to note that there have been complaints of system slowdowns
when using a large hosts file.
2. This is usually fixed by turning off and disabling the DNS Client in your
Services control panel under Administrative Tools.
3. The DNS client caches previous DNS requests in memory to supposedly speed
this process up, but it also reads the entire HOSTS file into that cache as well
which can cause a slowdown. This service is unnecessary and can be disabled.


## References
* [Wiki: hosts (file)](https://en.wikipedia.org/wiki/Hosts_(file))
* [The Hosts File and what it can do for you](https://www.bleepingcomputer.com/tutorials/hosts-files-explained/)
