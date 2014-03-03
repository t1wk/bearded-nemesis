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
	loadedFrameCallback = [];
	resizeCanvas = [];
	render = [];
	
	// Create arrays with IDs and number of images of each canvas
	motion.each(function(){
		arr.push($(this).attr('id'));
		seqBeg.push($(this).data('sequence-beg'));
		seqEnd.push($(this).data('sequence-end'));
	});
	
	for(i = 0, len=arr.length; i < len; i++) {
		
		console.log("i = " + i); // To test
		
		// Define Canvas
		canvas.push(document.getElementById(arr[i]));
		context.push(canvas[i].getContext('2d'));
			
		// Draw Image
		render = function(img) {
		  
		  var h, videoAspectRatio, videoHeight, videoWidth, w, windowAspectRatio, windowHeight, windowWidth, x;
		  
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
		  
			$.each( context, function(){
				//console.log(context[i], img); // Il réécrit img 6 fois. Pkoi ?
				//return this.drawImage(img, x, 0, w, h); // Rendering canvas
			});
		};
				
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
		  
		  for (a = _a = seqBeg[i]; seqBeg[i] <= seqEnd[i] ? _a <= seqEnd[i] : _a >= seqEnd[i]; 
			a = seqBeg[i] <= seqEnd[i] ? ++_a : --_a) {
			
			img = new Image();
			num = ("0000" + seqBeg[i]).slice(-4);
			file.push("" + rootPath + sequencePath + imgPrefix + num + ".jpg");
		
			// Assign onload handler to each image in array
			img.onload = (function(value){
			   return function(){
				   //context[value].drawImage(file[value+1], 0, 0);
				   context[value].drawImage(img, x, 0, w, h); // Render current image
			   }
			})(i);

			// IMPORTANT - Assign src last for IE
			img.src = file[i];	
			
			// Create sequences
			numSeq = ("0000" + a).slice(-4);
			seq[i].push("" + rootPath + sequencePath + imgPrefix + numSeq + ".jpg");
		  }
		};
		
		// Render current image
		loadedFrameCallback = function(img) {
		  return render(img);
		};
		
		// Render images after being loaded
		loadImageSequence();
		
		// console.log(seq[i]); // Array of each sequence - OK
		
		
		// Render Current Frame
		renderCurrentFrame = function() {
			var h, videoAspectRatio, videoHeight, videoWidth, w, windowAspectRatio, windowHeight, windowWidth, x;
		  
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
			
			for(i = 0, len=seq.length; i < len; i++) {
				var offset, currentFrame;
				offset = $(window).scrollTop();
				currentFrame = seq[i];
				currentFrame = Math.round(offset / 10); // Define parallax velocity
				console.log(currentFrame);
				
				/* if (currentFrame >= currentFrame[i].length-1) {
					currentFrame = currentFrame[i].length-1 - 1;
				  } 
				// Assign onload handler to each image in array
				img.onload = (function(value){
					return function(){
					   context[value].drawImage(currentFrame[value+1], 0, 0);
					   //context[value].drawImage(img, x, 0, w, h); // Render current image
					}
				})(i); */
			}
			
			for(i = 0, len=seq.length; i < len; i++) {
			//console.log(i);
		  
			  
			/* // Assign onload handler to each image in array
			currentFrame = (function(value){
				return function(){
				   //context[value].drawImage(file[value+1], 0, 0);
				   //context[value].drawImage(img, x, 0, w, h); // Render current image
				}
			})(i); */
			  
			  //console.log(render[currentFrame]);
			  //return render(seq[i][currentFrame]); // Rendering
			};
		
			/* $.each( seq, function(){
				//console.log(seqBeg[i]);
				//return render(this[currentFrame]); // Rendering
			}); */
		};
	}
	
	// Scroll Events
	//=============================================================//
	$(window).scroll(function() {
		// Prevent jittering
		//window.requestAnimationFrame(renderCurrentFrame[i]);

		//window.requestAnimationFrame(renderCurrentFrame);
		renderCurrentFrame();
		
		// Render
		/* $.each( renderCurrentFrame, function(){
			//console.log(this);
			window.requestAnimationFrame(this);
			return this;
		}); */
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
    //first();
	motionParallax();
});

