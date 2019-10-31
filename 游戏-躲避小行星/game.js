$(function ($) {
    var canvas = $('#gameCanvas')
    var context = canvas.get(0).getContext('2d')

    var canvasWidth = canvas.width()
    var canvasHeight = canvas.height()

    var playGame

    // 小行星
    var asteroids
    var numAsteroids
    var Asteroid = function (x, y, radius, vx) {
        this.x = x
        this.y = y
        this.radius = radius
        this.vx = vx
    }

    function createAsteroids() {
        var radius = 5 + Math.random() * 10//小行星半径
        var x = canvasWidth + radius + Math.floor(Math.random() * canvasWidth)//开始游戏时让小行星出现在屏幕右侧 从右往左运动
        var y = Math.floor(Math.random() * canvasHeight)
        var vx = -5 - Math.random() * 5

        asteroids.push(new Asteroid(x, y, radius, vx))
    }

    //玩家
    var player
    var Player = function (x, y) {
        this.x = x
        this.y = y
        this.width = 24
        this.height = 24
        this.halfWidth = this.width / 2
        this.halfHeight = this.height / 2

        this.vx = 0
        this.vy = 0
        //玩家控制时的属性
        this.moveRight = false
        this.moveUp = false
        this.moveDown = false

        this.flameLength = 20

    }

    //按键检测
    var arrowUp = 38
    var arrowRight = 39
    var arrowDown = 40

    //计分系统
    var score
    var scoreTimeout

    function timer() {
        if (playGame) {
            scoreTimeout = setTimeout(function () {
                console.log(1)
                uiScore.html(++score)
                //增加小行星数量
                if (score % 5 == 0) {
                    numAsteroids += 5
                }
                timer()
            }, 1000)
        }
    }


    //game ui
    var ui = $('#gameUI')
    var uiIntro = $('#gameIntro')
    var uiStats = $('#gameState')
    var uiComplete = $('#gameComplete')
    var uiPlay = $('#gamePlay')
    var uiReset = $('.gameReset')
    var uiScore = $('.gameScore')
    var soundBackground = $('#gameSoundBackground').get(0)
    var soundThrust = $('#gameSoundThrust').get(0)
    var soundDeath = $('#gameSoundDeath').get(0)

    function startGame() {
        uiScore.html('0')
        uiStats.show()

        playGame = false

        score = 0

        //数组存储小行星
        asteroids = new Array()
        numAsteroids = 10
        //创建小行星
        for (var i = 0; i < numAsteroids; i++) {
            createAsteroids()
        }

        //创建玩家火箭
        player = new Player(150, canvasHeight / 2)


        //监听键盘事件
        $(window).on('keydown', function (e) {
            var keyCode = e.keyCode
            console.log(keyCode)

            //当按下按键时 游戏未开始 则触发开始游戏
            if (!playGame) {
                playGame = true
                soundBackground.currentTime = 0
                soundBackground.play()
                animate()
                timer()
            }
            //玩家火箭对应的方向被触发
            if (keyCode == arrowRight) {
                player.moveRight = true
            } else if (keyCode == arrowUp) {
                player.moveUp = true
            } else if (keyCode == arrowDown) {
                player.moveDown = true
            }

        })
        $(window).on('keyup', function (e) {
            player.moveRight = false
            player.moveUp = false
            player.moveDown = false
            if (!player.moveRight) {
                soundThrust.pause()
            }
        })

        animate()

    }

    //init game environment
    function init() {
        uiStats.hide()
        uiComplete.hide()

        uiPlay.on('click', function (e) {
            e.preventDefault()
            uiIntro.hide()
            startGame()
        })
        uiReset.on('click', function (e) {
            e.preventDefault()
            uiComplete.hide()
            $(window).unbind('keyup')
            $(window).unbind('keydown')
            soundBackground.pause()
            soundThrust.pause()
            clearTimeout(scoreTimeout)
            startGame()

        })
    }

    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        //对象运动
        //添加小行星运动 遍历小行星
        var asteroidsLength = asteroids.length
        for (var i = 0; i < asteroidsLength; i++) {
            var tmpAsteroid = asteroids[i]

            //小行星和玩家火箭 碰撞检测
            var dx = player.x - tmpAsteroid.x
            var dy = player.y - tmpAsteroid.y
            var distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < player.halfWidth + tmpAsteroid.radius) {
                soundThrust.pause()
                soundBackground.pause()

                soundDeath.currentTime = 0
                soundDeath.play()

                playGame = false
                clearTimeout(scoreTimeout)
                uiStats.hide()
                uiComplete.show()

                $(window).unbind('keydown')
                $(window).unbind('keyup')

            }

            tmpAsteroid.x += tmpAsteroid.vx

            context.fillStyle = 'rgb(255,255,255)'
            context.beginPath()
            context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI * 2, true)
            context.closePath()
            context.fill()

            //让小行星无线循环
            if (tmpAsteroid.x + tmpAsteroid.radius <= 0) {
                tmpAsteroid.radius = 5 + Math.random() * 5
                tmpAsteroid.x = tmpAsteroid.radius + canvasWidth
                tmpAsteroid.y = Math.floor(Math.random() * canvasHeight)
                tmpAsteroid.vx = -5 - Math.random() * 5
            }


        }

        //增加小行星数量
        while (asteroids.length < numAsteroids) {
            createAsteroids()
        }

        //添加玩家火箭运动
        player.vx = 0
        player.vy = 0
        if (player.moveRight) {
            player.vx = 3

            if (soundThrust.paused) {
                soundThrust.currentTime = 0
                soundThrust.play()
            }

        } else {
            player.vx = -3
        }
        if (player.moveUp) {
            player.vy = -3
        }
        if (player.moveDown) {
            player.vy = 3
        }
        // if (player.moveRight) {
        //     player.vx = 3
        // } else if (player.moveUp) {
        //     player.vy = -3
        // } else if (player.moveDown) {
        //     player.vy = 3
        // }
        player.x += player.vx
        player.y += player.vy

        //绘制玩家火箭
        context.fillStyle = 'rgb(255,0,0)'
        context.beginPath()
        context.moveTo(player.x + player.halfWidth, player.y)
        context.lineTo(player.x - player.halfWidth, player.y - player.halfHeight)
        context.lineTo(player.x - player.halfWidth, player.y + player.halfHeight)
        context.closePath()
        context.fill()

        //玩家火箭的边界
        if (player.x - player.halfWidth < 20) {
            player.x = 20 + player.halfWidth
        } else if (player.x + player.halfWidth > canvasWidth - 20) {
            player.x = canvasWidth - 20 - player.halfWidth
        }

        if (player.y - player.halfHeight < 20) {
            player.y = 20 + player.halfHeight
        } else if (player.y + player.halfHeight > canvasHeight - 20) {
            player.y = canvasHeight - 20 - player.halfHeight
        }
        //火箭前进时尾部火焰
        if (player.moveRight) {
            context.save()
            context.translate(player.x - player.halfWidth, player.y)

            player.flameLength === 20 ? 15 : 20
            // if (player.flameLength == 20) {
            //     player.flameLength = 15
            // } else {
            //     player.flameLength = 20
            // }

            //绘制火焰
            context.fillStyle = 'orange'
            context.beginPath()
            context.moveTo(0, -5)
            context.lineTo(-player.flameLength, 0)
            context.lineTo(0, 5)
            context.closePath()
            context.fill()

            context.restore()
        }


        if (playGame) {
            setTimeout(animate, 1000 / 60)
        }

    }

    init()

})
