/* eslint-disable func-names, object-curly-newline */
import mongoose from 'mongoose';

const vaultSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
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
    Children: this.Children,
    IsBuffer: this.IsBuffer,
  };
};

export default mongoose.model('Vault', vaultSchema, 'Vaults');
