import mongoose from 'mongoose';
import User from '../../../models/User.mjs';

export async function getUsers() {
  return User.find({})
    .exec();
}

export async function getUserById(userId) {
  let id = userId;

  if (!(userId instanceof mongoose.Types.ObjectId)) {
    try {
      id = new mongoose.Types.ObjectId(userId);
    } catch (e) {
      throw new Error('Invalid user id value');
    }
  }

  return User.findOne({ _id: id })
    .exec();
}

export async function createUser(user) {
  let userModel = user;

  if (!(user instanceof User)) {
    userModel = new User(user);

    if (!userModel) {
      throw new Error('Invalid user data');
    }
  }

  const newUserModel = await userModel.set({ _id: new mongoose.Types.ObjectId() })
    .save();

  if (!newUserModel) throw new Error('Failed to create new user');

  return newUserModel;
}

export async function updateUser(user) {
  const userModel = await getUserById(user.id);

  if (!userModel) {
    throw new Error('User doesn\'t exists');
  }

  const updatedVault = await userModel.set(user)
    .save();

  if (!updatedVault) throw new Error('Failed to update user data');

  return updatedVault;
}

export async function deleteUserById(userId) {
  let id = userId;

  if (!(userId instanceof mongoose.Types.ObjectId)) {
    id = new mongoose.Types.ObjectId(userId);

    if (!id) {
      throw new Error('Invalid user id value');
    }
  }

  return User.deleteOne({ _id: id })
    .exec();
}
