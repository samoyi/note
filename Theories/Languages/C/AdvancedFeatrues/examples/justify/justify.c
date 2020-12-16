/* Formats a file of text */

#include <string.h>
#include "line.h"
#include "word.h"

#define MAX_WORD_LEN 20

int main(void)
{
    char word[MAX_WORD_LEN+2];
    int word_len;


    clear_line();

    // 不断的读取单词并向行缓冲区写入单词，
    // 期间如果一行满了就输出一行并清空缓冲区，然后继续读取和写入
    for (;;) {
        // 读取一个单词
        read_word(word, MAX_WORD_LEN+1);
        word_len = strlen(word);

        // 读取文件结束
        if (word_len == 0) {
            flush_line();
            return 0;
        }

        // 单词长度超过允许最大长度，则把刚超过的那一位字符设为 *。
        if ( word_len > MAX_WORD_LEN ) {
            word[MAX_WORD_LEN] = '*';
        }

        // 该行剩余的空位是否已经不够插入当前读入的单词
        // 不够的话就是并输出该行内容并清空行缓冲区
        // 当前单词插入时，要先和前面的单词空一个，所以 +1。
        if ( word_len + 1 > space_remaining() ) {
            // 不够的话就输出该行，然后清空行缓冲区，准备进入下一行的写入
            write_line();
            clear_line();
        }

        // 把该单词添加到当前的行缓冲区
        add_word(word);
    }
}