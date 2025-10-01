class Mentor {
    constructor({ id, expertise = [], affiliation, programs }) {
        this.id = id || null;
        this.expertise = expertise;
        this.affiliation = affiliation;
        this.programs = programs;
    }
}

module.exports = Mentor;