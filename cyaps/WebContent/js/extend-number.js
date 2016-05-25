//in order to solve the js float calculate bug
//http://www.codeweblog.com/javascript-to-avoid-the-floating-point-bug-ways-reprint-provenance-unknown/
//Give Number type add to add a way to call up more convenient. 
Number.prototype.add = function(arg) {
	return accAdd (this,arg);
}

Number.prototype.sub = function(arg) {
	return accSub (this,arg);
}

// Number type give way to add a div, call up more convenient.
Number.prototype.div = function (arg) {
	return accDiv (this, arg);
} 

// Give Number type mul add a method call is more convenient.
Number.prototype.mul = function (arg) {
	return accMul (this,arg);
}

Number.prototype.toSigFigs = function (arg) {
	return getSignificantNum(this,arg);
}

Number.prototype.isSigFigs = function (arg) {
	return isSignificantNum(this,arg);
}
/* 
 * Adder functions, to be precise adder results
 * Note: javascript error will be the result of the addition,
 * at a time when the sum of two floating-point numbers will be more obvious. 
 * This function return more precise results adder.
 * Call: accAdd (arg1, arg2)
 * Return value: arg1 coupled with the accurate results arg2
*/ 
 
function accAdd (arg1, arg2) {
	var r1, r2, m;
	try {r1 = arg1.toString().split(".")[1].length;} catch (e) {r1 = 0;}
	try {r2 = arg2.toString().split(".")[1].length;} catch (e) {r2 = 0;}
	m = Math.pow(10,Math.max(r1,r2));
	return (arg1 * m + arg2 * m) / m;
}

function accSub(arg1,arg2) {
	return accAdd(arg1,-arg2);
}

// Division function, to be precise division results
/* 
 * Note: javascript error will be the result of the division, 
 * two floating-point division at a time when it would be more obvious. 
 * This function return the results of a more precise division.
*/
// Call: accDiv (arg1, arg2)
// Return value: arg1 divided by arg2 precise results
function accDiv (arg1, arg2) {
	var t1 = 0, t2 = 0, r1, r2;
	try {t1 = arg1.toString().split(".")[1].length;} catch (e) {}
	try {t2 = arg2.toString().split(".")[1].length;} catch (e) {}
	with (Math) {
		r1 = Number(arg1.toString().replace(".",""));
		r2 = Number(arg2.toString().replace(".",""));
		return (r1/r2)* Math.pow(10,t2-t1);
	}
}

/* 
 * Multiplication function, to be precise multiplication results
 * Note: javascript error multiplication results will be, 
 * at a time when two floating point multiply more obvious. 
 * This function return the results of more precise multiplication.
 * Call: accMul (arg1, arg2)
 * Return value: arg1 multiplied by arg2 precise results
*/ 
function accMul (arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {m = m+s1.split(".")[1].length;} catch (e) {}
	try {m = m+s2.split(".")[1].length;} catch (e) {}
	return Number(s1.replace (".",""))* Number(s2.replace (".",""))/Math.pow (10,m);
}

//function getSignificantNum(),convert the number to significant figures
/*
*function getSignificantNum(num,sigLen) {
*	var s1 = num.toString();
*	var intLen = sigLen - Math.floor(Math.log(num)/Math.LN10)-1;
*	var mult = Math.pow(10,intLen);
*	return Math.ceil(num.mul(mult))/mult;
*}
*/

function isSignificantNum(num,sigLen) {
	var tmpNum=num;
	if(num==getSignificantNum(tmpNum,sigLen)) return true;
	else return false;
}

function getSignificantNum(num,n){  
	var intLen;
	var strNum = num+"";  
	n=n/1;  
	
	if(num<1) {
		intLen = 0;
	}else{
		if(strNum.indexOf(".")>-1){
			intLen=strNum.substring(0,strNum.indexOf(".")).length;
		}else{
			intLen = strNum.length;
		}		
	}
	
	if(intLen>n) {
		var factor = Math.pow(10,intLen-n);
		var newNum = Math.ceil(num.div(factor));
		return newNum*factor;		
	}else{
		var factor = Math.pow(10,n-intLen);
		var newNum = Math.ceil(num.mul(factor));
		return newNum/factor;
	}
}	
