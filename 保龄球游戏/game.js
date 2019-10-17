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

    uiPlay.click(function(e){
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
        platformX = canvasWidth /2
        platformY = 150
        platformOuterRadius = 100
        platformInnerRadius = 75

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
        context.arc(platformX, platformY, platformOuterRadius, 0, Math.PI*2, true)
        context.closePath()
        context.fill()


        if (playGame) {
            setTimeout(animate, 1000 / 60)
        }
    }

    init()
})