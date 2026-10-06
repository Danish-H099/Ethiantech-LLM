function normalizeAnswers(spec, answers) {
  const out = {};
  if (!answers || typeof answers !== "object") return out;
  const optionsById = new Map();
  spec.questions.forEach((q) => {
    const set = new Set();
    q.options.forEach((o) => set.add(o.id));
    optionsById.set(q.id, set);
  });
  spec.questions.forEach((q) => {
    const known = optionsById.get(q.id);
    const val = answers[q.id];
    if (q.type === "multiple") {
      const arr = Array.isArray(val) ? val : val == null ? [] : [val];
      const unique = [...new Set(arr.filter((v) => typeof v === "string" && known.has(v)))];
      out[q.id] = unique.sort();
    } else {
      const scalar = Array.isArray(val) ? val[0] : val;
      if (typeof scalar === "string" && known.has(scalar)) out[q.id] = scalar;
    }
  });
  return out;
}

function isQuestionCorrect(question, answer) {
  if (answer === undefined) return false;
  if (question.type === "multiple") {
    const expected = Array.isArray(question.correctAnswer)
      ? [...question.correctAnswer].sort()
      : [String(question.correctAnswer)].sort();
    const actual = Array.isArray(answer) ? [...answer].sort() : [String(answer)].sort();
    if (expected.length === 0 || actual.length !== expected.length) return false;
    return expected.every((v, i) => v === actual[i]);
  }

  const expected = question.correctAnswer;
  return answer === expected;
}

export function scoreAnswers(spec, answers) {
  const normalized = normalizeAnswers(spec, answers);
  let correctCount = 0;
  const total = spec.questions.length;
  spec.questions.forEach((q) => {
    if (isQuestionCorrect(q, normalized[q.id])) correctCount += 1;
  });
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = score >= spec.passingScore;
  return { score, correctCount, totalCount: total, passed };
}

export { normalizeAnswers, isQuestionCorrect };