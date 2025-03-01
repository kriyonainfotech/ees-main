// const Razorpay = require("razorpay");

// var instance = new Razorpay({
//   key_id: "rzp_test_15Itqkn7OjvmAs",
//   key_secret: "GFLdR8VKGomGo82s37TZ0B2R",
// });
const { Parser } = require("json2csv");

// Function to calculate GST
const calculateGST = (amount) => {
  const gst = amount * 0.18;
  return {
    totalGST: gst.toFixed(2),
    cgst: (gst / 2).toFixed(2), // CGST 9%
    sgst: (gst / 2).toFixed(2), // SGST 9%
  };
};

const generateCSV = (payments) => {
  const transactions = payments.map((p) => {
    const { totalGST, cgst, sgst } = calculateGST(p.amount / 100);
    return {
      transaction_id: p.id,
      amount: (p.amount / 100).toFixed(2),
      gst: totalGST,
      cgst,
      sgst,
      status: p.status,
      date: new Date(p.created_at * 1000).toISOString(),
      mode: p.method,
      reference: p.acquirer_data?.reference_id || "-",
      description: p.notes?.description || "-",
    };
  });

  const parser = new Parser({ fields: Object.keys(transactions[0]) });
  return parser.parse(transactions);
};

module.exports = generateCSV;
