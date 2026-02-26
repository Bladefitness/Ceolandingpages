// Script to generate a test roadmap by calling the tRPC API directly

const API_URL = 'http://localhost:3000/api/trpc';

// Sample quiz answers that will generate a complete roadmap
const testAnswers = {
  firstName: "Test",
  currentRevenue: "$50K-$90K",
  mainOffer: "Botox & Fillers",
  leadSource: "Organic social media",
  monthlyLeads: "25-50",
  conversionRate: "25-50%",
  avgClientValue: "$500-$1,000",
  systemsInPlace: ["CRM", "Email marketing"],
  biggestChallenge: "Lead generation",
  marketingBudget: "$1K-$5K",
  teamSize: "Just me",
  growthGoal: "Double revenue in 12 months"
};

async function generateTestRoadmap() {
  try {
    console.log('Generating test roadmap...');
    
    const response = await fetch(`${API_URL}/roadmap.generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: { answers: testAnswers }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Roadmap generated successfully!');
    console.log('Roadmap ID:', data.result.data.json.id);
    console.log('Dashboard URL: http://localhost:3000/dashboard/' + data.result.data.json.id);
    console.log('\nScores:');
    console.log('- Overall:', data.result.data.json.overallScore);
    console.log('- Lead Generation:', data.result.data.json.leadGenerationScore);
    console.log('- Offer Clarity:', data.result.data.json.offerClarityScore);
    console.log('- Social Presence:', data.result.data.json.socialPresenceScore);
    console.log('- Conversion:', data.result.data.json.conversionScore);
    
    return data.result.data.json;
  } catch (error) {
    console.error('❌ Error generating roadmap:', error.message);
    throw error;
  }
}

generateTestRoadmap();
