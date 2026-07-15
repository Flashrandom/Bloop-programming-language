package com.bloop.interpreter;

import java.util.ArrayList;
import java.util.List;
import com.bloop.tokenizer.*;
import com.bloop.parser.*;

public class Interpreter {

    public static class ExecutionResult {
        private final String output;
        private final List<String> errors;

        public ExecutionResult(String output, List<String> errors) {
            this.output = output;
            this.errors = errors;
        }

        public String getOutput() {
            return output;
        }

        public List<String> getErrors() {
            return errors;
        }
    }

    public ExecutionResult run(String sourceCode) {
        List<String> errors = new ArrayList<>();
        String output = "";
        try {
            // Step 1 — Tokenize
            Tokenizer tokenizer = new Tokenizer(sourceCode);
            List<Token> tokens = tokenizer.tokenize();

            // Step 2 — Parse
            Parser parser = new Parser(tokens);
            List<Instruction> instructions = parser.parse();

            // Step 3 — Execute
            Environment env = new Environment();
            for (Instruction instruction : instructions) {
                instruction.execute(env);
            }
            output = env.getOutput();
        } catch (Exception e) {
            errors.add(e.getMessage() != null ? e.getMessage() : e.toString());
        }
        return new ExecutionResult(output, errors);
    }
}
