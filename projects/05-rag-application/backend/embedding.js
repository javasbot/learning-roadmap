/**
 * RAG - 阶段 1: 知识库的切片与特征提取 (Embedding)
 */

// 1. Chunking（文本切片）
// 为什么需要切？哪怕是 128k 上下文的模型也是有尽头的。我们必须把一整本书切成小块。
export function splitTextIntoChunks(text, chunkSize = 200, overlap = 50) {
  // 按照换行符等简单分割，如果是企业级建议使用 RecursiveCharacterTextSplitter (LangChain)
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  const chunks = [];
  
  let currentChunk = '';
  for (const p of paragraphs) {
    if ((currentChunk + p).length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      // Overlap (滑动窗口思想)：保留上一个 Chunk 结尾的一部分作为下一个 Chunk 的开头，这样防止一句话被切断导致的语义丢失。
      currentChunk = currentChunk.slice(-overlap) + ' ' + p;
    } else {
      currentChunk += ' ' + p;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

// 2. Embedding（向量化）
// 什么是向量？"苹果" 和 "水果" 在语义空间里的距离很近，而 "苹果" 和 "拖拉机" 在数字空间里很远。
export async function generateEmbeddings(chunks) {
  const vectors = [];

  for (const chunk of chunks) {
    // 真实的开发中：调用 openai.embeddings.create({ input: chunk, model: 'text-embedding-3-small' })
    // 这里我们用一个简易的高维随机数组模拟 OpenAI 返回的 1536 维数据结构
    const vector = Array.from({ length: 1536 }, () => (Math.random() - 0.5) * 2);
    
    vectors.push({
      id: "chunk_" + Math.random().toString(36).substring(7),
      text: chunk,     // 必须要把原文字段也带上（这叫做 Payload）方便到时候让大模型读
      vector: vector,  // 用于数字数学计算的特征坐标
    });
  }

  // 计算完毕后，真实的场景是存到 Chroma, Pinecone 甚至 Postgres+pgvector 中
  return vectors;
}
