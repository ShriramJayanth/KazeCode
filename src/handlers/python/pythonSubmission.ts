import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ExecutionResult {
    stdout: string;
    stderr: string;
    status: 'completed' | 'queued' | 'processing' | 'failed';
}

export const execPythonCode=async(sourceCode:string,stdin:string):Promise<ExecutionResult> =>{
    const tempFilePathCode: string = path.join(__dirname, 'code.py');

    let result: ExecutionResult = {
        stdout: '',
        stderr: '',
        status: 'queued'
    };

    try{
        fs.writeFileSync(tempFilePathCode,sourceCode);
        const pythonProcess:ChildProcessWithoutNullStreams=spawn("python3",[tempFilePathCode],{stdio:["pipe","pipe","pipe"]});

        pythonProcess.stdin.write(stdin);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on("data",(data:Buffer)=>{
            result.stdout=data.toString();
        });

        pythonProcess.stderr.on("data",(data:Buffer)=>{
            result.stderr+=data.toString();
        });

        await new Promise<void>((resolve,reject)=>{
            pythonProcess.on("close",(code:number)=>{
                result.status=code===0?"completed":"failed";
                resolve();
            })

            pythonProcess.on('error', (err: Error) => {
                result.stderr += err.message;
                result.status = 'failed';
                reject(err);
            });
        })
    }
    catch(err){
        result.stderr=`Error: ${err}`;
        result.status="failed";
    }
    finally {
        try {
            fs.unlinkSync(tempFilePathCode);
        } catch (cleanupErr) {
            console.error('Failed to delete temporary file:', cleanupErr);
        }
    }

    return result;   
}

// const pythonCode = `
// srt=int(input())
// print(srt)
// `;

// const stdin = 'Hello from stdin!';

// execPythonCode(pythonCode,stdin).then((result)=>{
//     console.log(result)
// })
