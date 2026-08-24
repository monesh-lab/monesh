/* ==========================================================================
   Annai Foundation JavaScript File
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Hamburger Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Events Page Calendar & Carousel Interaction (Synchronized Prototype)
  const calendarDays = document.querySelectorAll('#calendarGrid .calendar-day.event-active');
  const carouselCards = document.querySelectorAll('.carousel-card');
  const carousel = document.getElementById('eventCarousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  const featuredImg = document.getElementById('featuredEventImg');
  const featuredTitle = document.getElementById('featuredEventTitle');
  const featuredDesc = document.getElementById('featuredEventDesc');
  const featuredContent = document.getElementById('featuredEventContent');

  if (carouselCards.length > 0) {
    // Helper to update featured banner with a fade transition
    const updateFeaturedBanner = (imgSrc, title, desc) => {
      if (!featuredImg || !featuredTitle || !featuredDesc || !featuredContent) return;

      // Start fade out
      featuredImg.style.transition = 'opacity 0.2s ease';
      featuredContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      featuredImg.style.opacity = '0';
      featuredContent.style.opacity = '0';
      featuredContent.style.transform = 'translateY(10px)';

      setTimeout(() => {
        featuredImg.src = imgSrc;
        featuredTitle.textContent = title;
        featuredDesc.textContent = desc;

        // Fade back in
        featuredImg.style.opacity = '0.85';
        featuredContent.style.opacity = '1';
        featuredContent.style.transform = 'translateY(0)';
      }, 200);
    };

    // Helper to center active card inside the carousel viewport
    const centerActiveCard = (card) => {
      if (!carousel || !card) return;
      const carouselWidth = carousel.clientWidth;
      const cardWidth = card.clientWidth;
      const cardOffset = card.offsetLeft;
      
      // Calculate scroll position to center the card
      const scrollPos = cardOffset - (carouselWidth / 2) + (cardWidth / 2);
      
      carousel.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });
    };

    // Main function to select an event
    const selectEvent = (card) => {
      if (!card) return;

      // 1. Set active card class
      carouselCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // 2. Extract event data
      const dateVal = card.getAttribute('data-date');
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');

      // 3. Update featured banner
      updateFeaturedBanner(imgSrc, title, desc);

      // 4. Update highlighted date in calendar
      if (calendarDays.length > 0) {
        calendarDays.forEach(day => {
          day.classList.remove('selected');
          if (day.getAttribute('data-date') === dateVal) {
            day.classList.add('selected');
          }
        });
      }

      // 5. Scroll card to center
      centerActiveCard(card);
    };

    // Card click event triggers selection
    carouselCards.forEach(card => {
      card.addEventListener('click', () => {
        selectEvent(card);
      });
    });

    // Calendar day click triggers selection
    if (calendarDays.length > 0) {
      calendarDays.forEach(day => {
        day.addEventListener('click', () => {
          const dateVal = day.getAttribute('data-date');
          const targetCard = Array.from(carouselCards).find(c => c.getAttribute('data-date') === dateVal);
          if (targetCard) {
            selectEvent(targetCard);
          }
        });
      });
    }

    // Prev Button click navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeCard = document.querySelector('.carousel-card.active');
        const cardsArray = Array.from(carouselCards);
        let currentIndex = cardsArray.indexOf(activeCard);
        
        let targetIndex = currentIndex - 1;
        if (targetIndex < 0) {
          targetIndex = cardsArray.length - 1; // Wrap around to end
        }
        
        selectEvent(cardsArray[targetIndex]);
      });
    }

    // Next Button click navigation
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeCard = document.querySelector('.carousel-card.active');
        const cardsArray = Array.from(carouselCards);
        let currentIndex = cardsArray.indexOf(activeCard);
        
        let targetIndex = currentIndex + 1;
        if (targetIndex >= cardsArray.length) {
          targetIndex = 0; // Wrap around to start
        }
        
        selectEvent(cardsArray[targetIndex]);
      });
    }
  }

  // 4. Donate Page amount chips selection
  const amountChips = document.querySelectorAll('.amount-chip');
  if (amountChips.length > 0) {
    amountChips.forEach(chip => {
      chip.addEventListener('click', () => {
        amountChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        // If there is a hidden amount field, set it
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) {
          customAmountInput.value = chip.getAttribute('data-amount');
        }
      });
    });
  }

  // Frequency options toggle simulation
  const frequencyOptions = document.querySelectorAll('input[name="frequency"]');
  frequencyOptions.forEach(opt => {
    opt.addEventListener('change', () => {
      const activeChip = document.querySelector('.amount-chip.active');
      if (activeChip) {
        const amount = activeChip.getAttribute('data-amount');
        console.log(`Donation frequency changed to ${opt.value} for ₹${amount}`);
      }
    });
  });

  // 5. Form Submissions & Success Modal
  const volunteerForm = document.getElementById('volunteerForm');
  const contactForm = document.getElementById('contactForm');
  const donateForm = document.getElementById('donateForm');
  const successOverlay = document.getElementById('successOverlay');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const successTitle = document.getElementById('successTitle');
  const successText = document.getElementById('successText');

  function showSuccessModal(title, text) {
    if (successOverlay && successTitle && successText) {
      successTitle.textContent = title;
      successText.textContent = text;
      successOverlay.classList.add('show');
      
      // Auto close after 4 seconds
      setTimeout(() => {
        successOverlay.classList.remove('show');
      }, 4000);
    }
  }

  if (successCloseBtn && successOverlay) {
    successCloseBtn.addEventListener('click', () => {
      successOverlay.classList.remove('show');
    });
  }

  // Volunteer Form Submission Handler
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate inputs
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      
      if (!name || !email || !phone) {
        alert('Please fill out all required fields.');
        return;
      }
      
      showSuccessModal(
        'Application Submitted!',
        `Thank you ${name} for joining hands with Annai Foundation. Our coordinator will reach out to you within 3 business days.`
      );
      volunteerForm.reset();
    });
  }

  // Contact Form Submission Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const message = document.getElementById('messageText').value.trim();
      
      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }
      
      showSuccessModal(
        'Message Sent Successfully!',
        `Thank you ${name}. We have received your message and will respond to you as soon as possible.`
      );
      contactForm.reset();
    });
  }

  // Donate Form Submission Handler
  if (donateForm) {
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const address = document.getElementById('billingAddress').value.trim();
      
      const activeChip = document.querySelector('.amount-chip.active');
      const amount = activeChip ? activeChip.getAttribute('data-amount') : '500';
      
      if (!name || !email || !address) {
        alert('Please fill out all required fields.');
        return;
      }
      
      showSuccessModal(
        'Donation Successful!',
        `Thank you ${name} for your generous donation of ₹${amount}. A receipt has been sent to ${email}.`
      );
      donateForm.reset();
    });
  }

  // 6. Stats Counter Animation using IntersectionObserver
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds animation duration
      const startTime = performance.now();
      
      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function - easeOutQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        // Format number with commas
        el.textContent = currentValue.toLocaleString('en-US') + '+';
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target.toLocaleString('en-US') + '+';
        }
      };
      
      requestAnimationFrame(updateCount);
    };
    
    const observerOptions = {
      root: null,
      threshold: 0.1
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    statNumbers.forEach(num => counterObserver.observe(num));
  }
});
