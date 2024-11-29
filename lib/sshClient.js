import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';
// const host = process.env.SSH_HOST;
// const port = process.env.SSH_PORT;
const username = process.env.SSH_USER;
const keyPath = path.join(process.env.HOME, process.env.RELATIVE_SSH_KEY_PATH);

class SshClient {
    // todo host,portは引数で受け取るようにする
    constructor(param) {
        this.config = {
            host: param.host,
            port: param.port,
            username: username,
            privateKey: fs.readFileSync(keyPath, { encoding: 'utf8' }),
            keepaliveInterval: 1000,
        }
        this.client = new Client();
    }

    // SSH接続を開始する
    connect() {
        return new Promise((resolve, reject) => {
            this.client.on('ready', () => {
                console.log('SSH接続が確立しました');
                resolve();
            }).on('error', (err) => {
                reject(`SSH接続エラー: ${err.message}`);
            }).connect(this.config);
        });
    }

    async execute(command) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(new Error('Not connected'));
                return;
            }

            this.client.exec(command, (err, stream) => {
                if (err) {
                    reject(new Error(`Failed to execute command: ${err.message}`));
                    return;
                }

                let data = '';
                let stderr = '';

                stream.on('data', (chunk) => {
                    data += chunk.toString();
                });

                stream.stderr.on('data', (chunk) => {
                    stderr += chunk.toString();
                });

                stream.on('close', (code, signal) => {
                    if (code !== 0) {
                        reject(new Error(`Command exited with non-zero code: ${code}\n${stderr}`));
                    } else {
                        resolve(data);
                    }
                });
            });
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                resolve();
                return;
            }

            this.client.end();
            this.connected = false;
            resolve();
        });
    }
}