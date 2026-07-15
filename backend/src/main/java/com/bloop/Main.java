package com.bloop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import com.bloop.interpreter.Interpreter;

@SpringBootApplication
public class Main {

    public static void main(String[] args) {
        // If a file is passed as the first argument, run in CLI mode
        if (args.length == 1 && args[0].endsWith(".bloop")) {
            String source;
            try {
                source = Files.readString(Path.of(args[0]));
            } catch (IOException e) {
                System.err.println("Unable to read file: " + args[0]);
                System.exit(1);
                return;
            }

            Interpreter interpreter = new Interpreter();
            Interpreter.ExecutionResult result = interpreter.run(source);
            
            if (!result.getErrors().isEmpty()) {
                System.err.println("Errors encountered:");
                for (String error : result.getErrors()) {
                    System.err.println(error);
                }
                System.exit(1);
            } else {
                System.out.print(result.getOutput());
            }
        } else {
            // Otherwise, boot up the Spring Boot Web application
            SpringApplication.run(Main.class, args);
        }
    }
}
