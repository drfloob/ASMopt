// rows & variables are ZERO-INDEXED

function SimplexModule(stdlib, foreign, heap) {
    "use asm";

    var sqrt = stdlib.Math.sqrt;
    var imul = stdlib.Math.imul;
    var HEAP32F = new stdlib.Float32Array(heap);
    var HEAP32I = new stdlib.Int32Array(heap);
    var varcnt= 0, rowcnt= 0, rowlen= 0;

    // console.log(HEAP32F);
    function getf(i) {
	i= i|0;
	return +HEAP32F[2+i << 2 >> 2];
    }

    function getfb() {
	return +HEAP32F[1];
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





    function setf(i, val) {
	i= i|0; val= +val;
	HEAP32F[2+i << 2 >> 2] = +val;
	return 0|0;
    }

    function setfb(val) {
	val= +val;
	HEAP32F[1 << 2 >> 2] = +val;
	return 0|0;
    }

    function setc(i, rowlen, val) {
	i= i|0; rowlen= rowlen|0; val= +val;
	// console.log('setc setting', 2+rowlen+i, 'to', val);
	HEAP32F[2+rowlen+i << 2 >> 2] = +val;
	return 0|0;
    }

    function setrc(r, i, rowlen, val) {
	r= r|0; 
	i= i|0; 
	rowlen= rowlen|0;
	val= +val;
	return setc(imul(r, rowlen) + i|0, rowlen, val)|0;
    }

    function setrb(r, rowlen, val) {
	r= r|0; rowlen= rowlen|0; val= +val;
	return setc(imul(r, rowlen)-1|0, rowlen, val)|0;
    }


    /**
     * Solves a simplex optimization problem presented in basic feasible solved form. 
     * Returns 1 if successful, 0 otherwise.
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
	var i= 0, j=0, k=0, l=0;
	var exitVal= 999999999.0, exitIdx= 0, aij= 0.0, bi= 0.0, tmp= 0.0;
	var enterIdx=0;
	var multiplier= 0.0;

	varcnt= (HEAP32I[0])|0;
	rowcnt= (varcnt)|0;
	rowlen= (varcnt+1)|0;

	for(; (i|0) < (varcnt|0); i=(i+1)|0) {
	    if (+getf(i|0) < +0)
		break;
	}
	if ((i|0) == (varcnt|0)) {
	    store_solution();
	    return 1;
	}
	enterIdx=i;
	// console.log("entry variable", enterIdx);

	for(; (j|0) < (rowcnt|0); j=(j+1)|0) {
	    aij = +getrc(j, i, rowlen);
	    // console.log(j, i, aij);
	    if (aij < +0)
		break;
	}
	if ((j|0) == (rowcnt|0))
	    return 0;


	for(j=0; (j|0) < (rowcnt|0); j=(j+1)|0) {
	    // aij = +getf(imul(j+1, rowlen) + i + 1|0);
	    aij = +getrc(j, enterIdx, rowlen);
	    // console.log("j (row)", j, "aij", aij);
	    if (+aij < +0) {
		bi = +getrb(j, rowlen);
		// console.log(j, " bi: ", bi);
		tmp = +((-1.0 * +bi) / +aij);
		// console.log("aij < 0 at", j, "aij: ", aij, "-b/aij: ", tmp);
		if (+tmp < +exitVal) {
		    exitVal= +tmp;
		    exitIdx= j|0;
		}
	    }
	}
	// console.log("exit variable", exitIdx);


	// assign the entering constraint
	aij = +getrc(exitIdx, enterIdx, rowlen);
	setrb(enterIdx, rowlen, exitVal);
	for(k=0; (k|0) < (varcnt|0); k=(k+1)|0) {
	    // console.log('k', k);
	    if ((k|0) == (enterIdx|0)) {
		setrc(enterIdx, k, rowlen, 0.0);
		setrc(exitIdx, k, rowlen, 0.0);
		continue;
	    }
	    tmp= +(-1.0 * getrc(exitIdx, k, rowlen));
	    if ((k|0) == (exitIdx|0))
		tmp = +(tmp + 1.0);
	    // console.log('-bi', tmp, 'aij', aij);
	    setrc(enterIdx, k, rowlen, tmp/aij);
	    setrc(exitIdx, k, rowlen, 0.0);
	}

	// console.log('self test', getrc(enterIdx, enterIdx, rowlen));
	// console.log('exit test', getrc(enterIdx, exitIdx, rowlen));



	// fix f with new constraint
	multiplier= +getf(enterIdx);
	// console.log('multiplier', multiplier);
	setf(enterIdx, 0.0);

	setfb(+getfb() + multiplier * getrb(enterIdx, rowlen));
	// console.log('fb', getfb());

	for(k=0; (k|0) < (varcnt|0); k=(k+1)|0) {
	    // console.log('k', k, 'getf(k)', getf(k), 'getrc(enterIdx, k, rowlen)', getrc(enterIdx, k, rowlen));
	    setf(k, +getf(k) + multiplier * getrc(enterIdx, k, rowlen));
	    // console.log('new f for k: ', k, getf(k));
	}

	// fix all other constraints with new constraint
	for(k=0; (k|0) < (rowcnt|0); k=(k+1)|0) {
	    if ((k|0) == (enterIdx|0))
		continue;
	    
	    multiplier= +getrc(k, enterIdx, rowlen);
	    // console.log('k', k, 'multiplier', multiplier);
	    if (+multiplier == 0.0)
		continue;
	    setrc(k, enterIdx, rowlen, 0.0);

	    // console.log('setrb setting k', k
	    // 		, 'current val', getrb(k, rowlen)
	    // 		, 'adding', multiplier * getrb(enterIdx, rowlen)
	    // 	       );
	    setrb(k, rowlen, +getrb(k, rowlen) + multiplier * getrb(enterIdx, rowlen));
	    for(l=0; (l|0) < (varcnt|0); l=(l+1)|0) {
		// console.log('setting k l', k, l
		// 	    , 'current val', getrc(k, l, rowlen)
		// 	    , 'adding', multiplier * getrc(enterIdx, l, rowlen)
		// 	   );
		setrc(k, l, rowlen, +getrc(k, l, rowlen) + multiplier * getrc(enterIdx, l, rowlen));
	    }
	}

	// console.log('pivoted', HEAP32F);

	return simplex_opt()|0; // not done
    };


    function store_solution() {
	var start_idx=0;
	start_idx = stdlib.Math.pow(rowlen, 2);
	// console.log(start_idx, HEAP32F[start_idx], HEAP32F);
	
    };

    function simplex_solve() {};

    return { solve: simplex_opt };
};


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
};
