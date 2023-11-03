const { MongoClient } = require('mongodb');
const { trainTestSplit } = require('scikit-learn');
const { precisionScore, recallScore, f1Score } = require('scikit-learn');

const url =
  'mongodb+srv://saber:mOsNq8rNL3HTHg8G@cluster0.7kjglo0.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url, { useNewUrlParser: true });

client.connect(async (err) => {
  if (err) {
    console.log(err);
    return;
  }

  const database = client.db('<database>');
  const ratings = database.collection('ratings');

  const cursor = ratings.find({});
  const data = [];

  await cursor.forEach((doc) => {
    const user = doc.user;
    const item = doc.item;
    const score = doc.score;
    data.push([user, item, score]);
  });

  const [trainData, testData] = trainTestSplit(data, { test_size: 0.2 });

  const recommendationMatrix = buildRecommendationMatrix(trainData);

  const trueValues = [];
  const predictedValues = [];

  for (let i = 0; i < testData.length; i++) {
    const user = testData[i][0];
    const item = testData[i][1];
    const score = testData[i][2];

    trueValues.push(score);
    predictedValues.push(recommendationMatrix[user][item]);
  }

  const precision = precisionScore(trueValues, predictedValues);
  console.log(`Precision: ${precision}`);

  const recall = recallScore(trueValues, predictedValues);
  console.log(`Recall: ${recall}`);

  const f1 = f1Score(trueValues, predictedValues);
  console.log(`F1 Score: ${f1Score}`);
});

const FeedbackSchema = new mongoose.Schema({
  userId: String,
  itemId: String,
  helpful: Boolean,
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

async function recommend(userId) {
  const userRatings = await Rating.find({ userId });

  // Calculate recommendations as before

  const recommendedItems = calculateRecommendations(userRatings);

  // Get user feedback on recommended items
  const feedback = await Feedback.find({ userId });

  const helpfulItems = feedback
    .filter((f) => f.helpful === true)
    .map((f) => f.itemId);

  const unhelpfulItems = feedback
    .filter((f) => f.helpful === false)
    .map((f) => f.itemId);

  // Adjust scores based on feedback
  recommendedItems.forEach((item) => {
    if (helpfulItems.includes(item._id)) {
      item.score *= 1.1; // Increase score by 10% for helpful items
    } else if (unhelpfulItems.includes(item._id)) {
      item.score *= 0.9; // Decrease score by 10% for unhelpful items
    }
  });

  // Sort by adjusted scores
  recommendedItems.sort((a, b) => b.score - a.score);

  return recommendedItems;
}