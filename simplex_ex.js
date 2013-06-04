
// heap for asm.js
var f = [0, 0, 0, 0.5, 0, -0.5];
var C = [[3,0,0,0,0,-1],
	 [3,0,0,-0.5,0,-0.5],
	 [0,0,0,0,0,0],
	 [2,0,0,0,0,-1],
	 [0,0,0,0,0,0]
	];
var heap = SimplexModule.setup(f,C);
var s = SimplexModule(window, {}, heap);

if(s.solve()) { 
    SimplexModule.print(heap);
}
