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

    var player//玩家
    var playerOriginalX
    var playerOriginalY

    /**
     * 
     * @param {*} x x轴位置
     * @param {*} y y轴位置
     * @param {*} radius 半径
     * @param {*} mass 质量
     * @param {*} friction 摩擦力
     */
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


    uiScore.html('0')//重置分数
    uiStats.show()//显示统计信息

    function startGame() {
        playGame = true
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
            var ringRadius = 0//当前圈的半径
            //是否是最内圈
            if (r == ringCount - 1) {
                currentRing = 1
            } else {
                currentRing = outerRing - (r * 3)
                angle = 360 / currentRing//每个小行星之间的角度
                ringRadius = platformInnerRadius - ringSpacing * r//当前圈的半径
            }
            for (var a = 0; a < currentRing; a++) {
                // 初始化小行星的坐标
                var x = 0
                var y = 0
                if (r == ringCount - 1) { //如果是最内圈
                    x = platformX
                    y = platformY
                } else {
                    x = platformX + ringRadius * Math.cos(angle * a * Math.PI / 180)
                    y = platformY + ringRadius * Math.sin(angle * a * Math.PI / 180)
                }
                //初始化小行星其他参数
                var radius = 10
                var mass = 5
                var friction = 0.95
                asteroids.push(new Asteroid(x, y, radius, mass, friction))
            }

        }
        //玩家使用的小行星
        var pRadius = 15
        var pMass = 100
        var pFriction = 0.97
        playerOriginalX = canvasWidth / 2
        playerOriginalY = canvasHeight - 150
        player = new Asteroid(playerOriginalX, playerOriginalY, pRadius, pMass, pFriction)
        player.player = true
        asteroids.push(player)

        uiRemaining.html(asteroids.length - 1)//初始化剩余小行星个数

        animate()
    }

    //初始化游戏
    function init() {

    }

    //循环动画
    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        player.y -= 10
        //主要实现逻辑
        //绘制平台
        context.fillStyle = 'rgb(100,100,100)'
        context.beginPath()
        context.arc(platformX, platformY, platformOuterRadius, 0, Math.PI * 2, true)
        context.closePath()
        context.fill()






        //绘制小行星
        context.fillStyle = 'rgb(255,255,255)'
        var asteroidsLength = asteroids.length
        for (var i = 0; i < asteroidsLength; i++) {

            var temAsteroid = asteroids[i]
            //计算新位置
            temAsteroid.x += temAsteroid.vx
            temAsteroid.y += temAsteroid.vy
            //摩擦力
            if (Math.abs(temAsteroid.vx) > 0.1) {
                temAsteroid.vx *= temAsteroid.friction
            } else {
                temAsteroid.vx = 0
            }

            if (Math.abs(temAsteroid.vy) > 0.1) {
                temAsteroid.vy *= temAsteroid.friction
            } else {
                temAsteroid.vy = 0
            }

            for (var j = i + 1; j < asteroidsLength; j++) {
                var temAsteroidB = asteroids[j]
                // 碰撞检测代码
                var dx = temAsteroidB.x - temAsteroid.x;
                var dy = temAsteroidB.y - temAsteroid.y;
                var distance = Math.sqrt((dx * dx) + dy * dy)
                if (distance < temAsteroid.radius + temAsteroidB.radius) {
                    //距离小于两个球的半径 说明碰撞了
                    var angle = Math.atan2(dy, dx)//计算两个球之间连线与水平位置的夹角

                    //后续会用到 先计算出来
                    var sine = Math.sin(angle)
                    var cosine = Math.cos(angle)

                    // 旋转小行星的位置
                    var x = 0
                    var y = 0

                    //旋转小行星B的位置
                    var xb = dx * cosine + dy * sine
                    var yb = dy * cosine - dx * sine

                    //旋转小行星的速度
                    var vx = temAsteroid.vx * cosine + temAsteroid.vy * sine
                    var vy = temAsteroid.vy * cosine - temAsteroid.vx * sine

                    //旋转小行星B的速度
                    var vxb = temAsteroidB.vx * cosine + temAsteroidB.vy * sine
                    var vyb = temAsteroidB.vy * cosine - temAsteroidB.vx * sine

                    //保持动量
                    var vTotal = vx - vxb
                    vx = ((temAsteroid.mass - temAsteroidB.mass) * vx + 2 * temAsteroidB.mass * vxb) / (temAsteroidB.mass + temAsteroid.mass)
                    vxb = vTotal + vx

                    //将小行星分开
                    xb = x + (temAsteroidB.radius + temAsteroid.radius)

                    //转回小行星的位置
                    temAsteroid.x = temAsteroid.x + (x * cosine - y * sine)
                    temAsteroid.y = temAsteroid.y + (y * cosine + x * sine)
                    //转回小行星B的位置
                    temAsteroidB.x = temAsteroid.x + (xb * cosine - yb * sine)
                    temAsteroidB.y = temAsteroid.y + (yb * cosine + xb * sine)

                    //转回小行星的速度
                    temAsteroid.vx = vx * cosine - vy * sine
                    temAsteroid.vy = vy * cosine + vx * sine

                    //转回小行星B的速度
                    temAsteroidB.vx = vxb * cosine - vyb * sine
                    temAsteroidB.vy = vyb * cosine + vxb * sine



                }

            }
            context.beginPath()
            context.arc(temAsteroid.x, temAsteroid.y, temAsteroid.radius, 0, Math.PI * 2, true)
            context.closePath()
            context.fill()
        }

        if (playGame) {
            setTimeout(animate, 1000 / 60)
        }
    }

    init()
})