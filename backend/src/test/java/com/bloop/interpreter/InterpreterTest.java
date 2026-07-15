package com.bloop.interpreter;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class InterpreterTest {

    @Test
    public void testBasicPrintAndAssign() {
        Interpreter interpreter = new Interpreter();
        Interpreter.ExecutionResult result = interpreter.run("put 42 into answer\nprint answer");

        assertTrue(result.getErrors().isEmpty());
        assertEquals("42\n", result.getOutput());
    }

    @Test
    public void testArithmetic() {
        Interpreter interpreter = new Interpreter();
        Interpreter.ExecutionResult result = interpreter.run("put 2 + 3 * 4 into val\nprint val");

        assertTrue(result.getErrors().isEmpty());
        assertEquals("14\n", result.getOutput()); // 2 + (3 * 4) = 14
    }

    @Test
    public void testConditional() {
        Interpreter interpreter = new Interpreter();
        Interpreter.ExecutionResult result = interpreter.run(
            "put 10 into score\n" +
            "if score > 5 then:\n" +
            "    print \"pass\"\n"
        );

        assertTrue(result.getErrors().isEmpty());
        assertEquals("pass\n", result.getOutput());
    }

    @Test
    public void testRepeatLoop() {
        Interpreter interpreter = new Interpreter();
        Interpreter.ExecutionResult result = interpreter.run(
            "repeat 3 times:\n" +
            "    print \"hi\"\n"
        );

        assertTrue(result.getErrors().isEmpty());
        assertEquals("hi\nhi\nhi\n", result.getOutput());
    }

    @Test
    public void testDivisionByZero() {
        Interpreter interpreter = new Interpreter();
        Interpreter.ExecutionResult result = interpreter.run("put 5 / 0 into bad");

        assertFalse(result.getErrors().isEmpty());
        assertTrue(result.getErrors().get(0).contains("Division by zero."));
    }

    @Test
    public void testUndefinedVariable() {
        Interpreter interpreter = new Interpreter();
        Interpreter.ExecutionResult result = interpreter.run("print nonexistent");

        assertFalse(result.getErrors().isEmpty());
        assertTrue(result.getErrors().get(0).contains("Variable not defined: nonexistent"));
    }
}
