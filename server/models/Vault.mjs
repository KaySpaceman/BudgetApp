/* eslint-disable func-names */
import mongoose from 'mongoose';

const vaultSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: { type: String },
  Goal: { type: Number, required: true },
  Balance: { type: Number, default: 0, min: 0, required: true },
  Parent: { type: mongoose.ObjectId, ref: 'Vault' },
  Children: { type: Array },
  IsBuffer: { type: Boolean },
});

vaultSchema.methods.toJSON = function () {
  return {
    id: this.id,
    Name: this.Name,
    Parent: this.Parent ? this.Parent.toString() : null,
    Type: this.Type,
    Children: this.Children,
    Level: this.Level,
    IsSystem: this.IsSystem,
  };
};

export default mongoose.model('Vault', vaultSchema, 'Vaults');
