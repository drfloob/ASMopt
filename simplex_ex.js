/**
 * This example illustrates the simplex problem:
 *
 * Minimize:
 *   0 + 0.5*S1 - 0.5*S3
 * Subject to:
 *   X = 3 - S3
 *   Y = 3 - 0.5*S1 - 0.5*S3
 *   S2 = 2 - S3
 */

// coefficients of the objective function
var f = [0, 0, 0, 0.5, 0, -0.5];

// coefficients of basic constraints
var C = [[3,0,0,0,0,-1],
	 [3,0,0,-0.5,0,-0.5],
	 [0,0,0,0,0,0],
	 [2,0,0,0,0,-1],
	 [0,0,0,0,0,0]
	];

// required for simplex operation
var heap = SimplexModule.setup(f,C);

// instantiate the SimplexModule
var s = SimplexModule(window, {}, heap);

// solve & print
console.log("trying simplex method ...");
if(s.solve()) { 
    // print results to console directly (debugging)
    SimplexModule.print(heap);

    // return results as a primitive array
    var sol = SimplexModule.get_solution(heap);
    console.log("returned solution", sol);
} else {
    console.log("no solution");
}
