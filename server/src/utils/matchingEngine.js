const normalize = (value = "") => value.toLowerCase().trim();

const levelWeight = {
  Beginner: 0.5,
  Intermediate: 0.8,
  Expert: 1,
};

const scoreSkillPair = (offered, wanted) => {
  if (!offered || !wanted) return 0;

  const offeredName = normalize(offered.name);
  const wantedName = normalize(wanted.name);
  const exact = offeredName === wantedName ? 1 : 0;

  const offeredTags = (offered.tags || []).map(normalize);
  const wantedTags = (wanted.tags || []).map(normalize);

  const overlap = wantedTags.filter((tag) => offeredTags.includes(tag));
  const partial = wantedTags.length ? overlap.length / wantedTags.length : 0;
  const skillScore = Math.max(exact, partial * 0.8);

  const offeredLevelWeight = levelWeight[offered.level] || 0.5;
  const wantedLevelWeight = levelWeight[wanted.level] || 0.5;
  const levelScore = Math.min(offeredLevelWeight / wantedLevelWeight, 1);

  return skillScore * 0.75 + levelScore * 0.25;
};

const bestDirectionalScore = (offeredSkills = [], wantedSkills = []) => {
  if (!offeredSkills.length || !wantedSkills.length) return 0;

  let best = 0;
  for (const wanted of wantedSkills) {
    for (const offered of offeredSkills) {
      const score = scoreSkillPair(offered, wanted);
      if (score > best) best = score;
    }
  }

  return best;
};

const pairMatchScore = (userA, userB) => {
  const aToB = bestDirectionalScore(userA.skillsOffered, userB.skillsWanted);
  const bToA = bestDirectionalScore(userB.skillsOffered, userA.skillsWanted);
  const weighted = (aToB + bToA) / 2;
  return Math.round(weighted * 100);
};

const buildPairMatches = (currentUser, allUsers = []) =>
  allUsers
    .filter((candidate) => String(candidate._id) !== String(currentUser._id))
    .map((candidate) => {
      const score = pairMatchScore(currentUser, candidate);
      return {
        user: candidate,
        score,
      };
    })
    .filter((m) => m.score >= 30)
    .sort((a, b) => b.score - a.score);

const buildGraph = (users = []) => {
  const graph = new Map();

  users.forEach((fromUser) => {
    const edges = [];
    users.forEach((toUser) => {
      if (String(fromUser._id) === String(toUser._id)) return;
      const score = bestDirectionalScore(fromUser.skillsOffered, toUser.skillsWanted);
      if (score >= 0.35) {
        edges.push({ to: String(toUser._id), score: Math.round(score * 100) });
      }
    });

    graph.set(String(fromUser._id), edges);
  });

  return graph;
};

const buildChainMatches = (currentUser, users = [], maxDepth = 4) => {
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  const graph = buildGraph(users);
  const source = String(currentUser._id);
  const chains = [];

  const dfs = (node, path, scoreTotal, depth) => {
    if (depth > maxDepth) return;

    const neighbors = graph.get(node) || [];
    for (const edge of neighbors) {
      if (edge.to === source && path.length >= 2) {
        const avg = Math.round((scoreTotal + edge.score) / (path.length + 1));
        chains.push({
          path: [...path, source],
          averageScore: avg,
          users: [...path, source].map((id) => userMap.get(id)),
        });
        continue;
      }

      if (path.includes(edge.to)) continue;

      dfs(edge.to, [...path, edge.to], scoreTotal + edge.score, depth + 1);
    }
  };

  dfs(source, [source], 0, 1);

  const deduped = [];
  const seen = new Set();

  for (const chain of chains) {
    const key = chain.path.join("->");
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(chain);
  }

  return deduped
    .filter((chain) => chain.path.length > 3)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10);
};

module.exports = {
  buildPairMatches,
  buildChainMatches,
};
