// rows & variables are ZERO-INDEXED


function SimplexModule(stdlib, foreign, heap) {
    "use asm";

    var sqrt = stdlib.Math.sqrt;
    var imul = stdlib.Math.imul;
    var HEAP32F = new stdlib.Float32Array(heap);
    var HEAP32I = new stdlib.Int32Array(heap);

    console.log(HEAP32F);
    function getf(i) {
	i= i|0;
	return +HEAP32F[2+i << 2 >> 2];
    }

    function getc(i, rowlen) {
	i= i|0; rowlen= rowlen|0;
	// console.log("getc", 2+rowlen+i);
	return +HEAP32F[2+rowlen+i << 2 >> 2];
    }

    function getrc(r, i, rowlen) {
	r= r|0; 
	i= i|0; 
	rowlen= rowlen|0;
	return +getc(imul(r, rowlen) + i|0, rowlen);
    }

    function getrb(r, rowlen) {
	r= r|0; rowlen= rowlen|0;
	return +getc(imul(r, rowlen)-1|0, rowlen);
    }




    /**
     * Solves a simplex optimization problem presented in basic feasible solved form.
     * 
     * C: ArrayBuffer (Float32), ideally of length ((f.length)^2 - f.length)
     *     represents constant + constraint coefficients for each variable in (your) known order (including slack, if needed)
     *     the first entry for each "row" is treated as a static constant, the rest coefficients
     * f: ArrayBuffer (Float32)
     *     represents the objective function constant + coefficients for each variable in (your) known order (including slack, if needed)
     *     the first is treated as a static constant, the rest coefficients
     * 
     */
    function simplex_opt() {
	var varcnt= 0, rowcnt= 0, rowlen= 0;
	var i= 0, j=0;
	var exitVal= 999999999.0, exitIdx= 0, aij= 0.0, bi= 0.0, tmp= 0.0;

	varcnt= (HEAP32I[0])|0;
	rowcnt= (varcnt)|0;
	rowlen= (varcnt+1)|0;

	for(; (i|0) < (varcnt|0); i=(i+1)|0) {
	    if (+getf(i|0) < +0)
		break;
	}
	if ((i|0) == (varcnt|0))
	    return 0;
	console.log("entry variable", i);

	for(; (j|0) < (rowcnt|0); j=(j+1)|0) {
	    aij = +getrc(j, i, rowlen);
	    // console.log(j, i, aij);
	    if (aij < +0)
		break;
	}
	if ((j|0) == (rowcnt|0))
	    return 1;


	for(j=0; (j|0) < (rowcnt|0); j=(j+1)|0) {
	    // aij = +getf(imul(j+1, rowlen) + i + 1|0);
	    aij = getrc(j, i, rowlen);
	    console.log("j (row)", j, "aij", aij);
	    if (+aij < +0) {
		bi = +getrb(j, rowlen);
		console.log(j, " bi: ", bi);
		tmp = +((-1.0 * +bi) / +aij);
		console.log("aij < 0 at", j, "aij: ", aij, "-b/aij: ", tmp);
		if (+tmp < +exitVal) {
		    exitVal= +tmp;
		    exitIdx= j|0;
		}
	    }
	}
	console.log("exit variable", exitIdx);

	return 2|0; // not done
    };

    function simplex_solve() {};

    return { solve: simplex_opt };
}


SimplexModule.setup = function(f, C) {
    var sizeMult = (f.length)|0;
    var minByteSize = Math.max(4096, Math.pow(f.length, 2) * 32 / 8);
    var mult = Math.ceil(Math.log(minByteSize)/Math.log(2));
    var heap = new ArrayBuffer(Math.pow(2, mult));
    var h = new Float32Array(heap);
    var hi = new Int32Array(heap);
    hi[0] = f.length-1;
    h.set(f, 1);
    for(var i=0; i<C.length; i++)
	h.set(C[i], (f.length)*(i+1) + 1);
    return heap;
}