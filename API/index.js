const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const subtle = crypto.webcrypto.subtle;
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { decode } = require('base64-arraybuffer');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const jwtKey = process.env.JWT_KEY;
const uts = Date.now()
const time = new Date(uts);

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
    optionSuccessStatus: 200,
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(cors(corsOptions));

// Read both JSON and binary request bodies
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    try {
        req.db = await pool.getConnection();
        req.db.connection.config.namedPlaceholders = true;
        await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
        await req.db.query(`SET time_zone = '-8:00'`);
        await next();
        req.db.release();
    } catch (err) {
        console.log(err)
        if (req.db) req.db.release();
        throw err;
    }
    });

let keyPair;

app.get('/api', (req, res) => {
    res.json({
        message: 'connected'
    });
});

app.post('/api/login', async function (req, res) {
    try {
        const { user, hay } = req.body;
        let pass = await decryptPass(hay);

        const [[users]] = await req.db.query(`SELECT * FROM users WHERE username = :user`, {  user });
    
        if (!users) res.json('Email not found');
        const dbPassword = `${users.userpass}`
        const compare = await bcrypt.compare(pass, dbPassword);
    
        if (compare) {
          const payload = {
            userId: users.uid,
            username: users.username,
          }
          
          const encodedUser = jwt.sign(payload, process.env.JWT_KEY);
    
          res.json({
            jwt: encodedUser,
            username: users.username,
            questions: users.questions,
            correct: users.correct
        });
        } else {
          res.json('Password not found');
        }
        
      } catch (err) {
        console.log('Error in /login', err)
      }
});

app.get('/api/getkey', async function (req, res) {
    try {
        let key = await genKeys();
        expo = key;
        res.json({
            key,
        });
    } catch (err) {
        console.log(err);
        res.json({
            message: 'failed'
        });
    }
});

app.post('/api/checkUser', async function (req, res) {
    try {
        const user = req.body.user;
        const check = await req.db.query(`
            SELECT CASE 
                WHEN EXISTS(SELECT 1 FROM users WHERE username = :username) THEN deleted_flag 
                ELSE null
            END AS Bob
            FROM users;
        `, {
            username: user
        });
        if (check[0][0].Bob === null) {
            res.json({
                result: false
            });
        } else if (check[0][0].Bob === 0) {
            res.json({
                result: true
            });
        } else {
            res.json({
                result: false
            });
        }
        

    } catch(err) {
        console.error(err);res.json({
            message: 'error during user check',
            result: null
        });
    }
})

app.post('/api/register', async function (req, res) {
    try {
        let bib = req.body;
        let bob = await decryptPass(bib.hay);
        let encUser;
        await bcrypt.hash(bob, 10).then(async hash => {
            try {
              console.log('HASHED PASSWORD', hash);
      
              const [user] = await req.db.query(`
                INSERT INTO users (
                    username,
                    userpass
                )
                VALUES (
                    :username,
                    :password
                );
              `, {
                username: bib.user,
                password: hash
              });
      
              console.log('USER', user)
      
              encUser = jwt.sign(
                { 
                  userId: user.insertId,
                  ...req.body
                },
                process.env.JWT_KEY
              );
      
              console.log('ENCODED USER', encUser);
            } catch (error) {
              console.log('error', error);
            }
          });
      
          res.json({
            jwt: encUser,
            username: bib.user,
            questions: 0,
            correct: 0
          });
    } catch(err) {
        console.error(err);
        res.json(err);
    }
});

async function genKeys() {
    keyPair = await subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512",
        },
        true,
        ["encrypt", "decrypt"],
    );
    const exported = await subtle.exportKey('jwk', keyPair.publicKey)
    return exported;
};

async function decryptPass(pass) {

    let bub = decode(pass);
    let bob = ab2str(await subtle.decrypt({name: "RSA-OAEP"}, keyPair.privateKey, bub));
    return bob;

}

function ab2str(ab) {
    let bin = null;
    let bob = new DataView(ab);
    let bib = new TextDecoder();
    bin = bib.decode(bob.buffer);
    return bin;
}

// Jwt verification checks to see if there is an authorization header with a valid jwt in it.
app.use(async function verifyJwt(req, res, next) {
    if (!req.headers.authorization) {
      res.json('Invalid authorization, no authorization headers');
    }
  
    const [scheme, token] = req.headers.authorization.split(' ');
  
    if (scheme !== 'Bearer' || token === null) {
      res.json('Invalid authorization, invalid authorization scheme');
    }
  
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      req.user = payload;
    } catch (err) {
      console.log(err);
      if (
        err.message && 
        (err.message.toUpperCase() === 'INVALID TOKEN' || 
        err.message.toUpperCase() === 'JWT EXPIRED' ||
        err.message.toUpperCase() ==='JWT MALFORMED')
      ) {
  
        req.status = err.status || 500;
        req.body = err.message;
        req.app.emit('jwt-error', err, req);
      } else {
  
        throw((err.status || 500), err.message);
      }
    }
  
    await next();
});
    
app.post('/api/updateScore', async function (req, res, next) {
    try {
        const bib = req.body;
        console.log('user', req.user);
        const [update] = await req.db.query(
            `UPDATE users
            SET 
                questions = :questions,
                correct = :correct
            WHERE
                uid = :uid AND
                deleted_flag = 0
            `, {
                questions: bib.questions,
                correct: bib.correct,
                uid: req.user.userId
        });
    } catch (err) {
      console.log(err);
      res.json({ err });
    }
});

app.listen(port, (req, res) => {
    console.log(`server started on http://localhost:${port} @ ${time}`);
});