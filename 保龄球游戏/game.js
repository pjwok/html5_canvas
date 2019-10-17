$(function ($) {
    var canvas = $('#gameCanvas')
    var context = canvas.get(0).getContext('2d')

    var canvasWidth = canvas.width()
    var canvasHeight = canvas.height()

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
        animate()
    }
    //初始化游戏
    function init() {

    }

    //循环动画
    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight)

        //主要实现逻辑



        if (playGame) {
            setTimeout(animate, 1000 / 60)
        }
    }

    init()
})