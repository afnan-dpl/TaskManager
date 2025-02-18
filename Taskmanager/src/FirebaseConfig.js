   // src/firebaseConfig.js
   import { initializeApp } from 'firebase/app';
   import { getDatabase } from 'firebase/database';

   const firebaseConfig = {
    apiKey: "AIzaSyA6UkKA7LGgizTQ_J0UYfQxTdpKpzP1Qr4",
    authDomain: "taskmanager-59a82.firebaseapp.com",
    databaseURL: "https://taskmanager-59a82-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "taskmanager-59a82",
    storageBucket: "taskmanager-59a82.firebasestorage.app",
    messagingSenderId: "86578016860",
    appId: "1:86578016860:web:389e800afe406da0412c99"
    };


   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const database = getDatabase(app);

   export { database };