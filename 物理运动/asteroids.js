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


            //检测碰撞
            for (var j = i + 1; j < asteroidslength; j++) {
                var elb = asteroids[j]

                var dx = elb.x - el.x
                var dy = elb.y - el.y
                var distance = Math.sqrt(dx * dx + dy * dy)
                if (distance < el.radius + elb.radius) {
                    //弹开物体
                    //通过tan来求出两边的夹角
                    var angle = Math.atan2(dy, dx);//计算两个圆之间的角度
                    var sine = Math.sin(angle)//对边与斜边的比值
                    var cosine = Math.cos(angle)//邻边与斜边的比值


                    //把圆的位置和速度进行旋转
                    var x = 0
                    var y = 0
                    var xb = dx * cosine + dy * sine
                    var yb = dy * cosine - dx * sine

                    var vx = el.vx * cosine + el.vy * sine
                    var vy = el.vy * cosine - el.vx * sine

                    var vxb = elb.vx * cosine + elb.vy * sine
                    var vyb = elb.vy * cosine - elb.vx * sine

                    vx *= -1
                    vxb *= -1
                    
                    xb = x +(el.radius+elb.radius)

                    el.x = el.x + (x*cosine -y*sine)
                    el.y = el.y + (y*cosine + x*sine)

                    elb.x = el.x + (xb*cosine - yb *sine)
                    elb.y = el.y + (yb*cosine + xb *sine)

                    el.vx = vx*cosine - vy *sine
                    el.vy = vy*cosine + vx *sine

                    elb.vx = vxb * cosine - vyb *sine
                    elb.vy = vyb * cosine + vxb *sine

                }
            }



            if (Math.abs(el.vx) < 5) {
                el.vx += el.ax
            }
            if (Math.abs(el.vx) < 5) {

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