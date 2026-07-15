package com.bloop.tokenizer;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class TokenizerTest {

    @Test
    public void testKeywordsAndIdentifiers() {
        Tokenizer tokenizer = new Tokenizer("put 10 into x");
        List<Token> tokens = tokenizer.tokenize();

        assertEquals(5, tokens.size()); // PUT, NUMBER, INTO, IDENTIFIER, EOF
        assertEquals(TokenType.PUT, tokens.get(0).getType());
        assertEquals("10", tokens.get(1).getValue());
        assertEquals(TokenType.INTO, tokens.get(2).getType());
        assertEquals("x", tokens.get(3).getValue());
        assertEquals(TokenType.EOF, tokens.get(4).getType());
    }

    @Test
    public void testNumbersAndStrings() {
        Tokenizer tokenizer = new Tokenizer("put 3.14 into y\nprint \"Hello BLOOP\"");
        List<Token> tokens = tokenizer.tokenize();

        // line 1: PUT, NUMBER(3.14), INTO, IDENTIFIER(y), NEWLINE
        // line 2: PRINT, STRING(Hello BLOOP), EOF
        assertEquals(8, tokens.size());
        assertEquals(TokenType.NUMBER, tokens.get(1).getType());
        assertEquals("3.14", tokens.get(1).getValue());
        
        assertEquals(TokenType.NEWLINE, tokens.get(4).getType());
        
        assertEquals(TokenType.PRINT, tokens.get(5).getType());
        assertEquals(TokenType.STRING, tokens.get(6).getType());
        assertEquals("Hello BLOOP", tokens.get(6).getValue());
        assertEquals(TokenType.EOF, tokens.get(7).getType());
    }

    @Test
    public void testOperators() {
        Tokenizer tokenizer = new Tokenizer("+ - * / > < == :");
        List<Token> tokens = tokenizer.tokenize();

        // Note: ':' is skipped by Tokenizer.
        // Expected: PLUS, MINUS, STAR, SLASH, GREATER, LESS, EQUAL_EQUAL, EOF
        assertEquals(8, tokens.size());
        assertEquals(TokenType.PLUS, tokens.get(0).getType());
        assertEquals(TokenType.MINUS, tokens.get(1).getType());
        assertEquals(TokenType.STAR, tokens.get(2).getType());
        assertEquals(TokenType.SLASH, tokens.get(3).getType());
        assertEquals(TokenType.GREATER, tokens.get(4).getType());
        assertEquals(TokenType.LESS, tokens.get(5).getType());
        assertEquals(TokenType.EQUAL_EQUAL, tokens.get(6).getType());
        assertEquals(TokenType.EOF, tokens.get(7).getType());
    }
}
