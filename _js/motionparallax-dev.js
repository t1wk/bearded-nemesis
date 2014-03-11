/*! Parallax functions
==============================================================
@name motionparallax.js
@author Christophe Zlobinski-Furmaniak (christophe.zf@gmail.com or @t1wk)
@version 1.0
@date 02/06/2014
@category Animation scripts
@license No open-source for the time being.

@based-on: Be Moved by Sony (http://discover.store.sony.com/be-moved/)
@based-url: https://github.com/ballistiq/parallax-demo
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

function rotationMatrix() {
	// http://en.wikipedia.org/wiki/Rotation_matrix
	// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function
	
	// Matrix3d for rotationY(2deg) is rendering the following
	// matrix3d(0.939693, 0, -0.34202, 0, 0, 1, 0, 0, 0.34202, 0, 0.939693, 0, 0, 0, 0, 1)
	// matrix3d = (Math.cos(rotateY * deg2rad), 0, Math.sin(-rotateY * deg2rad), 0, 0, 1, 0, 0, Math.sin(rotateY * deg2rad), 0, Math.cos(rotateY * deg2rad), 0, 0, 0, 0, 1);
	
	var yDegree = 2;
	var deg2rad = Math.PI/180; // Convert degrees to radians
		
		// for Ydegree = 2,
		var y1 = Math.cos(yDegree * deg2rad); 	// y1 = 0.9993908270190958
		var y2 = Math.sin(-yDegree * deg2rad); 	// y2 = -0.03489949670250097
		var y3 = Math.sin(yDegree * deg2rad); 	// y3 = 0.03489949670250097
		var y4 = Math.cos(yDegree * deg2rad); 	// y4 = 0.9993908270190958
		
		// for Ydegree = 0,
		var ytest1 = Math.cos(0 * deg2rad); 	// y1 = 0
		var ytest2 = Math.sin(-0 * deg2rad); 	// y2 = 1
		var ytest3 = Math.sin(0 * deg2rad); 	// y3 = 0
		var ytest4 = Math.cos(0 * deg2rad); 	// y4 = 1
		
		// for Ydegree = -2,
		var ytt1 = Math.cos(-2 * deg2rad); 		// y1 = 0.9993908270190958
		var ytt2 = Math.sin(2 * deg2rad); 		// y2 = 0.03489949670250097
		var ytt3 = Math.sin(-2 * deg2rad); 		// y3 = -0.03489949670250097
		var ytt4 = Math.cos(-2 * deg2rad); 		// y4 = 0.9993908270190958

	
	//var el = document.getElementById("parallax_first");	
}

//=============================================================//
// Define Path for images
//=============================================================//
	var rootPath, sequencePath, imgPrefix;

	// Define root
	if (document.location.hostname === "localhost") {
	  rootPath = "/motion";
	} else {
	  rootPath = "";
	}

	// Define sequence path
	sequencePath = "/_images/1280/";

	// Define prefix of image sequence
	imgPrefix = "motion";
	
function motionParallax(){
	
	
	
	// Create variables
	var motion = $('canvas');
	var articles = $("article");
	var total_slides = motion.length;
	var currentFrame = 1;
	var canvas = [], context = [], arr = [], seq = [], seqBeg = [], seqEnd = [], img = [];
	
	// Create arrays with IDs and number of images of each canvas
	motion.each(function(){
		arr.push($(this).attr('id'));
		seqBeg.push($(this).data('sequence-beg'));
		seqEnd.push($(this).data('sequence-end'));
	});
	
	//=============================================================//
	//	Px Loader
	//=============================================================//
	
	// Delay each image to prevent caching 
	var $progress = $('#progress').text('0 / 100'), 
    loader = new PxLoader();
	
	// Count how many images has to be preloaded
	totalFramestoLoad = 0;
	for(i = 1, len=motion.length; i < len; i++) {
		totalFramestoLoad+= seqEnd[i]-seqBeg[i];
		totalFramestoLoad = totalFramestoLoad+1;
	};
	
	// create a PxLoaderImage
	for(var i=0; i < totalFramestoLoad; i++) { 
		num = ("0000" + i).slice(-4);
		var pxImage = new PxLoaderImage("" + rootPath + sequencePath + imgPrefix + num + ".jpg"); 
		pxImage.imageNumber = i + 1;
		loader.add(pxImage);
	}			
	
	// Callback that runs every time an image loads 
	loader.addProgressListener(function(e) { 
		 
		// log which image completed 
		//console.log('Image ' + e.resource.imageNumber + ' Loaded\r');
		
		// the event provides stats on the number of completed items 
		$progress.text(Math.round((e.completedCount / totalFramestoLoad) * 100) + ' / ' + ((e.totalCount / totalFramestoLoad) * 100));
		
		// Hide the loader
		if(e.completedCount === e.totalCount) {
			//console.log("Completed");
			$("#progress").addClass('none');
		}
	});

	loader.start();
	
	//=============================================================//
	// Parallax Canvas
	//=============================================================//
	for(i = 0, len=arr.length; i < len; i++) {
	
		// Define Canvas
		canvas.push(document.getElementById(arr[i]));
		context.push(canvas[i].getContext('2d'));
				
		// Preload images
		loadImageSequence = function() {
			var file, fileSeq, a, img, num, numSeq, sequence, _a, 
			h, videoAspectRatio, videoHeight, videoWidth, w, windowAspectRatio, windowHeight, windowWidth, x;
			img = [];
			seq[i] = []; 
			file = [];
			fileSeq = [];

			// Define Window Ratio
			windowWidth = $(window).width();
			windowHeight = $(window).height();
			windowAspectRatio = windowWidth / windowHeight;

			// Define Video Ratio
			videoWidth = 1280; // Please define width
			videoHeight = 720; // and height
			videoAspectRatio = videoWidth / videoHeight;

			// Render properly if ratio is different than expected
			if (windowAspectRatio > videoAspectRatio) {
				w = windowWidth;
				h = windowWidth / videoAspectRatio;
			} else {
				w = videoAspectRatio * windowHeight;
				h = windowHeight;
			}
			x = -(w - windowWidth) / 2;
			
			numFirst = ("0000" + seqBeg[i]).slice(-4);
			var fileFirst = "" + rootPath + sequencePath + imgPrefix + numFirst + ".jpg";
			
			// Draw Image
			for (a = _a = seqBeg[i]; seqBeg[i] <= seqEnd[i] ? _a <= seqEnd[i] : _a >= seqEnd[i]; 
			a = seqBeg[i] <= seqEnd[i] ? ++_a : --_a) {

				img = new Image();
				img.frame = ("0000" + seqBeg[i]).slice(-4);
				num = ("0000" + a).slice(-4);
				file = "" + rootPath + sequencePath + imgPrefix + num + ".jpg";				
				//seq[i].push("" + rootPath + sequencePath + imgPrefix + num + ".jpg");
				
				// Assign onload handler to each image in array
				img.onload = (function(value){
				   return function(){
						context[value].drawImage(img, x, 0, w, h); // Render current image
						img.src = fileFirst; // Will the first frame
				   }
				})(i);

				// IMPORTANT - Assign src last for IE
				img.src = file; // Will load every files
			}
		
			// Render Current Frame
			renderCurrentFrame = function() {			
				
				// Is the canvas visible ?
				for(i = 0, len=articles.length; i < len; i++) {
					
					var offset, currentFrame, numCurrentFrame, fileCurrentFrame, velocity;
					offset = $(window).scrollTop();
					article = $(articles[i]);
										
					// To test if the article is seen into the viewport
					/* if(article.isOnScreen()){
						console.log("ok " + i);
					} else {
						console.log("nok " + i);
					}; */
					
					// Count how many images to load
					var totalFrames = 0;
					totalFrames+= seqEnd[i]-seqBeg[i];
					totalFrames = totalFrames+1;
														
					// Define parallax velocity for all
					// Velocity is smoothed if you don't have the same amount of frames by sequence 
					velocity = Math.round(((offset * 3) / totalFrames)); 

					
					// Define if the number is an even or not
					function isEven(num) {
					  return isNaN(num) && num !== false && num !== true ? false : num % 2 == 0;
					}
								 
					
					
					
					// Article is into the ViewPort?
					// Great, render the sequence
					if(article.isOnScreen()){
						
						// Play with the rotation of the canvas
						rotationMatrix();
						var el = $(canvas[i]);
						elDOM = el[0]; // returns a HTML DOM Object instead of a jQuery object
						
						//console.log(el, el2, article);
						
						var st = window.getComputedStyle(el2, null);
						var tr = st.getPropertyValue("-webkit-transform") ||
							 st.getPropertyValue("-moz-transform") ||
							 st.getPropertyValue("-ms-transform") ||
							 st.getPropertyValue("-o-transform") ||
							 st.getPropertyValue("transform") ||
							 "FAIL";

						
						// Retrieve Matrix for rotateY
						var values = tr.split('(')[1].split(')')[0].split(',');
						var y1 = values[0];
						var y2 = values[1];
						var y3 = values[8];
						var y4 = values[10];
						
						console.log(a, b, c, d);
						
						animation = (offset / 500) >= 0 ? (offset / 500) : (offset / 500);
						leftPos = animation * 5;
						size = offset * .5;
						yPos = 11;
						yPosEven = 20;
						
						if(isEven(i) === true) {
							
							article.css({
								//'top': + size
								//'height' : 80 + '%' <= 120 + '%' ? 80 + size + '%' : 120 + '%',
								//'width' : 120 + '%' <= 150 + '%' ? 120 + size + '%' : 150 + '%'
							});
							
							// matrix3d(0.939693, 0, -0.34202, 0, 0, 1, 0, 0, 0.34202, 0, 0.939693, 0, 0, 0, 0, 1)
							el.css({
								//'transform': 'rotateY(' + (yDegree >= 0) + 'deg)' ? 'rotateY(' + (yDegree - animation) + 'deg)' : 'rotateY(0deg)',
								'transform': (y4 <= 0) ? 'matrix3d('+ y1 + ', 0, ' + y2 + ', 0, 0, 1, 0, 0,' + y3 + ', 0, ' + y4 + '0, 0, 0, 0, 1)'	: 'rotateY(0deg)',
								'left' : yPos + '%' >= -yPos + '%' ? (yPos - leftPos) + '%' : -yPos + '%'
							});
						} else {
							/* el.css({
								'transform': 'rotateY(' + (-yDegree <= 0) + 'deg)' ? 'rotateY(' + (-yDegree + animation) + 'deg)' : 'rotateY(' + 0 + 'deg)',
								'left' : -yPosEven + '%' <= yPosEven + '%' ? (-yPosEven + leftPos) + '%' : yPosEven + '%'
							}); */
						}
						
						render = (function(value){
							return function(){
							
								// Increase currentFrame but stop if you reach the end of the sequence
								currentFrame = (seqBeg[i] + velocity) >= seqEnd[i] ? seqEnd[i] : (seqBeg[i] + velocity);
								
								// Make the CurrentFrame became a file src
								numCurrentFrame = ("0000" + currentFrame).slice(-4);
								fileCurrentFrame= "" + rootPath + sequencePath + imgPrefix + numCurrentFrame + ".jpg"
								
								image = new Image();
								image.src = fileCurrentFrame;
								
								// And draw it into the right canvas
								return context[value].drawImage(image, x, 0, w, h);
							}
						})(i);
					
						render();
					}
				};
			};
		};
		
		// Render images after being loaded
		loadImageSequence();
	}
	
	// Scroll Events
	//=============================================================//
	$(window).scroll(function() {
		window.requestAnimationFrame(renderCurrentFrame); // Prevent jittering
		renderCurrentFrame();
	});

	//return $(window).on('touchmove', renderCurrentFrame[i]);
		
	
	// Resize Functions
	//=============================================================//	
		// Define Canvas Resize Function
		resizeCanvas = function(){
		  var windowHeight, windowWidth;
		  windowWidth = $(window).width();
		  windowHeight = $(window).height();
		  $.each( canvas, function(){
			return $(this).attr('width', windowWidth).attr('height', windowHeight);
		  });
		};

		resizeCanvas();
		//$(window).resize(resizeCanvas);
		
}

$(function() {
	motionParallax();
});

