# System Folders

## `/bin` Essential command binaries
The `/bin` folder holds many of binaries running on your machine. When you type
a command into the terminal, this is the folder you’re searching through.

## `/boot` Static files of the boot loader
These are the files that your computer needs to boot. This is where your
bootloader and the Linux kernel live. Needless to say, the stuff in here is
essential. Screwing around in here can cause your computer not to start.

## `/dev` Device files
This folder’s name is short for device, not developer. Here you find files
related to the hardware in your machine, such as the CPU and various hard
drives.  
Unix systems treat everything as a file, even when they aren’t. The “fake” files
 in `/dev` won’t make sense to your average user, but they make life easier for
developers.

## `/etc` Host-specific system configuration
This began as a place to dump files that didn’t have a home. Now you will find
start-up scripts and configuration files for your applications. If you want to
edit which users have sudo privileges, for example, the configuration file is
here.

## `/home`
Each user gets their own directory. Here you see your documents, music, videos,
and other content you see in your file manager.

## `/sbin` Essential system binaries
`/sbin` holds binaries reserved for system administrators. These are the
commands that normal users may not need to access.

## `/lib` / `lib64` Essential shared libraries and kernel modules
This location holds library images that your computer needs to boot plus kernel
modules. The contents of this folder also enable you to run commands in a root environment. In short, important stuff.

## `/media` Mount point for removeable media
As mentioned earlier, Linux treats everything as a file, including devices. Like
 `/dev`, this folder contains files corresponding to hardware. In this case,
it’s removable media like flash drives and CD roms.

## `/mnt` Mount point for mounting a filesystem temporarily
This is the directory for temporarily mounting drives. Think ISO images. Older
Linux systems put more demand on the `/mnt` directory. These days many temporary
 mounts, such as loading an external hard drive, use `/media`.

## `/opt` Add-on application software packages
The name is short for optional. This is a space third-party software can use,
such as Java or Google Chrome.

## `/proc`
Here you will find information about currently running processes. These “fake”
files don’t actually take up disk space. But like the contents of `/dev` and
`/media`, they look real.  
These folders give information on your computer’s hardware and the kernel.
`/proc/cpuinfo` provides details about your CPU, for example. You may want to
let a system monitor access these files rather than view them directly.

## `/root`
When you sign in as the root user, you have a separate home directory. This is
it. Note, `/root` is different from `/`, which is also referred to as your root
directory.

## `/run`
There are some directories you would not have encountered a decade or two ago.
This is one of them. It started to appear in 2011.  
Some programs that run early during the boot process placed runtime data under
`/dev` and other locations. This directory provides a dedicated space for this.

## `/srv` Data for services provided by this system
These letters stands for service, specifically those that you serve through
your machine. Don’t be surprised to see nothing in this folder if you aren’t
using your machine as a server.

## `/sys`
This directory is a virtual filesystem. It displays information related to
kernel subsystems, hardware devices, and associated device drivers. This area of
 your computer is a product of sysfs.

## `/tmp` Temporary files
Unsurprisingly, this folder contains temporary files. Here you may find ZIP
files from programs and crash logs that won’t stick around. In the past, hard
drives were small. Now we have more space than we need, but that doesn’t mean
every bit of data needs to stick around forever.

## `/usr` Secondary hierarchy
User-facing applications and tools appear in this directory. Here you can find
binaries, source code, icons, documentation, and other useful data.

## `/var` Variable data
This space contains variable data. This is the spot for system logs, printer
spools, lock files, and similar files. You may see cached data and folders
specific to games. `/var` is separate from `/usr` for times when the latter is
read-only.

## References
* [What Are Those Folders in Your Linux Root Directory?](https://www.makeuseof.com/tag/folders-linux-root-directory/)
* [The Root Directory](http://www.tldp.org/LDP/Linux-Filesystem-Hierarchy/html/the-root-directory.html)
