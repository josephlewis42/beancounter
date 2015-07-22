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
        {return  "{" + $1 + "} = {" + $3 + "}";}

    | e EOF
        {console.log($1); return $1;}
    ;

e
    :  e '+' e
        {$$ = "{" + $1 + "} + {" + $3 + "}";}
    | e '-' e
        {$$ = "{" + $1 + "} - {" + $3 + "}";}
    | e '*' e
        {$$ = "{" + $1 + "} \\bullet {" + $3 + "}";}
    | e '/' e
        {$$ = "{" + $1 + "}\\over{" + $3 + "}";}
    | e '^' e
        {$$ = "{" +  $1 + "}^{" + $3 + "}";}
    | '-' e %prec UMINUS
        {$$ = "{-" + $2 + "}";}
    | '(' e ')'
        {$$ = "({" + $2 + "})";}
    | SQRT '(' e ')'
        {$$ = "\\sqrt{" + $3 + "}";}
    | NUMBER
        {$$ = yytext;}
    | E
        {$$ = "e";}
    | PI
        {$$ = "\\pi";}
    | VARNAME
        {$$ = yytext;}
    ;

%%

var Latexify = parser.parse;
