document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // ===== Navbar scroll effect =====
  const navbar = document.querySelector(".navbar");

  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll);

  // ===== Mobile menu =====
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });

  mobileMenuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });

  // Close mobile menu when clicking on a link
  const mobileNavLinks = mobileMenu.querySelectorAll("a");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });
  });

  // ===== Scroll reveal animation =====
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        const delay = element.getAttribute("data-delay") || 0;
        setTimeout(() => {
          element.classList.add("active");
        }, delay);
      }
    });
  }

  window.addEventListener("scroll", checkReveal);
  window.addEventListener("resize", checkReveal);

  // Initial check
  checkReveal();

  // ===== Vertical Photo Changer =====
  const photoChanger = document.querySelector(".vertical-photo-changer");
  if (photoChanger) {
    const mainPhoto = document.getElementById("main-photo");
    const photoDescription = document.querySelector(".photo-description");
    const thumbnails = photoChanger.querySelectorAll(".thumbnail");
    const prevButton = photoChanger.querySelector(".nav-button.prev");
    const nextButton = photoChanger.querySelector(".nav-button.next");
    const photoItems = photoChanger.querySelectorAll(".photo-item");
    
    let currentIndex = 0;
    const totalPhotos = thumbnails.length;
    
    // Update main photo and description
    function updatePhoto(index) {
      // Update current index
      currentIndex = index;
      
      // Get photo data
      const photoItem = photoItems[index];
      const imgSrc = photoItem.querySelector("img").src;
      const imgAlt = photoItem.querySelector("img").alt;
      const title = photoItem.querySelector("h3").textContent;
      const description = photoItem.querySelector("p").textContent;
      
      // Update main photo
      mainPhoto.src = imgSrc;
      mainPhoto.alt = imgAlt;
      
      // Update description
      photoDescription.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
      `;
      
      // Update active thumbnail
      thumbnails.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add("active");
        } else {
          thumb.classList.remove("active");
        }
      });
    }
    
    // Navigate to previous photo
    function prevPhoto() {
      const newIndex = currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1;
      updatePhoto(newIndex);
    }
    
    // Navigate to next photo
    function nextPhoto() {
      const newIndex = currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1;
      updatePhoto(newIndex);
    }
    
    // Add event listeners
    prevButton.addEventListener("click", prevPhoto);
    nextButton.addEventListener("click", nextPhoto);
    
    // Add click event to thumbnails
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        updatePhoto(index);
      });
    });
    
    // Initialize with first photo
    updatePhoto(0);
  }


  // ===== Loading Animation =====
  const loadingOverlay = document.getElementById("loading-animation");
  const loadingPercentage = document.getElementById("loading-percentage");
  const progressCircle = document.querySelector(".progress");
  const leftDoor = document.querySelector(".left-door");
  const rightDoor = document.querySelector(".right-door");

  let progress = 0;

  // Simulate loading progress
  function simulateLoading() {
    const interval = setInterval(() => {
      progress += (100 - progress) / 3;

      if (progress >= 99) {
        clearInterval(interval);
        progress = 100;

        // Update UI
        updateLoadingUI();

        // Open doors
        setTimeout(() => {
          leftDoor.classList.add("open");
          rightDoor.classList.add("open");

          // Hide loading overlay
          setTimeout(() => {
            loadingOverlay.classList.add("hidden");
          }, 1500);
        }, 500);

        return;
      }

      // Update UI
      updateLoadingUI();
    }, 100);
  }

  // Update loading UI
  function updateLoadingUI() {
    // Update percentage text
    loadingPercentage.textContent = Math.round(progress);

    // Update progress circle
    const dashoffset = 283 - (283 * progress) / 100;
    progressCircle.style.strokeDashoffset = dashoffset;
  }

  // Start loading simulation
  simulateLoading();

  // ===== Lightbox =====
  const productCards = document.querySelectorAll(".product-card");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let currentImageIndex = 0;

  // Product images data
  const productImages = Array.from(productCards).map((card) => {
    const img = card.querySelector("img");
    return {
      src: img.src,
      alt: img.alt,
    };
  });

  // Open lightbox
  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Update lightbox image
  function updateLightboxImage() {
    lightboxImage.src = productImages[currentImageIndex].src;
    lightboxImage.alt = productImages[currentImageIndex].alt;
  }

  // Previous image
  function prevImage() {
    currentImageIndex = currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1;
    updateLightboxImage();
  }

  // Next image
  function nextImage() {
    currentImageIndex = currentImageIndex === productImages.length - 1 ? 0 : currentImageIndex + 1;
    updateLightboxImage();
  }

  // Event listeners
  productCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      prevImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", (e) => {
      e.stopPropagation();
      nextImage();
    });
  }

  // Close on background click
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "ArrowRight") {
      nextImage();
    }
  });

  // ===== Form submission =====
  window.submitForm = function(form) {
    // Get form data
    const formData = new FormData(form);
    const formValues = {};
    
    for (const [key, value] of formData.entries()) {
      formValues[key] = value;
    }
    
    // In a real implementation, you would send this data to a server
    // For now, we'll just show an alert
    alert('Form submitted successfully!\n\nNormally this would be sent to the server. Form data:\n' + 
          JSON.stringify(formValues, null, 2));
    
    // Reset the form
    form.reset();
    
    return false;
  };
});

// Opens sticky-chat automatically within 5 seconds of page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("offchat-menu").checked = true;
  }, 10000);
});