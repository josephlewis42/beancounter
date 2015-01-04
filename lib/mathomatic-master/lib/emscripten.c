#include <stdio.h>
#include <stdlib.h>
#include "mathomatic.h"

int num_replacements;
int max_replacement_params;

struct Replacement{
    char* matchtext;
    char* subtext;
    int nargs;
};

struct Replacement replacements[] = {
    {"sqrt([^,)]*)", "(($1)**.5)", 1},
    {"cbrt([^,)]*)", "(($1)**(1/3))", 1},
    {"exp([^,)]*)", "(e**($1))", 1},
    {"pow([^,)]*,[^,)]*)", "(($1)**($2))", 2},
    {"abs([^,)]*)", "(|($1)|)", 1},
    {"sgn([^,)]*)", "(($1)/|($1)|)", 1},
    {"factorial([^,)]*)", "(($1)!)", 1},
    {"gamma([^,)]*)", "((($1)-1)!)", 1},
    {"phi", "((1+5**.5)/2)", 0},
    {"omega", "(0.5671432904097838729999686622)", 0},
    {"euler", "(0.57721566490153286060651209008)", 0},

    {"floor([^,)]*)", "(($1)-($1)%1)", 1},
    {"ceil([^,)]*)", "(($1)+(-($1))%1)", 1},
    {"int([^,)]*)", "(($1)//1)", 1},
    {"round([^,)]*)", "((($1)+|($1)|/($1)/2)//1)", 1},

    {"sin([^,)]*)", "((e**(i*($1))-e**(-i*($1)))/(2i))", 1},
    {"cos([^,)]*)", "((e**(i*($1))+e**(-i*($1)))/2)", 1},
    {"tan([^,)]*)", "((e**(i*($1))-e**(-i*($1)))/(i*(e**(i*($1))+e**(-i*($1)))))", 1},
    {"cot([^,)]*)", "(i*(e**(i*($1))+e**(-i*($1)))/(e**(i*($1))-e**(-i*($1))))", 1},
    {"sec([^,)]*)", "(2/(e**(i*($1))+e**(-i*($1))))", 1},
    {"csc([^,)]*)", "(2i/(e**(i*($1))-e**(-i*($1))))", 1},
    {"sinc([^,)]*)", "(((e**(i*pi*($1))-e**(-i*pi*($1)))/(2i))/(pi*($1)))", 1},

    {"sinh([^,)]*)", "((e**($1)-e**-($1))/2)", 1},
    {"cosh([^,)]*)", "((e**($1)+e**-($1))/2)", 1},
    {"tanh([^,)]*)", "((e**($1)-e**-($1))/(e**($1)+e**-($1)))", 1},
    {"coth([^,)]*)", "((e**($1)+e**-($1))/(e**($1)-e**-($1)))", 1},
    {"sech([^,)]*)", "(2/(e**($1)+e**-($1)))", 1},
    {"csch([^,)]*)", "(2/(e**($1)-e**-($1)))", 1},
    {0,0,0}
};
/**
// Regex must have exactly one bracket pair; Taken from the slre test suite
static char *slre_replace(const char *regex, const char *buf,
                          const char *sub) {
  char *s = NULL;
  int n, n1, n2, n3, s_len, len = strlen(buf);
  struct slre_cap cap = { NULL, 0 };

  do {
    s_len = s == NULL ? 0 : strlen(s);
    if ((n = slre_match(regex, buf, len, &cap, 1, 0)) > 0) {
      n1 = cap.ptr - buf, n2 = strlen(sub),
         n3 = &buf[n] - &cap.ptr[cap.len];
    } else {
      n1 = len, n2 = 0, n3 = 0;
    }
    s = (char *) realloc(s, s_len + n1 + n2 + n3 + 1);
    memcpy(s + s_len, buf, n1);
    memcpy(s + s_len + n1, sub, n2);
    memcpy(s + s_len + n1 + n2, cap.ptr + cap.len, n3);
    s[s_len + n1 + n2 + n3] = '\0';

    buf += n > 0 ? n : len;
    len -= n > 0 ? n : len;
  } while (len > 0);

  return s;
}


char* do_replacement(char* origstring, int replacementno)
{
    char* tmp = origstring;
    int i;
    for(i = strlen(origstring) i < 
    
    return tmp;
}

char* m4_replace(char* origstring)
{
    int i;
    char* tmp;
    
    for(i = 0; i < num_replacements; i++)
    {
        tmp = do_replacement(
    }
    
    
//m4_define(`sqrt', `(($1)**.5)'); 
    static const char *regex = "(?i)((https?://)[^\\s/'\"<>]+/?[^\\s'\"<>]*)";
    struct slre_cap caps[2];
    int i, j = 0, str_len = strlen(str);

    while (j < str_len &&
           (i = slre_match(regex, str + j, str_len - j, caps, 2, 0)) > 0) {
      printf("Found URL: [%.*s]\n", caps[0].len, caps[0].ptr);
      j += i;
    }


}

**/

inline int bad_character(char x)
{
    return x > 31 && x < 127;
}

void init()
{
    int i;
    char* output;
    
    matho_init();
    
    matho_process("set modulus_mode=2", &output);
    free(output);
    
    i = 0;
    max_replacement_params = 0;
    while(1)
    {
        if(replacements[i].matchtext == 0)
            break;
        
        if(replacements[i].nargs > max_replacement_params)
            max_replacement_params = replacements[i].nargs;
        
        i++;
    }
    
    num_replacements = i;
}


/* we assume that matho_init has already been called by the HTML page */
int solve_function(char* input, char* seperator)
{
    char *output;
    int i;
    int rv;
    
    //printf("Input: %s\n", input);
    
    rv = matho_process(input, &output);
    /**
    for(i=0;output[i]!='\0';i++)
    {
        if(bad_character(output[i]))
        {
            if(rv)
                free(output);

            return 0;
        }
    }
    **/
    //puts(seperator);
    if(output != 0)
        printf("%s\n%s\n%s\n", seperator, output, seperator);
    //puts(seperator);

    if(rv)
        free(output);
        
    return rv;
}
