/**
 * MOHASINA SIDDIKA Online Movie Ticket Booking System
 * Seat Picker & Pricing Engine
 */

class SeatPicker {
  constructor({ containerId, onSelectionChange }) {
    this.container = document.getElementById(containerId);
    this.onSelectionChange = onSelectionChange;
    this.selectedSeats = new Map(); // seatId -> { id, label, type, price }
    this.seatsData = [];
    this.basePrice = 250;
    this.maxSeats = 6;
  }

  init(seats, basePrice = 250) {
    this.seatsData = seats;
    this.basePrice = Number(basePrice) || 250;
    this.selectedSeats.clear();
    this.render();
    this.notify();
  }

  calculatePrice(type) {
    if (type === 'premium') return Math.round(this.basePrice * 1.20);
    if (type === 'vip') return Math.round(this.basePrice * 1.50);
    return Math.round(this.basePrice);
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    // Group seats by row_label
    const rowsMap = new Map();
    this.seatsData.forEach(seat => {
      const row = seat.row_label;
      if (!rowsMap.has(row)) {
        rowsMap.set(row, []);
      }
      rowsMap.get(row).push(seat);
    });

    // Render each row
    rowsMap.forEach((seatsInRow, rowLabel) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'seat-row';

      // Row indicator label
      const labelSpan = document.createElement('span');
      labelSpan.className = 'row-label';
      labelSpan.textContent = rowLabel;
      rowDiv.appendChild(labelSpan);

      // Seat buttons in row
      seatsInRow.sort((a, b) => a.seat_number - b.seat_number);
      seatsInRow.forEach(seat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `seat-btn ${seat.seat_type}`;
        btn.textContent = seat.seat_number;
        btn.title = `Seat ${seat.row_label}${seat.seat_number} - ${seat.seat_type.toUpperCase()} (₹${this.calculatePrice(seat.seat_type)})`;

        if (seat.is_booked) {
          btn.classList.add('booked');
          btn.disabled = true;
          btn.title += ' [SOLD OUT]';
        } else if (this.selectedSeats.has(seat.seat_id)) {
          btn.classList.add('selected');
        }

        btn.addEventListener('click', () => this.toggleSeat(seat));
        rowDiv.appendChild(btn);
      });

      // Right row indicator label for symmetry
      const labelSpanRight = document.createElement('span');
      labelSpanRight.className = 'row-label';
      labelSpanRight.textContent = rowLabel;
      rowDiv.appendChild(labelSpanRight);

      this.container.appendChild(rowDiv);
    });
  }

  toggleSeat(seat) {
    if (seat.is_booked) return;

    if (this.selectedSeats.has(seat.seat_id)) {
      this.selectedSeats.delete(seat.seat_id);
    } else {
      if (this.selectedSeats.size >= this.maxSeats) {
        alert(`You can select a maximum of ${this.maxSeats} seats per booking.`);
        return;
      }
      const price = this.calculatePrice(seat.seat_type);
      this.selectedSeats.set(seat.seat_id, {
        id: seat.seat_id,
        label: `${seat.row_label}${seat.seat_number}`,
        type: seat.seat_type,
        price
      });
    }

    this.render();
    this.notify();
  }

  notify() {
    const seatsArray = Array.from(this.selectedSeats.values());
    const count = seatsArray.length;
    const baseTotal = seatsArray.reduce((sum, s) => sum + s.price, 0);
    const taxAndFee = count > 0 ? Math.round(baseTotal * 0.18) : 0; // 18% GST / fee
    const grandTotal = baseTotal + taxAndFee;

    if (typeof this.onSelectionChange === 'function') {
      this.onSelectionChange({
        selectedSeats: seatsArray,
        count,
        baseTotal,
        taxAndFee,
        grandTotal
      });
    }
  }

  getSelectedSeatIds() {
    return Array.from(this.selectedSeats.keys());
  }

  getSelectedLabels() {
    return Array.from(this.selectedSeats.values()).map(s => s.label);
  }
}

window.SeatPicker = SeatPicker;
