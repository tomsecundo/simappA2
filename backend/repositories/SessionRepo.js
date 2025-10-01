const SessionModel = require("../models/SessionModel");
const Session = require("../domain/SessionDomain");

class SessionRepo {
    async create(session) {
        const data = new SessionModel({
        applicationName: session.applicationName,
        mentorfirstName: session.mentorfirstName,
        mentorlastName: session.mentorlastName,
        sessionDate: session.sessionDate,
        });

        const saved = await data.save();
        return new Session({
        id: saved._id.toString(),
        applicationName: saved.applicationName,
        mentorfirstName: saved.mentorfirstName,
        mentorlastName: saved.mentorlastName,
        sessionDate: saved.sessionDate
        });
    }

    async findById(id) {
        const doc = await SessionModel.findById(id);
        if (!doc) return null;

        return new Session({
        id: doc._id.toString(),
        applicationName: doc.applicationName,
        mentorfirstName: doc.mentorfirstName,
        mentorlastName: doc.mentorlastName,
        sessionDate: doc.sessionDate
        });
    }

    async findAll() {
        const docs = await SessionModel.find();
        return docs.map(
            (doc) => new Session({
                id: doc._id.toString(),
                applicationName: doc.applicationName,
                mentorfirstName: doc.mentorfirstName,
                mentorlastName: doc.mentorlastName,
                sessionDate: doc.sessionDate
            })
        );
    }

    async update(id, updates) {
        const doc = await SessionModel.findByIdAndUpdate(id, updates, { new: true });
        if (!doc) return null;

        return new Session({
        id: doc._id.toString(),
        applicationName: doc.applicationName,
        mentorfirstName: doc.mentorfirstName,
        mentorlastName: doc.mentorlastName,
        sessionDate: doc.sessionDate
        });
    }

    async delete(id) {
        return SessionModel.findByIdAndDelete(id);
    }
}

module.exports = new SessionRepo(); // Singleton instance
