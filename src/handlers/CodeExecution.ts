import { spawn, execSync, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ExecutionResult {
    stdout: string;
    stderr: string;
    status: 'completed' | 'queued' | 'failed';
}

export const execCode = async (languageID: number, sourceCode: string, stdin: string): Promise<ExecutionResult> => {
    
    let tempFilePathCode: string = "";
    let objectCodePath: string = "";

    if (languageID === 1) {
        tempFilePathCode = path.join(__dirname, 'Program.py');
    } else if (languageID === 2) {
        tempFilePathCode = path.join(__dirname, 'Program.java');
        objectCodePath = path.join(__dirname, 'Program.class');
    } else {
        tempFilePathCode = path.join(__dirname, 'Program.cpp');
        objectCodePath = path.join(__dirname, 'Program');
    }

    let result: ExecutionResult = {
        stdout: '',
        stderr: '',
        status: 'queued'
    };

    try {
        fs.writeFileSync(tempFilePathCode, sourceCode);
        let Process: ChildProcessWithoutNullStreams;

        if (languageID === 1) {
            Process = spawn("python3", [tempFilePathCode], { stdio: ["pipe", "pipe", "pipe"] });
        } else if (languageID === 2) {
            execSync(`javac ${tempFilePathCode}`);
            Process = spawn('java', ['Program'], { stdio: ['pipe', 'pipe', 'pipe'] });
        } else {
            execSync(`g++ -o ${objectCodePath} ${tempFilePathCode}`);
            Process = spawn(objectCodePath, [], { stdio: ['pipe', 'pipe', 'pipe'] });
        }

        Process.stdin.write(stdin);
        Process.stdin.end();

        Process.stdout.on("data", (data: Buffer) => {
            result.stdout += data.toString();
        });

        Process.stderr.on("data", (data: Buffer) => {
            result.stderr += data.toString();
        });

        await new Promise<void>((resolve, reject) => {
            Process.on("close", (code: number) => {
                result.status = code === 0 ? "completed" : "failed";
                resolve();
            });

            Process.on('error', (err: Error) => {
                result.stderr += err.message;
                result.status = 'failed';
                reject(err);
            });
        });
    } catch (err) {
        result.stderr = `Error: ${err}`;
        result.status = "failed";
    } finally {
        try {
            fs.unlinkSync(tempFilePathCode);
            if (objectCodePath && fs.existsSync(objectCodePath)) {
                fs.unlinkSync(objectCodePath);
            }
        } catch (cleanupErr) {
            console.error('Failed to delete temporary files:', cleanupErr);
        }
    }

    return result;
};


// const pythonCode = `
// message=input()
// print(message)
// `;

// const javaCode = `
// import java.util.Scanner;

// public class Program {
//     public static void main(String[] args) {
//         Scanner scanner = new Scanner(System.in);
//         String message = scanner.nextLine();
//         System.out.println(message);
//         scanner.close();
//     }
// }
// `;

// const cppCode = `
// #include <bits/stdc++.h>
// using namespace std;

// int main() {
//     string message;
//     getline(cin,message);
//     cout<<message<<endl;
//     return 0;
// }
// `;

// const stdin = 'Kaizoku ou ni orewa naru"';

// execCode(1, pythonCode, stdin).then((result) => {
//     console.log('Python result:', result);
// });

// execCode(2, javaCode, stdin).then((result) => {
//     console.log('Java result:', result);
// });

// execCode(3, cppCode, stdin).then((result) => {
//     console.log('C++ result:', result);
// });
