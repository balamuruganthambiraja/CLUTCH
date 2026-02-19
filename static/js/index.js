window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "https://homes.cs.washington.edu/~kpar/nerfies/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise(function(resolve, reject) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

function initBibtexCopyButtons() {
  var buttons = document.querySelectorAll('.copy-bibtex-button');
  if (!buttons.length) {
    return;
  }

  buttons.forEach(function(button) {
    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent.trim() || 'Copy BibTeX';
    }

    button.addEventListener('click', function() {
      var targetId = button.getAttribute('data-copy-target');
      var codeBlock = document.getElementById(targetId);
      if (!codeBlock) {
        return;
      }
      var text = codeBlock.textContent.trim();

      copyTextToClipboard(text).then(function() {
        button.classList.remove('is-link', 'is-danger');
        button.classList.add('is-success');
        button.textContent = 'Copied!';
        setTimeout(function() {
          button.classList.remove('is-success', 'is-danger');
          button.classList.add('is-link');
          button.textContent = button.dataset.defaultLabel;
        }, 2000);
      }).catch(function() {
        button.classList.remove('is-link', 'is-success');
        button.classList.add('is-danger');
        button.textContent = 'Copy failed';
        setTimeout(function() {
          button.classList.remove('is-success', 'is-danger');
          button.classList.add('is-link');
          button.textContent = button.dataset.defaultLabel;
        }, 2000);
      });
    });
  });
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();
    initBibtexCopyButtons();

})
