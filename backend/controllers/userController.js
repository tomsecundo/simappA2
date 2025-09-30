const mongoose = require('mongoose');
const { User, Mentor } = require('../models/UserModel');

const getUsers = async (req,res) => {
  try {
    if (req.query.role === 'Mentor') {
      const mentors = await Mentor.find({}).select('-password');
      if (mentors.length) return res.json(mentors);
      
      const userMentors = await User.find({role: 'Mentor'}).select('-password');
      return res.json(userMentors);
  }

  const users = await User.find({role:'Mentor'}).select('-password');
  return res.json(users);
  } catch (err) {
    return res.status(500).json({message: 'Server error'});
  }
};

const getUserById = async (req,res) => {
  try {
    const {id} = req.params;

    if (req.user.role !== 'Admin' && req.user._id.toString() !==id) {
      return res.status(403).json({message: 'Admin/Mentor Only Access'});
    }

    let user  = await Mentor.findById(id).select('-password');
    if (!user) user = await User.findById(id).select('-password');

    if (!user) return res.status(404).json({message:'User not Found'});
    res.json(user);
  } catch (e) {
      return res.status(500).json({message: 'Server error'});
    }
  };


const getProfile = async (req, res) => {
  try {
    let user; 

    if (req.user.role === "Mentor") {
      user = await Mentor.findById(req.user._id).select('-password');
    } else {
      user = await User.findById(req.user._id).select('-password');
    }

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
    try {
      
      const targetId = 
        req.user.role === 'Admin' && req.body.id ? req.body.id : req.user._id;
      
      let user = await Mentor.findById(targetId);
      if (user) {

        const { firstName, lastName, email, number, expertise, affiliation, address, password } = req.body;
        
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.number = number || user.number;
        user.expertise = expertise || user.expertise;
        user.affiliation = affiliation || user.affiliation;
        user.address = address || user.address;
        if (password) user.password = password;

        const updatedUser = await user.save();
        const obj = updatedUser.toObject(); delete obj.password;
        return res.json({_id: updatedUser._id.toString(), id: updatedUser.id, role: updatedUser.role, ...obj});

      } 
      user = await User.findById(targetId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      const { name, email, role, university, address, password, firstName, lastName, number, expertise, affiliation } = req.body;

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.university = university || user.university;
        user.address = address || user.address;
        if (password) user.password = password;

        const updatedUser = await user.save();

        if(updatedUser.role === 'Mentor') {
          const f = firstName ?? (updatedUser.name?.split(' ')[0]||'');
          const l = lastName ?? (updatedUser.name?.split(' ').slice(1).join(' ') || '');

          const update = {
              $set: {
                role: 'Mentor',
                email: updatedUser.email,
                password: updatedUser.password,
                firstName: f,
                lastName: l,
                expertise,
                affiliation,
                address: updatedUser.address
              },

              $setOnInsert: {
                number: number || `AUTO-${updatedUser._id.toString().slice(-6)}`
              }
            };
            if (number) update.$set.number = number;

            try{
            await Mentor.findOneAndUpdate(
              {email: updatedUser.email},
              update,
              { upsert: true, new: true}
          );
        } catch (e) {

          if (e?.code === 11000) {
            return res.status(400).json({message: 'Duplicate email/number'});
          }
            throw e;
        }
      }

        const obj = updatedUser.toObject(); delete obj.password;
        return res.json({ _id: updatedUser._id.toString(), id: updatedUser.id, role: updatedUser.role, ...obj});

      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    };

const deleteUser = async (req,res) => {
    try {
        if(!req.user) return res.status(401).json({message: 'Unauthorized'});
        if (req.user.role !== 'Admin') {
            return res.status(403).json({message: 'Admin access only'});
        }

        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({message: 'Invalid id'});
        }

        const mentor = await Mentor.findById(id);
        if (mentor) {
            await Mentor.deleteOne({_id: id});
            return res.status(200).json({_id: id, deleted: true, source: 'Mentor'});
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({message: 'User not found'});
        if (user.role !== 'Mentor') {
            return res.status(400).json({message: 'Not a mentor account'});
        }

        await User.deleteOne({_id: id});
        return res.status(200).json({_id: id, deleted: true, source: 'User'});
    } catch (err) {
        return res.status(500).json({message: 'Server Error'});
    }
};

module.exports = { updateUserProfile, getProfile, getUsers, getUserById, deleteUser,};
