/* description: Parses end executes mathematical expressions. */

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
\w+                   return 'VARNAME';
<<EOF>>               return 'EOF';

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS
%left '='

%start expressions

%% /* language grammar */

expressions
    : e '=' e EOF
        {return  "<math mode=\"display\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>" + $1 + " <mo>=</mo> " + $3 + "</mrow></math>";}

    | e EOF
        {console.log($1); return "<math mode=\"display\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow>" + $1 + "</mrow></math>";}
    ;

e
    :  e '+' e
        {$$ = "<mrow>" + $1 + " <mo>+</mo> " + $3 + "</mrow>";}
    | e '-' e
        {$$ = "<mrow>" + $1 + " <mo>-</mo>" + $3 + "</mrow>";}
    | e '*' e
        {$$ = "<mrow>" + $1 + " <mo>&#x2022;</mo> " + $3 + "</mrow>";}
    | e '/' e
        {$$ = "<mfrac>" + $1 + " " + $3 + "</mfrac>";}
    | e '^' e
        {$$ = "<msup>" +  $1 + " " + $3 + "</msup>";}
    | '-' e %prec UMINUS
        {$$ = "<mrow><mo>-</mo>" + $2 + "</mrow>";}
    | '(' e ')'
        {$$ = "<mrow><mo> ( </mo>" + $2 + "<mo> ) </mo></mrow>";}
    | SQRT '(' e ')'
        {$$ = "<msqrt><mrow>" + $3 + "</mrow></msqrt>";}
    | NUMBER
        {$$ = "<mn>" + yytext + "</mn>";}
    | E
        {$$ = "<mi>e</mi>";}
    | PI
        {$$ = "<mi>&pi;</mi>";}
    | VARNAME
        {$$ = "<mi>" + yytext + "</mi>";}
    ;
