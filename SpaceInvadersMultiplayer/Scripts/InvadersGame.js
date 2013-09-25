
var canvas, ctx,
	leftDown, rightDown;

var playerShip, friendlyShips,
    bullets, invaders, particles,
    images;

var screenHeight, screenWidth;
//screenWidth = window.innerWidth;
//screenHeight = window.innerHeight;
screenWidth = 1000;
screenHeight = 500;

var gameId = parseInt($("#gameId").val());
var isMainPlayer = false;
var frameCounter = 0;

//---------------------- Register Hub -----------------------

// Declare a proxy to reference the hub.
var chat = $.connection.spaceHub;
chat.client.toAllRegisterShip = function (ship) {
    if (isPresentShip(ship.id)) {
        if (ship.isRejoining) {
            chat.server.sendShip(playerShip, gameId);
        }
    }
    else {
        console.log("Registering ship with id: " + ship.id);
        if (!friendlyShips) {
            friendlyShips = [];
        }

        var newShip = new PlayerShip(ship.x, ship.y);
        newShip.id = ship.id;
        friendlyShips.push(newShip);

        chat.server.sendShip(playerShip, gameId);
    }
};

chat.client.refreshShipPosition = function (ship) {

    if (ship.id != playerShip.id) {
        for (var i = 0; i < friendlyShips.length; i++) {
            if (friendlyShips[i].id == ship.id) {
                friendlyShips[i].x = ship.x;
                friendlyShips[i].y = ship.y;
                break;
            }
        }
    }
}; 

chat.client.refreshInvadersPosition = function (message) {
    invaders = [];
    for (var i = 0; i < message.invaders.length; i++) {
        invaders.push(new Invader(message.invaders[i].x, message.invaders[i].y));
        invaders[i].velX = message.invaders[i].velX;
    }
};

chat.client.fireBulletAll = function (bullet) {

    if (bullet.id != playerShip.id) {
        var newBullet = new Bullet(bullet.x, bullet.y);
        bullets.push(newBullet);
    }
};

chat.client.startGame = function () {
    resetInvaders();
};

chat.client.makeMainPlayer = function () {
    isMainPlayer = true;
};

$.connection.hub.start().done(function () {

    loadImages();
    playerShip = new PlayerShip(screenWidth / 2, screenHeight - 80);
    registerShip();

});

//---------------------- The Game -----------------------

function init() {

    canvas = document.createElement('canvas');
    document.getElementById("game-container").appendChild(canvas);
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    ctx = canvas.getContext('2d');

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    bullets = [];
    particles = [];
    invaders = [];
    //resetInvaders();

    setInterval(loop, 1000 / 50);

}

function loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    checkKeys();

    updateBullets();
    //if (isMainPlayer) {
        updateInvaders();
    //}

    checkCollisions();

    renderBullets();
    renderInvaders();
    updateParticles();
    playerShip.render(ctx);
    renderFriendlies();
    
    //refresh invaders
    if (frameCounter % 100 == 0) {
        chat.server.refreshInvaders({ invaders: invaders }, gameId, playerShip.id);
    }

    frameCounter++;
}

function resetInvaders() {
    invaders = [];

    for (var col = 0; col < 10; col++) {
        for (var row = 0; row < 3; row++) {
            var invader = new Invader(col * 80 + 50, row * 60 + 30);
            invaders.push(invader);

        }
    }
}

function renderFriendlies() {
    if (friendlyShips) {
        for (var i = 0; i < friendlyShips.length; i++) {
            friendlyShips[i].render(ctx);
        }
    }
}

function updateBullets() {
    for (var i = 0; i < bullets.length; i++) {

        bullets[i].update();
    }
}

function updateParticles() {
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].render(ctx);
    }
}

function renderBullets() {
    for (var i = 0; i < bullets.length; i++) {

        bullets[i].render(ctx);
    }
}

function updateInvaders() {
    var hittingWall = false;

    for (var i = 0; i < invaders.length; i++) {
        if (invaders[i].x <= 0 || (invaders[i].x >= screenWidth - 40)) {
            hittingWall = true;
            break;
        }
    }

    for (var i = 0; i < invaders.length; i++) {

        if (hittingWall) {
            invaders[i].velX = invaders[i].velX * (-1);
        }

        invaders[i].update();
    }
}

function renderShip(x, y) {

}

function renderInvaders() {
    for (var i = 0; i < invaders.length; i++) {

        invaders[i].render(ctx);
    }
}

function registerShip() {
    var localId = localStorage.getItem("id");

    if (!localId) {
        requester.getJSON("/api/ships/register").then(function (data) {
            playerShip.id = data;
            localStorage.setItem("id", playerShip.id);
            chat.server.sendShip(playerShip, gameId);
            init();
        });
    }
    else {
        playerShip.id = localId;
        playerShip.isRejoining = true;
        localStorage.setItem("id", playerShip.id);
        chat.server.sendShip(playerShip, gameId);
        playerShip.isRejoining = false;
        init();
    }

}

function isPresentShip(shipId) {
    if (friendlyShips) {
        for (var i = 0; i < friendlyShips.length; i++) {
            if (friendlyShips[i].id == shipId) {
                return true;
            }
        }
    }

    return false;
}

function makeExplosion(x, y) {
    for (var i = 0; i < 15; i++) {

        var p = new Particle(x, y);
        particles.push(p);

    }
}

function loadImages() {
    images = [];
    var imgPlayerShip = new Image();
    imgPlayerShip.src = "../../img/player-ship.png";
    images['player-ship'] = imgPlayerShip;

    var imgInvaderShip = new Image();
    imgInvaderShip.src = "../../img/invader.jpg";
    images['invader-ship'] = imgInvaderShip;

    var imgFireball = new Image();
    imgFireball.src = "../../img/fireball.png";
    images['fireball'] = imgFireball;
}

//---------------------- Events -----------------------

function checkCollisions() {

    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];

        for (var j = 0; j < invaders.length; j++) {
            var invader = invaders[j];

            if ((bullet.x > invader.x) && (bullet.x < invader.x + invader.width)
				&& (bullet.y > invader.y) && (bullet.y < invader.y + invader.height)) {

                invaders.splice(j, 1);
                j--;
                bullets.splice(i, 1);
                i--;

                makeExplosion(invader.x + invader.width / 2, invader.y + invader.height / 2)

            }
        }
    }
}

function checkKeys() {

    if (leftDown) {
        if (playerShip.x >= 0) {
            playerShip.x -= 10;
            chat.server.refreshShip(playerShip);
        }
    } else if (rightDown) {
        if (playerShip.x <= screenWidth - 50) {
            playerShip.x += 10;
            chat.server.refreshShip(playerShip);
        }
    }
}

function keyDown(e) {
    e.preventDefault();
    if (e.keyCode == 37) {
        leftDown = true;
    } else if (e.keyCode == 39) {
        rightDown = true;
    }

    if (e.keyCode == 32) {
        var bullet = new Bullet(playerShip.x + playerShip.width / 2, playerShip.y);
        chat.server.fireBullet(bullet);
        bullets.push(bullet);
    }
}

function keyUp(e) {

    if (e.keyCode == 37) {
        leftDown = false;
    } else if (e.keyCode == 39) {
        rightDown = false;
    }
}

//---------------------- Classes -----------------------

function PlayerShip(x, y) {
    this.id = 0;
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 40;
    this.isRejoining = false;

    this.render = function (ctx) {
        var self = this;
        ctx.save();

        ctx.drawImage(images['player-ship'], this.x, this.y, 50, 50);

        ctx.restore();
    }
}

function Bullet(x, y) {
    this.id = playerShip.id;
    this.x = x;
    this.y = y;

    this.update = function () {
        this.y -= 20;

    }
    this.render = function (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, 4, 10);
    }
}

function Invader(x, y) {

    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 40;
    this.velX = 1;

    this.update = function () {
        this.x += this.velX;
    }

    this.render = function (ctx) {
        ctx.save();

        ctx.drawImage(images['invader-ship'], this.x, this.y, 50, 50);

        ctx.restore();
    }
}

function Particle(x, y) {

    this.x = x;
    this.y = y;
    this.velX = Math.random() * 20 - 10;
    this.velY = Math.random() * 20 - 10;
    this.size = 10;
    this.update = function () {
        this.x += this.velX;
        this.y += this.velY;

    }
    this.render = function (ctx) {
        ctx.save();

        ctx.drawImage(images['fireball'], this.x, this.y, this.size, this.size);

        ctx.restore();
    }

}


