// const mysql = require('mysql');
import mysql from 'mysql'
export class UserModel {
    jb = 0;
    tg = 0;
    object = "";
    connection;
    constructor(jb, tg, object) {
        this.jb = jb;
        this.tg = tg;
        this.object = object;
        this.connection = mysql.createConnection({
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME
        });
        console.log(process.env);
        this.connection.connect();
    }

    async get(month) {
       const result = await (new Promise((resolve, reject) => {
           this.connection.query('select * from `users` where `month` = '+month+' and `jb` = ' + this.jb + ' and `tg` = ' + this.tg + ' and `object` = \'' + this.object + '\'', (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
           });
       }));

       return result;
    }

    async save(data) {
        await Promise.all(data.map(async el => {
            const checkExists = await (new Promise((resolve, reject) => {
                this.connection.query('select * from `users` where `month` = '+ el.month +' and `jb` = ' + this.jb + ' and `tg` = ' + this.tg + ' and `object` = \'' + this.object + '\'', (err, res) => {
                    if (err)
                        reject(err);
                    resolve(res);
                });
            }));
            if (checkExists.length) {
                this.connection.query(`
                    update \`users\` set \`days\` = '${JSON.stringify(el.days)}' where \`month\` = ${el.month} and \`jb\` = ${this.jb} and \`tg\` = ${this.tg} and \`object\` = ${this.object}
                `)
            } else {
                const result = await (new Promise((resolve, reject) => {
                    this.connection.query(
                        'insert into `users` (`jb`, `tg`, `object`, `days`, `month`) values ('+this.jb+', '+this.tg+', \''+this.object+'\', \''+JSON.stringify(el.days)+'\', '+el.month+')', (err, res) => {
                            if (err)
                                reject(err);
                            resolve(res);
                        });
                }));
            }
        }));
    }
}