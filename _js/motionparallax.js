/*! Parallax functions
==============================================================
@name motionparallax.js
@author Christophe Zlobinski-Furmaniak (christophe.zf@gmail.com or @t1wk)
@version 1.1
@date 03/07/2014
@category Animation scripts
@license No open-source for the time being.

@based-on: Be Moved by Sony (http://discover.store.sony.com/be-moved/)
@based-url: https://github.com/ballistiq/parallax-demo
==============================================================
*/

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
	//=============================================================//
	// Parallax Canvas
	//=============================================================//

	// Create variables
	var motion = $('canvas');
	var total_slides = motion.length;
	var currentFrame = 1;
	
	var canvas = [];
	var context = [];
	var arr = [];
	var seq = [];
	var seqBeg = [];
	var seqEnd = [];
	var img = [];
	
	renderCurrentFrame = [];
	loadImageSequence = [];
	resizeCanvas = [];
	render = [];
	
	// Create arrays with IDs and number of images of each canvas
	motion.each(function(){
		arr.push($(this).attr('id'));
		seqBeg.push($(this).data('sequence-beg'));
		seqEnd.push($(this).data('sequence-end'));
	});
	
	for(i = 0, len=arr.length; i < len; i++) {
	
		// Define Canvas
		canvas.push(document.getElementById(arr[i]));
		context.push(canvas[i].getContext('2d'));
				
		// Preload images
		loadImageSequence = function() {
			var file, fileSeq, a, img, num, numSeq, sequence, _a, h, videoAspectRatio, videoHeight, videoWidth, w, windowAspectRatio, windowHeight, windowWidth, x;
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

			// Draw Image
			for (a = _a = seqBeg[i]; seqBeg[i] <= seqEnd[i] ? _a <= seqEnd[i] : _a >= seqEnd[i]; 
			a = seqBeg[i] <= seqEnd[i] ? ++_a : --_a) {

				img = new Image();
				num = ("0000" + a).slice(-4);
				seq[i].push("" + rootPath + sequencePath + imgPrefix + num + ".jpg");

				// Assign onload handler to each image in array
				img.onload = (function(value){
				   return function(){
					   context[value].drawImage(img, x, 0, w, h); // Render current image
				   }
				})(i);

				// IMPORTANT - Assign src last for IE
				img.src = seq[i][1];
			}
			
			// Render Current Frame
			renderCurrentFrame = function() {			
				for(i = 0, len=seq.length; i < len; i++) {
					var offset, currentFrame, numCurrentFrame, fileCurrentFrame;
					offset = $(window).scrollTop();
					currentFrame = Math.round(seqBeg[i] + (offset * (seq[i].length / 1100))); // Define parallax velocity
					
					if (currentFrame >= seqEnd[i]) {
						currentFrame = seqEnd[i] - 1;
					} 
					
					// Assign handler to each image in array
					render = (function(value){
						return function(){
							numCurrentFrame = ("0000" + currentFrame).slice(-4);
							fileCurrentFrame= "" + rootPath + sequencePath + imgPrefix + numCurrentFrame + ".jpg"
							image = new Image();
							image.src = fileCurrentFrame;
							return context[value].drawImage(image, x, 0, w, h); // Rendering canvas
						}
					})(i);
					
					render();
				}
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


