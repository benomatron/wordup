window.onload = resetGame;

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
    playPlumbi();
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
            crapple = crapple + i + ' ';
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

var wHeight = document.documentElement.clientHeight;
var wWidth = document.documentElement.clientWidth;

/*
window.onscroll = function() {
    wHeight = window.innerHeight;
    wWidth = window.innerWidth;
    console.log('scroll h = ', wHeight, ' w = ', wWidth);
}
*/

var killX = -1000;
var killY = -1000;
var baseSpeed = 14;
var r = 36;
var plumbusCount = 0;

var plumbi = {
    p1: {xid: 'p-1', timerId: 0, image: "images/ok/p1.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p2: {xid: 'p-2', timerId: 0, image: "images/ok/p2.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p3: {xid: 'p-3', timerId: 0, image: "images/ok/p3.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p4: {xid: 'p-4', timerId: 0, image: "images/ok/p4.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p5: {xid: 'p-5', timerId: 0, image: "images/ok/p5.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p6: {xid: 'p-6', timerId: 0, image: "images/ok/p6.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p7: {xid: 'p-7', timerId: 0, image: "images/ok/p1.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p8: {xid: 'p-8', timerId: 0, image: "images/ok/p2.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p9: {xid: 'p-9', timerId: 0, image: "images/ok/p3.gif", di: "images/ok/x.gif", w: 100, h: 150, del: false},
    p10: {xid: 'p-10', timerId: 0, image: "images/ok/p4.gif", di: "images/ok/x.gif",  w: 100, h: 150, del: false}
};

function playPlumbi() {
    var startTime = 12000; //14000
    var delayTime = 10000; //10000;
    var nextTime = 12000; //14000

    plumbusCount = 0;

    setTimeout(function () {
        startPaulPants();
    }, startTime * 2.5);

    var az = document.createElement('audio');
    az.setAttribute('src', 'z.mp3');
    az.play();

    for (var p in plumbi) {
        doSetTimeout(plumbi[p], nextTime);
        delayTime = Math.floor(delayTime + 2300);
        nextTime = startTime + delayTime;
    }

    function doSetTimeout(p, i) {
        setTimeout(function() {
            createPlumbus(p);
        }, i);
    }
}

var t2 = document.getElementById('t2');
t2.addEventListener('click', function(){
    playPlumbi();
});

function stopPlumbus(id) {
    clearInterval(id);
}

function startNum() {
    var x = Math.ceil(Math.random() * 2);
    if (x % 2) {
        return -1;
    }
    return 1;
}


function movePaddle(e) {
    var el = document.getElementById('paddle');
    el.style.left = e.x + 'px';
    el.style.top = e.y + 'px';
}

function doPaddle() {

    var paddle = document.createElement('img');
    paddle.id = 'paddle';
    paddle.src = 'images/ok/paddle.png';
    paddle.height = 100;
    paddle.width = 100;
    paddle.style.position="absolute";
    paddle.style.zIndex = 1000;

    document.body.addEventListener('mousemove', function(e) {
        movePaddle(e);
    });

    document.body.appendChild(paddle);
}

function createPlumbus(plumbus) {

    var plumbusImg = document.createElement('img');
    var yp = Math.max(Math.floor(Math.random() * wHeight), 1);
    var sx = startNum();
    var sy = startNum();

    plumbusImg.id = plumbus.xid;
    plumbusImg.src = plumbus.image;
    plumbusImg.height = plumbus.h;
    plumbusImg.width = plumbus.w;
    plumbusImg.style.position="absolute";
    plumbusImg.style.left = 0 + 'px';
    plumbusImg.style.top = yp + 'px';
    plumbusImg.style.zIndex = 1000;
    //plumbusImg.style.border = "1px solid #000000";
    plumbusImg.addEventListener('mouseover', function(e) {
        bouncePlumbus(e);
    });

    document.body.appendChild(plumbusImg);
    plumbusCount++;
    movePlumbus(plumbus, sx, sy, baseSpeed);
}

function startPaulPants() {
    var pWidth = 864;
    var pHeight = 648;
    var paulPants = document.createElement('img');
    paulPants.id = 'paul-pants';
    paulPants.src = 'images/ok/paulpants_walk.gif';
    paulPants.height = pHeight;
    paulPants.width = pWidth;
    paulPants.style.position="absolute";
    paulPants.style.left = '-1000px';
    paulPants.style.top = '70px';
    paulPants.style.zIndex = 500;

    document.body.appendChild(paulPants);

    var paulTimer = setInterval(paulMove, 20);
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'pp.mp3');
    audioElement.play();

    var leftPos = -300;
    var endPoint = wWidth / 2 - pWidth / 2;

    function paulMove() {

        if (leftPos < endPoint) {
            leftPos++;
        } else if (leftPos >= endPoint) {
            clearInterval(paulTimer);
            killX = Math.floor(wWidth / 2);
            killY = 200;
            paulPants.src = 'images/ok/paulpants_stand.gif';

            var wordUp = document.getElementById('word-up-all');
            wordUp.style.display = 'none';

            var ppHead = document.getElementById('pp-header');
            ppHead.style.top = '20px';
            ppHead.style.display = 'block';

           doPaddle();

        }

        paulPants.style.left = leftPos + 'px';
    }

}

function movePlumbus(plumbus, xRate, yRate, speed) {

    var elem = document.getElementById(plumbus.xid);
    var leftPos = elem.x;
    var topPos = elem.y;
    var angle = 0;
    var aMax = Math.floor(Math.random() * 20 + 5);
    var aDir = 1;

    function isDead(xPos, yPos) {
        if (xPos > killX - r && xPos < killX + r && yPos > killY && yPos < killY + r) {
            return true;
        }
        return false;
    }

    function frame() {

        leftPos += xRate;
        topPos += yRate;
        angle += aDir;

        if (leftPos >= wWidth - plumbus.w) {
            xRate = Math.min(xRate, xRate * -1);
        } else if (leftPos <= 0) {
            xRate = Math.max(xRate, xRate * -1);
        }

        if (topPos >= wHeight - plumbus.h) {
            yRate = Math.min(yRate, yRate * -1);
        } else if (topPos <= 0) {
            yRate = Math.max(yRate, yRate * -1);
        }

        if (angle >= aMax) {
            aDir = -1;
        } else if (angle <= aMax * -1) {
            aDir = 1;
        }

        elem.style.webkitTransform = 'rotate(' + angle + 'deg)';

        if (isDead(leftPos + plumbus.w / 2, topPos + plumbus.h / 2) && !plumbus.del) {
            plumbus.del = true;
            clearInterval(plumbus.timerId);
            elem.removeEventListener('click', true);
            //elem.width = 120;
            //elem.height = 60;
            elem.src = plumbus.di;

            var pp = document.getElementById('paul-pants');
            pp.src = 'images/ok/paulpants_happy.gif';
            plumbusCount--;
            setTimeout(function () {
                elem.remove();
                plumbus.del = true;
                if (plumbusCount > 0) {
                    var px = document.getElementById('paul-pants');
                    px.src = 'images/ok/paulpants_stand.gif';
                }
            }, 3000);
            var ay = document.createElement('audio');
            ay.setAttribute('src', 'y.mp3');
            ay.play();

            if (plumbusCount <= 0) {
                document.getElementById('pp-img').src = 'images/ok/banner_win.png';
                var px = document.getElementById('paul-pants');
                px.src = 'images/ok/paulpants_poo.gif';
            }
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
            x = Math.max(Math.floor(num), -3);
        } else if (num > 0) {
            x = Math.min(Math.ceil(num), 3);
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
    var randSpeed = Math.floor(Math.random() * 10 + 10);

    xOff = niceNumb(xOff);
    yOff = niceNumb(yOff);

    for (var p in plumbi) {
        var bp = plumbi[p];
        if (bp.xid === tg.id) {
            stopPlumbus(bp.timerId);
            movePlumbus(bp, xOff, yOff, randSpeed);
        }
    }
}
