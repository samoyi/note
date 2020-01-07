def PascalTriangle(n):
    if n == 0:
        return [1]
    elif n == 1:
        return [1, 1]
    else:
        last = PascalTriangle(n-1)
        list = []
        for index in range(1, len(last)):
            list.append(last[index-1] + last[index])
        return [1] + list + [1]


print(PascalTriangle(7)) # [1, 7, 21, 35, 35, 21, 7, 1]