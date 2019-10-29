$(function ($) {
    var canvas = $('#gameCanvas')
    var context = canvas.get(0).getContext('2d')

    var canvasWidth = canvas.width()
    var canvasHeight = canvas.height()

    //游戏是否开始
    var playGame
    //游戏圆形平台
    var platformX;
    var platformY;
    var platformOuterRadius;
    var platformInnerRadius;
    //小行星
    var asteroids;
    //玩家
    var player;
	var playerOriginalX;
	var playerOriginalY;

    // Game UI
    var ui = $("#gameUI");
    var uiIntro = $("#gameIntro");
    var uiStats = $("#gameStats");
    var uiComplete = $("#gameComplete");
    var uiPlay = $("#gamePlay");
    var uiReset = $(".gameReset");
    var uiRemaining = $("#gameRemaining");
    var uiScore = $(".gameScore");

    var Asteroid = function (x, y, radius, mass, friction) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        this.friction = friction;

        this.vX = 0;
        this.vY = 0;

        this.player = false;
    };

    //重置和开始游戏
    function startGame() {
        // Reset game stats
        uiScore.html("0");
        uiStats.show();

        playGame = true//start game?

        platformX = canvasWidth / 2;
        platformY = 150;
        platformOuterRadius = 100;
        platformInnerRadius = 75;

        asteroids = new Array();

        //玩家使用的小行星的位置
        playerOriginalX = canvasWidth/2;
        playerOriginalY = canvasHeight-150;
        var pRadius = 15;
		var pMass = 10;
		var pFriction = 0.97;
		player = new Asteroid(playerOriginalX, playerOriginalY, pRadius, pMass, pFriction);
        player.player = true;
        player.vY = -25
        asteroids.push(player);
        //end  玩家使用小行星的位置

        // Set up other asteroids
        var outerRing = 8; // Asteroids around outer ring
        var ringCount = 3; // Number of rings
        var ringSpacing = (platformInnerRadius / (ringCount - 1)); // Distance between each ring

        for (var r = 0; r < ringCount; r++) {
            var currentRing = 0; // Asteroids around current ring
            var angle = 0; // Angle between each asteroid
            var ringRadius = 0;

            // Is this the innermost ring?
            if (r == ringCount - 1) {
                currentRing = 1;
            } else {
                currentRing = outerRing - (r * 3);
                angle = 360 / currentRing;
                ringRadius = platformInnerRadius - (ringSpacing * r);
            };


            for (var a = 0; a < currentRing; a++) {
				var x = 0;
				var y = 0;
				
				// Is this the innermost ring?
				if (r == ringCount-1) {
					x = platformX;
					y = platformY;
				} else {
					x = platformX+(ringRadius*Math.cos((angle*a)*(Math.PI/180)));
					y = platformY+(ringRadius*Math.sin((angle*a)*(Math.PI/180)));
				};
			
				var radius = 10;
				var mass = 5;
				var friction = 0.95;
				
				asteroids.push(new Asteroid(x, y, radius, mass, friction));
			};
        }
        uiRemaining.html(asteroids.length-1);

        animate()
    }

    //初始化游戏环境
    function init() {
        uiStats.hide();
        uiComplete.hide();

        uiPlay.click(function (e) {
            e.preventDefault();
            uiIntro.hide();
            startGame();
        });

        uiReset.click(function (e) {
            e.preventDefault();
            uiComplete.hide();
            startGame();
        });
    }

    //游戏的动画效果
    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        // Draw platform
        context.fillStyle = "rgb(100, 100, 100)";
        context.beginPath();
        context.arc(platformX, platformY, platformOuterRadius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        context.fillStyle="rgb(255,255,255)"
        var asteroidsLength = asteroids.length
        for(var i = 0; i< asteroidsLength;i++){
            var tmpAsteroid = asteroids[i]

            for(var j = i+1; j<asteroidsLength;j++){
                var tmpAsteroidB = asteroids[j]

                var dX = tmpAsteroidB.x - tmpAsteroid.x;
				var dY = tmpAsteroidB.y - tmpAsteroid.y;
                var distance = Math.sqrt((dX*dX)+(dY*dY));
                
                if (distance < tmpAsteroid.radius + tmpAsteroidB.radius) {								
					var angle = Math.atan2(dY, dX);
					var sine = Math.sin(angle);
					var cosine = Math.cos(angle);
					
					// Rotate asteroid position
					var x = 0;
					var y = 0;
					
					// Rotate asteroidB position
					var xB = dX * cosine + dY * sine;
					var yB = dY * cosine - dX * sine;
						
					// Rotate asteroid velocity
					var vX = tmpAsteroid.vX * cosine + tmpAsteroid.vY * sine;
					var vY = tmpAsteroid.vY * cosine - tmpAsteroid.vX * sine;
					
					// Rotate asteroidB velocity
					var vXb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY * sine;
					var vYb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX * sine;
					
					// Conserve momentum
					var vTotal = vX - vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) / (tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX;
					
					// Move asteroids apart
					// CHANGE THIS IN PREVIOUS CHAPTER
					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);
					
					// Rotate asteroid positions back
					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);
					
					tmpAsteroidB.x = tmpAsteroid.x + (xB * cosine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * cosine + xB * sine);
					
					// Rotate asteroid velocities back
					tmpAsteroid.vX = vX * cosine - vY * sine;
					tmpAsteroid.vY = vY * cosine + vX * sine;
					
					tmpAsteroidB.vX = vXb * cosine - vYb * sine;
					tmpAsteroidB.vY = vYb * cosine + vXb * sine;
				};
            }
            // Calculate new position
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;
			
			// Friction
			if (Math.abs(tmpAsteroid.vX) > 0.1) {
				tmpAsteroid.vX *= tmpAsteroid.friction;
			} else {
				tmpAsteroid.vX = 0;
			};
			
			if (Math.abs(tmpAsteroid.vY) > 0.1) {
				tmpAsteroid.vY *= tmpAsteroid.friction;
			} else {
				tmpAsteroid.vY = 0;
			};

            context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, true);
			context.closePath();
			context.fill();

        }

        if (playGame) {
            setTimeout(animate, 1000 / 60)
        }
    }

    init()
})