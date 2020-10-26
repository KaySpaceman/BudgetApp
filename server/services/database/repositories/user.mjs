import User from '../../../models/User.mjs';

export async function getUsers() {
  return User.find({})
    .exec();
}

export async function getUserById(userId) {
  return User.findOne({ _id: userId })
    .exec();
}
