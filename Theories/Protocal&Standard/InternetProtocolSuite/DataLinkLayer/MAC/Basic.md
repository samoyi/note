# Basic



## How are MAC Addresses Determined
1. Vendors are given a range of MAC Addresses that can be assigned to their
products by the IEEE (Institute of Electrical and Electronics Engineers). MAC
Address are assigned to Vendors in various sized blocks as appropriate.
2. You can find the vendor given a particular MAC Address or find a MAC Address
Range given to a vendor on a website similar to [MacVendors.co](https://macvendors.co/)



## Devices are **not** uniquely identified by their MAC addresses
* In the past vendors have intentionally or by mistake assigned the same MAC
Address to multiple devices.
* It is possible to change the MAC Address presented by most hardware to the OS,
 an action often referred to as [MAC spoofing](https://en.wikipedia.org/wiki/MAC_spoofing)
* In order for a network device to be able to communicate, the MAC Address it is using must be unique. No other device on that local network subnet can use that
MAC Address. If two devices have the same MAC Address (which occurs more often
than network administrators would like), neither computer can communicate
properly. On an Ethernet LAN, this will cause a high number of collisions.
Duplicate MAC Addresses separated by one or more routers is not a problem since
the two devices won’t see each other and will use the router to communicate.



## Reference
* [How is the Uniqueness of MAC Addresses Enforced?](https://www.howtogeek.com/228286/how-is-the-uniqueness-of-mac-addresses-enforced/)
