import mongoose from 'mongoose';

// Line Item interface
interface LineItem {
  lineTotal: number;
  desc: string;
  qty: number;
  price: number;
  unit: string;
  payers: string[];
}

// Schema for line item within a receipt
const lineItemSchema = new mongoose.Schema({
  lineTotal: {
    type: Number,
  },
  desc: {
    type: String,
  },
  qty: {
    type: Number,
  },
  price: {
    type: Number,
  },
  unit: {
    type: String,
  },
  payers: {
    type: [String],
  },
});

// Receipt interface
interface Receipt {
  isClosed: boolean;
  creatorName: string;
  establishment: string;
  total: number;
  subtotal: number;
  cash: number;
  change: number;
  tax: number;
  tip: number;
  currency: string;
  lineItems: LineItem[];
}

const receiptSchema = new mongoose.Schema({
  isClosed:  {
    type: Boolean,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  establishment: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  cash: {
    type: Number,
    required: true,
  },
  change: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  tip: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  lineItems: {
    type: [lineItemSchema],
    required: true,
  },
});

const ReceiptModel = mongoose.model<Receipt>('Receipt', receiptSchema);
export default ReceiptModel;
