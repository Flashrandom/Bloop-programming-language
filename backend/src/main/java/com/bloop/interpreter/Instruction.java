package com.bloop.interpreter;

import java.util.List;

// ─── Instruction Interface ───────────────────────────────────────────────────

public interface Instruction {
    /**
     * Execute this instruction, reading and writing variables via the Environment.
     */
    void execute(Environment env);
}


// ─── AssignInstruction ───────────────────────────────────────────────────────

class AssignInstruction implements Instruction {
    private final String variableName;
    private final Expression expression;

    public AssignInstruction(String variableName, Expression expression) {
        this.variableName = variableName;
        this.expression   = expression;
    }

    @Override
    public void execute(Environment env) {
        Object value = expression.evaluate(env);
        env.set(variableName, value);
    }
}


// ─── PrintInstruction ────────────────────────────────────────────────────────

class PrintInstruction implements Instruction {
    private final Expression expression;

    public PrintInstruction(Expression expression) {
        this.expression = expression;
    }

    @Override
    public void execute(Environment env) {
        Object value = expression.evaluate(env);

        // Capture stdout redirected to our environment
        String text;
        if (value instanceof Double) {
            double d = (Double) value;
            if (d == Math.floor(d) && !Double.isInfinite(d)) {
                text = String.valueOf((long) d);
            } else {
                text = String.valueOf(d);
            }
        } else {
            text = String.valueOf(value);
        }
        env.print(text);
    }
}


// ─── IfInstruction ───────────────────────────────────────────────────────────

class IfInstruction implements Instruction {
    private final Expression condition;
    private final List<Instruction> body;

    public IfInstruction(Expression condition, List<Instruction> body) {
        this.condition = condition;
        this.body      = body;
    }

    @Override
    public void execute(Environment env) {
        Object result = condition.evaluate(env);

        if (result instanceof Boolean && (Boolean) result) {
            for (Instruction instruction : body) {
                instruction.execute(env);
            }
        }
    }
}


// ─── RepeatInstruction ───────────────────────────────────────────────────────

class RepeatInstruction implements Instruction {
    private final int count;
    private final List<Instruction> body;

    public RepeatInstruction(int count, List<Instruction> body) {
        this.count = count;
        this.body  = body;
    }

    @Override
    public void execute(Environment env) {
        for (int i = 0; i < count; i++) {
            for (Instruction instruction : body) {
                instruction.execute(env);
            }
        }
    }
}
