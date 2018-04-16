import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'
import {glMatrix, mat2, mat2d, mat3, mat4, quat,vec2, vec3, vec4} from './gl-matrix'
import obj from './monkey.obj'
import objImg from '@/assets/stupidity2.gif'

import Mesh from './Mesh'

let vertexShaderText = {text: vertex, type: "x-shader/x-vertex"}
let fragmentShaderText = {text: fragment, type: "x-shader/x-fragment"}
   
var gl;
let worldVertexTextureCoordBuffer;
let testMesh;

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, shaderData) {
    var str = shaderData.text

    var shader;
    if (shaderData.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderData.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, fragmentShaderText);
    var vertexShader = getShader(gl, vertexShaderText);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "texCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "normal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    setUniformLocations();
    setLightLocations();
}

function setUniformLocations() {
    shaderProgram.transform = gl.getUniformLocation(shaderProgram, "transform");
    shaderProgram.transformProjected = gl.getUniformLocation(shaderProgram, "transformProjected");
    
    shaderProgram.Sampler = gl.getUniformLocation(shaderProgram, "Sampler");
    shaderProgram.baseColor = gl.getUniformLocation(shaderProgram, "baseColor");
    shaderProgram.eyePos = gl.getUniformLocation(shaderProgram, "eyePos");
    shaderProgram.ambientLight = gl.getUniformLocation(shaderProgram, "ambientLight");

    shaderProgram.specularIntensity = gl.getUniformLocation(shaderProgram, "specularIntensity");
    shaderProgram.specularPower = gl.getUniformLocation(shaderProgram, "specularPower");
}

function setLightLocations() {
    shaderProgram.directionalLightColor = gl.getUniformLocation(shaderProgram, "directionalLight.base.color");
    shaderProgram.directionalLightIntensity = gl.getUniformLocation(shaderProgram, "directionalLight.base.intensity");
    shaderProgram.directionalLightDirection = gl.getUniformLocation(shaderProgram, "directionalLight.direction");

    shaderProgram.pointLights = [];
    for(let i = 0; i < 4; i++) {
        shaderProgram.pointLights[i] = {};
        shaderProgram.pointLights[i].color = gl.getUniformLocation(shaderProgram, "pointLight" + [i] + ".base.color");
        shaderProgram.pointLights[i].intensity = gl.getUniformLocation(shaderProgram, "pointLight" + [i] + ".base.intensity");
        shaderProgram.pointLights[i].constant = gl.getUniformLocation(shaderProgram, "pointLight" + [i] + ".atten.constant");
        shaderProgram.pointLights[i].linear = gl.getUniformLocation(shaderProgram, "pointLight" + [i] + ".atten.linear");
        shaderProgram.pointLights[i].exponent = gl.getUniformLocation(shaderProgram, "pointLight" + [i] + ".atten.exponent");
        shaderProgram.pointLights[i].position = gl.getUniformLocation(shaderProgram, "pointLight" + [i] + ".position");
        shaderProgram.pointLights[i].range = gl.getUniformLocation(shaderProgram, "pointLight" + [i] + ".range");
    }

    shaderProgram.spotLights = [];
    for(let i = 1; i < 5; i++) {
        shaderProgram.spotLights[i] = {};
        shaderProgram.spotLights[i].color = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".pointLight.base.color");
        shaderProgram.spotLights[i].intensity = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".pointLight.base.intensity");
        shaderProgram.spotLights[i].constant = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".pointLight.atten.constant");
        shaderProgram.spotLights[i].linear = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".pointLight.atten.linear");
        shaderProgram.spotLights[i].exponent = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".pointLight.atten.exponent");
        shaderProgram.spotLights[i].position = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".pointLight.position");
        shaderProgram.spotLights[i].range = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".pointLight.range");
        shaderProgram.spotLights[i].direction = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".direction");
        shaderProgram.spotLights[i].cutoff = gl.getUniformLocation(shaderProgram, "spotLight" + [i] + ".cutoff");
    }
}

var transform = mat4.create();
var transformProjected = mat4.create();

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function loadWorld(model, tex) {
    testMesh = new Mesh(model, tex, [0, 0, 0], gl);
}

let lastTime = 0;
let xPos = 0;
let yPos = 3;
let zPos = 6;
let yaw = 0;
let yawRate = 0.02;
let pitch = -20;
let pitchRate = 0.02;
let period = 10000;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        xPos = 6*Math.sin(2*Math.PI*timeNow/period);
        zPos = 6*Math.cos(2*Math.PI*timeNow/period);
        yaw = 360*timeNow/period;
    }
    lastTime = timeNow;
}

export default class GLinit {

    ambientLight;
    gloss;
    pointLights;

    
    constructor (canvas, model, tex) {
        this.setDefaultLights()
        initGL(canvas);
        initShaders();
        loadWorld(model, tex);
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        this.tick();
    }

    setDefaultLights() {
        this.ambientLight = {};
        this.ambientLight.r = 0.1;
        this.ambientLight.g = 0.1;
        this.ambientLight.b = 0.1;

        this.gloss = 256;

        this.pointLights = [];
        for (let i = 0; i < 4; i++) {
            this.pointLights[i] = {};
            this.pointLights[i].r = 1;
            this.pointLights[i].g = 1;
            this.pointLights[i].b = 1;
            this.pointLights[i].intensity = 10;
            this.pointLights[i].x = Math.pow(-1, i) * 2;
            this.pointLights[i].y = 3;
            this.pointLights[i].z = -2 + 4 * (i < 2);
        }

        
    }

    tick() {
        let self = this;
        requestAnimationFrame(() => {self.tick()});
        self.renderAll();
        animate();
    }

    renderAll() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        mat4.identity(transformProjected);
        mat4.perspective(transformProjected, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    
        mat4.identity(transform);
    
        mat4.rotate(transformProjected, transformProjected, degToRad(-pitch), [1, 0, 0]);
        mat4.rotate(transformProjected, transformProjected, degToRad(-yaw), [0, 1, 0]);
        mat4.translate(transformProjected, transformProjected, [-xPos, -yPos, -zPos]);
        
        this.setUniforms();
        testMesh.render(shaderProgram);
    }

    setUniforms() {
        gl.uniformMatrix4fv(shaderProgram.transformProjected, false, transformProjected);
        gl.uniformMatrix4fv(shaderProgram.transform, false, transform);
    
    
        gl.uniform3fv(shaderProgram.baseColor, [1, 1, 1]);
        gl.uniform3fv(shaderProgram.eyePos, [xPos, yPos, zPos]);
        gl.uniform3fv(shaderProgram.ambientLight, [this.ambientLight.r, this.ambientLight.g, this.ambientLight.b]);
    
        gl.uniform1f(shaderProgram.specularIntensity, this.gloss);
        gl.uniform1f(shaderProgram.specularPower, 128);
    
        for (let i = 0; i < 4; i++) {
            gl.uniform3fv(shaderProgram.pointLights[i].color, [this.pointLights[i].r, this.pointLights[i].g, this.pointLights[i].b]);
            gl.uniform1f(shaderProgram.pointLights[i].intensity, this.pointLights[i].intensity);
            gl.uniform1f(shaderProgram.pointLights[i].constant, 0);
            gl.uniform1f(shaderProgram.pointLights[i].linear, 0);
            gl.uniform1f(shaderProgram.pointLights[i].exponent, 1);
            gl.uniform3fv(shaderProgram.pointLights[i].position, [this.pointLights[i].x, this.pointLights[i].y, this.pointLights[i].z]);
            gl.uniform1f(shaderProgram.pointLights[i].range, 100);
        }    
    }
} 
