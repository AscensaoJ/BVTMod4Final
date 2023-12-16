import { encode } from "base64-arraybuffer";
const { subtle } = globalThis.crypto;

// Login user and retrieve stats from database
export async function login(user, pass) {
  try {
    const bib = await encrypter(pass);
    const response = await fetch(`http://localhost:3000/api/login`, {
      method: "POST",
      body: JSON.stringify({
        user: user,
        hay: bib
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    
    localStorage.setItem('quizappjwt', result.jwt);
    return {
      username: result.username,
      questions: result.questions,
      correct: result.correct
    }
  }
  catch (err) {
    console.log(err);
  }
}

// Register new user to database
export async function register(user, pass) {
  try {
    const bib = await encrypter(pass);
    const response = await fetch(`http://localhost:3000/api/register`, {
      method: "POST",
      body: JSON.stringify({
        user: user,
        hay: bib
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    
    localStorage.setItem('quizappjwt', result.jwt);
    return {
      username: result.username,
      questions: result.questions,
      correct: result.correct
    }
  }
  catch (err) {
    console.log(err);
  }
}

// Handle local storage logout
export function logout() {
  if(confirm('Do you want to log out?')){
    localStorage.removeItem('quizappjwt');
    return true;
  }
}

// Checks to see if user exists in database
export async function checkUser(user) {
  try {
    let userCheck = await fetch(`http://localhost:3000/api/checkUser`, {
      method: "POST",
      body: JSON.stringify({
        user: user
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await userCheck.json();
    console.log(data)
    switch (data.result) {
      case true:
        return true;
      case false:
        return false;
      case null:
        alert(data.message);
        return null;
      default:
        alert('Check incomplete');
        break;
    }
  }
  catch (err) {
    console.log(err);
  }
}
      

// Ensure passwords entered for registration match
export function checker(pw1, pw2) {
  if (pw1 != pw2) {
    //alert('Passwords do not match!');
    return false;
  }
  return true;
}

// Update user data in database
export async function updateUser(user, questions, correct) {
  try {
    const jwt = localStorage.getItem('quizappjwt');
    const response = await fetch(`http://localhost:3000/api/updateScore`, {
      method: "POST",
      body: JSON.stringify({
        user: user,
        questions: questions,
        correct: correct
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      }
    });
    const result = response.json();
    console.log(result);
  }
  catch (err) {
    console.log(err);
  }
}

// Retrieve stats from database if jwt in local storage on load
export async function loadStats() {
  
}

// Encrypt password for network transmission
async function encrypter(pass) {
  try {
    const toEncrypt = str2ab(pass);
    const response = await fetch('http://localhost:3000/api/getkey', {method: 'GET'});
    const result = await response.json();
    const key = await subtle.importKey('jwk', result.key, {name: 'RSA-OAEP', hash: 'SHA-512'}, true, [ 'encrypt' ]);
    const encrypted = await subtle.encrypt({name: "RSA-OAEP"}, key, toEncrypt);
    let toEncode = new DataView(encrypted);
    let toSend = encode(toEncode.buffer);
    return toSend;
  }
  catch (err) {
    console.log(err);
  }
}

// Translate plaintext password to arraybuffer
function str2ab(str) {
  let out = null;
  let encoder = new TextEncoder();
  out = encoder.encode(str);
  return out;
}