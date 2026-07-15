package com.bloop.parser;

import org.junit.jupiter.api.Test;
import java.util.List;
import com.bloop.tokenizer.*;
import com.bloop.interpreter.Instruction;
import static org.junit.jupiter.api.Assertions.*;

public class ParserTest {

    @Test
    public void testValidParsing() {
        Tokenizer tokenizer = new Tokenizer("put 15 into age\nprint age");
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);
        List<Instruction> instructions = parser.parse();

        assertNotNull(instructions);
        assertEquals(2, instructions.size());
    }

    @Test
    public void testSyntaxErrorUnexpectedToken() {
        // "times" without repeat
        Tokenizer tokenizer = new Tokenizer("times 5");
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);

        Exception exception = assertThrows(RuntimeException.class, parser::parse);
        assertTrue(exception.getMessage().contains("Syntax Error: Unexpected token 'times'"));
    }

    @Test
    public void testSyntaxErrorUnmatchedToken() {
        // "put" without expression
        Tokenizer tokenizer = new Tokenizer("put into x");
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);

        assertThrows(RuntimeException.class, parser::parse);
    }
}
