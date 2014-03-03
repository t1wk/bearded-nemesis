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
	
	
	// Count how many images to load
	var totalFrames = 0;
	for(i = 0, len=total_slides; i < len; i++) {
		totalFrames+= seqEnd[i]-seqBeg[i];
		totalFrames = totalFrames+1;
	}

	for(i = 0, len=arr.length; i < len; i++) {
		
		console.log("i = " + i); // To test
		
		// Define Canvas
		canvas.push(document.getElementById(arr[i]));
		context.push(canvas[i].getContext('2d'));
		
		// Render Current Frame
		renderCurrentFrame[i] = function() {
		  var offset, currentFrame;
		  offset = $(window).scrollTop();
		  currentFrame = seqBeg[i];
		  seqBeg[i] = Math.round(offset / 10); // Define parallax velocity
		  
		  if (seqBeg[i] >= seqEnd[i]) {
			seqBeg[i] = seqEnd[i] - 1;
		  }
		
			$.each( seq, function(){
				//console.log(seqBeg[i]);
				return render(this[currentFrame]); // Rendering
			});
		};
			
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
				//console.log(this, img); // Il réécrit img 6 fois. Pkoi ?
				//return this.drawImage(img, x, 0, w, h); // Rendering canvas
			});
		};
				
		// Preload images
		loadImageSequence = function() {
		  var file, a, img, num, _a, h, videoAspectRatio, videoHeight, videoWidth, w, windowAspectRatio, windowHeight, windowWidth, x;
		  img = [];
		  seq[i] = []; 
		  file = [];
		  
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
				   context[value].drawImage(img, x, 0, w, h);
			   }
			})(i);

			// IMPORTANT - Assign src last for IE
			img.src = file[i];	
			seq[i].push(img);
		  }
		  
		  $.each( seq, function(){
			console.log(this);
			//return this;
		  });
		 // console.log(seq[i]);
		  
		  //return seq[i];
		};
		
		var firstFrame = [];
		firstFrame= seqBeg[i];
		
		// Render current image
		loadedFrameCallback = function(img) {
		  return render(img);
		};
		
		// Render images after being loaded
		//loadImageSequence = loadImageSequence[i];
		seq[i] = loadImageSequence();
		//console.log(seq);
	}
	
	// Scroll Events
	//=============================================================//
	$(window).scroll(function() {
		// Prevent jittering
		//window.requestAnimationFrame(renderCurrentFrame[i]);

		// Render
		$.each( renderCurrentFrame, function(){
			//console.log(this);
			window.requestAnimationFrame(this);
			return this;
		});
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

