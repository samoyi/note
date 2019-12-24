from turtle import *
from random import randint

# branchLen 越小，线条越细
# 最后的枝条画成叶子的形状
def setByBranchLen(t, len):
    if (len > 10):
        t.color('green')
        t.pensize(len/10)
    else:
        t.color('red')
        t.pensize(5)

# 随机分叉角度
def setAngle(base):
    right = base + randint(-5, 5)
    left = right + base + randint(-5, 5)
    backward = left - right
    return [right, left, backward]

def tree(branchLen, t):
    if branchLen > 5:
        setByBranchLen(t, branchLen)

        # 先画当前枝条
        t.forward(branchLen)

        angles = setAngle(20)
        print(angles)
        rightAngle = angles[0]
        leftAngle = angles[1]
        backwardAngle = angles[2]

        # 画右侧分支
        t.right(rightAngle)
        tree(branchLen-randint(10,15), t)

        # 画左侧分支
        t.left(leftAngle)
        tree(branchLen-randint(10,15), t)

        setByBranchLen(t, branchLen)

        # 回到当前枝条起点
        # 对于起点的那一条主分支,画完后是不需要回到起点的。
        # 但对于之后每一个二分分支：画完右侧分支后，乌龟会到终点，这时必须要再回到起点画左侧分支；
        # 画完左侧分之后，虽然本次递归不需要在画其他分支，但仍然需要退回到本次的分叉点，因为之后上一级要在此基础上回退
        t.right(backwardAngle)
        t.backward(branchLen)





t = Turtle()
myWin = t.getscreen()
t.left(90)
t.up()
t.backward(300)
t.down()
tree(110, t)
myWin.exitonclick()

