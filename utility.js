"use strict";


// Shuffles an array using Fisher-Yates
function shuffle(arr) {
  let i = arr.length;

  while (i > 0) {
    const r = Math.floor(Math.random() * i--);
    const temp = arr[r];
    arr[r] = arr[i];
    arr[i] = temp;
  }

  return arr;
} // end shuffle


// Randomly returns an element in an array
function sample(arr) {
  return arr[Math.random() * arr.length | 0];
} // end sample


// Randomly deletes an element from an array and returns it
function randPop(arr) {
  return arr.splice((Math.random() * arr.length) | 0, 1)[0];
} // end randPop 


// Returns an array of keys in an object
const keys = Object.keys || function (obj) { 
  const keys = [];

  for (const key in obj) {
    keys.push(key);
  }

  return keys;
}; // end keys


// Returns an array of values in an object
const values = Object.values || function (obj) {
  const values = [];

  for (const key in obj) {
    values.push(obj[key]);
  }

  return values;
}; // end values
