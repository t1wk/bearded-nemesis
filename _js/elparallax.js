/*! Elements Parallax functions
==============================================================
@name elparallax.js
@author Christophe Zlobinski-Furmaniak (christophe.zf@gmail.com or @t1wk)
@version 1.0
@date 03/09/2014
@category Animation scripts
@license No open-source for the time being.
==============================================================
*/

//=============================================================//
// Useful function to deal with rotation degrees
//=============================================================//
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }

    if(angle < 0) angle +=360;
    return angle;
}

// Is it an even number?
function isEven(num) {
	return isNaN(num) && num !== false && num !== true ? false : num % 2 == 0;
}

function elRotation(){
	yDegree = 2;
	yPos = 11;

	if(isEven(i) === true) {
		el.css({
			'transform': 'rotateY(' + yDegree >= -yDegree + ')' ? 'rotateY(' + (yDegree - animation) + 'deg)' : 'rotateY(' + -yDegree + 'deg)',
			'left' : yPos + '%' >= -yPos + '%' ? (yPos - leftPos) + '%' : -yPos + '%'
		});
	} else {
		el.css({
			'transform': 'rotateY(' + -yDegree <= yDegree + ')' ? 'rotateY(' + (-yDegree + animation) + 'deg)' : 'rotateY(' + yDegree + 'deg)',
			'left' : -yPos + '%' <= yPos + '%' ? (-yPos + leftPos) + '%' : yPos + '%'
		});
	}
}