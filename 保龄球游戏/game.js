$(function ($) {
    var canvas = $('#gameCanvas')
    var context = canvas.get(0).getContext('2d')

    var canvasWidth = canvas.width()
    var canvasHeight = canvas.height()

    //游戏盘面的属性 
    var platformX, //平台原点
        platformY,
        platformOuterRadius, //整个平台区域
        platformInnerRadius//放置小行星的区域

    var asteroids = []

    function Asteroid(x, y, radius, mass, friction) {
        this.x = x
        this.y = y
        this.radius = radius
        this.mass = mass
        this.friction = friction//摩擦力

        this.vx = 0
        this.vy = 0
        this.player = false//是否适用较大的行星
    }


    //是否开始游戏
    var playGame

    //获取页面数据
    var ui = $('#gameUI')
    var uiIntro = $('#gameIntro')
    var uiStats = $('#gameStats')
    var uiComplete = $('#gameComplete')
    var uiPlay = $('#gamePlay')
    var uiReset = $('.gameReset')
    var uiRemaining = $('#gameRemaining')
    var uiScore = $('.gameScore')
    // console.log(ui,uiIntro,uiStats,uiComplete,uiPlay,uiReset,uiRemaining,uiScore)
    //初始化游戏前隐藏一些元素
    uiStats.hide()
    uiComplete.hide()

    uiPlay.click(function (e) {
        e.preventDefault()
        uiIntro.hide()
        startGame()
    })
    uiReset.click(function (e) {
        e.preventDefault()
        uiComplete.hide()
        startGame()
    })


    function startGame() {
        playGame = false
        //初始化游戏平台
        platformX = canvasWidth / 2
        platformY = 150
        platformOuterRadius = 100
        platformInnerRadius = 75

        //小行星群
        var outerRing = 8//外圈小行星数量
        var ringCount = 3//圈数
        var ringSpacing = (platformInnerRadius / (ringCount - 1))//每个圈之间的距离

        for (var r = 0; r < ringCount; r++) {
            var currentRing = 0//当前圈上小行星的数目
            var angle = 0//每个小行星之间的角度
            var ringRadius = 0
            if (r == ringCount - 1) {
                currentRing = 1
            } else {
                currentRing = outerRing - (r * 3)
                angle = 360 / currentRing
                ringRadius = platformInnerRadius - ringSpacing * r

                for(var a = 0; a<currentRing;a++){
                    var x = 0
                    var y =0
                    if(r==ringCount-1){
                        x = platformX
                        y = platformY
                    } else {
                        x = platformX + ringRadius *Math.cos(angle*a*Math.PI/180)
                        y = platformY + ringRadius *Math.sin(angle*a*Math.PI/180)
                    }

                    var radius = 10
                    var mass = 5
                    var friction = 0.95
                    asteroids.push(new Asteroid(x,y,radius,mass,friction))
                }
            }

        }


        animate()
    }

    //初始化游戏
    function init() {

    }

    //循环动画
    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        //主要实现逻辑
        context.fillStyle = 'rgb(100,100,100)'
        context.beginPath()
        context.arc(platformX, platformY, platformOuterRadius, 0, Math.PI * 2, true)
        context.closePath()
        context.fill()


        if (playGame) {
            setTimeout(animate, 1000 / 60)
        }
    }

    init()
})