// Export 1: The Transcript Data
export const MOCK_TRANSCRIPT = [
  {
    id: 1,
    speaker: "Agent",
    startTime: 0.5,
    endTime: 3.2,
    text: "Good morning, this is Sarah from Universal Bank. Am I speaking with Mr. Rahul Sharma?"
  },
  {
    id: 2,
    speaker: "Customer",
    startTime: 3.5,
    endTime: 5.0,
    text: "Yes, this is Rahul speaking."
  },
  {
    id: 3,
    speaker: "Agent",
    startTime: 5.2,
    endTime: 9.0,
    text: "Thank you. I am calling regarding the outstanding payment of 45,000 rupees on your credit card."
  },
  {
    id: 4,
    speaker: "Customer",
    startTime: 9.5,
    endTime: 14.0,
    text: "I know, I know. I am currently facing a cash flow issue. I can pay by next Tuesday."
  },
  {
    id: 5,
    speaker: "Agent",
    startTime: 14.2,
    endTime: 18.0,
    text: "I understand. I will mark a 'Promise to Pay' for next Tuesday in our system. Thank you."
  }
];

// Export 2: The Insights Data
export const MOCK_INSIGHTS = {
  riskScore: 78,
  sentiment: "Distressed",
  compliance: {
    disclaimerGiven: true,
    abusiveLanguage: false,
    rightPartyContact: true
  },
  entities: [
    { type: "MONEY", value: "₹45,000", context: "Outstanding" },
    { type: "DATE", value: "Next Tuesday", context: "Promise to Pay" },
    { type: "PRODUCT", value: "Credit Card", context: "Gold Tier" }
  ]
};