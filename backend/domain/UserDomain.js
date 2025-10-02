class User {
    constructor({ _id, id, name, email, role, password, number, affiliation, address }) {
        if (!name || !email || !role ) {
            throw new Error("Missing required fields for User");
        }

        this.id = id || _id || null;
        this.name = name.trim();
        this.email = email;
        this.role = role;

        if (password) {
            this.password = password;
        }

        this.number = number || undefined;
        this.affiliation = affiliation || '';
        this.address = address || '';
    }
}

module.exports = User;
