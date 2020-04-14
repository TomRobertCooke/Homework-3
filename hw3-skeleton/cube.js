"use strict";

var canvas;
var gl;

var numPositions  = 36;

var positions = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [0, 0, 0];
//same as in the colored cube example


//here are some definitions that may be needed.
var modelMatrix=mat4();
var viewMatrix=mat4();
var projectionMatrix=mat4();
var resultMatrix=mat4();
var identityMatrix=mat4();
var matrixLoc;

var origin=vec3(0,0,0);
var cameraUp=vec3(0,1,0);
var cameraPosition=vec3(0,0,1);
var cameraLookingAtCube=false;
var cameraText;
var useProjection=false;
var usePerspective=false;



window.onload = function init()
{
    console.log("hello");
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    matrixLoc = gl.getUniformLocation(program, "uMatrix");


	/* todo: define the HTML input elements.
	Hint: you can define a checkbox in HTML like this:
	
	<input type="checkbox" id="use-perspective">
	  <label for="use-perspective">Use perspective</label>
	</input>
	
	And a button liek this:
	<button id= "look-at-cube">Look at cube</button>
	
	You can add text in HTML like this : <p id="camera-text">Camera location:</p>
	*/

	//event listeners for switching between looking at cube/looking at -z





	//todo: add event listeners for controlling the camera abd cube, and switching between options.
	//1. conrtolling the position of the camera and orientation of the cube
	//2. switching between looking at the cube and at the default direction
	//3. switching between camera projections
	
	//examples: 
	
	//document.getElementById( "use-projection" ).onchange = function (e) {};
	
	//hint: inside an event hander function, "this" refers to the HTML element of the event. You can use this.textContent="..." to change the text of a button.
    //hint: inside the event handler function of a checkbox, this.checked is the boolean checked state of the checkbox.
    
	document.getElementById( "look-at-cube" ).onclick = function (e) {
        cameraLookingAtCube = true;
        render();
    };
    document.getElementById( "default-direction" ).onclick = function (e) {
        cameraLookingAtCube = false;
        render();
    };
    
	
	
	
	
	//todo: keys to control the camera and cube for example. You can also use the mouse or sliders.
	
	//hint: using sensible change rates and limits help prevent moving the cube out of the camera's view. Note components of theta are in degrees.
	//hint: without a projection, the visible area in the frame of the camera is a cube from -1 to 1 in x, y and z coordinates. This means the distance from the camera to any face of the cube should be less than 1 for it to be visible, for example.
	
	//example: document.addEventListener("keydown",function(e){ ... });
	//hint: you can use conditions like if(e.key=="a") or if(e.keyCode==37). You can look up key codes, or use console.log(e.keyCode) in this listener to see what's the code of a key you press.
	//hint: after changing the cube or camera's frame, call render() again.
	document.addEventListener("keydown", function(e) {
        switch (e.key) {
            case 'q':
                if (cameraPosition[1] < 0.5) {
                    cameraPosition[1] += 0.05;
                    cameraPosition[1] = Math.round(cameraPosition[1] * 100) / 100;
                    render();
                } else {
                    alert("too far");
                }
                break;
            case 'e':
                if (cameraPosition[1] > -0.5 ) {
                    cameraPosition[1] -= 0.05;
                    cameraPosition[1] = Math.round(cameraPosition[1] * 100) / 100;
                    render();
                } else {
                    alert("too far");
                }
                break;
            case 'a':
                if (cameraPosition[0] > -0.5) {
                    cameraPosition[0] -= 0.05;
                    cameraPosition[0] = Math.round(cameraPosition[0] * 100) / 100;
                    render();
                } else {
                    alert("too far");
                }
                break;
            case 'd':
                if (cameraPosition[0] < 0.5) {
                    cameraPosition[0] += 0.05;
                    cameraPosition[0] = Math.round(cameraPosition[0] * 100) / 100;
                    render();
                } else {
                    alert("too far");
                }
                break;
            case 'w':
                if (cameraPosition[2] > -1) {
                    cameraPosition[2] -= 0.05;
                    cameraPosition[2] = Math.round(cameraPosition[2] * 100) / 100;
                    render();
                } else {
                    alert("too far");
                }
                break;
            case 's':
                if (cameraPosition[2] < 1) {
                    cameraPosition[2] += 0.05;
                    cameraPosition[2] = Math.round(cameraPosition[2] * 100) / 100;
                    render();
                } else {
                    alert("too far");
                }
                break;
            case "F5":
                break;
            case "ArrowLeft":
                if (theta[1] == 357) {
                    theta[1] = 0;
                } else {
                    theta[1] += 3;
                }
                break;
            case "ArrowRight":
                if (theta[1] == 0) {
                    theta[1] = 357;
                } else {
                    theta[1] -= 3;
                }
                break;
            case "ArrowDown":
                if (theta[0] == 0) {
                    theta[0] = 357;
                } else {
                    theta[0] -= 3;
                }
                break;
            case "ArrowUp":
                if (theta[0] == 357) {
                    theta[0] = 0;
                } else {
                    theta[0] += 3;
                }
                break;
            default:
                alert("Camera Controls:\nQ: up\nE: down\nA: left\nD: right\nW: forward\nS: back");
                break;
        }
        cameraText.textContent="Camera Position: " + cameraPosition;
        render()
    });
	
	//todo: show the camera position and direction(whether it's looking at the cube) in text. 
	//hint: You can set the text like this:
    cameraText = document.getElementById("camera-text"); 
    cameraText.textContent="Camera Position: " + cameraPosition; 

    render();
}

function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d)
{
    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4(0.5,  0.5,  0.5, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(0.5,  0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        vec4(1.0, 1.0, 1.0, 1.0)   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [a, b, c, a, c, d];

    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);
    }
}



function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//todo: compute the model matrix here instead of in the shader
	//modelMatrix=...
	//hint: you can use rotateX, rotateY and rotateZ to get matrices and combine them.

    modelMatrix = mult( mult(rotateX(theta[0]), rotateY(theta[1])), rotateZ(theta[2]) );
    
	//todo: 
	//1. compute the view matrix when the camera is pointing at the -z direction.
	//hint: here the view matrix is the inverse of the camera matrix, which is a translation from the origin to the position of the camera(by default the camera is already looking towards the -z direction if you don't rotate it). Then combine the model and view matrices. There's a function translate( x, y, z ).
    var cameraMatrix;
    var modelView;
    if (cameraLookingAtCube == false) {
        /*cameraMatrix = translate(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
        viewMatrix = inverse4(cameraMatrix);*/
        var newEye = vec3();
        newEye[0] = cameraPosition[0];
        newEye[1] = cameraPosition[1];
        newEye[2] = cameraPosition[2] - 0.1;
        viewMatrix = lookAt(newEye, cameraPosition, cameraUp);
        modelView = mult(modelMatrix, viewMatrix);
    }

    //2. add support for looking at the cube
    //hint: there's a function lookAt( eye, at, up ). We want the camera (eye) to look at the center of the cube.
    if (cameraLookingAtCube == true) {
        viewMatrix = inverse4(lookAt( origin, cameraPosition, cameraUp));
        modelView = mult(modelMatrix, viewMatrix);
    }

	//3. add orthographic or perspective projection if it's enabled, and multiply the projection matrix with the model-view matrix.
	//hint: there are functions perspective( fovy, aspect, near, far ) and ortho( left, right, bottom, top, near, far ).
    resultMatrix = modelView;
    //var projectionMatrix = perspective(90, 1, 1, -1);
    //resultMatrix = mult(modelMatrix, projectionMatrix);
    
	//set the matrix uniform - flatten() already transposes into column-major order.
	gl.uniformMatrix4fv(matrixLoc, false, flatten(resultMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    //requestAnimationFrame(render);
}
