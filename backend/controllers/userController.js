const User = require('../domain/UserDomain');
const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const { UserRole } = require('../models/UserModel');

class UserController {   
    async getAllUsers(req, res, next) {
        // try {
        //     if (req.query.role === 'Mentor') {
        //     const mentors = await Mentor.find({}).select('-password');
        //     if (mentors.length) return res.json(mentors);
            
        //     const userMentors = await User.find({role: 'Mentor'}).select('-password');
        //     return res.json(userMentors);
        // }

        // const users = await User.find({role:'Mentor'}).select('-password');
        //     return res.json(users);
        //     } catch (err) {
        //         return res.status(500).json({message: 'Server error'});
        // }
        try {
            const users = await UserRepo.findAll();
            res.json(users);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            next(error);
        }
    }

    async getProfile(req, res, next) {
        //     try {
        //         // let user; 

        //         // if (req.user.role === "Mentor") {
        //         //     user = await Mentor.findById(req.user._id).select('-password');
        //         // } else {
        //         //     user = await User.findById(req.user._id).select('-password');
        //         // }

        //         // if (!user) {
        //         //     return res.status(404).json({ message: 'User not found' });
        //         // }
        //         // const user = await User.findById(req.user._id).select('-password');
        //         if(!req.user) return res.status(401).json({ message: 'Not authorized' });

        //         const user = await UserRepo.findById(req.user._id);
        //         res.json(user);

        //     } catch (error) {
        //         res.status(500).json({ message: 'Failed to get profile', error: error.message });
        //     }
        try {
            if (!req.user) return res.status(401).json({ message: 'Not authorized' });

            const user = await UserRepo.findById(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // If mentor profile
            if (user.role === UserRole.MENTOR) {
                const mentor = await MentorRepo.findById(user._id);
                return res.json({
                    ...user.toObject(),
                    expertise: mentor?.expertise || null,
                    programs: mentor?.programs || [],
                });
            }

            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    async getUserById(req, res, next) {
        try {
            // const {id} = req.params;

            // if (req.user.role !== 'Admin' && req.user._id.toString() !==id) {
            // return res.status(403).json({message: 'Admin/Mentor Only Access'});
            // }

            const user = await UserRepo.findById(req.params.id);
            // let user  = await Mentor.findById(id).select('-password');

            // if (!user) user = await User.findById(id).select('-password');
            if (!user) return res.status(404).json({message:'User not Found'});

            // if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
            // return res.status(403).json({ message: 'Access denied' });
            // }

            res.json(user);
        } catch (error) {
            // return res.status(500).json({message: error.message});
            next(error);
        }
    };

    async updateUserProfile(req, res, next) {
        try {
            const updatedUser = await UserRepo.updateById(req.user._id, req.body);
            
            res.json(updatedUser);

            // const targetId = 
            //     req.user.role === 'Admin' && req.body.id ? req.body.id : req.user._id;
            
            // let user = await Mentor.findById(targetId);
            // if (user) {

            //     const { firstName, lastName, email, number, expertise, affiliation, address, password } = req.body;
                
            //     user.firstName = firstName || user.firstName;
            //     user.lastName = lastName || user.lastName;
            //     user.email = email || user.email;
            //     user.number = number || user.number;
            //     user.expertise = expertise || user.expertise;
            //     user.affiliation = affiliation || user.affiliation;
            //     user.address = address || user.address;
            //     if (password) user.password = password;

            // } else {
            //     user = await User.findById(targetId);
            //     if (!user) return res.status(404).json({ message: 'User not found' });
            
            //     const { name, email, role, university, address } = req.body;

            //     user.name = name || user.name;
            //     user.email = email || user.email;
            //     user.role = role || user.role;
            //     user.university = university || user.university;
            //     user.address = address || user.address;
            // }

            // const updatedUser = await user.save();

            // res.json({ 
            // id: updatedUser.id, 
            // role: updatedUser.role, 
            // ...updatedUser.toObject(),
            // });

        } catch (error) {
            // res.status(500).json({ message: error.message });
            next(error);
        }
    };

    // const deleteUser = async (req,res) => {
    //     try {
    //         if(!req.user) return res.status(401).json({message: 'Unauthorized'});
    //         if (req.user.role !== 'Admin') {
    //             return res.status(403).json({message: 'Admin access only'});
    //         }

    //         const {id} = req.params;
    //         if (!mongoose.Types.ObjectId.isValid(id)) {
    //         return res.status(400).json({message: 'Invalid id'});
    //         }

    //         const mentor = await Mentor.findById(id);
    //         if (mentor) {
    //             await Mentor.deleteOne({_id: id});
    //             return res.status(200).json({_id: id, deleted: true, source: 'Mentor'});
    //         }

    //         const user = await User.findById(id);
    //         if (!user) return res.status(404).json({message: 'User not found'});
    //         if (user.role !== 'Mentor') {
    //             return res.status(400).json({message: 'Not a mentor account'});
    //         }

    //         await User.deleteOne({_id: id});
    //         return res.status(200).json({_id: id, deleted: true, source: 'User'});
    //     } catch (err) {
    //         return res.status(500).json({message: 'Server Error'});
    //     }
    // };
}

// module.exports = { updateUserProfile, getProfile, getUsers, getUserById, deleteUser, };
module.exports = new UserController();