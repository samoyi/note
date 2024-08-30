package com.craftinginterpreters.lox;

import java.util.List;

class AstPrinter implements Expr.Visitor<String> {

    String print(Expr expr) {
        return expr.accept(this);
    }

    @Override
        public String visitBinaryExpr(Expr.Binary expr) {
            return parenthesize(expr.operator.lexeme, expr.left, expr.right);
        }

        @Override
        public String visitGroupingExpr(Expr.Grouping expr) {
            return parenthesize("group", expr.expression);
        }

        @Override
        public String visitLiteralExpr(Expr.Literal expr) {
            if (expr.value == null) return "nil";
            return expr.value.toString();
        }

        @Override
        public String visitUnaryExpr(Expr.Unary expr) {
            return parenthesize(expr.operator.lexeme, expr.right);
        }

    private String parenthesize(String name, Expr... exprs) {
        StringBuilder builder = new StringBuilder();

        builder.append("(").append(name);
        for (Expr expr : exprs) {
            builder.append(" ");
            builder.append(expr.accept(this));
        }
        builder.append(")");

        return builder.toString();
    }

    public static void main(String[] args) {
        // 不用手动实现语法树了，在 Lox 的 run 方法中使用 Parser 把 token 自动流解析为语法树并打印
        // Expr expression = new Expr.Binary(
        //     new Expr.Unary(
        //         new Token(TokenType.MINUS, "-", null, 1),
        //         new Expr.Literal(123)),
        //     new Token(TokenType.STAR, "*", null, 1),
        //     new Expr.Grouping(
        //         new Expr.Literal(45.67)));

        // System.out.println(new AstPrinter().print(expression));
    }
}
