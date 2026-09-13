/**
 * Mock quiz banks keyed by opaque lesson ID (e.g. "3-s4-l0").
 * Absence of a key = no quiz data → repository returns null → placeholder fallback.
 *
 * This is the prototype data source. UI components never import this file
 * directly — they obtain a QuizSpec through studentRepository.getQuizData(),
 * so swapping this for a backend (`GET /api/quizzes/:lessonId`) is a
 * repository-only change with no presentation impact.
 *
 * @typedef {object} QuizOption
 * @property {string} id Stable option ID ("a", "b", "c", "d").
 * @property {string} text Option label.
 *
 * @typedef {object} QuizQuestion
 * @property {string} id Stable question ID ("q1", "q2", ...).
 * @property {"single"|"multiple"|"true-false"} type
 * @property {string} text Question prompt.
 * @property {QuizOption[]} options
 * @property {string|string[]} correctAnswer
 *   - single / true-false: option id
 *   - multiple: array of option ids
 * @property {string} [explanation] Shown in results review.
 *
 * @typedef {object} QuizSpec
 * @property {number} passingScore 0-100 minimum to pass.
 * @property {number|null} maxAttempts null = unlimited; otherwise exactly N attempts.
 * @property {QuizQuestion[]} questions
 */
const quizzes = {
  "3-s2-l0": {
    passingScore: 60,
    maxAttempts: 3,
    questions: [
      {
        id: "q1",
        type: "single",
        text: "What is the primary purpose of BrowserRouter in a React Router app?",
        options: [
          { id: "a", text: "To style navigation links" },
          { id: "b", text: "To keep the UI in sync with the URL" },
          { id: "c", text: "To lazy-load route components" },
          { id: "d", text: "To manage global application state" },
        ],
        correctAnswer: "b",
        explanation:
          "BrowserRouter renders the matching route element for the current URL and updates it on navigation.",
      },
      {
        id: "q2",
        type: "multiple",
        text: "Which of the following are valid uses of the `to` prop on a <Link>? (Select all that apply.)",
        options: [
          { id: "a", text: "A relative path string like 'settings'" },
          { id: "b", text: "An absolute path string like '/settings'" },
          { id: "c", text: "An object with a pathname and optional search or state" },
          { id: "d", text: "A function that returns the next location" },
        ],
        correctAnswer: ["a", "b", "c"],
        explanation: "<Link to> accepts a string path or a location object.",
      },
      {
        id: "q3",
        type: "true-false",
        text: "A nested route's path is appended to its parent route's path.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correctAnswer: "a",
        explanation: "Nested route paths are resolved relative to and combined with their parent's path.",
      },
      {
        id: "q4",
        type: "single",
        text: "Given a route path of /courses/:courseId, which <Link> targets course 42?",
        options: [
          { id: "a", text: "<Link to=\"courses/42\">" },
          { id: "b", text: "<Link to=\"/courses/42\">" },
          { id: "c", text: "<Link to={42}>" },
          { id: "d", text: "Both A and B are correct" },
        ],
        correctAnswer: "b",
        explanation: "Absolute paths starting with / are unambiguous; relative paths work from the current URL.",
      },
      {
        id: "q5",
        type: "single",
        text: "What element should wrap route outlets so layout is shared across child routes?",
        options: [
          { id: "a", text: "<Routes>" },
          { id: "b", text: "<Router>" },
          { id: "c", text: "<Outlet>" },
          { id: "d", text: "<Route>" },
        ],
        correctAnswer: "c",
        explanation: "A parent route renders an <Outlet> where its matched child route elements appear.",
      },
    ],
  },
  "3-s2-l4": {
    passingScore: 80,
    maxAttempts: 2,
    questions: [
      {
        id: "q1",
        type: "single",
        text: "How do you read URL parameters inside a route component?",
        options: [
          { id: "a", text: "useParams()" },
          { id: "b", text: "useParams" },
          { id: "c", text: "props.params" },
          { id: "d", text: "useLocation().params" },
        ],
        correctAnswer: "a",
        explanation: "useParams returns an object of dynamic segment key/value pairs.",
      },
      {
        id: "q2",
        type: "true-false",
        text: "A route loader runs on the client only, after the component mounts.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correctAnswer: "b",
        explanation: "Loaders run before the route renders (during navigation), not after mount.",
      },
      {
        id: "q3",
        type: "multiple",
        text: "Which hooks can a route component use to read URL state? (Select all that apply.)",
        options: [
          { id: "a", text: "useParams" },
          { id: "b", text: "useLocation" },
          { id: "c", text: "useSearchParams" },
          { id: "d", text: "useNavigate" },
        ],
        correctAnswer: ["a", "b", "c"],
        explanation: "useParams, useLocation, and useSearchParams all read URL state; useNavigate performs navigation.",
      },
      {
        id: "q4",
        type: "single",
        text: "To navigate programmatically and replace (not add) a history entry, you call:",
        options: [
          { id: "a", text: "navigate('/path')" },
          { id: "b", text: "navigate('/path', { replace: true })" },
          { id: "c", text: "redirect('/path')" },
          { id: "d", text: "navigate.replace('/path')" },
        ],
        correctAnswer: "b",
        explanation: "useNavigate returns a function that accepts a replace option.",
      },
      {
        id: "q5",
        type: "single",
        text: "Lazy-loaded routes in React Router v7 are defined with:",
        options: [
          { id: "a", text: "lazy: () => import('./Module')" },
          { id: "b", text: "lazy: { Component: () => import('./Module') }" },
          { id: "c", text: "Component: lazy(() => import('./Module'))" },
          { id: "d", text: "loadable: import('./Module')" },
        ],
        correctAnswer: "b",
        explanation: "Route objects use lazy: { Component: () => import(...) } for code-splitting.",
      },
    ],
  },
  "5-s3-l4": {
    passingScore: 60,
    maxAttempts: 2,
    questions: [
      {
        id: "q1",
        type: "single",
        text: "What is the main benefit of using a Pipeline in scikit-learn?",
        options: [
          { id: "a", text: "It trains a model faster" },
          { id: "b", text: "It chains transforms and estimators to prevent data leakage" },
          { id: "c", text: "It automatically selects the best algorithm" },
          { id: "d", text: "It converts text to numbers" },
        ],
        correctAnswer: "b",
        explanation:
          "A pipeline ensures preprocessing like scaling fits only on training data within each fold, avoiding leakage into validation.",
      },
      {
        id: "q2",
        type: "multiple",
        text: "Which of the following are valid scikit-learn transformers? (Select all that apply.)",
        options: [
          { id: "a", text: "StandardScaler" },
          { id: "b", text: "OneHotEncoder" },
          { id: "c", text: "LogisticRegression" },
          { id: "d", text: "SimpleImputer" },
        ],
        correctAnswer: ["a", "b", "d"],
        explanation: "Transformers have fit/transform; LogisticRegression is an estimator, not a transformer.",
      },
      {
        id: "q3",
        type: "single",
        text: "When scaling features before a train/test split, the correct approach is:",
        options: [
          { id: "a", text: "Fit the scaler on all data, then transform" },
          { id: "b", text: "Fit the scaler only on the training set, then transform both sets" },
          { id: "c", text: "Transform first, then split the scaled data" },
          { id: "d", text: "Don't scale at all for tree models" },
        ],
        correctAnswer: "b",
        explanation: "Fitting on all data leaks test-set information into training via the scaler's statistics.",
      },
      {
        id: "q4",
        type: "true-false",
        text: "train_test_split shuffles the data by default before splitting.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correctAnswer: "a",
        explanation: "shuffle=True is the default unless the data is explicitly a time-series split.",
      },
      {
        id: "q5",
        type: "single",
        text: "Which metric is most appropriate for an imbalanced binary classification problem?",
        options: [
          { id: "a", text: "Accuracy" },
          { id: "b", text: "Precision only" },
          { id: "c", text: "F1-score" },
          { id: "d", text: "Mean squared error" },
        ],
        correctAnswer: "c",
        explanation: "F1 balances precision and recall, making it more informative than accuracy on imbalanced classes.",
      },
    ],
  },
  "7-s3-l3": {
    passingScore: 60,
    maxAttempts: null,
    questions: [
      {
        id: "q1",
        type: "single",
        text: "When optimizing a paid-ad campaign, the first thing to check is:",
        options: [
          { id: "a", text: "A/B test two ad variants" },
          { id: "b", text: "Audience targeting" },
          { id: "c", text: "The campaign's cost per acquisition goal" },
          { id: "d", text: "Increasing the daily budget" },
        ],
        correctAnswer: "c",
        explanation: "You can't tell if performance is good without a defined cost-per-acquisition target.",
      },
      {
        id: "q2",
        type: "multiple",
        text: "Which of the following are valid ways to improve a campaign's ROI? (Select all that apply.)",
        options: [
          { id: "a", text: "Tightening audience targeting" },
          { id: "b", text: "Raising bids on the highest-converting placements" },
          { id: "c", text: "Pausing underperforming keywords" },
          { id: "d", text: "Removing all conversion tracking" },
        ],
        correctAnswer: ["a", "b", "c"],
        explanation: "Removing conversion tracking makes optimization blind, so it's never a valid choice.",
      },
      {
        id: "q3",
        type: "single",
        text: "In attribution, what does a 'last-click' model do?",
        options: [
 { id: "a", text: "Give all credit to the first touchpoint" },
          { id: "b", text: "Split credit evenly across all touchpoints" },
          { id: "c", text: "Give all credit to the final click before conversion" },
          { id: "d", text: "Weight touchpoints by time decay" },
        ],
        correctAnswer: "c",
        explanation: "Last-click credit goes to the final interaction before a conversion.",
      },
      {
        id: "q4",
        type: "true-false",
        text: "An A/A test compares two versions that are intentionally different.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correctAnswer: "b",
        explanation: "An A/A test compares identical versions to validate the test setup before an A/B test.",
      },
      {
        id: "q5",
        type: "single",
        text: "If a campaign's cost per click rises but conversions stay flat, what should you do?",
        options: [
          { id: "a", text: "Immediately double the daily budget" },
          { id: "b", text: "Check the search term report and refine keyword match types" },
          { id: "c", text: "Raise bids to win more auctions" },
          { id: "d", text: "Switch to a different ad platform" },
        ],
        correctAnswer: "b",
        explanation:
          "Rising CPC often signals irrelevant search traffic; the search term report reveals which queries to add as negatives.",
      },
    ],
  },
};

export default quizzes;
