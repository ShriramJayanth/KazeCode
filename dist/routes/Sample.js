"use strict";
let sourceCode = `
for i in range(5):
    print(i)
`;
console.log(Buffer.from(sourceCode).toString('base64'));
