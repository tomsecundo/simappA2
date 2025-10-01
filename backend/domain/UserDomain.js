class User {
    constructor({ name, email, role, password }) {
        if (!name || !email || !role || !password) {
            throw new Error("Missing required fields for User");
        }
        this.name = name.trim();
        this.email = email.trim();
        this.role = role;
        this.password = password;
    }
}

module.exports = User;
