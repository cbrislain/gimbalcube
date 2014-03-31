// cube.js
// 2014 - Cooper Brislain
// this is by no means polished or complete

var deg_to_rad = Math.PI/180;
var rad_to_deg = 180/Math.PI;

var CSS3 = {
	supported: false,
	prefix: ""
};

var oTrans;

// generate a matrix object from the transform value of an object
// returns identity matrix if no transforms are present
// current issues: have not implemented translation of 2D transforms to 3D
//    identity matrix is returned instead

jQuery.fn.getTransMatrix = function() {
	trans = this.css(CSS3.prefix+'transform');
	if(trans == 'none') return Matrix.I(4);
	vals = trans.match(/[^\()]+/g);
	vals_array = vals[1].split(",");
	if(vals_array.length < 16) return Matrix.I(4);
	vals_array = vals_array.map(function(str){
		return parseFloat(str);	
	});
	var M = Matrix.create([
		vals_array.slice(0,4),
		vals_array.slice(4,8),
		vals_array.slice(8,12),
		vals_array.slice(12,16)
	]);
	return M;
};

// generate the string for the css-transform value

Matrix.prototype.cssTransformString = function(){
	return 'matrix3d('+this.elements.join()+')';
};

// rotation matrix to transformation matrix

Matrix.prototype.r2t = function(){ 
	M = this;
	M.setElements([
		[M.e(1,1),M.e(1,2),M.e(1,3),0],
		[M.e(2,1),M.e(2,2),M.e(2,3),0],
		[M.e(3,1),M.e(3,2),M.e(3,3),0],
		[0,0,0,1]
	]);
	return M;
}

// creates a translation matrix to rotate deg degrees around a cardinal axis

function tM(deg, axis){
	switch(axis){
		case 'x':
			return Matrix.RotationX(deg*deg_to_rad).r2t();
			break;
		case 'y':
			return Matrix.RotationY(deg*deg_to_rad).r2t();
			break;
		case 'z':
			return Matrix.RotationZ(deg*deg_to_rad).r2t();
			break;
	}
}

jQuery(document).ready(function(){	
	jQuery(document).data('xoffset',0);
	jQuery(document).data('yoffset',0);
	
	jQuery(document).on('touchstart mousedown',function(e){
		if(e.type == 'touchstart'){
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			jQuery(this).data('xoffset', touch.pageX);
			jQuery(this).data('yoffset', touch.pageY);
		}
		if(e.type == 'mousedown'){
			jQuery(this).data('xoffset', e.pageX);
			jQuery(this).data('yoffset', e.pageY);
		}
		oTrans = jQuery('#rotator').getTransMatrix();
		jQuery('#rotator').css(CSS3.prefix+'transition', 'all 0.01s linear');
		jQuery(this).data('mouseIsDown',true);
	});
	
	jQuery(document).on('mouseup touchend',function(e){
		jQuery('#rotator').css(CSS3.prefix+'transition', 'all 0.25s ease');
		oTrans = jQuery('#rotator').getTransMatrix();
		// tween to snap
		jQuery(this).data('mouseIsDown',false);	
	
	});
	
	jQuery(document).on('touchmove mousemove',function(e){
		if(jQuery(this).data('mouseIsDown')){
			e.preventDefault();
			if(e.type == 'touchmove'){
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				var x = touch.pageX - jQuery(this).data('xoffset');
				var y = touch.pageY - jQuery(this).data('yoffset');
			}
			if(e.type == 'mousemove'){
				var x = e.pageX - jQuery(this).data('xoffset');
				var y = e.pageY - jQuery(this).data('yoffset');
			}
			jQuery('#rotator').css(CSS3.prefix+'transform',oTrans.multiply(tM(-1*x,'y')).multiply(tM(y,'x')).cssTransformString());
		}
	});
	
	jQuery(".cubeface").on('click',function(){
		jQuery(this).addClass('easing');
		if(jQuery(this).is('.open')){
			jQuery(this).removeClass('open');
		} else {
			jQuery(this).addClass('open');
		}
		//jQuery(this).removeClass('easing');
	});
	
	jQuery('#back').unbind('click');
	
	jQuery('#back').on('click',function(){
		jQuery(this).addClass('easing');
		if(jQuery(this).is('.open')){
			jQuery('#rotator').css(CSS3.prefix+'transform','none');
			jQuery('.cubeface').removeClass('open');
		} else {
			jQuery(this).addClass('open');
		}
		//jQuery(this).removeClass('easing');
	});
	
	jQuery('#top').unbind('click');
	
	// wtf this is not properly setting the correct transform
	
	/*  jQuery('#top').on('click',function(){
		if(jQuery(this).parent().is('#cube')){	
			M = jQuery(this).getTransMatrix();
			M = M.multiply(jQuery('#rotator').getTransMatrix());
			jQuery(this).appendTo('#container');
			jQuery(this).css(CSS3.prefix+'transition', 'all 0.01s linear');
			// wtf here
			console.log(M.cssTransformString());
			jQuery(this).css(CSS3.prefix+'transform',M.cssTransformString());			
		}
	}); */ 
	// initialize
	
    if (typeof(document.body.style.borderRadius) != 'undefined') {
        CSS3.supported = true;
        CSS3.prefix = "";
    } else if (typeof(document.body.style.MozBorderRadius) != 'undefined') {
        CSS3.supported = true;
        CSS3.prefix = "-moz-";
    } else if (typeof(document.body.style.webkitBorderRadius) != 'undefined') {
        CSS3.supported = true;
        CSS3.prefix = "-webkit-";
    }
    if (CSS3.supported)
    	console.log('Using prefix for CSS3: '+CSS3.prefix);
    else 
        jQuery('body').html('<h1>Sorry, you must use a browser that supports CSS3</h1>');
});

