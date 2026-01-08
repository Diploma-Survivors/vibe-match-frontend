export const AIService = {
  generateReview: async (
    submissionId: string,
    prompt: string,
    code: string
  ): Promise<string> => {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response
    return `
# AI Review for Submission #${submissionId}

## Analysis
The submitted code implements the solution using a standard approach. 

### Time Complexity
The time complexity appears to be **O(N)** where N is the input size, as it iterates through the array once.

### Space Complexity
The space complexity is **O(1)** as it uses a constant amount of extra space.

## Suggestions
1. **Variable Naming**: Consider using more descriptive variable names.
2. **Edge Cases**: Check if the input array is empty.

## Code Snippet
\`\`\`javascript
// Example improvement
if (arr.length === 0) return 0;
\`\`\`

Overall, good job!
    `;
  },
};
