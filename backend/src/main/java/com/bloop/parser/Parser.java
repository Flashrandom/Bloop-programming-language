package com.bloop.parser;

import java.util.ArrayList;
import java.util.List;
import com.bloop.tokenizer.*;
import com.bloop.interpreter.*;

public class Parser {
    private final List<Token> tokens;
    private int current;

    public Parser(List<Token> tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    //  Entry point
    public List<Instruction> parse() {
        List<Instruction> instructions = new ArrayList<>();
        skipNewlines();

        while (!isAtEnd()) {
            Instruction instr = parseInstruction();
            if (instr != null) instructions.add(instr);
            skipNewlines();
        }
        return instructions;
    }

    //  Decide which instruction to parse
    private Instruction parseInstruction() {
        Token token = peek();

        switch (token.getType()) {
            case PUT:    return parseAssign();
            case PRINT:  return parsePrint();
            case IF:     return parseIf();
            case REPEAT: return parseRepeat();
            default:
                throw new RuntimeException(
                "Syntax Error: Unexpected token '" + token.getValue() +
                "' at line " + token.getLine());
        }
    }

    // ── Assignment Statement parsing ───────────────────────────────────────────────

    //  put <expr> into <variable>
    private Instruction parseAssign() {
        consume(TokenType.PUT);
        Expression expr = parseComparison();
        consume(TokenType.INTO);
        Token name = consume(TokenType.IDENTIFIER);
        consumeNewlineOrEOF();

        return ASTFactory.createAssign(name.getValue(), expr);
    }

    // ── Print Statement parsing ───────────────────────────────────────────────

    //  print <expr>
    private Instruction parsePrint() {
        consume(TokenType.PRINT);
        Expression expr = parseComparison();
        consumeNewlineOrEOF();
        return ASTFactory.createPrint(expr);
    }

    // ── Conditional Statement parsing ──────────────────────────────────────────

    private Instruction parseIf() {
        consume(TokenType.IF);
        Expression condition = parseComparison();
        consume(TokenType.THEN);
        consumeNewlineOrEOF();
        List<Instruction> body = parseIndentedBlock();
        return ASTFactory.createIf(condition, body);
    }

    // ── Repeat parsing ───────────────────────────────────────────────

    private Instruction parseRepeat() {
        consume(TokenType.REPEAT);
        Token countToken = consume(TokenType.NUMBER);
        int count = (int) Double.parseDouble(countToken.getValue());
        consume(TokenType.TIMES);
        consumeNewlineOrEOF();

        List<Instruction> body = parseIndentedBlock();
        return ASTFactory.createRepeat(count, body);
    }

    // ── Indented block parsing ───────────────────────────────────────────────

    private List<Instruction> parseIndentedBlock() {
        List<Instruction> body = new ArrayList<>();

        while (!isAtEnd()) {
            int newlineCount = skipNewlinesCount();

            if (isAtEnd()) break;

            TokenType nextType = peek().getType();

            // STOP CONDITION:
            if (newlineCount >= 1 && isBlockStarter(nextType)) {
                break;
            }   

            Instruction instr = parseInstruction();

            if (instr != null) body.add(instr);
            else {
                throw new RuntimeException(
                    "Invalid statement inside block at line " + peek().getLine());
            }
        }

        return body;
    }

    private boolean isBlockStarter(TokenType type) {
        return type == TokenType.PUT    ||
               type == TokenType.PRINT  ||
               type == TokenType.IF     ||
               type == TokenType.REPEAT;
    }

    private Expression parseComparison() {
        Expression left = parseExpression();

        while (match(TokenType.GREATER, TokenType.LESS, TokenType.EQUAL_EQUAL)) {
            String op = previous().getValue();
            Expression right = parseExpression();
            left = ASTFactory.createBinaryOp(left, op, right);
        }
        return left;
    }

    private Expression parseExpression() {
        Expression left = parseTerm();

        while (match(TokenType.PLUS, TokenType.MINUS)) {
            String op = previous().getValue();
            Expression right = parseTerm();
            left = ASTFactory.createBinaryOp(left, op, right);
        }
        return left;
    }

    private Expression parseTerm() {
        Expression left = parsePrimary();

        while (match(TokenType.STAR, TokenType.SLASH)) {
            String op = previous().getValue();
            Expression right = parsePrimary();
            left = ASTFactory.createBinaryOp(left, op, right);
        }
        return left;
    }

    private Expression parsePrimary() {
        if (match(TokenType.NUMBER)) {
            return ASTFactory.createNumber(Double.parseDouble(previous().getValue()));
        }
        if (match(TokenType.STRING)) {
            return ASTFactory.createString(previous().getValue());
        }
        if (match(TokenType.IDENTIFIER)) {
            return ASTFactory.createVariable(previous().getValue());
        }
        throw new RuntimeException(
            "Unexpected token in expression: " + peek() + " on line " + peek().getLine());
    }

    private Token peek() {
        return tokens.get(current);
    }

    private Token previous() {
        return tokens.get(current - 1);
    }

    private Token advance() {
        if (!isAtEnd()) current++;
        return previous();
    }

    private boolean check(TokenType type) {
        return !isAtEnd() && peek().getType() == type;
    }
    
    private boolean match(TokenType... types) {
        for (TokenType type : types) {
            if (check(type)) {
                advance();
                return true;
            }
        }
        return false;
    }

    private Token consume(TokenType type) {
        if (check(type)) return advance();
        throw new RuntimeException(
            "Expected " + type + " but got " + peek() + " on line " + peek().getLine());
    }

    private void consumeNewlineOrEOF() {
        if (check(TokenType.NEWLINE)) advance();
    }

    private void skipNewlines() {
        while (check(TokenType.NEWLINE)) advance();
    }

    private boolean isAtEnd() {
        return peek().getType() == TokenType.EOF;
    }

    private int skipNewlinesCount() {
        int count = 0;
        while (check(TokenType.NEWLINE)) {
            advance();
            count++;
        }
        return count;
    }
}
