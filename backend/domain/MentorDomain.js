const { UserRole } = require("../models/UserModel");
const User = require ("./UserDomain");
class Mentor extends User {
    constructor({ _id, id, name, firstName, lastName, email, number, 
        password, expertise, role, affiliation, address, programs }) {
        
        super({ _id, id, name, email, password, role, number, affiliation,address });

        this.firstName = firstName;
        this.lastName = lastName;
        this.expertise = expertise || '';
        this.programs = programs ||  [];
    }
}

module.exports = Mentor;