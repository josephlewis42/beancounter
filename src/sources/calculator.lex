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
