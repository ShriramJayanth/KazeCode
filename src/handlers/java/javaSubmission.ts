import { spawn, execSync, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ExecutionResult {
    stdout: string;
    stderr: string;
    status: 'completed' | 'queued' | 'processing' | 'failed';
}

interface JavaProcessOptions {
    javaCode: string;
    stdin: string;
}

const executeJavaCode = async (options: JavaProcessOptions): Promise<ExecutionResult> => {
    const { javaCode, stdin } = options;
    const tempFilePath: string = path.join(__dirname, 'TempProgram.java');
    const classFilePath: string = path.join(__dirname, 'TempProgram.class');

    let result: ExecutionResult = {
        stdout: '',
        stderr: '',
        status: 'queued'
    };

    try {
        fs.writeFileSync(tempFilePath, javaCode);

        execSync(`javac ${tempFilePath}`);

        result.status = 'processing';

        const javaProcess: ChildProcessWithoutNullStreams = spawn('java', ['TempProgram'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        javaProcess.stdin.write(stdin);
        javaProcess.stdin.end();

        javaProcess.stdout.on('data', (data: Buffer) => {
            result.stdout += data.toString();
        });

        javaProcess.stderr.on('data', (data: Buffer) => {
            result.stderr += data.toString();
        });

        await new Promise<void>((resolve, reject) => {
            javaProcess.on('close', (code: number) => {
                result.status = code === 0 ? 'completed' : 'failed';
                resolve();
            });

            javaProcess.on('error', (err: Error) => {
                result.stderr += err.message;
                result.status = 'failed';
                reject(err);
            });
        });
    } catch (err) {
        result.stderr = `Error: ${err}`;
        result.status = 'failed';
    } finally {
        try {
            fs.unlinkSync(tempFilePath);
            if (fs.existsSync(classFilePath)) {
                fs.unlinkSync(classFilePath);
            }
        } catch (cleanupErr) {
            console.error('Failed to delete temporary files:', cleanupErr);
        }
    }

    return result;
};

// const javaCode = `
// import java.util.Scanner;

// public class TempProgram {
//     public static void main(String[] args) {
//         Scanner scanner = new Scanner(System.in);
//         String inputData = scanner.nextLine();
//         System.out.println("Received input: " + inputData);
//     }
// }`;

// const stdin = 'Hello from stdin!';

// executeJavaCode({ javaCode, stdin }).then((result) => {
//     console.log(result)
// });
