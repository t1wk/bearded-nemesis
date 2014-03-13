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

//=============================================================//
// Notes for motion images
//=============================================================//

	Sequences need:
	- to be extracted every 5 frames
	- to differ from +/- 20 images
	- to have at least 100 images
	
	Images need:
	- to have the same ratio (1280*800 || 704 * 396 - Sony be Moved standard)
	- to weight tops 50k

//=============================================================//
// Video credits
//=============================================================//
	http://vimeo.com/16310661
	http://vimeo.com/16385618
	http://vimeo.com/16411252
	http://vimeo.com/31476977
	http://vimeo.com/53889629
	http://vimeo.com/78177043
	http://vimeo.com/79388454
	http://vimeo.com/54611029
*/


var deg2rad = Math.PI/180; // Convert degrees to radians	
		

function rotationMatrix() {
	// http://en.wikipedia.org/wiki/Rotation_matrix
	// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function
	
	// Matrix3d for rotationY(2deg) is rendering the following
	// matrix3d(0.939693, 0, -0.34202, 0, 0, 1, 0, 0, 0.34202, 0, 0.939693, 0, 0, 0, 0, 1)
	// matrix3d = (Math.cos(rotateY * deg2rad), 0, Math.sin(-rotateY * deg2rad), 0, 0, 1, 0, 0, Math.sin(rotateY * deg2rad), 0, Math.cos(rotateY * deg2rad), 0, 0, 0, 0, 1);
	
	var yDegree = 2;
		
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
			
			// Define the first image of a sequence
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
						img.src = fileFirst; // Will load the first frame
				   }
				})(i);

				// IMPORTANT - Assign src last for IE
				img.src = file; // Will load every files
			}
		
			// Render Current Frame
			renderCurrentFrame = function() {			
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
						// rotationMatrix();
						
						// Define the element
						var el = $(canvas[i]);
						el2 = el[0]; // returns a HTML DOM Object instead of a jQuery object
						yPos = 11;
						yPosEven = 20;
						yDegree = 2;
						
						
						// Retrieve Matrix for rotateY
						var st = window.getComputedStyle(el2, null);
						var tr = st.getPropertyValue("-webkit-transform") ||
							 st.getPropertyValue("-moz-transform") ||
							 st.getPropertyValue("-ms-transform") ||
							 st.getPropertyValue("-o-transform") ||
							 st.getPropertyValue("transform") ||
							 "FAIL";
						
						
						// Get Matrix values
						var values = tr.split('(')[1].split(')')[0].split(',');
						//console.log(values);
						
						// Split the values we need for rotateY
						// And render them as numbers
						var y1 = parseFloat(values[0]); 	// y1 = 0.9993908270190958
						var y2 = parseFloat(values[2]); 	// y2 = -0.03489949670250097
						var y3 = parseFloat(values[8]);		// y3 = 0.03489949670250097
						var y4 = parseFloat(values[10]);	// y4 = 0.9993908270190958
						
						// Define the animation
						animation = (offset / 500);
						leftPos = animation * 5;
						size = offset * .5;
						
						// Define position and values
						yPos = 11;
						yPosEven = 20;
						yDegree = 2;
						
						_y1 = Math.cos(yDegree + animation);
						_y2 = Math.sin(-(yDegree + animation));
						_y3 = Math.sin(yDegree + animation);
						_y4 = Math.cos(yDegree + animation);
					
						// for Ydegree = 0,
						var ytest1 = Math.cos(0 * deg2rad); 	// y1 = 0
						var ytest2 = Math.sin(-0 * deg2rad); 	// y2 = 1
						var ytest3 = Math.sin(0 * deg2rad); 	// y3 = 0
						var ytest4 = Math.cos(0 * deg2rad); 	// y4 = 1
						
						// for Ydegree = -2,
						var ytt1 = Math.cos(-2 * deg2rad); 		// y1 = 0.9993908270190958
						var ytt2 = Math.sin(2 * deg2rad); 		// y2 = 0.03489949670250097
						var ytt3 = Math.sin(-2 * deg2rad); 		// y3 = -0.03489949670250097
						var ytt4 = Math.cos(-2 * deg2rad); 		// y4 = 0.9993908270190958 */
						
						if (i % 2 === 0) {
							yDegree = 2;
							el.css({
								//'transform': 'rotateY(' + yDegree <= -2 + 'deg)' ? 'rotateY(' + (yDegree - animation) + 'deg)' : 'rotateY(0deg)',
								'transform': (y3 === 0) ? 'rotateY(' + (yDegree - animation) + 'deg)' : 'rotateY(0deg)',
								'left' : yPos + '%' >= -yPos + '%' ? (yPos - leftPos) + '%' : -yPos + '%'
							});
							
						}else {
							//console.log("impair", i, "y3 = " + y3);
						}
							
							// matrix3d(0.939693, 0, -0.34202, 0, 0, 1, 0, 0, 0.34202, 0, 0.939693, 0, 0, 0, 0, 1)
							
						
							/* el.css({
								'transform': 'rotateY(' + (-yDegree <= 0) + 'deg)' ? 'rotateY(' + (-yDegree + animation) + 'deg)' : 'rotateY(' + 0 + 'deg)',
								'left' : -yPosEven + '%' <= yPosEven + '%' ? (-yPosEven + leftPos) + '%' : yPosEven + '%'
							}); */
						
						
						render = (function(value){
							return function(){
							
								// Increase currentFrame but stop if you reach the end of the sequence
								currentFrame = (seqBeg[i] + velocity) >= seqEnd[i] ? seqEnd[i] : (seqBeg[i] + velocity);
								
								// Make the CurrentFrame become a file src
								numCurrentFrame = ("0000" + currentFrame).slice(-4);
								fileCurrentFrame= "" + rootPath + sequencePath + imgPrefix + numCurrentFrame + ".jpg"
								
								image = new Image();
								image.src = fileCurrentFrame;
								
								// And draw it into the right canvas
								return context[value].drawImage(image, x, 0, w, h);
							}
						})(i);
					
						render();
					}else{
						yDegree = 2;
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

