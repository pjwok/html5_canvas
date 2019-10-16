$(function () {
    //获取页面上的一些对象
    var canvas = $('#canvas')
    var context = canvas.get(0).getContext('2d')
    var canvasWidth = canvas.width()
    var canvasHeight = canvas.height()
    $(window).resize(resizeCanvas)

    //让画布充满屏幕
    function resizeCanvas() {
        canvas.attr('width', $(window).get(0).innerWidth)
        canvas.attr('height', $(window).get(0).innerHeight)

        canvasWidth = canvas.width()
        canvasHeight = canvas.height()
    }
    resizeCanvas()

    //是否执行动画
    var play = true

    $('#start').hide().click(function () {
        $(this).hide()
        $('#stop').show()
        play = true
        animate()
    })
    $('#stop').click(function () {
        $(this).hide()
        $('#start').show()
        play = false
    })

    //小行星对象
    function Asteroid(x, y, radius, vx, vy, ax, ay) {
        this.x = x
        this.y = y
        this.radius = radius

        //x, y轴上的速率
        this.vx = vx
        this.vy = vy

        //x, y轴上的加速度
        this.ax = ax
        this.ay = ay
    }

    var asteroids = [],
        numOfAsteroids = 10//小行星数量

    for (var i = 0; i < numOfAsteroids; i++) {
        //创建小行星
        var x = 20 + (Math.random() * (canvasWidth - 40))
        var y = 20 + (Math.random() * (canvasHeight - 40))
        var radius = 5 + Math.random() * 10

        var vx = Math.random() * 4 - 2
        var vy = Math.random() * 4 - 2

        var ax = Math.random() * 0.2 - 0.1
        var ay = Math.random() * 0.2 - 0.1

        asteroids.push(new Asteroid(x, y, radius, vx, vy, ax, ay))
    }

    function animate() {
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        context.fillStyle = 'rgb(255,255,255)'

        var asteroidslength = asteroids.length
        for (var i = 0; i < asteroidslength; i++) {
            var el = asteroids[i]
            if (Math.abs(el.vx) < 10) {
                el.vx += el.ax
            }
            if (Math.abs(el.vx) < 10) {

                el.vy += el.ay
            }
            el.x += el.vx
            el.y += el.vy
            //判断是否出界
            if (el.x - el.radius < 0) {
                el.x = el.radius
                el.vx *= -1
                //当碰到边界时需要改变加速度的方向 不然会继续往一个方向运动
                el.ax *= -1
            } else if (el.x + el.radius > canvasWidth) {
                el.x = canvasWidth - el.radius
                el.vx *= -1
                el.ax *= -1
            }

            if (el.y - el.radius < 0) {
                el.y = el.radius
                el.vy *= -1
                el.ay *= -1
            } else if (el.y + el.radius > canvasHeight) {
                el.y = canvasHeight - el.radius
                el.vy *= -1
                el.ay *= -1
            }

            context.beginPath()
            context.arc(el.x, el.y, el.radius, 0, Math.PI * 2, false)
            context.closePath()
            context.fill()
        }

        if (play) {
            setTimeout(animate, 1000 / 60)
        }
    }
    animate()
})