package com.bloop.dto;

import java.util.List;

public class RunResponse {
    private String output;
    private List<String> errors;

    public RunResponse() {}

    public RunResponse(String output, List<String> errors) {
        this.output = output;
        this.errors = errors;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
