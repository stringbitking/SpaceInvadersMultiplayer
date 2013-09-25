
var canvas, ctx,
	leftDown, rightDown;

var playerShip, friendlyShips,
    bullets, invaders;

var screenHeight, screenWidth;
//screenWidth = window.innerWidth;
//screenHeight = window.innerHeight;
screenWidth = 800;
screenHeight = 600;

//---------------------- Register Hub -----------------------

// Declare a proxy to reference the hub.
var chat = $.connection.spaceHub;
chat.client.toAllRegisterShip = function (ship) {
    if (isPresentShip(ship.id)) {

    }
    else {
        if (ship.id != playerShip.id) {
            console.log("Registering ship with id: " + ship.id);
            if (!friendlyShips) {
                friendlyShips = [];
            }

            var newShip = new PlayerShip(ship.x, ship.y);
            newShip.id = ship.id;
            friendlyShips.push(newShip);

            chat.server.sendShip(playerShip);
        }
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

chat.client.fireBulletAll = function (bullet) {

    if (bullet.id != playerShip.id) {
        var newBullet = new Bullet(bullet.x, bullet.y);
        bullets.push(newBullet);
    }
};

$.connection.hub.start().done(function () {
    playerShip = new PlayerShip(screenWidth / 2, screenHeight - 80);
    registerShip();
});

//---------------------- The Game -----------------------

function init() {
    
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    ctx = canvas.getContext('2d');

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    bullets = [];

    setInterval(loop, 1000 / 50);

}

function loop() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    checkKeys();

    updateBullets();

    renderBullets();
    playerShip.render(ctx);
    renderFriendlies();
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

function renderBullets() {
    for (var i = 0; i < bullets.length; i++) {

        bullets[i].render(ctx);
    }
}

function checkKeys() {

    if (leftDown) {
        playerShip.x -= 10;
        chat.server.refreshShip(playerShip);
    } else if (rightDown) {
        playerShip.x += 10;
        chat.server.refreshShip(playerShip);
    }
}

function keyDown(e) {

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

function renderShip(x, y) {

}

function registerShip() {
    requester.getJSON("/api/ships/register").then(function (data) {
        playerShip.id = data;
        chat.server.sendShip(playerShip);
        init();
    });
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

//---------------------- Classes -----------------------

function PlayerShip(x, y) {
    this.id = 0;
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 40;

    this.render = function (ctx) {
        var self = this;
        if (self.id == playerShip.id) {
            ctx.fillStyle = 'white';
        }
        else {
            ctx.fillStyle = 'red';
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);
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