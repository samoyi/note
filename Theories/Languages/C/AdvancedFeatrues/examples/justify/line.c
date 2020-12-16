#include <stdio.h>
#include <string.h>
#include "line.h"

#define MAX_LINE_LEN 60    // 一行总长

char line[MAX_LINE_LEN+1]; // 该行字符串
int line_len = 0;          // 当前行的已经使用的字符数量
int num_words = 0;         // 当前行的单词数量

void clear_line(void)
{
    line[0] = '\0';
    line_len = 0;
    num_words = 0;
}

void add_word(const char *word)
{
    // 如果该行现在就存在单词，则需要空一格
    if ( num_words > 0 ) {
        // line[line_len] 之前是 \0，现在替换为空格
        line[line_len] = ' ';
        // 添加重新添加 \0
        line[line_len+1] = '\0';
        line_len++;
    }

    // 把单词填进去（最后会自动生成一个 \0）
    strcat(line, word);
    line_len += strlen(word);
    num_words++;
}

int space_remaining(void)
{
    return MAX_LINE_LEN - line_len;
}

void write_line(void)
{
    int extra_spaces, spaces_to_insert, i, j;

    // 为了保持每行长度相等而需要额外添加的空格
    // 这些额外的空格需要添加在现有的单词之间
    extra_spaces = MAX_LINE_LEN - line_len; 

    // 遍历所有已有的字符
    for ( i = 0; i < line_len; i++ ) {
        if ( line[i] != ' ' ) {
            // 如果是非空的有效字符则直接输出
            putchar(line[i]);
        }
        else {
            // 如果是单词间的空格，则插入额外补齐用的空格
            // 为了在单词之间添加空格，需要计算每个单词间添加几个空格
            spaces_to_insert = extra_spaces / (num_words - 1);
            // 插入空格
            for ( j = 1; j <= spaces_to_insert + 1; j++ ) {
                putchar(' ');
            }

            // 每次插入几个空格（spaces_to_insert）要动态计算
            // 例如本例中输出的一行如下
            // need for a system implementation language  efficient  enough
            // 开始 5 次的 spaces_to_insert 计算都是 0.x 向下取整，
            // 最后两次 spaces_to_insert 都是 1。
            extra_spaces -= spaces_to_insert; 
            num_words--;
        }
    }
    putchar('\n');
}

void flush_line(void)
{
    if (line_len > 0)
        puts(line);
}