class Application {
    constructor({ applicationId, applicationEmail, applicationPhone, program, startupName, description, status, createdBy }) {
        if (!applicationEmail || !applicationPhone || !program || !startupName || !createdBy) {
            throw new Error("Missing required fields");
        }

        this.applicationId = applicationId;
        this.applicationEmail = applicationEmail.trim();
        this.applicationPhone = applicationPhone.trim();
        this.program = program;
        this.startupName = startupName.trim();
        this.description = description;
        this.status = status || "Pending";
        this.createdBy = createdBy;
    }
}

module.exports = Application;