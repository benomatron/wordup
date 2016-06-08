var ohYes = document.getElementById('oh-yes');
var ohNo = document.getElementById('oh-no');
var resetBtn = document.getElementById('reset-btn');
var letterList = document.getElementById('letters');
var spinner = document.getElementById('spinner');
var letterUp = document.getElementById('letter-up');
var pointBox = document.getElementById('point-box');
var skipBox = document.getElementById('skip-box');
var spinBox = document.getElementById('spin-box');
var wordBox = document.getElementById('word-box');
var msgBox = document.getElementById('msg-box');

//
var plumbusOne = document.getElementById('plumbus-one');
var plumbusOneTimer = null;

var skips = 0;
var points = 0;
var spins = 0;
var totalWords = 50;
var maxSpins = 5;
var maxSkips = 3;

var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var bucket = {};
var words = [];

ohYes.onclick = addLetter;
ohNo.onclick = skipLetter;
spinner.onclick = spinThing;
resetBtn.onclick = resetGame;
plumbusOne.onclick = stopPlumbus;

window.onload = addListeners;

function resetGame() {
    skips = 0;
    spins = 0;
    points = 0;
    bucket = {};
    letterUp.textContent = '';
    letterList.textContent = '';
    makeWords(totalWords, 13, 7);
    updateHead();
}

function testMove() {
    moveThing(plumbusOne, plumbusOneTimer);
}

function stopPlumbus() {
    clearInterval(plumbusOneTimer);
}

function makeWords(numWords, maxLength, minLength) {
    words = [];
    wordText = '';
    for (var i = 0; i <= numWords; i++) {
        var w = createWord(maxLength);
        words.push(w);
        wordText = wordText + w + ' ';
    }
    wordBox.textContent = wordText;
}

function updateHead() {
    pointBox.textContent = points;
    skipBox.textContent = maxSkips - skips;
    spinBox.textContent = maxSpins - spins;
}

function addLetter() {
    var letter = letterUp.textContent;
    var crapple = '';
    if (letter) {
        bucket[letter] = letter;
        for (i in bucket) {
            crapple = crapple + i + '-';
        }
        letterList.textContent = crapple.slice(0, crapple.length-1);
        letterUp.textContent = '';
    } else {
        makeMessage('You gotta spin it, bitch!', 'ok');
    }
}

function skipLetter() {
    if (letterUp.textContent) {
        if (skips < maxSkips) {
            skips += 1;
            letterUp.textContent = '';
            updateHead();
        } else {
            makeMessage('You got no more skips, bitch!', 'bad');
        }
    } else {
        makeMessage('You gotta spin it, bitch!', 'ok');
    }
}

function spinThing() {
    var i;
    while (bucket[letters[i]] || i == null) {
        i = Math.floor(Math.random() * (26 - 0)) + 0;
    }
    spins += 1;
    letterUp.textContent = letters[i];
    clearMessage();
    updateHead();
}

function makeMessage(content, type) {
    msgBox.textContent = content;
    msgBox.className = 'msg ' + type;
}

function clearMessage() {
    msgBox.textContent = '';
}

function createWord(length) {
    var consonants = 'bcdfghjklmnpqrstvwxyz',
        vowels = 'aeiou',
        rand = function(limit) {
            return Math.floor(Math.random()*limit);
        },
        i, word='', length = parseInt(length,10),
        consonants = consonants.split(''),
        vowels = vowels.split('');
    for (i=0;i<length/2;i++) {
        var randConsonant = consonants[rand(consonants.length)],
            randVowel = vowels[rand(vowels.length)];
        word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
        word += i*2<length-1 ? randVowel : '';
    }
    return word;
}

function moveThing(elem, timer) {

    var left = 0;
    var top = 0;
    var moveLeft = true;
    var moveDown = true;
    plumbusOneTimer = setInterval(frame, 10); // draw every 10ms

    function frame() {

        if (moveLeft) {
            left++;
        } else {
            left--;
        }

        if (moveDown) {
            top++;
        } else {
            top--;
        }

        if (left > 1000) {
            moveLeft = false;
            //clearInterval(id);
        } else if (left < 0) {
            moveLeft = true;
        }

        if (top > 300) {
            moveDown = false;
            //clearInterval(id);
        } else if (top < 0) {
            moveDown = true;
        }

        elem.style.top = top + 'px';
        elem.style.left = left + 'px';

    }
}

function addListeners(){
    document.getElementById('plumbus-one').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
  //debugger;
  //  var div = document.getElementById('dxy');
  //  div.style.position = 'absolute';
  //  div.style.top = e.clientY + 'px';
  //  div.style.left = e.clientX + 'px';
  plumbusOne.style.position = 'absolute';
  plumbusOne.style.top = e.clientY + 'px';
  plumbusOne.style.left = e.clientX + 'px';
}

/*
function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}
genCharArray('a', 'z');
*/
