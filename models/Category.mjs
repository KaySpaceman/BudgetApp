import mongoose from 'mongoose';


const Category = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: String,
  Parent: mongoose.ObjectId,
});

export default mongoose.model('Category', Category, 'Categories');
