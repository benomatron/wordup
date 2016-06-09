window.onload = addListeners;

////////////////////////////////////////////////////////////////////////
// wordup
////////////////////////////////////////////////////////////////////////

// elements

var letterList = document.getElementById('letters');
var letterUp = document.getElementById('letter-up');
var pointBox = document.getElementById('point-box');
var skipBox = document.getElementById('skip-box');
var spinBox = document.getElementById('spin-box');
var wordBox = document.getElementById('word-box');
var msgBox = document.getElementById('msg-box');

// internal vars

var skips = 0;
var points = 0;
var spins = 0;
var letterCount = 0;
var totalWords = 50;
var maxSpins = 6;
var maxSkips = 3;
var maxLetters = 5;

var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var letterBucket = {};
var words = [];

// buttons

var noBtn = document.getElementById('oh-no');
    noBtn.onclick = skipLetter;
var resetBtn = document.getElementById('reset-btn');
    resetBtn.onclick = resetGame;
var finishBtn = document.getElementById('finish-btn');
    finishBtn.onclick = finishGame;
    finishBtn.setAttribute("disabled", "true");
var spinBtn = document.getElementById('spin-btn');
    spinBtn.onclick = spinThing;
var yesBtn = document.getElementById('oh-yes');
    yesBtn.onclick = addLetter;

function resetGame() {
    skips = 0;
    spins = 0;
    points = 0;
    letterBucket = {};
    letterUp.textContent = '';
    letterList.textContent = '';
    makeWords(totalWords, 13, 7);
    updateHead();
}

function finishGame() {
    var tally = 0;
    for (i in letterBucket) {
        for (var j = 0; j < words.length; j++) {
            if (words[j].indexOf(letterBucket[i]) !== -1) {
                points++;
            }
        }
    }
    updateHead();
    if (playPlumbi) {
        testMove();
    }
}

function spinsMaxed() {
    if (letterCount <= maxLetters) {
        updateLetter();
        addLetter();
    }
    disableButtons();
    makeMessage('You ran out of spins, bitch!', 'bad');
}

function disableButtons() {
    finishBtn.removeAttribute("disabled");
    noBtn.setAttribute("disabled", "true");
    yesBtn.setAttribute("disabled", "true");
    //resetBtn.setAttribute("disabled", "true");
    spinBtn.setAttribute("disabled", "true");
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
    if (spins >= maxSpins) {
        spinsMaxed();
    }
    pointBox.textContent = points;
    if (points) {
        pointBox.className = "finished";
        pointBox.textContent = '+ ' + points + ' !!!';
    }
    skipBox.textContent = maxSkips - skips;
    spinBox.textContent = maxSpins - spins;

}

function addLetter() {
    var letter = letterUp.textContent;
    var crapple = '';
    if (letter) {
        letterBucket[letter] = letter;
        for (i in letterBucket) {
            crapple = crapple + i + '-';
        }
        letterCount++;
        letterList.textContent = crapple.slice(0, crapple.length-1);
        letterUp.textContent = '';
        updateHead();
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

function updateLetter() {
    var i;
    if (spins < maxSpins) {
        spins += 1;
    }
    while (letterBucket[letters[i]] || i == null) {
        i = Math.floor(Math.random() * (26 - 0)) + 0;
    }
    letterUp.textContent = letters[i];
}

function spinThing() {
    clearMessage();
    updateLetter();
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

////////////////////////////////////////////////////////////////////////
// plumbi paulpants
////////////////////////////////////////////////////////////////////////

// plumbus things

var playPlumbi = true;

var plumbusOne = document.getElementById('plumbus-one');
var plumbusOneTimer = null;
plumbusOne.onclick = stopPlumbus;

function testMove() {
    playPlumbi = false;
    moveThing(plumbusOne, plumbusOneTimer);
}


function stopPlumbus() {
    clearInterval(plumbusOneTimer);
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
