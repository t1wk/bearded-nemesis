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

//=============================================================//
// Define Path for images
//=============================================================//
	var rootPath, sequencePath, imgPrefix;

	// Define root
	if (document.location.hostname === "localhost") {
	  rootPath = "/git/bearded-nemesis";
	} else {
	  rootPath = "";
	}

	// Define sequence path
	sequencePath = "/_images/beard/";

	// Define prefix of image sequence
	imgPrefix = "motion";
	
//=============================================================//
// Parallax for elements
//=============================================================//
function elParallax(article, offset, animation){
	
	var nav, navHeight, header, headerHeight;
	nav = $("nav");
	header = $("header");
	
	navHeight = nav.height();
	headerHeight = header.height();
	triggerNav = headerHeight - navHeight;
	
	if (offset >= triggerNav){
		nav.addClass("active");
	}else {
		nav.removeClass("active");
	}
}

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

					// Count how many images to load
					var totalFrames = 0;
					totalFrames+= seqEnd[i]-seqBeg[i];
					totalFrames = totalFrames+1;
														
					// Define parallax velocity for all
					// Velocity is smoothed if you don't have the same amount of frames by sequence 
					// velocity = Math.round(((offset * 3) / totalFrames)); // For about 100 images/sequence
					velocity = Math.round(((offset * 7.5) / totalFrames)); // For about 200 images/sequence
					
					// Define if the number is an even or not
					function isEven(num) {
					  return isNaN(num) && num !== false && num !== true ? false : num % 2 == 0;
					}		
					
					// Define the animation
					var animation = (offset / 500);
					var leftPos = animation * 5;
					
					// Define position and values
					var yPos = 20;
					var yDegree = 2;
					
					// Render Parallax of elements
					elParallax(article, offset, animation);
					
					// Article is into the ViewPort?
					// Great, render the sequence
					if(article.isOnScreen()){
						
						// Define the element
						var el = $(canvas[i]);
						el2 = el[0]; // returns a HTML DOM Object instead of a jQuery object
						
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
												
						// Split the values we need for rotateY
						// And render them as numbers
						var y1 = parseFloat(values[0]); 	// y1 = 0.9993908270190958
						var y2 = parseFloat(values[2]); 	// y2 = -0.03489949670250097
						var y3 = parseFloat(values[8]);		// y3 = 0.03489949670250097
						var y4 = parseFloat(values[10]);	// y4 = 0.9993908270190958
						
						// Play with the rotation of the canvas
						// Rotate differently if the element is even or not
						if (isEven(i)) {
							yDegree = 2;
							el.css({
								'transform': (y3 === 0) ? 'rotateY(' + (yDegree - animation) + 'deg)' : 'rotateY(' + (-yDegree + animation) + 'deg)',
								'left' : -yPos + '%' <= yPos + '%' ? (-yPos + leftPos) + '%' : yPos + '%'
							});
							
						}else {
							yDegree = -2;
							el.css({
								'transform': (y2 === 0) ? 'rotateY(' + (yDegree - animation) + 'deg)' : 'rotateY(' + (-yDegree + animation) + 'deg)',
								'left' : -yPos + '%' <= yPos + '%' ? (-yPos + leftPos) + '%' : yPos + '%'
							});
						}
						
						// Render the images on scroll
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
						
						// Parallax the canvas inside the parent element
						// ------------------------------------------------
						
						// Canvas Parallax
						top = el.css('top');
						el.css({
							'top': (-top + animation) +'%' 
						});
						
						// And play with the perspective and top to give a parallax effect
						perspective = article.css('perspective');
						perspective = perspective.split("px");
						perspective = parseInt(perspective[0]);
						
						topArticle = article.css('top');
						topArticle = topArticle.split("px");
						topArticle = parseInt(topArticle[0]);
						
						article.css({
							'perspective': perspective <= 280 ? Math.round(perspective + (animation / articles.length)) + 'px' : 280 + 'px',
							'top' : topArticle <= 200 ? Math.round(topArticle + animation) + 'px' : Math.round(200 - animation * 2) + 'px'
						});
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

