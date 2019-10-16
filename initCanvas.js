var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    play = true,
    start = document.getElementById('start'),
    stop = document.getElementById('stop')
//创建用于控制动画的按钮
$(start).hide().click(function () {
    $(this).hide()
    $(stop).show()
    play = true
    animate()
})
$(stop).click(function () {
    $(this).hide()
    $(start).show()
    play = false
})