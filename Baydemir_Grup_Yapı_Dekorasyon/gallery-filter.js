document.addEventListener("DOMContentLoaded", () => {
  // Gallery filtering
  const filterButtons = document.querySelectorAll(".filter-button");
  const galleryItems = document.querySelectorAll(".gallery-item");
  
  // Initialize Lightbox
  const galleryLightbox = document.getElementById("gallery-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDescription = document.getElementById("lightbox-description");
  const lightboxClose = document.querySelector("#gallery-lightbox .lightbox-close");
  const lightboxPrev = document.querySelector("#gallery-lightbox .lightbox-prev");
  const lightboxNext = document.querySelector("#gallery-lightbox .lightbox-next");
  
  // Zoom controls
  const zoomInButton = document.querySelector(".zoom-in");
  const zoomOutButton = document.querySelector(".zoom-out");
  const zoomResetButton = document.querySelector(".zoom-reset");
  const zoomLevelIndicator = document.querySelector(".zoom-level");
  const zoomInstructions = document.querySelector(".zoom-instructions");
  
  let currentFilter = "all";
  let visibleItems = [];
  let currentLightboxIndex = 0;
  
  // Zoom and pan variables
  let scale = 1;
  let panning = false;
  let pointX = 0;
  let pointY = 0;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  
  // Filter gallery items
  function filterGallery(filter) {
    currentFilter = filter;
    
    galleryItems.forEach((item) => {
      const categories = item.dataset.categories.split(" ");
      
      if (filter === "all" || categories.includes(filter)) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
    
    // Update visible items for lightbox navigation
    updateVisibleItems();
  }
  
  // Update the array of currently visible items
  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(
      (item) => !item.classList.contains("hidden")
    );
  }
  
  // Open lightbox
  function openLightbox(index) {
    const item = visibleItems[index];
    const img = item.querySelector("img");
    const title = item.querySelector(".gallery-info h3").textContent;
    const description = item.querySelector(".gallery-info p").textContent;
    
    // Reset zoom and position
    resetZoom();
    
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    
    galleryLightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    currentLightboxIndex = index;
    
    // Show zoom instructions briefly
    showZoomInstructions();
  }
  
  // Close lightbox
  function closeLightbox() {
    galleryLightbox.classList.remove("active");
    galleryLightbox.classList.remove("zoomed-mode");
    document.body.style.overflow = "";
    resetZoom();
  }
  
  // Navigate to previous image
  function prevImage() {
    // Reset zoom before changing image
    resetZoom();
    
    const newIndex = 
      currentLightboxIndex === 0 
        ? visibleItems.length - 1 
        : currentLightboxIndex - 1;
    openLightbox(newIndex);
  }
  
  // Navigate to next image
  function nextImage() {
    // Reset zoom before changing image
    resetZoom();
    
    const newIndex = 
      currentLightboxIndex === visibleItems.length - 1 
        ? 0 
        : currentLightboxIndex + 1;
    openLightbox(newIndex);
  }
  
  // Zoom functions
  function zoomIn() {
    if (scale >= 3) return; // Maximum zoom level
    scale += 0.5;
    updateZoom();
  }
  
  function zoomOut() {
    if (scale <= 1) return; // Minimum zoom level
    scale -= 0.5;
    updateZoom();
    
    // If zoomed out completely, reset position
    if (scale === 1) {
      resetPosition();
    }
  }
  
  function resetZoom() {
    scale = 1;
    resetPosition();
    updateZoom();
  }
  
  function resetPosition() {
    pointX = 0;
    pointY = 0;
    lastX = 0;
    lastY = 0;
    updateZoom();
  }
  
  function updateZoom() {
    // Apply transform to the image
    lightboxImage.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    
    // Update zoom level indicator
    zoomLevelIndicator.textContent = `${Math.round(scale * 100)}%`;
    
    // Show zoom level indicator
    zoomLevelIndicator.classList.add("visible");
    setTimeout(() => {
      zoomLevelIndicator.classList.remove("visible");
    }, 1500);
    
    // Update cursor and class based on zoom level
    if (scale > 1) {
      lightboxImage.classList.add("zoomed");
      galleryLightbox.classList.add("zoomed-mode");
    } else {
      lightboxImage.classList.remove("zoomed");
      galleryLightbox.classList.remove("zoomed-mode");
    }
  }
  
  function showZoomInstructions() {
    zoomInstructions.classList.add("visible");
    setTimeout(() => {
      zoomInstructions.classList.remove("visible");
    }, 5000); // Instructions will fade out after 5 seconds
  }
  
  // Pan functions
  function startPan(e) {
    e.preventDefault();
    
    // Only enable panning when zoomed in
    if (scale <= 1) {
      // If not zoomed, clicking the image will zoom in
      zoomIn();
      return;
    }
    
    panning = true;
    
    // Get start position based on touch or mouse
    if (e.type === "touchstart") {
      startX = e.touches[0].clientX - lastX;
      startY = e.touches[0].clientY - lastY;
    } else {
      startX = e.clientX - lastX;
      startY = e.clientY - lastY;
    }
    
    lightboxImage.style.cursor = "grabbing";
  }
  
  function movePan(e) {
    e.preventDefault();
    
    if (!panning) return;
    
    let currentX, currentY;
    
    // Get current position based on touch or mouse
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - startX;
      currentY = e.touches[0].clientY - startY;
    } else {
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
    }
    
    // Calculate boundaries to prevent panning outside image bounds
    const imageRect = lightboxImage.getBoundingClientRect();
    const containerRect = lightboxImage.parentElement.getBoundingClientRect();
    
    // Calculate the maximum allowed panning distance
    const maxX = (imageRect.width * scale - containerRect.width) / 2;
    const maxY = (imageRect.height * scale - containerRect.height) / 2;
    
    // Constrain panning within boundaries
    pointX = Math.min(Math.max(currentX, -maxX), maxX);
    pointY = Math.min(Math.max(currentY, -maxY), maxY);
    
    // Apply the transform
    lightboxImage.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    
    // Store last position
    lastX = pointX;
    lastY = pointY;
  }
  
  function endPan() {
    panning = false;
    lightboxImage.style.cursor = "grab";
  }
  
  // Add event listeners to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      
      // Filter gallery
      filterGallery(button.dataset.filter);
    });
  });
  
  // Add click event to gallery items
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      updateVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });
  
  // Lightbox controls
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
  
  // Zoom controls
  if (zoomInButton) {
    zoomInButton.addEventListener("click", (e) => {
      e.stopPropagation();
      zoomIn();
    });
  }
  
  if (zoomOutButton) {
    zoomOutButton.addEventListener("click", (e) => {
      e.stopPropagation();
      zoomOut();
    });
  }
  
  if (zoomResetButton) {
    zoomResetButton.addEventListener("click", (e) => {
      e.stopPropagation();
      resetZoom();
    });
  }
  
  // Image click to zoom
  if (lightboxImage) {
    lightboxImage.addEventListener("click", (e) => {
      e.stopPropagation();
      if (scale === 1) {
        zoomIn();
      }
    });
    
    // Pan events for mouse
    lightboxImage.addEventListener("mousedown", startPan);
    window.addEventListener("mousemove", movePan);
    window.addEventListener("mouseup", endPan);
    
    // Pan events for touch
    lightboxImage.addEventListener("touchstart", startPan);
    window.addEventListener("touchmove", movePan);
    window.addEventListener("touchend", endPan);
  }
  
  // Close on background click
  if (galleryLightbox) {
    galleryLightbox.addEventListener("click", (e) => {
      if (e.target === galleryLightbox) {
        closeLightbox();
      }
    });
  }
  
  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!galleryLightbox || !galleryLightbox.classList.contains("active")) return;
    
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "+" || e.key === "=") {
      zoomIn();
    } else if (e.key === "-") {
      zoomOut();
    } else if (e.key === "0") {
      resetZoom();
    }
  });
  
  // Mouse wheel zoom
  galleryLightbox.addEventListener("wheel", (e) => {
    if (!galleryLightbox.classList.contains("active")) return;
    
    e.preventDefault();
    
    // Zoom in or out based on wheel direction
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  });
  
  // Initialize gallery
  updateVisibleItems();
  
  // Set current year in footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});