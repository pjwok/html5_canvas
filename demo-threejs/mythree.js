$(function () {

    //创建GUI
    var controls = new function () {
        this.rotationSpeed = 0.02
        this.bouncingSpeed = 0.03
    }

    var gui = new dat.GUI()
    gui.add(controls, 'rotationSpeed', 0, 0.5)
    gui.add(controls, 'bouncingSpeed', 0, 0.5)

    // 初始化统计对象
    function initStats() {
        var stats = new Stats()
        stats.setMode(0)//0-FPS 1-渲染时间
        stats.domElement.style.position = 'absolute'
        stats.domElement.style.left = '0'
        stats.domElement.style.top = '0'
        $('#stats-output').append(stats.domElement)
        return stats
    }

    var stats = initStats()

    //创建场景
    var scene = new THREE.Scene()

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

    var renderer = new THREE.WebGLRenderer()
    // renderer.setClearColorHex(0xEEEEEE)//老版本
    renderer.setClearColor(0xefefef, 1)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true

    //创建坐标轴
    var axes = new THREE.AxisHelper(20)

    //在场景中添加坐标轴
    scene.add(axes)

    //创建平面
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)//尺寸
    //MeshLambertMaterial 和 MeshPhongMaterial 会对光源产生反应 MeshBasicMaterial不会对光源产生反应
    var planeMaterial = new THREE.MeshLambertMaterial({//材质
        color: 0xcccccc
    })

    var plane = new THREE.Mesh(planeGeometry, planeMaterial)//将尺寸和材质组合在一起
    //确定位置
    plane.rotation.x = -0.5 * Math.PI//旋转角度
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0

    //接受阴影
    plane.receiveShadow = true
    //在场景中添加平面
    scene.add(plane)

    //创建方块
    var cubeGeometry = new THREE.CubeGeometry(4, 4, 4)
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff,
        // wireframe: false//线框
    })

    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.x = -4
    cube.position.y = 3
    cube.position.z = 0


    //投射阴影效果
    cube.castShadow = true
    scene.add(cube)

    //创建圆
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x77ffff,
        wireframe: true
    })

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.x = 20
    sphere.position.y = 4
    sphere.position.z = 2

    //投射阴影效果
    sphere.castShadow = true

    scene.add(sphere)

    //添加光源
    var spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-40, 60, -10)

    //投射阴影
    spotLight.castShadow = true

    scene.add(spotLight)

    //摄像机的位置
    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    //让画面动起来

    //控制动画
    var step = 0

    function renderAnimation() {
        cube.rotation.x += controls.rotationSpeed
        cube.rotation.y += controls.rotationSpeed
        cube.rotation.z += controls.rotationSpeed

        //圆球的曲线运动
        step += controls.bouncingSpeed//弹跳的速度
        sphere.position.x = 20 + Math.cos(step) * 10
        sphere.position.y = 2 + Math.abs(Math.sin(step)) * 10

    }

    //渲染动画
    function renderScene() {
        stats.update()

        renderAnimation()

        requestAnimationFrame(renderScene)
        renderer.render(scene, camera)
    }

    $('#webgl-output').append(renderer.domElement)
    renderScene()


})
