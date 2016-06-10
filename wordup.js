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

function doDebug() {
    debugger;
}

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

// multiple plumbus arrive on screen and bounce around
// paul pants walks out
// cursor turns to paddle
// contact with plumbus changes its vector
// if plumbus hits paulpants mouth it flashes and disappears
// when plumbus are gone paulpants poos and walks off screen

var playPlumbi = true;

var wHeight = document.body.scrollHeight;
var wWidth = document.body.scrollWidth;

/*
window.onscroll = function() {
    wHeight = window.innerHeight;
    wWidth = window.innerWidth;
    console.log('scroll h = ', wHeight, ' w = ', wWidth);
}
*/

var killX = -1000;
var killY = -1000;
var baseSpeed = 3;
var r = 100;

var plumbi = {
    plumbusOne: {xid: 'p-one', timerId: 0, image: "images/ok/p1.gif", xp: 100, yp: 100, w: 80, h: 120},
    plumbusTwo: {xid: 'p-two', timerId: 0, image: "images/ok/p2.gif", xp: 300, yp: 300, w: 80, h: 120}
};

function readyReady() {
    cursor: url("images/ok/paddle.gif");
}

var t1 = document.getElementById('t1');
t1.addEventListener('click', function(){
    createPlumbus(plumbi['plumbusOne']);
});

var t2 = document.getElementById('t2');
t2.addEventListener('click', function(){
    startPaulPants();
});

var t3 = document.getElementById('t3');
t3.addEventListener('click', function(){
    stopPlumbus(plumbi['plumbusOne'].timerId);
});

function stopPlumbus(id) {
    clearInterval(id);
}

function createPlumbus(plumbus) {
    //var plumbusImg = document.createElement('div');
    //plumbusImg.id = plumbus.divId;
    //plumbusImg.className = 'plumbus';

    //var image = document.createElement('img');
//    image.id = plumbus.id;
//    image.src = plumbus.image;
//    image.height = 100;
//    image.width = 60;

    var plumbusImg = document.createElement('img');
    plumbusImg.id = plumbus.xid;
    plumbusImg.src = plumbus.image;
    plumbusImg.height = plumbus.h;
    plumbusImg.width = plumbus.w;
    plumbusImg.style.position="absolute";

    //plumbusImg.appendChild(image);
    plumbusImg.style.left = plumbus.xp + 'px';
    plumbusImg.style.top = plumbus.yp + 'px';

    plumbusImg.style.border = "1px solid #000000";
    plumbusImg.addEventListener('click', function(e) {
        bouncePlumbus(e);
    });

    document.body.appendChild(plumbusImg);

    movePlumbus(plumbus, 1, 1, baseSpeed);
}

function killPlumbus(plumbus) {
    var plumbusImg = document.getElementById(plumbus.divId);
    plumbusImg.remove();
}

function startPaulPants() {
    var pWidth = 400;
    var pHeight = 400;
    var paulPants = document.createElement('img');
    paulPants.id = 'paul-pants';
    paulPants.src = 'images/ok/paulpants.gif';
    paulPants.height = pHeight;
    paulPants.width = pWidth;
    paulPants.style.position="absolute";

    //paulPants.appendChild(image);
    paulPants.style.left = '-1000px';
    paulPants.style.top = '200px';
    paulPants.style.border = "1px solid #000000";
    //paulPants.addEventListener('click', function(e) {
    //    bouncePlumbus(e);
    //});

    document.body.appendChild(paulPants);

    var paulTimer = setInterval(paulMove, baseSpeed);
    var leftPos = -300;
    var endPoint = wWidth / 2 - pWidth / 2;

    function paulMove() {

        if (leftPos < endPoint) {
            leftPos++;
        } else if (leftPos >= endPoint) {
            clearInterval(paulTimer);
            killX = Math.floor(wWidth / 2);
            killY = 200; Math.floor(wHeight / 2);
            var kz = document.createElement('img');
            kz.id = 'kz';
            kz.src = 'images/ok/kz.png';
            kz.style.position="absolute";
            kz.height = r*2;
            kz.width = r*2;
            kz.style.left = killX - r + 'px';
            kz.style.top = killY + r + 'px';
            document.body.appendChild(kz);

        }

        paulPants.style.left = leftPos + 'px';
    }

}

function movePlumbus(plumbus, xRate, yRate, speed) {

    console.log('p = ', plumbus);

    var elem = document.getElementById(plumbus.xid);
    //var init = true, leftPos, topPos;

    var leftPos = elem.x;
    var topPos = elem.y;

    function isDead(xPos, yPos) {
        if (xPos > killX - r && xPos < killX + r && yPos > killY && yPos > killY + r) {
            console.log('DEAD');
            return true;
        }
        return false;
    }

    function frame() {

        leftPos += xRate;
        topPos += yRate;

        if (leftPos > wWidth - plumbus.w || leftPos < 0) {
            xRate = xRate * -1;
        }

        if (topPos > wHeight - plumbus.h || topPos < 0) {
            yRate = yRate * -1;
        }

        if (isDead(leftPos + plumbus.w / 2, topPos + plumbus.h / 2)) {
            clearInterval(plumbus.timerId);
            elem.removeEventListener('click', true);
        }

        elem.style.left = leftPos + 'px';
        elem.style.top = topPos + 'px';
    }

    plumbus.timerId = setInterval(frame, speed);
}

function bouncePlumbus(ev) {

    function niceNumb(num) {
        var x = 1;
        if (num < 1) {
            x = Math.floor(num);
        } else if (num > 0) {
            x = Math.ceil(num);
        }
        return x;
    }

    var tg = ev.target;
    var tx = Math.floor(tg.x + tg.width / 2);
    var ty = Math.floor(tg.y + tg.height / 4);

    var cx = ev.x;
    var cy = ev.y;

    var xOff = (cx - tx) / 10 * -1;
    var yOff = (cy - ty) / 10 * -1;

    var randSpeed = Math.floor(Math.random() * 10 + 20);

    xOff = niceNumb(xOff);
    yOff = niceNumb(yOff);

    console.log('xs = ', xOff, 'ys = ', yOff, ' s = ', randSpeed);

    for (var p in plumbi) {
        var bp = plumbi[p];
        if (bp.xid === tg.id) {
            stopPlumbus(bp.timerId);
            movePlumbus(bp, xOff, yOff, randSpeed);
        }
    }
}

function addListeners(){
    console.log('ok');
   // document.getElementById('plumbus-one').addEventListener('mousedown', mouseDown, false);
   // window.addEventListener('mouseup', mouseUp, false);

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
  //plumbusOne.style.position = 'absolute';
  //plumbusOne.style.top = e.clientY + 'px';
  //plumbusOne.style.left = e.clientX + 'px';
}
