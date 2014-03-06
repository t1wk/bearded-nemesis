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
			num = ("0000" + a).slice(-4);
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
			
			// Render Current Frame
			renderCurrentFrame = function() {			
				for(i = 0, len=seq.length; i < len; i++) {
					var offset, currentFrame, numCurrentFrame, fileCurrentFrame;
					offset = $(window).scrollTop();
		
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
		
					//console.log(currentFrame[i]);
					currentFrame = Math.round(offset / 10); // Define parallax velocity
					
					if (currentFrame >= seqEnd[i]) {
						currentFrame = seqEnd[i] - 1;
					  } 
					
					
					// Assign onload handler to each image in array
					test = (function(value){
						return function(){
							numCurrentFrame = ("0000" + currentFrame).slice(-4);
							fileCurrentFrame= "" + rootPath + sequencePath + imgPrefix + numCurrentFrame + ".jpg"
							image = new Image();
							image.src = fileCurrentFrame;
							//console.log("render["+ i + "](" + fileCurrentFrame + ")");
							//console.log("render["+ i+ "](" + seq[i] + "[currentFrame]");
						    //console.log(seq[i]);
							//return render[i](fileCurrentFrame); // Rendering							
							console.log(context[value], fileCurrentFrame);
							//return context[value].drawImage(image, x, 0, w, h); // Rendering canvas
						}
					})(i);
					
					test();
					//console.log("render(" + seq[i]+ "[" + currentFrame + "])");
					
					//console.log(seq[i]); // retourne le tableau 1 uniquement
					//return render[i](seq[i][currentFrame]); // Rendering
				}
			};
			
			// Draw Image
			render[i] = function(img) {
			  
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
			  
			  // Create a new Image to display native element to give to context
			  img_converted = new Image();
			  img_converted.src = img;
			  //console.log(img_converted);
			  
			  /* img = new Image();
			  img.onload = (function(value){
				   return function(){
						console.log(this);
					   context[value].drawImage(img, 0, 0);
				   }
			   })(i); */
			  
			  //return context[i].drawImage(img_converted, x, 0, w, h); // Rendering canvas
			};
		};
		
		// Render current image
		loadedFrameCallback = function(img) {
		  return render(img);
		};
		
		// Render images after being loaded
		loadImageSequence();
		
		// console.log(seq[i]); // Array of each sequence - OK
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

