class User {
    constructor({ name, email, role, password, number, affiliation, address }) {
        if (!name || !email || !role || !password) {
            throw new Error("Missing required fields for User");
        }
        this.name = name.trim();
        this.email = email;
        this.role = role;
        this.password = password;
        this.number = number;
        this.affiliation = affiliation;
        this.address = address;
    }
}

module.exports = User;
