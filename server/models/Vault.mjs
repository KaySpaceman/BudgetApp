/* eslint-disable func-names, object-curly-newline, no-use-before-define */
import mongoose from 'mongoose';

const vaultSchema = new mongoose.Schema({
  _id: { type: mongoose.ObjectId },
  Name: { type: String },
  Goal: { type: Number, required: true },
  Balance: { type: Number, default: 0, min: 0, required: true },
  Color: { type: String },
  Parent: { type: mongoose.ObjectId, ref: 'Vault' },
  Children: { type: Array },
  IsBuffer: { type: Boolean },
});

vaultSchema.methods.toJSON = function () {
  return {
    id: this.id,
    Name: this.Name,
    Goal: this.Goal,
    Balance: this.Balance,
    Color: this.Color,
    Parent: this.Parent ? this.Parent.toString() : null,
    Children: this.Children.length ? this.Children : [],
    IsBuffer: this.IsBuffer,
  };
};

vaultSchema.virtual('id').set(function (newId) {
  try {
    this._id = new mongoose.Types.ObjectId(newId);
  } catch (e) {
    // New id was invalid. Don't change model's _id
  }
});

export default mongoose.model('Vault', vaultSchema, 'Vaults');
