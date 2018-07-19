# Shady Characters

1. URLs were designed to be portable(可移植的). They were also designed to
uniformly name all the resources on the Internet, which means that they will be
transmitted through various protocols. Because all of these protocols have
different mechanisms for transmitting their data, it was important for URLs to
be designed so that they could be transmitted safely through any Internet
protocol.
2. Safe transmission means that URLs can be transmitted without the risk of
losing information. Some protocols, such as the Simple Mail Transfer Protocol
(SMTP) for electronic mail, use transmission methods that can strip off certain
characters. To get around this, URLs are permitted to contain only characters
from a relatively small, universally safe alphabet.
3. In addition to wanting URLs to be transportable by all Internet protocols,
designers wanted them to be readable by people. So invisible, nonprinting
characters also are prohibited in URLs, even though these characters may pass
through mailers and otherwise be portable.
4. To complicate matters further, URLs also need to be complete. URL designers
realized there would be times when people would want URLs to contain binary data
 or characters outside of the universally safe alphabet. So, an escape mechanism
 was added, allowing unsafe characters to be encoded into safe characters for
transport.


## The URL Character Set
A restricted subset of the US-ASCII character set and escape sequences.


## Encoding Mechanisms
To get around the limitations of a safe character set representation, an
encoding scheme was devised to represent characters in a URL that are not safe.
The encoding simply represents the unsafe character by an “escape” notation,
consisting of a percent sign (`%`) followed by two hexadecimal digits that represent the ASCII code of
the character.


## Character Restrictions
Several characters have been reserved to have special meaning inside of a URL.
Others are not in the defined US-ASCII printable set. And still others are known
 to confuse some Internet gateways and protocols, so their use is discouraged.

<table>
    <thead>
        <tr>
            <td>Character</td>
            <td>Reservation/Restriction</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`%`</td>
            <td>
                Reserved as escape token for encoded characters
            </td>
        </tr>
        <tr>
            <td>`/`</td>
            <td>
                Reserved for delimiting splitting up path segments in the path component
            </td>
        </tr>
        <tr>
            <td>`.`</td>
            <td>
                Reserved in the path component
            </td>
        </tr>
        <tr>
            <td>`..`</td>
            <td>
                Reserved in the path component
            </td>
        </tr>
        <tr>
            <td>`#`</td>
            <td>
                Reserved as the fragment delimiter
            </td>
        </tr>
        <tr>
            <td>`?`</td>
            <td>
                Reserved as the query-string delimiter
            </td>
        </tr>
        <tr>
            <td>`;`</td>
            <td>
                Reserved as the params delimiter
            </td>
        </tr>
        <tr>
            <td>`:`</td>
            <td>
                Reserved to delimit the scheme, user/password, and host/port components
            </td>
        </tr>
        <tr>
            <td>`$ , +`</td>
            <td>
                Reserved
            </td>
        </tr>
        <tr>
            <td>`@ & =`</td>
            <td>
                Reserved because they have special meaning in the context of some schemes
            </td>
        </tr>
        <tr>
            <td>`{ } | \ ^ ~ [ ] ‘`</td>
            <td>
                Restricted because of unsafe handling by various transport agents, such as gateways
            </td>
        </tr>
        <tr>
            <td>`< > "`</td>
            <td>
                Unsafe; should be encoded because these characters often have meaning outside the scope of the URL, such as delimiting the URL itself in a document (e.g., “http://www.joes-hardware.com”)
            </td>
        </tr>
        <tr>
            <td>`0x00–0x1F, 0x7F`</td>
            <td>
                Restricted;characterswithinthesehexrangesfallwithinthenonprintablesectionoftheUS-ASCIIcharacter set
            </td>
        </tr>
        <tr>
            <td>`> 0x7F`</td>
            <td>
                Restricted; characters whose hex values fall within this range do not fall within the 7-bit range of the US-ASCII character set
            </td>
        </tr>
    </tbody>
</table>




## References
* [《HTTP: The Definitive Guide》](https://book.douban.com/subject/1440226/)
