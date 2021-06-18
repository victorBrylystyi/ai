*** Target library assembled in " ./dist/bundle "

I. How use current library:
    1. Get bundle.js from "./dist/bundle". 
    2. Plug in like "import * as $ from './dist/bundle';".
    2. Get some domElement like 'const someDomElement = document.getElementsByClassName('someDiv')[0];'

II How link resources and change settings
    1. Use 'assets.json' to link assets in current project.
        Fields "type" and "name" for indentify texture and his type. (Dont change this parametrs!)
        Field  '"scale": 1.0' for change dimensions of input image.
    2. Use 'settings.json' to change application settings. 
       To get default settings use: 'const currentDefaultSett = app.defSettings;'. 
    3. Or use your variables with identical structure.('assets.json' for resources and 'settings.json' for settings)

III. Example
    1. ./demo/index.js - example how use current library.
    2. In demo directory run terminal command - "npm install".
    3. npm run start.

IV. Usefull application methods: 
    1. app.resize() - will resize canvas and change camera settings; 
                   (default window have listner "resize" with this method)
    2. app.stopAnimation() / app.startAnimation() - for control application status



// ----- 26 May 2021

1. demo/index.js  - change "const someDomElement =  document.body.querySelector('.someDiv');"
2. demo/index.html - change     <style>
                                    .someDiv{
                                        width: 100vw;
                                        height: 100vh;    
                                    }
                                </style>                                
3. /src/App.js - change:
    38: this.renderer.setSize(this.canvas.width, this.canvas.height); 
    107:  //document.body.appendChild(this.renderer.domElement); // 26 May 2021  ! delete this code 

4. /src/Effect.js - change: 
    52: this.defaultWidth = 1920; -  add default width 
    54: this.resizeScene(); - call initial resize 
    93: addSmokeParticles() - change method 
    144: resizeScene() - add resize scene method
    154: this.resizeScene(); - add resize scene method to reiszeAction method