/* description: Parses end executes mathematical expressions. */

%define moduleName "calculator"

/* lexical grammar */
%lex
%%
\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER';
"="                   return '=';
"*"                   return '*';
"/"                   return '/';
"-"                   return '-';
"+"                   return '+';
"^"                   return '^';
"("                   return '(';
")"                   return ')';
"sqrt"                return 'SQRT';
"pi"                  return 'PI';
"e"                   return 'E';
"sin"                 return 'SIN';
"cos"                 return 'COS';
"tan"                 return 'TAN';
"abs"                 return 'ABS';
"ceil"                return 'CEIL';
"floor"               return 'FLOOR';
"log"                 return 'LOG';
";"                   return ';';
\w+                   return 'VARNAME';
<<EOF>>               return 'EOF';

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : definitions ';' e EOF
        %{
            yy = {};
            console.log($3);
            return $3;
        %}
    | e EOF
        %{
            yy = {};
            console.log($1);
            return $1;
        %}
    ;

definitions
    : definition
    | definitions definition
    ;

definition
    : VARNAME '=' NUMBER
        {yy["VAR_" + $1] = parseFloat($3);}
    ;

e
    :  e '+' e
        {$$ = $1 + $3;}
    | e '-' e
        {$$ = $1 - $3;}
    | e '*' e
        {$$ = $1 * $3;}
    | e '/' e
        {$$ = $1 / $3;}
    | e '^' e
        {$$ = Math.pow($1, $3);}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | SQRT '(' e ')'
        {$$ = Math.sqrt( $3 );}
    | SIN '(' e ')'
        {$$ = Math.sin( $3 );}
    | COS '(' e ')'
        {$$ = Math.cos( $3 );}
    | TAN '(' e ')'
        {$$ = Math.tan( $3 );}
    | ABS '(' e ')'
        {$$ = Math.abs( $3 );}
    | CEIL '(' e ')'
        {$$ = Math.ceil( $3 );}
    | FLOOR '(' e ')'
        {$$ = Math.floor( $3 );}
    | LOG '(' e ')'
        {$$ = Math.log( $3 );}
    | NUMBER
        {$$ = parseFloat(yytext);}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | VARNAME
        {$$ = yy["VAR_" + yytext];}
    ;

%% /* Extra Code */



function AST (e) {
    this.e = e;
}

AST.prototype.toLatex = function() {
    return this.e.toLatex();
}

AST.prototype.toMathml = function() {
    return this.e.toMathml();
}

AST.prototype.eval = function(env) {
    return this.e.eval(env);
}

AST.prototype.vars = function() {
    return this.e.vars();
}

function ASTBinary(lhs, rhs, operator) {
    this.lhs = lhs
    this.rhs = rhs
    this.operator = operator
}

ASTBinary.prototype.toLatex = function() {
    var lhs = this.lhs.toLatex()
    var rhs = this.rhs.toLatex()

    return "{" + lhs + " " + this.operator + " " + rhs + "}"
}

ASTBinary.prototype.toMathml = function() {
    var lhs = this.lhs.toMathml()
    var rhs = this.rhs.toMathml()
    return "<mrow>" + lhs + " <mo>" + this.operator + "</mo> " + rhs + "</mrow>"
}

ASTBinary.prototype.eval = function(env) {
    var lhs = this.lhs.eval(env);
    var rhs = this.rhs.eval(env);

    switch this.operator {
    case "+":
        return lhs + rhs;
    case "-":
        return lhs - rhs;
    case "*":
        return lhs * rhs;
    case "/":
        return lhs / rhs;
    case "^":
        return Math.pow(lhs, rhs);
    }
    return NaN;
}

ASTBinary.prototype.vars = function() {
    var lhs = this.lhs.vars()
    var rhs = this.rhs.vars()
    return lhs + rhs
}



function ASTUnary(lhs, operator) {
    this.lhs = lhs
    this.operator = operator
}


    | '-' e %prec UMINUS
        {$$ = "<mrow><mo>-</mo>" + $2 + "</mrow>";}
    | '(' e ')'
        {$$ = "<mrow><mo> ( </mo>" + $2 + "<mo> ) </mo></mrow>";}
    | SQRT '(' e ')'
        {$$ = "<msqrt><mrow>" + $3 + "</mrow></msqrt>";}


ASTUnary.prototype.toLatex = function() {
    var lhs = this.lhs.toLatex()

    switch(this.operator){
        case "-":
            return "{-" + lhs + "}";
        case "sqrt":
            return "\\sqrt{" + lhs + "}";
        case "(":
            return "({" + lhs + "})";
        case "abs":
            return "|{" + lhs + "}|";
        case "ceil":
            return "\lceil{" + lhs + "}\rceil";
        case "floor":
            return "\lfloor{" + lhs + "}\rfloor";
        default:
            return this.operator + "({" + lhs + "})";

    }
}

ASTUnary.prototype.toMathml = function() {
    var lhs = this.lhs.toMathml()
    var op = "<mo> " +this.op + "</mo> "
    switch(this.operator){
        case "-":
            return "<mrow>" + op + lhs + "</mrow>";
        case "sqrt":
            return "<msqrt><mrow>" + lhs + "</mrow></msqrt>";
        case "(":
            return "<mrow><mo> ( </mo>" + lhs + "<mo> ) </mo></mrow>";
        case "abs":
            return "<mrow><mo> | </mo>" + lhs + "<mo> | </mo></mrow>";
        case "ceil":
            return "<apply> <ceiling/><ci>" + lhs + "</ci></apply>";
        case "floor":
            return "<apply> <floor/><ci>" + lhs + "</ci></apply>";
        default:
            return "<mrow>" + op + "( " + lhs + " )</mrow>";

    }
}

ASTUnary.prototype.eval = function(env) {
    var lhs = this.lhs.eval(env);
    var rhs = this.rhs.eval(env);

    switch this.operator {
    case "+":
        return lhs + rhs;
    case "-":
        return lhs - rhs;
    case "*":
        return lhs * rhs;
    case "/":
        return lhs / rhs;
    case "^":
        return Math.pow(lhs, rhs);
    }
    return NaN;
}

ASTUnary.prototype.vars = function() {
    var lhs = this.lhs.vars()
    var rhs = this.rhs.vars()
    return lhs + rhs
}


    | NUMBER
        {$$ = parseFloat(yytext);}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | VARNAME
        {$$ = yy["VAR_" + yytext];}
