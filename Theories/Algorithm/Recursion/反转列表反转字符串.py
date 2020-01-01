def reverseList(list):
    if (len(list) == 1):
        return list
    return reverseList(list[1:]) + list[0:1]

list = [1, 2, 3, 4, 5]
print(reverseList(list))



def reverseStr(str):
    if (str == ''):
        return ''
    return reverseStr(str[1:]) + str[0]

str = 'hello world'
print(reverseList(str))