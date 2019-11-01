$(function () {
    var scene = new THREE.Scene()

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

    var renderer = new THREE.WebGLRenderer()
    console.log(renderer)
    // renderer.setClearColorHex(0xEEEEEE)//老版本
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));

    renderer.setSize(window.innerWidth, window.innerHeight)

    //创建坐标轴
    var axes = new THREE.AxisHelper(20)

    //在场景中添加坐标轴
    scene.add(axes)

    //创建平面
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)//尺寸
    //MeshLambertMaterial 和 MeshPhongMaterial 会对光源产生反应 MeshBasicMaterial不会对光源产生反应
    var planeMaterial = new THREE.MeshPhongMaterial({//材质
        color: 0xcccccc
    })

    var plane = new THREE.Mesh(planeGeometry, planeMaterial)//将尺寸和材质组合在一起
    //确定位置
    plane.rotation.x = -0.5 * Math.PI//旋转角度
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0
    //在场景中添加平面
    scene.add(plane)

    //创建方块
    var cubeGeometry = new THREE.CubeGeometry(4, 4, 4)
    var cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x7777ff,
        wireframe: true//线框
    })

    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.x = -4
    cube.position.y = 3
    cube.position.z = 0

    scene.add(cube)

    //创建圆
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    var sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x77ffff,
        wireframe: true
    })

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.x = 20
    sphere.position.y = 4
    sphere.position.z = 2

    scene.add(sphere)

    //添加光源
    var spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-40,60,-10)
    scene.add(spotLight)

    //摄像机的位置
    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    $('#webgl-output').append(renderer.domElement)
    renderer.render(scene, camera)

})
