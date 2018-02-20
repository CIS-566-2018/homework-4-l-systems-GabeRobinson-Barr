import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Expander from './Expander';
import Parser from './Parser';
import Tree from './geometry/Tree';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 6,
  'Add Tree': loadScene, // A function pointer, essentially
  'Reset Scene': resetScene,
  iterations: 15,
  'Weeping Willow Mode': false,
  color: [255, 0, 0],
  currentshader: 'lambert',
  chaoslevel: 0, // This makes the noisyplanet more chaotic by decreasing noise tilesize
  enableTime: true,
  speed: 5,
  hillHeight: 1,
  bubbleHeight: 1,
  rippleHeight: 1,
  rippleFrequency: 1,
  swapcolors: true,
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;
//
let expander: Expander = new Expander(['R']);
let parser: Parser = new Parser();
let tree: Tree;

function loadScene() {
  // icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  // icosphere.create();
  // square = new Square(vec3.fromValues(0, 0, 0));
  // square.create();
  // cube = new Cube(vec3.fromValues(2, 0, 0));
  // cube.create();
  let willowmode = 0;
  if (controls['Weeping Willow Mode']) {
    willowmode = 20;
  }
  expander.expandSeed(controls.iterations + willowmode);
  parser.parse(expander.tree);

  tree = new Tree();
  tree.createTree(parser.positions, parser.normals);

}

function resetScene() {
  parser = new Parser();
  loadScene();
}

function main() {
  const startTime = new Date().getTime();

  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  
  gui.add(controls, 'Add Tree');
  gui.add(controls, 'Reset Scene');
  gui.add(controls, 'iterations', 1, 30).step(1);
  //gui.add(controls, "Weeping Willow Mode");
  

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 20), vec3.fromValues(0, 10, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const custom = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/custom-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/custom-frag.glsl')),
  ]);

  const noisyplanet = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/noisyplanet-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/noisyplanet-frag.glsl')),
  ]);


 

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    
    let prog: ShaderProgram;
    if(controls.currentshader == 'custom') {
      prog = custom;
    }
    else if(controls.currentshader == 'noisyplanet'){
      prog = noisyplanet;
    }
    else {
      prog = lambert;
    }

    let currTime = 0;
    if (controls.enableTime) {
      currTime = (new Date().getTime() - startTime) * controls.speed / 5;
    }

    renderer.render(camera, prog, [
      //icosphere,
      //square,
      //cube,
      tree,
    ], controls.color, currTime, (10 - controls.chaoslevel) / 10,
    vec4.fromValues(controls.hillHeight, controls.bubbleHeight, controls.rippleHeight, controls.rippleFrequency),
    controls.swapcolors);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
