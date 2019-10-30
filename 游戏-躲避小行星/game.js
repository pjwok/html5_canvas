$(function($){
    var canvas = $('#gameCanvas')
    var context = canvas.get(0).getContext('2d')

    var canvasWidth = canvas.width()
    var canvasHeight = canvas.height()

    var playGame

    //game ui
    var ui = $('#gameUI')
    var uiIntro = $('#gameIntro')
    var uiStats = $('#gameState')
    var uiComplete = $('#gameComplete')
    var uiPlay = $('#gamePlay')
    var uiReset = $('.gameReset')
    var uiScore = $('.gameScore')

    function startGame(){
        uiScore.html('0')
        uiStats.show()

        playGame = false

        animate()
    }

    function init(){
        uiStats.hide()
        uiComplete.hide()

        uiPlay.on('click', function(e){
            e.preventDefault()
            uiIntro.hide()
            startGame()
        })
        uiReset.on('click', function(e){
            e.preventDefault()
            uiComplete.hide()
            startGame()
        })
    }

    function animate(){
        context.clearRect(0,0,canvasWidth, canvasHeight)

        if(playGame){
            setTimeout(animate, 1000/60)
        }

    }
    init()

})
