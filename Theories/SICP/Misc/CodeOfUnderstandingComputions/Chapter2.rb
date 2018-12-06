
class Number < Struct.new(:value)
    def to_s
        value.to_s
    end
    def inspect
        "«#{self}»"
    end
    def reducible?
        false
    end
end

class Add < Struct.new(:left, :right)
    def to_s
        "#{left} + #{right}"
    end
    def inspect
        "«#{self}»"
    end
    def reducible?
        true
    end
    def reduce(env)
        if left.reducible?
            Add.new(left.reduce(env), right)
        elsif right.reducible?
            Add.new(left, right.reduce(env))
        else
            Number.new(left.value + right.value)
        end
    end
end

class Multiply < Struct.new(:left, :right)
    def to_s
        "#{left} * #{right}"
    end
    def inspect
        "«#{self}»"
    end
    def reducible?
        true
    end
    def reduce(env)
        if left.reducible?
            Multiply.new(left.reduce(env), right)
        elsif right.reducible?
            Multiply.new(left, right.reduce(env))
        else
            Number.new(left.value * right.value)
        end
    end
end

class Boolean < Struct.new(:value)
    def to_s
        value.to_s
    end
    def inspect
        "«#{self}»"
    end
    def reducible?
        false
    end
end

class LessThan < Struct.new(:left, :right)
    def to_s
        "«#{left} < #{right}»"
    end
    def inspect
        "«#{self}»"
    end
    def reducible?
        true
    end
    def reduce(env)
        if left.reducible?
            LessThan.new(left.reduce(env), right)
        elsif right.reducible?
            LessThan.new(left, right.reduce(env))
        else
            Boolean.new(left.value < right.value)
        end
    end
end

class Variable < Struct.new(:name)
    def to_s
        name.to_s
    end
    def inspect
        "«#{self}»"
    end
    def reducible?
        true
    end
    def reduce(env)
        env[name]
    end
end


class DoNothing
    def to_s
        'do-nothing'
    end
    def inspect
        "«#{self}»"
    end
    def ==(other_statement)
        other_statement.instance_of?(DoNothing)
    end
    def reducible?
        false
    end
end

class Assign < Struct.new(:name, :exp)
    def to_s
        "«#{name} = #{exp}»"
    end
    def inspect
        "«#{self}»"
    end
    def reducible?
        true
    end
    def reduce(env)
        if exp.reducible?
            [Assign.new(name, exp.reduce(env)), env]
        else
            [DoNothing.new, env.merge({name=> exp})]
        end
    end
end

# statement = Assign.new(
#     :x,
#     Add.new(Variable.new(:x), Number.new(1))
# )
# env = {x: Number.new(2)}
# statement, environment = statement.reduce(env)
# puts statement
# puts environment
# statement, environment = statement.reduce(env)
# puts statement
# puts environment
# statement, environment = statement.reduce(env)
# puts statement
# puts environment
# puts statement.reducible?



# class Machine < Struct.new(:exp, :env)
#     def step
#         self.exp = exp.reduce(env)
#     end
#     def run
#         while exp.reducible?
#             puts exp
#             step
#         end
#         puts exp
#     end
# end

class Machine < Struct.new(:statement, :environment)
    def step
        self.statement, self.environment = statement.reduce(environment)
    end

    def run
        while statement.reducible?
            puts "#{statement}, #{environment}"
            step
        end

        puts "#{statement}, #{environment}"
    end
end

Machine.new(
    Assign.new(:x, Add.new(Variable.new(:x), Number.new(1))),
    {x: Number.new(2)}
).run
