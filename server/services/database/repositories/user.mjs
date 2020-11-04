import mongoose from 'mongoose';
import User from '../../../models/User.mjs';

export async function getUsers() {
  return User.find({})
    .exec();
}

export async function getUserById(userId) {
  const id = userId instanceof mongoose.Types.ObjectId
    ? userId : new mongoose.Types.ObjectId(userId);

  if (!id) throw new Error('Invalid user id value');

  return User.findOne({ _id: id })
    .exec();
}

export async function createUser(user) {
  const userModel = user instanceof User ? user : new User(user);

  if (!userModel) throw new Error('Invalid user data');

  const newUserModel = await userModel.set({ _id: new mongoose.Types.ObjectId() })
    .save();

  if (!newUserModel) throw new Error('Failed to create new user');

  return newUserModel;
}

export async function updateUser(user) {
  let userModel = user;

  if (!(userModel instanceof User)) {
    userModel = await getUserById(user.id);
    userModel.set(user);
  }

  if (!userModel) throw new Error('User doesn\'t exists');

  const updatedUser = await userModel.save();

  if (!updatedUser) throw new Error('Failed to update user data');

  return updatedUser;
}

export async function deleteUserById(userId) {
  const id = userId instanceof mongoose.Types.ObjectId
    ? userId : new mongoose.Types.ObjectId(userId);

  if (!id) throw new Error('Invalid user id value');

  return User.deleteOne({ _id: id })
    .exec();
}
