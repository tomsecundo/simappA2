class Session {
    constructor({ id, applicationName, mentorfirstName, mentorlastName, sessionDate }) {
        this.id = id;
        this.applicationName = applicationName;
        this.mentorfirstName = mentorfirstName;
        this.mentorlastName = mentorlastName;
        this.sessionDate = new Date(sessionDate);
    }

    updateDetails({ sessionDate } = {}) {
        if(!sessionDate) {
            throw new Error ("Session Date must be provided.");
        }

        const updated = new Date(sessionDate);

        if(this.sessionDate && this.sessionDate.getTime() === updated.getTime()){
            throw new Error ("New session date must be different from the current session date.")
        }

        this.sessionDate = updated; 
    }

    isActive() {
        const now = new Date();
        return now >= this.sessionDate;
    }
}

module.exports = Session;
