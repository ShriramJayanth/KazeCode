
export function sanitizeCode(sourceCode: string): string {

    const forbiddenPatterns: RegExp[] = [
        /require\(.+\)/g,
        /process\./g,     
        /child_process/g,  
        /exec\(.+\)/g,  
        /while\s*\(true\)/g,
        /for\s*\(\s*;\s*;\s*\)/g, 
    ];

    for (const pattern of forbiddenPatterns) {
        if (pattern.test(sourceCode)) {
            return "Error: The submitted code contains forbidden constructs and cannot be executed.";
        }
    }

    
    const restrictedModules: string[] = ["fs", "os", "net", "child_process"];
    for (const module of restrictedModules) {
        const importPattern = new RegExp(`(import|require)\s*\(['\"]${module}['\"]\)`, 'g');
        if (importPattern.test(sourceCode)) {
            return `Error: Usage of restricted module '${module}' is not allowed.`;
        }
    }

    
    const maxCodeLength = 10000;
    if (sourceCode.length > maxCodeLength) {
        return "Error: The submitted code exceeds the maximum allowed length.";
    }

    return sourceCode;
}

export default sanitizeCode;
