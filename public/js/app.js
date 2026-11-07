/**
 * MOHASINA SIDDIKA Online Movie Ticket Booking System
 * Client Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    movies: [],
    filteredMovies: [],
    activeFilter: 'all',
    searchQuery: '',
    selectedMovie: null,
    selectedShowtimeId: null,
    currentShowtimes: [],
    seatPicker: null,
    currentSelection: null
  };

  // DOM Elements
  const moviesGrid = document.getElementById('movies-grid');
  const categoryFilters = document.getElementById('category-filters');
  const searchInput = document.getElementById('movie-search-input');
  
  // Seat Modal Elements
  const seatModal = document.getElementById('seat-modal');
  const closeSeatModalBtn = document.getElementById('close-seat-modal');
  const modalMovieHeader = document.getElementById('modal-movie-header');
  const modalShowtimePills = document.getElementById('modal-showtime-pills');
  const checkoutForm = document.getElementById('checkout-form');
  const confirmBtn = document.getElementById('confirm-booking-btn');
  
  // Summary Elements
  const summarySeatsText = document.getElementById('summary-seats-text');
  const summaryCountText = document.getElementById('summary-count-text');
  const summaryBaseText = document.getElementById('summary-base-text');
  const summaryTaxText = document.getElementById('summary-tax-text');
  const summaryTotalText = document.getElementById('summary-total-text');

  // Trailer Modal Elements
  const trailerModal = document.getElementById('trailer-modal');
  const closeTrailerModalBtn = document.getElementById('close-trailer-modal');
  const trailerIframe = document.getElementById('trailer-iframe');
  const trailerInfoBody = document.getElementById('trailer-info-body');

  // Ticket Modal Elements
  const ticketModal = document.getElementById('ticket-modal');
  const closeTicketModalBtn = document.getElementById('close-ticket-modal');
  const ticketDoneBtn = document.getElementById('ticket-modal-done-btn');

  // System Status Elements
  const systemStatusBtn = document.getElementById('system-status-btn');
  const statusModal = document.getElementById('status-modal');
  const closeStatusModalBtn = document.getElementById('close-status-modal');
  const dbModeBadge = document.getElementById('db-mode-badge');

  // Lookup Elements
  const ticketLookupForm = document.getElementById('ticket-lookup-form');
  const lookupRefInput = document.getElementById('lookup-ref-input');
  const lookupResultPreview = document.getElementById('lookup-result-preview');

  // Initialize Seat Picker Engine
  state.seatPicker = new SeatPicker({
    containerId: 'seating-grid-container',
    onSelectionChange: (selection) => {
      state.currentSelection = selection;
      updateSummaryUI(selection);
    }
  });

  // Fetch Movies on Load
  fetchMovies();

  // -------------------------------------------------------------
  // API Fetch Movies
  // -------------------------------------------------------------
  async function fetchMovies() {
    try {
      const res = await fetch('/api/movies');
      const data = await res.json();
      if (data.success) {
        state.movies = data.data;
        applyFilters();
      } else {
        showError('Unable to load movies.');
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      showError('Could not connect to cinema server. Please ensure the server is running.');
    }
  }

  function applyFilters() {
    let list = [...state.movies];

    // Filter by status or category
    if (state.activeFilter === 'now_showing' || state.activeFilter === 'coming_soon') {
      list = list.filter(m => m.status === state.activeFilter);
    } else if (state.activeFilter !== 'all') {
      list = list.filter(m => m.genre.toLowerCase().includes(state.activeFilter.toLowerCase()));
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.language.toLowerCase().includes(q)
      );
    }

    state.filteredMovies = list;
    renderMoviesGrid(list);
  }

  function renderMoviesGrid(movies) {
    if (!moviesGrid) return;

    if (movies.length === 0) {
      moviesGrid.innerHTML = `
        <div class="empty-ticket-state" style="grid-column: 1 / -1; padding: 48px;">
          <i class="fa-solid fa-film"></i>
          <p>No movies found matching your current filter criteria.</p>
        </div>
      `;
      return;
    }

    moviesGrid.innerHTML = movies.map(movie => {
      const isComingSoon = movie.status === 'coming_soon';
      const genres = movie.genre.split(',').map(g => `<span class="genre-tag">${g.trim()}</span>`).join('');

      return `
        <article class="movie-card" data-movie-id="${movie.movie_id}">
          <div class="poster-box">
            <img src="${movie.poster_url}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="rating-badge">
              <i class="fa-solid fa-star"></i> ${movie.rating}
            </div>
            <div class="age-badge">${movie.age_rating}</div>
            
            ${movie.trailer_url ? `
              <button class="trailer-overlay-btn" onclick="openTrailerModal(${movie.movie_id})" title="Watch Trailer">
                <span class="play-circle"><i class="fa-solid fa-play"></i></span>
              </button>
            ` : ''}
          </div>

          <div class="card-details">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
              <span><i class="fa-regular fa-clock"></i> ${movie.duration_mins}m</span>
              <span>&bull;</span>
              <span><i class="fa-solid fa-globe"></i> ${movie.language}</span>
            </div>

            <div class="genre-tags">${genres}</div>

            <div class="card-footer">
              ${isComingSoon ? `
                <button class="btn btn-outline" onclick="openTrailerModal(${movie.movie_id})">
                  <i class="fa-solid fa-bell"></i> Notify Me / Trailer
                </button>
              ` : `
                <button class="btn btn-primary" onclick="startBookingFlow(${movie.movie_id})">
                  <i class="fa-solid fa-ticket"></i> Book Tickets
                </button>
              `}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function showError(msg) {
    if (moviesGrid) {
      moviesGrid.innerHTML = `
        <div class="empty-ticket-state" style="grid-column: 1 / -1; color: #DC2626; border-color: #FCA5A5;">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p><strong>Error:</strong> ${msg}</p>
        </div>
      `;
    }
  }

  // -------------------------------------------------------------
  // Search & Filter Events
  // -------------------------------------------------------------
  if (categoryFilters) {
    categoryFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.activeFilter = e.target.getAttribute('data-filter');
        applyFilters();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();
    });
  }

  // -------------------------------------------------------------
  // Trailer Modal
  // -------------------------------------------------------------
  window.openTrailerModal = async (movieId) => {
    try {
      const res = await fetch(`/api/movies/${movieId}`);
      const data = await res.json();
      if (!data.success) return;

      const movie = data.data;
      if (trailerIframe) {
        trailerIframe.src = movie.trailer_url ? `${movie.trailer_url}?autoplay=1` : '';
      }
      if (trailerInfoBody) {
        trailerInfoBody.innerHTML = `
          <h2 style="font-family: var(--font-serif); margin-bottom: 8px;">${movie.title}</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
            <strong>Genre:</strong> ${movie.genre} | <strong>Duration:</strong> ${movie.duration_mins} mins | <strong>Rating:</strong> ${movie.rating} / 10
          </p>
          <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">${movie.synopsis}</p>
          ${movie.status === 'now_showing' ? `
            <button class="btn btn-primary" onclick="closeTrailer(); startBookingFlow(${movie.movie_id})">
              <i class="fa-solid fa-ticket"></i> Book Tickets Now
            </button>
          ` : ''}
        `;
      }
      if (trailerModal) trailerModal.style.display = 'flex';
    } catch (err) {
      console.error('Error opening trailer modal:', err);
    }
  };

  window.closeTrailer = () => {
    if (trailerModal) trailerModal.style.display = 'none';
    if (trailerIframe) trailerIframe.src = '';
  };

  if (closeTrailerModalBtn) closeTrailerModalBtn.addEventListener('click', window.closeTrailer);

  // -------------------------------------------------------------
  // Booking Flow & Showtime Selection
  // -------------------------------------------------------------
  window.startBookingFlow = async (movieId) => {
    try {
      const res = await fetch(`/api/movies/${movieId}`);
      const data = await res.json();
      if (!data.success) return;

      state.selectedMovie = data.data;
      state.currentShowtimes = data.data.showtimes || [];

      if (state.currentShowtimes.length === 0) {
        alert('No active showtimes currently scheduled for this movie.');
        return;
      }

      // Populate Movie Header
      if (modalMovieHeader) {
        modalMovieHeader.innerHTML = `
          <h3>${state.selectedMovie.title}</h3>
          <p class="header-subtitle">
            <i class="fa-solid fa-film"></i> ${state.selectedMovie.genre} &bull; 
            <i class="fa-solid fa-clock"></i> ${state.selectedMovie.duration_mins}m &bull; 
            <i class="fa-solid fa-certificate"></i> ${state.selectedMovie.age_rating}
          </p>
        `;
      }

      // Populate Showtime Pills
      renderShowtimePills();

      // Auto-select first showtime
      selectShowtime(state.currentShowtimes[0].showtime_id);

      // Open Modal
      if (seatModal) seatModal.style.display = 'flex';
    } catch (err) {
      console.error('Failed to initiate booking flow:', err);
      alert('Error opening booking screen.');
    }
  };

  function renderShowtimePills() {
    if (!modalShowtimePills) return;
    modalShowtimePills.innerHTML = state.currentShowtimes.map(st => `
      <button type="button" class="st-pill ${st.showtime_id === state.selectedShowtimeId ? 'active' : ''}" 
              data-showtime-id="${st.showtime_id}" onclick="selectShowtime(${st.showtime_id})">
        ${st.start_time} (₹${st.base_price})
      </button>
    `).join('');
  }

  window.selectShowtime = async (showtimeId) => {
    state.selectedShowtimeId = showtimeId;
    renderShowtimePills();

    try {
      const res = await fetch(`/api/showtimes/${showtimeId}/seats`);
      const data = await res.json();
      if (data.success) {
        state.seatPicker.init(data.seats, data.showtime.base_price);
      }
    } catch (err) {
      console.error('Failed to load showtime seats:', err);
    }
  };

  function updateSummaryUI(selection) {
    if (!selection) return;

    if (summarySeatsText) {
      summarySeatsText.textContent = selection.selectedSeats.length > 0 
        ? selection.selectedSeats.map(s => s.label).join(', ') 
        : 'None selected';
    }
    if (summaryCountText) summaryCountText.textContent = `${selection.count} Ticket${selection.count === 1 ? '' : 's'}`;
    if (summaryBaseText) summaryBaseText.textContent = `₹${selection.baseTotal.toFixed(2)}`;
    if (summaryTaxText) summaryTaxText.textContent = `₹${selection.taxAndFee.toFixed(2)}`;
    if (summaryTotalText) summaryTotalText.textContent = `₹${selection.grandTotal.toFixed(2)}`;

    // Enable/disable confirm button
    if (confirmBtn) {
      confirmBtn.disabled = selection.count === 0;
    }
  }

  function closeSeatModal() {
    if (seatModal) seatModal.style.display = 'none';
    if (checkoutForm) checkoutForm.reset();
  }

  if (closeSeatModalBtn) closeSeatModalBtn.addEventListener('click', closeSeatModal);

  // -------------------------------------------------------------
  // Booking Submission
  // -------------------------------------------------------------
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!state.currentSelection || state.currentSelection.count === 0) {
        alert('Please select at least one seat before confirming your booking.');
        return;
      }

      const seatIds = state.seatPicker.getSelectedSeatIds();
      const customerName = document.getElementById('cust-name').value.trim();
      const customerEmail = document.getElementById('cust-email').value.trim();
      const customerPhone = document.getElementById('cust-phone').value.trim();
      const paymentMethod = document.getElementById('cust-payment').value;

      if (!customerName || !customerEmail || !customerPhone) {
        alert('Please fill in all contact details.');
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reserving Seats...';

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            showtimeId: state.selectedShowtimeId,
            customerName,
            customerEmail,
            customerPhone,
            seatIds,
            paymentMethod
          })
        });

        const data = await res.json();
        if (data.success) {
          closeSeatModal();
          renderTicketPass(data.data);
          if (ticketModal) ticketModal.style.display = 'flex';
        } else {
          alert(`Booking Error: ${data.message}`);
        }
      } catch (err) {
        console.error('Booking submission failed:', err);
        alert('Network or server error while placing your booking.');
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Confirm & Reserve Seats';
      }
    });
  }

  // -------------------------------------------------------------
  // Digital Ticket Pass Rendering
  // -------------------------------------------------------------
  function renderTicketPass(booking) {
    const movieTitle = booking.showtime ? booking.showtime.movie_title : (booking.movie_title || 'Movie');
    const showDate = booking.showtime ? booking.showtime.show_date : (booking.show_date || 'Today');
    const startTime = booking.showtime ? booking.showtime.start_time : (booking.start_time || '12:00 PM');
    const screenName = booking.showtime ? booking.showtime.screen_name : (booking.screen_name || 'Screen 1');
    const ageRating = booking.showtime ? (booking.showtime.age_rating || 'PG-13') : 'PG-13';
    const venueName = booking.showtime ? (booking.showtime.theater_name || 'MOHASINA SIDDIKA Grand Cineplex') : 'MOHASINA SIDDIKA Grand Cineplex';

    document.getElementById('tkt-movie-title').textContent = movieTitle;
    document.getElementById('tkt-rating').textContent = ageRating;
    document.getElementById('tkt-screen').textContent = screenName;
    document.getElementById('tkt-date').textContent = showDate;
    document.getElementById('tkt-time').textContent = startTime;
    document.getElementById('tkt-customer').textContent = booking.customer_name;
    document.getElementById('tkt-ref').textContent = booking.booking_ref;
    document.getElementById('tkt-seats').textContent = (booking.seats || []).join(', ');
    document.getElementById('tkt-amount').textContent = `₹${Number(booking.total_amount).toFixed(2)}`;
    document.getElementById('tkt-venue').textContent = `${venueName}, Central Avenue`;
    document.getElementById('tkt-stub-ref').textContent = booking.booking_ref;
  }

  function closeTicketModal() {
    if (ticketModal) ticketModal.style.display = 'none';
  }

  if (closeTicketModalBtn) closeTicketModalBtn.addEventListener('click', closeTicketModal);
  if (ticketDoneBtn) ticketDoneBtn.addEventListener('click', closeTicketModal);

  // -------------------------------------------------------------
  // Ticket Lookup (Self-Service)
  // -------------------------------------------------------------
  window.quickLookup = (ref) => {
    if (lookupRefInput) {
      lookupRefInput.value = ref;
      executeLookup(ref);
    }
  };

  if (ticketLookupForm) {
    ticketLookupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ref = lookupRefInput.value.trim();
      if (ref) executeLookup(ref);
    });
  }

  async function executeLookup(ref) {
    if (!lookupResultPreview) return;
    lookupResultPreview.innerHTML = `
      <div class="empty-ticket-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Looking up booking reference ${ref}...</p>
      </div>
    `;

    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(ref)}`);
      const data = await res.json();

      if (data.success) {
        const b = data.data;
        lookupResultPreview.innerHTML = `
          <div style="background: #FFFFFF; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 24px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge-db" style="background: #ECFDF5; color: #059669;">CONFIRMED</span>
              <strong style="color: var(--primary); font-family: monospace; font-size: 1.1rem;">${b.booking_ref}</strong>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 6px;">${b.movie_title}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
              <i class="fa-solid fa-tv"></i> ${b.screen_name} &bull; <i class="fa-regular fa-clock"></i> ${b.start_time}
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.88rem; margin-bottom: 16px; background: var(--bg-primary); padding: 12px; border-radius: var(--radius-sm);">
              <div><span style="color: var(--text-muted);">Customer:</span><br><strong>${b.customer_name}</strong></div>
              <div><span style="color: var(--text-muted);">Reserved Seats:</span><br><strong style="color: var(--accent);">${(b.seats || []).join(', ')}</strong></div>
            </div>
            <button class="btn btn-primary btn-block" onclick="displayFoundTicket('${b.booking_ref}')">
              <i class="fa-solid fa-qrcode"></i> View Full Pass / Print
            </button>
          </div>
        `;
      } else {
        lookupResultPreview.innerHTML = `
          <div class="empty-ticket-state" style="color: #DC2626;">
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>${data.message}</p>
          </div>
        `;
      }
    } catch (err) {
      console.error('Error during ticket lookup:', err);
      lookupResultPreview.innerHTML = `
        <div class="empty-ticket-state" style="color: #DC2626;">
          <i class="fa-solid fa-wifi"></i>
          <p>Failed to connect to booking database.</p>
        </div>
      `;
    }
  }

  window.displayFoundTicket = async (ref) => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(ref)}`);
      const data = await res.json();
      if (data.success) {
        renderTicketPass(data.data);
        if (ticketModal) ticketModal.style.display = 'flex';
      }
    } catch (err) {
      console.error('Error opening full pass:', err);
    }
  };

  // -------------------------------------------------------------
  // System / Database Status Modal
  // -------------------------------------------------------------
  if (systemStatusBtn) {
    systemStatusBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/system/status');
        const data = await res.json();
        if (dbModeBadge) {
          dbModeBadge.textContent = data.database_mode;
          if (data.database_mode.includes('Live')) {
            dbModeBadge.style.background = '#ECFDF5';
            dbModeBadge.style.color = '#059669';
          } else {
            dbModeBadge.style.background = '#FEF3C7';
            dbModeBadge.style.color = '#B45309';
          }
        }
        if (statusModal) statusModal.style.display = 'flex';
      } catch (err) {
        console.error('Status check failed:', err);
      }
    });
  }

  if (closeStatusModalBtn) {
    closeStatusModalBtn.addEventListener('click', () => {
      if (statusModal) statusModal.style.display = 'none';
    });
  }

  // Close modals on overlay backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === seatModal) closeSeatModal();
    if (e.target === trailerModal) window.closeTrailer();
    if (e.target === ticketModal) closeTicketModal();
    if (e.target === statusModal) statusModal.style.display = 'none';
  });
});
