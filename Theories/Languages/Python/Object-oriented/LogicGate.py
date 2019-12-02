# 总的逻辑门类
class LogicGate:
    def __init__(self, n):
        self.label = n        # 当前逻辑门实例名称
        self.output = None    # 当前逻辑门实例输出

    def getLabel(self):
        return self.label

    # 获取当前逻逻辑门实例输出
    def getOutput(self):
        # 进行逻辑运算，获取输出。具体的运算根据不同的逻辑门，在相应的子类中实现该方法
        self.output = self.performGateLogic()
        return self.output


# 二元输入逻辑门类  例如与门、或门
class BinaryGate(LogicGate):
    def __init__(self, n):
        super().__init__(n)

        # 该逻辑门实例的两个针脚输入
        self.pinA = None
        self.pinB = None

    # 获取针脚A的输入值，分为两种情况
    def getPinA(self):
        # 如果当前针脚没有引用一个连接器，即没有连接器传入之前的逻辑门输出，则需要用户输入
        if self.pinA == None:
            return int(input("Enter Pin A input for gate " + \
                                 self.getLabel() + "-->"))
        else:
            # 使用连接器传入的之前逻辑门的输入作为该针脚的输入
            # self.pinA 引用连接器， getFrom 方法引用连接器 from 端链接的逻辑门， getOutput 方法进一步获得其输出
            return self.pinA.getFrom().getOutput()

    def getPinB(self):
        if self.pinB == None:
            return int(input("Enter Pin B input for gate " + \
                          self.getLabel() + "-->"))
        else:
            return self.pinB.getFrom().getOutput()
    
    # 确定让 connector 链接到当前逻辑门的哪个输入针脚上
    # 因为二元输入逻辑门有两个针脚，所以需要设定让连接器实例（source）链接到哪个针脚上
    def setNextPin(self, source):
        if self.pinA == None:
            self.pinA = source
        else:
            if self.pinB == None:
                self.pinB = source
            else:
                raise RuntimeError("Error: NO EMPTY PINS")


# 一元输入逻辑门类  例如非门  
class UnaryGate(LogicGate):
    def __init__(self, n):
        super().__init__(n)
        self.pin = None

    # 获取单针脚的输入值
    def getPin(self):
        if self.pin == None:
            return int(input("Enter Pin input for gate " + \
                          self.getLabel() + "-->"))
        else:
            return self.pin.getFrom().getOutput()   

    # 将 connector 链接到当前逻辑门实例的输入针脚上
    def setNextPin(self, source):
        if self.pin == None:
            self.pin = source
        else:
            raise RuntimeError("Error: NO EMPTY PINS")                    


# 与门类
class AndGate(BinaryGate):
    def __init__(self, n):
        super().__init__(n)

    # 与门逻辑运算，根据两个针脚的输入计算输出
    def performGateLogic(self):
        a = self.getPinA()
        b = self.getPinB()
        if a==1 and b==1:
            return 1
        else:
            return 0    


# 或门类
class OrGate(BinaryGate):
    def __init__(self, n):
        super().__init__(n)

    # 或门逻辑运算，根据两个针脚的输入计算输出
    def performGateLogic(self):
        a = self.getPinA()
        b = self.getPinB()
        if a==1 or b==1:
            return 1
        else:
            return 0                                   


# 非门类
class NotGate(UnaryGate):
    def __init__(self, n):
        super().__init__(n)

    # 非门逻辑运算，根据单针脚的输入计算输出
    def performGateLogic(self):
        a = self.getPin()
        return int(not a)


# 链接两个逻辑门实例的连接器类
class Connector:
    def __init__(self, fgate, tgate):
        # 设置当前连接器的 from 端逻辑门和 target 端逻辑门
        self.fromgate = fgate
        self.togate = tgate

        # 将当前连接器链接到 target 逻辑门的某个输入针脚上
        tgate.setNextPin(self)

    # 获取连接器 from 端链接的逻辑门
    def getFrom(self):
        return self.fromgate

    # 获取连接器 target 端链接的逻辑门
    def getTo(self):
        return self.togate


# 生成四个门电路
g1 = AndGate("G1")
g2 = AndGate("G2")
g3 = OrGate("G3")
g4 = NotGate("G4")
# 电路输入端是与门 g1 和 与门 g2，这两者的输出作为输入传给或门 g3 ，g3 的输出作为输入传给非门 g4
c1 = Connector(g1, g3)
c2 = Connector(g2, g3)
c3 = Connector(g3, g4)

# g4 是整个电路最终输出的逻辑门，这里请求它的输出
# 首先会调用 g4 的 performGateLogic 方法
# performGateLogic 会调用 getPin 获取单针脚输入值
# 因为 g4 的输入端有连接器，即 g4 的 pin 属性有值
# 所以调用连接器的 getFrom() 获取上级的 g3，进一步调用 getOutput() 请求g3 的输入
# g3 两个输入针脚，会分别通过连接器接收 g1 和 g2 的输出，重复上一部的逻辑
# 最后的 g1 g2 因为输入端都没有连接器，所以会依次请求用户对四个针脚进行输入
print(g4.getOutput())