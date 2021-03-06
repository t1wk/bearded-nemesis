/*! Parallax functions
==============================================================
@name motionparallax.js
@author Christophe Zlobinski-Furmaniak (christophe.zf@gmail.com or @t1wk)
@version 1.2
@date 03/09/2014
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

					
					// Article is into the ViewPort?
					// Great, render the sequence
					if(article.isOnScreen()){
						
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

