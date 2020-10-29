import mongoose from 'mongoose';
import User from '../../../models/User.mjs';

export async function getUsers() {
  return User.find({})
    .exec();
}

export async function getUserById(userId) {
  // if (!(userId instanceof mongoose.Types.ObjectId)) {
    // eslint-disable-next-line no-param-reassign
    // userId = new mongoose.Types.ObjectId(userId);
  // }

  return User.findOne({ _id: userId })
    .exec();
}

export async function createUser(formData) {
  // TODO: Add data validation
  const userData = {
    ...formData,
    _id: new mongoose.Types.ObjectId(),
  };
  const newUser = await new User(userData).save();

  if (!newUser) throw new Error('Failed to create new user');

  return newUser;
}

export async function updateUser(user) {
  if (!(user instanceof User)) {
    const id = new mongoose.Types.ObjectId(user._id || user.id);
    // eslint-disable-next-line no-param-reassign
    user = await User.findOne({ _id: id }); // TODO: Remove once switched to using models

    if (!user) {
      throw new Error('User doesn\'t exists');
    }

    user.set(user);
  }

  const updatedUser = await user.save();

  if (!updatedUser) {
    throw new Error('Failed to update user data');
  }

  return updatedUser;
}
