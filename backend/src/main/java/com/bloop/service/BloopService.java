package com.bloop.service;

import org.springframework.stereotype.Service;
import com.bloop.interpreter.Interpreter;
import com.bloop.dto.RunResponse;

@Service
public class BloopService {

    private final Interpreter interpreter = new Interpreter();

    /**
     * Executes the raw BLOOP script and returns a clean RunResponse.
     */
    public RunResponse executeCode(String code) {
        if (code == null) {
            code = "";
        }
        Interpreter.ExecutionResult result = interpreter.run(code);
        return new RunResponse(result.getOutput(), result.getErrors());
    }
}
