const createContact = async (user) => {
  try {
    const response = await instance.contacts.create({
      name: user.name,
      email: user.email,
      contact: user.phone,
      type: "employee", // or "customer", "vendor"
    });
    return response.id; // Save this contact ID
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

const createFundAccount = async (contactId, bankDetails) => {
  try {
    const response = await instance.fundAccounts.create({
      contact_id: contactId,
      account_type: "bank_account",
      bank_account: {
        name: bankDetails.accountHolderName,
        ifsc: bankDetails.ifscCode,
        account_number: bankDetails.accountNumber,
      },
    });
    return response.id; // Save this fund account ID
  } catch (error) {
    console.error("Error creating fund account:", error);
    throw error;
  }
};

const initiatePayout = async (fundAccountId, amount) => {
  try {
    const response = await instance.payouts.create({
      account_number: "YOUR_RAZORPAY_ACCOUNT_NUMBER", // Required
      fund_account_id: fundAccountId,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      mode: "IMPS", // Or NEFT, RTGS
      purpose: "payout",
      queue_if_low_balance: true,
    });
    return response;
  } catch (error) {
    console.error("Error processing payout:", error);
    throw error;
  }
};
module.exports = {
  createContact,
  initiatePayout,
  createFundAccount,
};
