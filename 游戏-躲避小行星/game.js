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
        this.radius = raidus
        this.vx = vx
    }

    //玩家
    var player
    var Player = function (x, y) {
        this.x = x
        this.y = y
        this.width = 24
        this.height = 24
        this.halfWidth = this.width / 2
        this.haldHeight = this.height / 2

        this.vx = 0
        this.vy = 0
    }


    //game ui
    var ui = $('#gameUI')
    var uiIntro = $('#gameIntro')
    var uiStats = $('#gameState')
    var uiComplete = $('#gameComplete')
    var uiPlay = $('#gamePlay')
    var uiReset = $('.gameReset')
    var uiScore = $('.gameScore')

    function startGame() {
        uiScore.html('0')
        uiStats.show()

        playGame = false

        //数组存储小行星
        asteroids = new Array()
        numAsteroids = 10
        //创建小行星
        for (var i = 0; i < numAsteroids; i++) {
            var radius = 5 + Math.random() * 10//小行星半径
            var x = canvasWidth + radius + Math.floor(Math.random() * canvasWidth)//开始游戏时让小行星出现在屏幕右侧 从右往左运动
            var y = Math.floor(Math.random() * canvasHeight)
            var vx = -5 - Math.random() * 5

            asteroids.push(new Asteroid(x, y, radius, vx))
        }

        //创建玩家火箭
        player = new Player(150, canvasHeight / 2)


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
            startGame()
        })
    }

    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        if (playGame) {
            setTimeout(animate, 1000 / 60)
        }

    }

    init()

})
