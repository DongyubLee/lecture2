// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

let camera, scene, raycaster, renderer
const mouse = new THREE.Vector2()
window.addEventListener( 'click', onClick, false);

var theCountX = 0
var theCountY = 0
var globalScore = 10

init()
animate()

function init() {

    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )

    // create a scene and a camera
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1,1,1)
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    //camera.position.y = - 100
    camera.position.z = 100

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    //const controls = new OrbitControls( camera, renderer.domElement )

    const directionalLight = new THREE.DirectionalLight( 0xffffff )
    directionalLight.position.set( 1, 1, 1 )
    directionalLight.castShadow = true
    directionalLight.intensity = 2

    const directionalLight2 = new THREE.DirectionalLight( 0xffffff )
    directionalLight2.position.set( -1, -1, -1 )
    directionalLight2.castShadow = true
    directionalLight2.intensity = 2

    scene.add( directionalLight )
    scene.add( directionalLight2 )

    raycaster = new THREE.Raycaster()

    const loader = new Rhino3dmLoader()
    loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

    //loader.load( 'sphere.3dm', function ( object ) {
    loader.load( 'DongyubLee.3dm', function ( object ) {

        document.getElementById('loader').remove()
        scene.add( object )
        console.log( object )

    } )

    let container = document.getElementById( 'container' )
    container = document.createElement( 'div' )
    container.id = 'container'
    const table = document.createElement( 'table' )
    container.appendChild( table )
    const row = document.createElement( 'tr' )
    row.innerHTML = `<td>Hit the ball!</td>`
    table.appendChild( row )
    document.body.appendChild( container )

}

function onClick( event ) {

    console.log( `click! (${event.clientX}, ${event.clientY})`)

	// calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    
    raycaster.setFromCamera( mouse, camera )

	// calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children, true )

    let container = document.getElementById( 'container' )
    if (container) container.remove()

    // reset object colours
    scene.traverse((child, i) => {
        if (child.isMesh) {
            child.material.color.set( 'white' )
        }
    });

    if (intersects.length > 0) {

        // get closest object
        const object = intersects[0].object
        console.log(object) // debug

        //object.material.color.set( 'red' )

        // get user strings
        let data, count
        if (object.userData.attributes !== undefined) {
            data = object.userData.attributes.userStrings
            object.material.color.set( 'red' )
            globalScore += Number(data[0][1])
        } else {
            // breps store user strings differently...
            data = object.parent.userData.attributes.userStrings
            object.material.color.set( 'green' )
            globalScore = Number(data[0][1])
        }


        // do nothing if no user strings
        if ( data === undefined ) return

        

        console.log( data )
        
        // create container div with table inside
        container = document.createElement( 'div' )
        container.id = 'container'
        
        const table = document.createElement( 'table' )
        container.appendChild( table )

        const row = document.createElement( 'tr' )
        row.innerHTML = `<td>Score</td><td>${globalScore}</td>`
        table.appendChild( row )

        for ( let i = 0; i < data.length-1; i ++ ) {

            const row = document.createElement( 'tr' )
            row.innerHTML = `<td>${data[ i+1 ][ 0 ]}</td><td>${data[ i+1 ][ 1 ]}</td>`
            table.appendChild( row )
        }

        document.body.appendChild( container )
    }

}

function animate() {

    theCountX += 0.05
    theCountY += 0.03

    requestAnimationFrame( animate )

    scene.rotation.x += 0.015
    scene.rotation.y += 0.015

    camera.position.x = Math.sin(theCountX) * 50
    camera.position.y = Math.sin(theCountY) * 50

    renderer.render( scene, camera )

}

