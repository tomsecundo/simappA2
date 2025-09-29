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
      let user;

      if (req.user.role === "Mentor") {
        user = await Mentor.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { firstName, lastName, email, number, expertise, affiliation, address, password } = req.body;
        
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.number = number || user.number;
        user.expertise = expertise || user.expertise;
        user.affiliation = affiliation || user.affiliation;
        user.address = address || user.address;
        if (password) user.password = password;

      } else {
        user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
      
        const { name, email, role, university, address } = req.body;

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.university = university || user.university;
        user.address = address || user.address;
      }
        const updatedUser = await user.save();

        res.json({ 
          id: updatedUser.id, 
          role: updatedUser.role, 
          token: generateToken({id: updatedUser.id, role: updatedUser.role}),
          ...updatedUser.toObject(),
        });

      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    };

module.exports = { updateUserProfile, getProfile, getUsers };
