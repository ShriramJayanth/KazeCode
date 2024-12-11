"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execCode = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const execCode = (languageID, sourceCode, stdin, timeout) => __awaiter(void 0, void 0, void 0, function* () {
    let tempFilePathCode = "";
    let objectCodePath = "";
    if (languageID === 1) {
        tempFilePathCode = path.join(__dirname, 'Program.py');
    }
    else if (languageID === 2) {
        tempFilePathCode = path.join(__dirname, 'Program.cpp');
        objectCodePath = path.join(__dirname, 'Program');
    }
    let result = {
        stdout: '',
        stderr: '',
        status: 'queued'
    };
    let Process;
    try {
        fs.writeFileSync(tempFilePathCode, sourceCode);
        if (languageID === 1) {
            Process = (0, child_process_1.spawn)("python3", [tempFilePathCode], { stdio: ["pipe", "pipe", "pipe"] });
        }
        else if (languageID === 2) {
            (0, child_process_1.execSync)(`g++ -o ${objectCodePath} ${tempFilePathCode}`);
            Process = (0, child_process_1.spawn)(objectCodePath, [], { stdio: ['pipe', 'pipe', 'pipe'] });
        }
        if (Process) {
            Process.stdin.write(stdin);
            Process.stdin.end();
            const timer = setTimeout(() => {
                if (Process) {
                    Process.kill('SIGTERM');
                    result.stderr = 'Time limit exceeded';
                    result.stdout = "";
                    result.status = 'timeout';
                    Process.stdout.destroy();
                    Process.stderr.destroy();
                }
            }, timeout);
            Process.stdout.on("data", (data) => {
                result.stdout += data.toString();
            });
            Process.stderr.on("data", (data) => {
                result.stderr += data.toString();
            });
            yield new Promise((resolve, reject) => {
                if (Process) {
                    Process.on("close", (code) => {
                        clearTimeout(timer);
                        result.status = code === 0 ? "completed" : "failed";
                        resolve();
                    });
                    Process.on('error', (err) => {
                        clearTimeout(timer);
                        result.stderr += err.message;
                        result.status = 'failed';
                        reject(err);
                    });
                }
            });
        }
        else {
            result.status = 'failed';
            result.stderr = 'Failed to initialize child process.';
        }
    }
    catch (err) {
        result.stderr = `Error: ${err}`;
        result.status = "failed";
    }
    finally {
        try {
            fs.unlinkSync(tempFilePathCode);
            if (objectCodePath && fs.existsSync(objectCodePath)) {
                fs.unlinkSync(objectCodePath);
            }
        }
        catch (cleanupErr) {
            console.error('Failed to delete temporary files:', cleanupErr);
        }
    }
    return result;
});
exports.execCode = execCode;
// const pythonCode = `
// for i in range(1000000):
//     for j in range(100000000):
//         print(i)
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
// const stdin = 'Kaizoku ou ni naru no otoka da"';
// execCode(1, pythonCode, stdin,5000).then((result) => {
//     console.log('Python result:', result);
// });
// execCode(2, javaCode, stdin,5000).then((result) => {
//     console.log('Java result:', result);
// });
// execCode(3, cppCode, stdin,5000).then((result) => {
//     console.log('C++ result:', result);
// });
