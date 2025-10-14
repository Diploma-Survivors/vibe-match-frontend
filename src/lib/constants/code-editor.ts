export const LANGUAGES = [
  { value: 'python', label: 'Python 3', monacoLang: 'python' },
  { value: 'cpp', label: 'C++17', monacoLang: 'cpp' },
  { value: 'java', label: 'Java 17', monacoLang: 'java' },
  { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
];

export const DEFAULT_CODE: Record<string, string> = {
  python: `# Nhập N từ bàn phím
n = int(input())

# Code của bạn ở đây
for i in range(1, n + 1):
    print(i, end=" ")
`,
  cpp: `#include <iostream>

int main() {    
    int soThuNhat, soThuHai, tong;
    std::cin >> soThuNhat;
    std::cin >> soThuHai;  
    tong = soThuNhat + soThuHai;
 
    std::cout << tong;
}`,
  java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // Code của bạn ở đây
        for (int i = 1; i <= n; i++) {
            System.out.print(i + " ");
        }
        
        sc.close();
    }
}`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (n) => {
    n = parseInt(n);
    
    // Code của bạn ở đây
    for (let i = 1; i <= n; i++) {
        process.stdout.write(i + " ");
    }
    
    rl.close();
});`,
};
