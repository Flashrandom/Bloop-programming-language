# BLOOP Language Specification

BLOOP is an educational, dynamically typed interpreted language written in Java. This specification serves as the official reference for the language rules.

---

## 🏷️ Datatypes

BLOOP supports two core datatypes:
1. **Numbers**: Evaluated internally as double-precision floating-point values (e.g., `10`, `3.14`). Whole numbers are printed without the trailing `.0` representation.
2. **Strings**: Double-quoted text sequences (e.g., `"Hello world"`).

---

## 🔑 Keywords

The following words are reserved by the interpreter:
* `put`: Starts an assignment instruction.
* `into`: Followed by the target identifier in assignments.
* `print`: Outputs the evaluation of an expression.
* `if`: Begins a conditional block.
* `then`: Concludes an IF condition statement (paired with optional trailing `:`).
* `repeat`: Begins a loop control statement.
* `times`: Concludes a loop statement (paired with optional trailing `:`).

---

## 🧮 Operators

BLOOP supports arithmetic and comparison operators:
- **Arithmetic**: `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division).
- **Comparison**: `>` (greater than), `<` (less than), `==` (equal to).

Evaluation order adheres to traditional operator precedence:
1. Multiplicative (`*`, `/`)
2. Additive (`+`, `-`)
3. Comparison (`>`, `<`, `==`)

---

## 📝 Control Structures

### 1. Conditionals (IF)
Conditionals test comparison operations. The body consists of indented lines following the conditional declaration:

```bloop
put 10 into age
if age > 18 then:
    print "Access granted."
```

### 2. Loops (Repeat)
Loops run a block of instructions a fixed number of times:

```bloop
repeat 3 times:
    print "Tick"
```
