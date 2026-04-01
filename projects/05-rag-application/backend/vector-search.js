/**
 * RAG - 阶段 2: 向量相似度检索 (Vector Retrieval)
 */

// 计算两个向量的神棍公式：余弦相似度 (Cosine Similarity)
// 一条线和另一条线夹角越小，相似度越逼近 1，反之趋向于 0 甚至 -1。
export function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 核心检索方法：从你积累的 1 万个切片语料库里，找出最贴合用户提问的三个文本！
 * 
 * @param {Array<number>} userQueryVector - 用户提问语句转变而成的 Embedding 向量
 * @param {Array<object>} myDatabase - 我们之前存好的公司知识库切片数组
 * @param {number} topK - 取前几名？一般是 3-5
 */
export function searchSimilarChunks(userQueryVector, myDatabase, topK = 3) {
  // 1. 遍历计算每一个公司语料库的区块和当前用户提问的 余弦距离（越接近1越相似）
  const results = myDatabase.map(doc => {
    return {
      docRef: doc,
      score: cosineSimilarity(userQueryVector, doc.vector)
    };
  });

  // 2. 按照打分从高到底排序
  results.sort((a, b) => b.score - a.score);

  // 3. 切割出得分最高的前 K 名
  const topMatches = results.slice(0, topK);

  // 4. 重构并拼装上下文准备发给真正的大师：LLM
  const contextTokens = topMatches.map(match => `【参考知识点 id:${match.docRef.id}】：${match.docRef.text}`).join('\n\n');
  
  return {
    topMatches,        // 顺便返回引用给前端用来渲染 "UI Citation"
    contextText: contextTokens // 核心重点：返回纯文本给 LLM 进行理解
  };
}

// -------------------------------------------------------------
// 【最终大模型组装环节 (Generation)】
// 得到上述经过 Retrieve 提取的答案后，系统是如何工作的？
//
// prompt_to_llm = `
// 你是一个客服，请仔细阅读我提供的【资料库】，并尽力用这些资料解答用户的问题。如果资料内没有，请回复不知道。
// 
// <内部系统查询到的可能有关联的参考资料库>
// ${searchResult.contextText}
// </结束>
// 
// 用户的提问是：${user_question}
// ` 
// -------------------------------------------------------------
