class Program {
    constructor({ id, title, description, startDate, endDate }) {
        if (!title || title.trim().length < 3) {
        throw new Error("Program title must be at least 3 characters long");
        }
        if (new Date(startDate) >= new Date(endDate)) {
        throw new Error("Program start date must be before end date");
        }

        this.id = id;
        this.title = title.trim();
        this.description = description || "";
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
    }

    durationInDays() {
        const ms = this.endDate - this.startDate;
        return Math.ceil(ms / (1000 * 60 * 60 * 24));
    }

    updateDetails({ title, description, startDate, endDate }) {
        if (title && title.trim().length >= 3) {
        this.title = title.trim();
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
