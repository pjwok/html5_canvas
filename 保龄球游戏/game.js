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
    //鼠标事件
    var playerSelected//小行星是否被选中
    var playerMaxAbsVelocity//小行星的最高速度
    var playerVelocityDampener//缓冲距离转换为弹射力度 存储小行星的速度
    var powerX
    var powerY
    // 计分
    var score

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

        playGame = false//start game?
        score = 0

        platformX = canvasWidth / 2;
        platformY = 150;
        platformOuterRadius = 100;
        platformInnerRadius = 75;

        asteroids = new Array();

        playerSelected = false;
        playerMaxAbsVelocity = 30;
        playerVelocityDampener = 0.3;
        powerX = -1;//鼠标可能移动到0，0的位置
        powerY = -1;

        //玩家使用的小行星的位置 初始化玩家的小行星
        playerOriginalX = canvasWidth / 2;
        playerOriginalY = canvasHeight - 150;
        var pRadius = 15;
        var pMass = 10;
        var pFriction = 0.97;
        player = new Asteroid(playerOriginalX, playerOriginalY, pRadius, pMass, pFriction);
        player.player = true;
        // player.vY = -25
        asteroids.push(player);
        //end  玩家使用小行星的位置


        // Set up other asteroids
        var outerRing = 8; // Asteroids around outer ring
        var ringCount = 3; // Number of rings
        var ringSpacing = (platformInnerRadius / (ringCount - 1)); // Distance between each ring

        // 计算每圈的个数
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
                if (r == ringCount - 1) {
                    x = platformX;
                    y = platformY;
                } else {
                    x = platformX + (ringRadius * Math.cos((angle * a) * (Math.PI / 180)));
                    y = platformY + (ringRadius * Math.sin((angle * a) * (Math.PI / 180)));
                };

                var radius = 10;
                var mass = 5;
                var friction = 0.95;

                asteroids.push(new Asteroid(x, y, radius, mass, friction));
            };
        }
        // 计算剩余个数
        uiRemaining.html(asteroids.length - 1);

        //监听鼠标事件
        $(window).mousedown(function (e) {
            //玩家小行星没有选中 且玩家小行星位于起始点
            if (!playerSelected && player.x == playerOriginalX && player.y == playerOriginalY) {
                // 计算相对canvas的位置
                var canvasOffset = canvas.offset()
                var canvasX = Math.floor(e.pageX - canvasOffset.left)
                var canvasY = Math.floor(e.pageY - canvasOffset.top)
                //检查游戏是否启动
                if (!playGame) {
                    playGame = true
                    animate()
                }

                //玩家小行星与鼠标之间的距离
                var dx = player.x - canvasX
                var dy = player.y - canvasY
                var distance = Math.sqrt(dx * dx + dy * dy)
                var padding = 5//增加可选中的范围

                if (distance < player.radius + padding) {
                    powerX = player.x
                    powerY = player.y
                    playerSelected = true

                }
            }
        })
        $(window).mousemove(function (e) {
            //当点击了玩家小行星之后
            if (playerSelected) {
                var canvasOffset = canvas.offset()
                var canvasX = Math.floor(e.pageX - canvasOffset.left)
                var canvasY = Math.floor(e.pageY - canvasOffset.top)

                //玩家小行星与鼠标之间的距离
                var dx = canvasX - player.x
                var dy = canvasY - player.y
                var distance = Math.sqrt(dx * dx + dy * dy)

                if (distance * playerVelocityDampener < playerMaxAbsVelocity) {
                    powerX = canvasX
                    powerY = canvasY
                } else {//最大速度值与/当前速度(distance) = 最大允许值(最大移动距离) 
                    var ratio = playerMaxAbsVelocity / (distance * playerVelocityDampener)
                    powerX = player.x + (dx * ratio)
                    powerY = player.y + (dy * ratio)
                }
            }
        })
        $(window).mouseup(function (e) {
            if (playerSelected) {
                // 力的位置和玩家使用的小行星之间的距离
                var dx = powerX - player.x
                var dy = powerY - player.y
                // 反方向的速度
                player.vX = -(dx * playerVelocityDampener)
                player.vY = -(dy * playerVelocityDampener)
                // 每选择一次玩家小行星就积分一次
                uiScore.html(++score)
            }
            // 小行星不再被选中 重置小行星的坐标值
            playerSelected = false
            powerX = -1
            powerY = -1

        })

        animate()
    }

    //重置player的位置和速度
    function resetPlayer() {
        player.x = playerOriginalX
        player.y = playerOriginalY
        player.vX = 0
        player.vY = 0
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

        if (playerSelected) {
            context.strokeStyle = 'rgb(255,255,255)'
            context.lineWidth = 3
            context.beginPath()
            context.moveTo(player.x, player.y)
            context.lineTo(powerX, powerY)
            context.closePath()
            context.stroke()
        }

        context.fillStyle = "rgb(255,255,255)"

        var deadAsteroids = new Array()//存储从圆台上掉下来的小行星
        var asteroidsLength = asteroids.length
        for (var i = 0; i < asteroidsLength; i++) {
            var tmpAsteroid = asteroids[i]

            for (var j = i + 1; j < asteroidsLength; j++) {
                var tmpAsteroidB = asteroids[j]

                var dX = tmpAsteroidB.x - tmpAsteroid.x;
                var dY = tmpAsteroidB.y - tmpAsteroid.y;
                var distance = Math.sqrt((dX * dX) + (dY * dY));

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


            if (!tmpAsteroid.player) {//不是玩家小行星
                var dXp = tmpAsteroid.x - platformX
                var dYp = tmpAsteroid.y - platformY
                var distanceP = Math.sqrt(dXp * dXp + dYp * dYp)
                if (distanceP > platformOuterRadius) {//小行星的距离大于圆台半径
                    if (tmpAsteroid.radius > 0) {
                        tmpAsteroid.radius -= 2 //让小行星缩小 消失
                    } else {
                        deadAsteroids.push(tmpAsteroid)//半径为0时归入到移除的数组内
                    }
                }
            }

            //玩家小行星离开画布 或 移动后停止才重置玩家小行星
            if (player.x != playerOriginalX && player.y != playerOriginalY) {
                console.log('离开')
                // if (player.vX == 0 && player.vY == 0) {
                //     resetPlayer()
                // } else if (player.x + player.radius < 0) {
                //     resetPlayer()
                // } else if (player.x - player.radius > canvasWidth) {
                //     resetPlayer()
                // } else if (player.y - player.radius > canvasHeight) {
                //     resetPlayer()
                // } else if (player.y + player.radius < 0) {
                //     resetPlayer()
                // }

                if ((player.vX == 0 && player.vY == 0) ||
                    player.x + player.radius < 0 ||
                    player.x - player.radius > canvasWidth ||
                    player.y - player.radius > canvasHeight ||
                    player.y + player.radius < 0) {
                    resetPlayer()
                }
            }

            context.beginPath();
            context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();

        }


        if (playGame) {
            var deadAsteroidsLength = deadAsteroids.length
            if( deadAsteroidsLength > 0 ){
                for(var di = 0; di< deadAsteroidsLength; di++){
                    var tmpDeadAsteroid = deadAsteroids[di]
                    asteroids.splice(asteroids.indexOf(tmpDeadAsteroid),1)
                }
                var remaining = asteroids.length -1
                uiRemaining.html(remaining)
                if(remaining == 0){
                    playGame = false
                    uiStats.hide()
                    uiComplete.show()
                    $(window).unbind('mousedown')
                    $(window).unbind('mousemove')
                    $(window).unbind('mouseup')
                }
            }
            setTimeout(animate, 1000 / 60)
        }
    }

    init()
})