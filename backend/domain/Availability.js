class Availability {
  constructor({ id, startDate, endDate }) {
    if (new Date(startDate) >= new Date(endDate)) {
      throw new Error("Availability start date must be before end date");
    }

    this.id = id;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  durationInDays() {
    const ms = this.endDate - this.startDate;
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  updateDetails({ startDate, endDate }) {
    if (startDate && endDate && new Date(startDate) < new Date(endDate)) {
      this.startDate = new Date(startDate);
      this.endDate = new Date(endDate);
    } else if (startDate || endDate) {
      throw new Error("Both start and end dates must be provided and valid");
    }
  }

  isActive() {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }
}

module.exports = Availability;