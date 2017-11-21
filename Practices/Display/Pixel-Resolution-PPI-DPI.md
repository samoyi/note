# Pixel vs Resolution vs PPI vs DPI

## Pixel
* 像素，组成图像的元素。
* It has nothing to do with the display(on screen or on paper).
* A certain image consists of a certain number of pixels, no matter how it is
displayed or printed.
* 一张300px*300px的图像，如果显示在一个分辨率为300px*300px的显示器上，它正好占满整
个屏幕，如果显示在一个分辨率为900px*900px的显示器上，它只会占据屏幕的九分之一。但不
管在哪里显示，这个图像本身都是由90000个像素组成。即使显示的设备本身分辨率低于
300px*300px导致显示不全，但也不影响图像自身的信息。


## Resolution
* The display resolution of a device is the number of distinct pixels in each
dimension that can be displayed.
* 一个分辨率1920px*1080px的显示设备，它横向可以显示1920个像素，纵向可以显示1080个
像素，整个屏幕可以容纳2073600个像素
* 但具体一个像素有多大是不一定的。在一个分辨率1920px*1080px的手机上，一个像素必须要
很小才能容纳2073600个像素；在一个尺寸为19.2m*10.8m、分辨率为1920px*1080px的大屏幕上
，一个像素的尺寸会是1平方厘米，才能保证2073600个像素填满整个屏幕。


## PPI
* Pixels Per Inch
* 根据前面的例子，手机屏幕的PPI要比大屏幕的高得多
* 一个固定像素的图像，显示在屏幕上的实际大小，取决于屏幕的PPI。一个1920px*1080px的
图像，显示在上述手机上，就是一个手机屏的大小；显示在上述大屏幕上，就是一个巨幅图片。
* 在打印图片时，PPI的设置将决定一像素在打印纸上的实际尺寸，最终决定一个固定像素的图
像打印之后的实际尺寸。
* 对于屏幕来说，你可以降低它的PPI，比如可以把一个分辨率为1920px*1080px的显示设备（
它拥有2073600个发光点，每个发光点对应一个像素）的显示分辨率调为960px*540px，让它使
用4个发光点来对应一个像素。这样图像的像是就会变大，但是质量也会降低。
* 设置PPI主要还是用来打印，比如同样是个图像，你要把它印在明信片上和印在大海报上，显
然就会设置差别很大的PPI值。


## DPI
* Dots Per Inch
* 这属于打印机或印刷机的性能指标，即它可以在一英寸上点多少个颜色点。值越高表示打印机
越能细腻的表现信息，可以在尽量少的面积上输出更多的信息。
* 比如在一个一平方英寸的纸上，一个DPI为1的打印机仅仅能输出一个单色块，只能输出一像素
的图像；而一个DPI为1000的打印机，理论可以输出1000000个极小的色点，理论上它最大可以
完整输出一个1000px*1000px像素的图像。
* 和其他很多类似的情况一样，打印机的DPI只是打印质量的一方面，而且DPI越高还会越慢且越
用更多墨。


## References
* [PPI vs. DPI: what’s the difference?](https://99designs.com/blog/tips/ppi-vs-dpi-whats-the-difference/)
