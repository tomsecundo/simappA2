class Program {
  constructor({ id, name, description, startDate, endDate }) {
    if (!name || name.trim().length < 3) {
      throw new Error("Program name must be at least 3 characters long");
    }
    if (new Date(startDate) >= new Date(endDate)) {
      throw new Error("Program start date must be before end date");
    }

    this.id = id;
    this.name = name.trim();
    this.description = description || "";
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  durationInDays() {
    const ms = this.endDate - this.startDate;
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  updateDetails({ name, description, startDate, endDate }) {
    if (name && name.trim().length >= 3) {
      this.name = name.trim();
    }
    if (description !== undefined) {
      this.description = description;
    }
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

module.exports = Program;
