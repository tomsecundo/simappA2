const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const mentorController = require('../controllers/mentorController');
const MentorRepo = require('../repositories/MentorRepo');
const MentorFactory = require('../domain/factories/MentorFactory');
const { UserRole } = require('../models/UserModel');

const { expect } = chai;

describe('MentorController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, user: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('create', () => {
        it('should create a mentor and return it', async () => {
            req.body = { name: 'Alice', email: 'a@test.com', expertise: 'AI' };

            const fakeMentor = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Alice',
                email: 'a@test.com',
                role: UserRole.MENTOR,
                toObject() { return this; }
            };

            sinon.stub(MentorRepo, 'create').resolves(fakeMentor);
            sinon.stub(MentorFactory, 'createMentor').returns({ id: fakeMentor._id.toString(), name: 'Alice' });

            await mentorController.create(req, res);

            expect(res.status.calledOnceWith(201)).to.be.true;
            expect(res.json.calledOnceWithMatch({ id: fakeMentor._id.toString(), name: 'Alice' })).to.be.true;
        });
    });

    describe('getAll', () => {
        it('should return all mentors', async () => {
            const fakeMentors = [
                { _id: new mongoose.Types.ObjectId(), name: 'M1', toObject() { return this; } },
                { _id: new mongoose.Types.ObjectId(), name: 'M2', toObject() { return this; } }
            ];

            sinon.stub(MentorRepo, 'findAll').resolves(fakeMentors);
            sinon.stub(MentorFactory, 'createMentors').returns([
                { id: fakeMentors[0]._id.toString(), name: 'M1' },
                { id: fakeMentors[1]._id.toString(), name: 'M2' }
            ]);

            await mentorController.getAll(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.be.an('array').with.length(2);
        });
    });

    describe('getProfile', () => {
        it('should return 401 if not authorized', async () => {
            req.user = null;

            await mentorController.getProfile(req, res);

            expect(res.status.calledOnceWith(401)).to.be.true;
            expect(res.json.calledOnceWithMatch({ message: 'Not authorized' })).to.be.true;
        });
    });
});
