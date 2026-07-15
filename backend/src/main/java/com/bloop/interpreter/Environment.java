package com.bloop.interpreter;

import java.util.HashMap;
import java.util.Map;

public class Environment {
    private final Map<String, Object> store = new HashMap<>();
    private final StringBuilder outputBuffer = new StringBuilder();

    /**
     * Store or update a variable's value.
     */
    public void set(String name, Object value) {
        store.put(name, value);
    }

    /**
     * Retrieve a variable's current value.
     */
    public Object get(String name) {
        if (!store.containsKey(name)) {
            throw new RuntimeException("Variable not defined: " + name);
        }
        return store.get(name);
    }

    /**
     * Write output line to buffer instead of System.out.
     */
    public void print(String value) {
        outputBuffer.append(value).append("\n");
    }

    /**
     * Retrieve all collected outputs.
     */
    public String getOutput() {
        return outputBuffer.toString();
    }
}
