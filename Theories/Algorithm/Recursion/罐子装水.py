# TODO   不具有可拓展性。而且这个问题是出现在递归章节中的，但实际也没有用到递归



def fill(max, tName):
    print('fill', tName)
    return max

def clean(tName):
    print('clean', tName)
    return 0

def transfer(t1, t2, n, max1, max2, tName1, tName2):
    if n > t1:
        raise Exception('n > t1')
    else:
        t1 -= n
        t2 += n
        if t2 > max2:
            t2 = max2
        print('transfer', n, 'frome', tName1, 'to', tName2)
        return [t1, t2]

def printT(t1, t2):
    print('tank1', t1, ', tank2', t2, '\n')

def foo(max1, max2, n):
    t1 = 0
    t2 = 0

    t1 = fill(max1, 't1')
    printT(t1, t2)

    re = transfer(t1, t2, max2, max1, max2, 't1', 't2')
    t1 = re[0]
    t2 = re[1]
    printT(t1, t2)

    t2 = clean('t2')
    printT(t1, t2)

    re = transfer(t1, t2, t1, max1, max2, 't1', 't2')
    t1 = re[0]
    t2 = re[1]
    printT(t1, t2)

    t1 = fill(max1, 't1')
    printT(t1, t2)

    re = transfer(t1, t2, max2-t2, max1, max2, 't1', 't2')
    t1 = re[0]
    t2 = re[1]
    printT(t1, t2)



# 有2个坛子，其中一个的容量是4加仑，另一个的是3加仑。坛子上都没有刻度线。可以用水泵将它们装满水。如何使4加仑的坛子最后装有2加仑的水？
foo(4, 3, 2)
