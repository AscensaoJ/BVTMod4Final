import { encode } from "base64-arraybuffer";
const { subtle } = globalThis.crypto;
const port = 3000;

// Login user and retrieve stats from database
export async function login(user, pass) {
  const encrypted = await encrypter(pass);
  const response = await fetch(`http://localhost:${port}/api/login`, {
    method: "POST",
    body: JSON.stringify({
      user: user,
      hay: encrypted
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  
  localStorage.setItem('quizappjwt', result.jwt);
  sessionStorage.setItem('quizapptotal', result.questions);
  sessionStorage.setItem('quizappcorrect', result.correct);
  sessionStorage.setItem('quizappuser', result.username);
}

// Register new user to database
export async function register(user, pass) {
  const encrypted = await encrypter(pass);
  const response = await fetch(`http://localhost:${port}/api/register`, {
    method: "POST",
    body: JSON.stringify({
      user: user,
      hay: encrypted
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  
  localStorage.setItem('quizappjwt', result.jwt);
  sessionStorage.setItem('quizapptotal', result.questions);
  sessionStorage.setItem('quizappcorrect', result.correct);
  sessionStorage.setItem('quizappuser', result.username);
}

// Handle local storage logout
export function logout() {
  if(confirm('Do you want to log out?')){
    localStorage.removeItem('quizappjwt');
    sessionStorage.setItem('quizapptotal', 0);
    sessionStorage.setItem('quizappcorrect', 0);
    sessionStorage.setItem('quizappuser', 'Guest');
    return true;
  }
}

// Gets user data from database
export async function loadStats() {
  try {
    const jwt = localStorage.getItem('quizappjwt');
    const response = await fetch(`http://localhost:${port}/api/getStats`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      }
    });
    const result = await response.json();
    sessionStorage.setItem('quizapptotal', result.questions);
    sessionStorage.setItem('quizappcorrect', result.correct);
    sessionStorage.setItem('quizappuser', result.user);
    return true;
  } catch (err) {
    console.error(err);
  }
}

// Checks to see if user exists in database
export async function checkUser(user) {
  let userCheck = await fetch(`http://localhost:${port}/api/checkUser`, {
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

// Checks if JWT is valid and if user ID, uid, exists in database without deleted flag set
export async function checkJWT(user) {
  try {
    const jwt = localStorage.getItem('quizappjwt');
    let userCheck = await fetch(`http://localhost:${port}/api/checkJWT`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
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
    console.error(err);
  }
}

// Asks database to set deleted flag to 1 for given uid in JWT. Logs out user locally
export async function deleteUser() {
    if(confirm('Are you sure you want to delete your account?')) {
      try {
        const jwt = localStorage.getItem('quizappjwt');
        const deleted = fetch(`http://localhost:${port}/api/deleteUser`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
          }
        });
        localStorage.removeItem('quizappjwt');
        sessionStorage.setItem('quizapptotal', 0);
        sessionStorage.setItem('quizappcorrect', 0);
        sessionStorage.setItem('quizappuser', 'Guest');
        return true;
      } catch (err) {
        console.log(err);
      }
    } else {
      return false;
    }
}  

// Ensure passwords entered for registration match
export function checker(pw1, pw2) {
  if(pw1 != pw2) {
    return false;
  }
  return true;
}

// Update user data in database
export async function updateUser(user, questions, correct) {
  const jwt = localStorage.getItem('quizappjwt');
  const response = await fetch(`http://localhost:${port}/api/updateScore`, {
    method: "PUT",
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

// Encrypt password for network transmission
async function encrypter(pass) {
  const enc = str2ab(pass);
  const response = await fetch('http://localhost:' + port + '/api/getkey', {method: 'GET'});
  const result = await response.json();
  const key = await subtle.importKey('jwk', result.key, {name: 'RSA-OAEP', hash: 'SHA-512'}, true, [ 'encrypt' ]);
  const encrypted = await subtle.encrypt({name: "RSA-OAEP"}, key, enc);
  let viewer = new DataView(encrypted);
  let encoded = encode(viewer.buffer);
  return encoded;
}
 
// Translate plaintext password to arraybuffer   
function str2ab(str) {
    let bout = null;
    let bib = new TextEncoder();
    bout = bib.encode(str);
    return bout;
}
