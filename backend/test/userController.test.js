const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const userController = require('../controllers/userController');
const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const { UserRole } = require('../models/UserModel');
const UserFactory = require('../domain/factory/UserFactory');

const { expect } = chai;

describe('UserController Tests', () => {
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

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { _id: new mongoose.Types.ObjectId(), name: 'Alice', email: 'a@test.com', role: UserRole.ADMIN, toObject() { return this; } },
                { _id: new mongoose.Types.ObjectId(), name: 'Bob', email: 'b@test.com', role: UserRole.STARTUP, toObject() { return this; } }
            ];

            sinon.stub(UserRepo, 'findAll').resolves(mockUsers);
            sinon.stub(UserFactory, 'createUser').callsFake(u => ({ id: u._id.toString(), ...u }));

            await userController.getAllUsers(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.be.an('array').with.length(2);
        });
    });

    describe('getProfile', () => {
        it('should return user profile for startup user', async () => {
            req.user = { _id: new mongoose.Types.ObjectId() };
            const fakeUser = {
                _id: req.user._id,
                name: 'Charlie',
                email: 'c@test.com',
                role: UserRole.STARTUP,
                toObject: function () { return this; }
            };

            sinon.stub(UserRepo, 'findById').resolves(fakeUser);
            sinon.stub(UserFactory, 'createUser').returns({ id: fakeUser._id.toString(), name: 'Charlie' });

            await userController.getProfile(req, res);

            expect(res.json.calledOnceWithMatch({ id: fakeUser._id.toString(), name: 'Charlie' })).to.be.true;
        });
    });

    describe('getUserById', () => {
        it('should return 404 if user not found', async () => {
            req.params.id = new mongoose.Types.ObjectId().toString();
            sinon.stub(UserRepo, 'findById').resolves(null);

            await userController.getUserById(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWithMatch({ message: 'User not Found' })).to.be.true;
        });
    });
});
