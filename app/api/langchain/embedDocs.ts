import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { vectorStore } from './db';

async function main() {
  console.log('开始加载文档...');
  const loader = new DirectoryLoader('./ai-docs', {
    '.txt': (path) => new TextLoader(path)
  });

  const docs = await loader.load();
  console.log(`成功加载 ${docs.length} 个文档`);

  // 手动分割文档
  const splits = docs.flatMap((doc) => {
    const parts = doc.pageContent.split('-------split line-------');
    return parts.map((content) => ({
      ...doc,
      pageContent: content.trim()
    }));
  });
  console.log(`文档分割完成，共 ${splits.length} 个片段`);

  // 存储文档
  console.log('开始存储文档向量...');
  await vectorStore.addDocuments(splits);
  console.log('文档向量存储完成！');
}

// 执行主函数
console.log('开始执行文档嵌入程序...');
main().catch((error) => {
  console.error('程序执行出错:', error);
});
