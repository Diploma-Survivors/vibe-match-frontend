// language-defaults.ts

// --- Defined Templates (Shared across versions) ---

const CPP_TEMPLATE = `#include <iostream>

int main() {    
    int soThuNhat, soThuHai, tong;
    std::cin >> soThuNhat;
    std::cin >> soThuHai;  
    tong = soThuNhat + soThuHai;
    std::cout << tong;
}`;

const C_TEMPLATE = `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Write your code here
    printf("Hello World\\n");
    return 0;
}`;

const PYTHON3_TEMPLATE = `import sys

# Increase recursion depth for deep recursive calls
sys.setrecursionlimit(2000)

def solve():
    # Write your code here
    print("Hello World")

if __name__ == "__main__":
    solve()`;

const PYTHON2_TEMPLATE = `import sys

def solve():
    # Write your code here
    print "Hello World"

if __name__ == "__main__":
    solve()`;

const JAVA_TEMPLATE = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code here
        System.out.println("Hello World");
        
        scanner.close();
    }
}`;

// --- Main Map by ID ---

export const LANGUAGE_DEFAULT_CODE: Record<number, string> = {
  // --- Assembly ---
  45: `section .data
    msg db 'Hello, World!', 0xa
    len equ $ - msg

section .text
    global _start

_start:
    mov edx, len
    mov ecx, msg
    mov ebx, 1
    mov eax, 4
    int 0x80

    mov eax, 1
    int 0x80`, // Assembly (NASM 2.14.02)

  // --- Bash ---
  46: `#!/bin/bash
echo "Hello World"`, // Bash (5.0.0)

  // --- Basic ---
  47: `PRINT "Hello World"`, // Basic (FBC 1.07.1)

  // --- C Languages ---
  48: C_TEMPLATE, // C (GCC 7.4.0)
  49: C_TEMPLATE, // C (GCC 8.3.0)
  50: C_TEMPLATE, // C (GCC 9.2.0)
  75: C_TEMPLATE, // C (Clang 7.0.1)

  // --- C++ Languages ---
  52: CPP_TEMPLATE, // C++ (GCC 7.4.0)
  53: CPP_TEMPLATE, // C++ (GCC 8.3.0)
  54: CPP_TEMPLATE, // C++ (GCC 9.2.0)
  76: CPP_TEMPLATE, // C++ (Clang 7.0.1)

  // --- C# ---
  51: `using System;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hello World");
    }
}`, // C# (Mono 6.6.0.161)

  // --- Clojure ---
  86: `(println "Hello World")`, // Clojure (1.10.1)

  // --- COBOL ---
  77: `IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
    DISPLAY 'Hello World'.
    STOP RUN.`, // COBOL (GnuCOBOL 2.2)

  // --- Common Lisp ---
  55: `(write-line "Hello World")`, // Common Lisp (SBCL 2.0.0)

  // --- D ---
  56: `import std.stdio;

void main()
{
    writeln("Hello World");
}`, // D (DMD 2.089.1)

  // --- Elixir ---
  57: `IO.puts "Hello World"`, // Elixir (1.9.4)

  // --- Erlang ---
  58: `-module(main).
-export([start/0]).

start() ->
    io:format("Hello World~n").`, // Erlang (OTP 22.2)

  // --- Executable ---
  44: '// Binary file execution', // Executable

  // --- F# ---
  87: `open System

[<EntryPoint>]
let main argv =
    printfn "Hello World"
    0`, // F# (.NET Core SDK 3.1.202)

  // --- Fortran ---
  59: `program hello
  print *, 'Hello, World!'
end program hello`, // Fortran (GFortran 9.2.0)

  // --- Go ---
  60: `package main
import "fmt"

func main() {
    fmt.Println("Hello World")
}`, // Go (1.13.5)

  // --- Groovy ---
  88: `class Main {
    static void main(String[] args) {
        println "Hello World"
    }
}`, // Groovy (3.0.3)

  // --- Haskell ---
  61: `module Main where

main :: IO ()
main = putStrLn "Hello World"`, // Haskell (GHC 8.8.1)

  // --- Java ---
  62: JAVA_TEMPLATE, // Java (OpenJDK 13.0.1)

  // --- JavaScript ---
  63: `// JavaScript (Node.js)
const fs = require('fs');

function main() {
    // Example of reading stdin
    // const input = fs.readFileSync(0, 'utf-8');
    console.log("Hello World");
}

main();`, // JavaScript (Node.js 12.14.0)

  // --- Kotlin ---
  78: `fun main(args: Array<String>) {
    println("Hello World")
}`, // Kotlin (1.3.70)

  // --- Lua ---
  64: `print("Hello World")`, // Lua (5.3.5)

  // --- Multi-file ---
  89: '// Multi-file program',

  // --- Objective-C ---
  79: `#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSLog(@"Hello World");
    }
    return 0;
}`, // Objective-C (Clang 7.0.1)

  // --- OCaml ---
  65: `print_endline "Hello World";;`, // OCaml (4.09.0)

  // --- Octave ---
  66: `disp('Hello World');`, // Octave (5.1.0)

  // --- Pascal ---
  67: `program Hello;
begin
  writeln ('Hello World');
end.`, // Pascal (FPC 3.0.4)

  // --- Perl ---
  85: `#!/usr/bin/perl
print "Hello World\\n";`, // Perl (5.28.1)

  // --- PHP ---
  68: `<?php
echo "Hello World";
?>`, // PHP (7.4.1)

  // --- Plain Text ---
  43: 'Hello World', // Plain Text

  // --- Prolog ---
  69: `:- initialization(main).
main :- write('Hello World'), nl, halt.`, // Prolog (GNU Prolog 1.4.5)

  // --- Python ---
  70: PYTHON2_TEMPLATE, // Python (2.7.17)
  71: PYTHON3_TEMPLATE, // Python (3.8.1)

  // --- R ---
  80: `cat("Hello World\\n")`, // R (4.0.0)

  // --- Ruby ---
  72: `puts "Hello World"`, // Ruby (2.7.0)

  // --- Rust ---
  73: `fn main() {
    println!("Hello World");
}`, // Rust (1.40.0)

  // --- Scala ---
  81: `object Main {
    def main(args: Array[String]): Unit = {
        println("Hello World")
    }
}`, // Scala (2.13.2)

  // --- SQL ---
  82: `SELECT 'Hello World';`, // SQL (SQLite 3.27.2)

  // --- Swift ---
  83: `print("Hello World")`, // Swift (5.2.3)

  // --- TypeScript ---
  74: `const hello: string = "Hello World";
console.log(hello);`, // TypeScript (3.7.4)

  // --- Visual Basic .NET ---
  84: `Module VBModule
    Sub Main()
        Console.WriteLine("Hello World")
    End Sub
End Module`, // Visual Basic.Net (vbnc 0.0.0.5943)
};

/**
 * Helper to get the default code by ID safely.
 */
export const getDefaultCode = (languageId: number): string => {
  return LANGUAGE_DEFAULT_CODE[languageId] || '// Write your code here...';
};
