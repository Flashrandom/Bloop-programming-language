package com.bloop.interpreter;

import java.util.List;

/**
 * Factory class to instantiate AST nodes which are package-private within
 * the com.bloop.interpreter package, decoupling them from the parser.
 */
public class ASTFactory {

    public static Instruction createAssign(String variableName, Expression expression) {
        return new AssignInstruction(variableName, expression);
    }

    public static Instruction createPrint(Expression expression) {
        return new PrintInstruction(expression);
    }

    public static Instruction createIf(Expression condition, List<Instruction> body) {
        return new IfInstruction(condition, body);
    }

    public static Instruction createRepeat(int count, List<Instruction> body) {
        return new RepeatInstruction(count, body);
    }

    public static Expression createBinaryOp(Expression left, String operator, Expression right) {
        return new BinaryOpNode(left, operator, right);
    }

    public static Expression createNumber(double value) {
        return new NumberNode(value);
    }

    public static Expression createString(String value) {
        return new StringNode(value);
    }

    public static Expression createVariable(String name) {
        return new VariableNode(name);
    }
}
