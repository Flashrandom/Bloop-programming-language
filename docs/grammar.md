# BLOOP Grammar Specification

This document details the Backus-Naur Form (EBNF) representation of the BLOOP programming language.

---

## 📋 Lexical Tokens

```ebnf
IDENTIFIER  = [a-zA-Z_] { [a-zA-Z0-9_] }
NUMBER      = [0-9]+ [ "." [0-9]+ ]
STRING      = '"' { AnyCharacterExceptDoubleQuote } '"'
```

---

## 🔤 Syntax Grammar (EBNF)

```ebnf
Program         = { Instruction } EOF ;

Instruction     = AssignInstr
                | PrintInstr
                | IfInstr
                | RepeatInstr ;

AssignInstr     = "put" Expression "into" IDENTIFIER NewlineOrEOF ;

PrintInstr      = "print" Expression NewlineOrEOF ;

IfInstr         = "if" Expression "then" ":" NewlineOrEOF IndentedBlock ;

RepeatInstr     = "repeat" NUMBER "times" ":" NewlineOrEOF IndentedBlock ;

IndentedBlock   = { Instruction } ( BlankLine | EOF ) ;

Expression      = Comparison ;

Comparison      = Term { ( ">" | "<" | "==" ) Term } ;

Term            = Factor { ( "+" | "-" ) Factor } ;

Factor          = Primary { ( "*" | "/" ) Primary } ;

Primary         = NUMBER
                | STRING
                | IDENTIFIER ;

NewlineOrEOF    = NEWLINE | EOF ;
```
