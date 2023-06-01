const { Client } = require('ssh2');
const fs = require('fs');
const path = require("path");

const connectViaSSH2 = () => {
    const conn = new Client();
    try {
        conn.on('ready', () => {
            console.log('Client :: ready');
            conn.exec(`${process.env.SQUISH_PATH} --testsuite ${process.env.TEST_DIR_PATH}`, (err, stream) => {
                if (err) {
                    console.log(err)
                    return false
                }
                stream.on('close', (code, signal) => {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' +
                        signal);
                    conn.end();
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                    fs.writeFile(
                        path.join(__dirname, `../w_poc_2/vm_result/output-${(new Date().toJSON().slice(0, 20))}.log`),
                        JSON.stringify(data),
                        "utf8",
                        (r) => {
                            console.log("write is done", r);
                        }
                    );
                }).on('error', (e) => {
                    console.log(' issue on error ', e)
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                    fs.writeFile(
                        path.join(__dirname, `../w_poc_2/vm_result/output-${(new Date().toJSON().slice(0, 20))}.log`),
                        JSON.stringify(data),
                        "utf8",
                        (r) => {
                            console.log("write is done", r);
                        }
                    );
                })
            })
        }).connect({
            host: '127.0.0.1',
            port: 22,
            username: 'sangh',
            //privateKey: "", // either private key or password , use one and remove other.
            password: 'aaaaaaa',

        }).on('error', (e) => {
            console.log('on error in conn', e)
            console.log('error ', `../w_poc_2/vm_result/output-${(new Date().toJSON().slice(0, 20))}.log`)
            console.log('error ', path.join(__dirname, `../w_poc_2/vm_result/output-${(new Date().toJSON().slice(0, 20))}.log`))
            fs.writeFile(
                path.join(__dirname, `../w_poc_2/vm_result/output-${(new Date().toJSON().slice(0, 20))}.log`),
                'connection error',
                "utf8",
                (r) => {
                    console.log("write is done at ssh2", r);
                }
            );
        });
    } catch (e) {
        console.log('error ', e)

    }
}

// export const PythonShell = () => {
//     const p = new Promise((resolve, reject) => {
//         if (reject) {
//             return reject
//         }
//         return resolve
//     })

// }


module.exports = { connectViaSSH2 }