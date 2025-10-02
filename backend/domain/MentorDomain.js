const { UserRole } = require("../models/UserModel");
const User = require ("./UserDomain");
class Mentor extends User {
    constructor({ name = '', firstName, lastName, email, number, 
        password, expertise, affiliation, address, programs }) {
        
        super({ name, email, password, role: UserRole.MENTOR });

        this.firstName = firstName;
        this.lastName = lastName;
        this.number = number || '';
        this.expertise = expertise || '';
        this.affiliation = affiliation || '';
        this.address = address || '';
        this.programs = programs ||  [];
    }
}

module.exports = Mentor;