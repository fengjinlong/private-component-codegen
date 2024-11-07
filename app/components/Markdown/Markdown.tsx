import React, { useMemo, memo, useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMath from 'remark-math';
import RemarkBreaks from 'remark-breaks';
import RehypeKatex from 'rehype-katex';
import RemarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import { useClassName } from './styles';
import { isEqual } from 'lodash';

const CodeLight = dynamic(() => import('./CodeLight'));

export enum CodeClassName {
  guide = 'guide',
  questionGuide = 'questionGuide',
  mermaid = 'mermaid',
  echarts = 'echarts',
  quote = 'quote',
  img = 'img'
}

const CHUNK_SIZE = 2; // 每次渲染的字符数
const RENDER_INTERVAL = 0.5; // 渲染间隔(ms)

const Markdown = ({
  source,
  isChatting = false,
  isStream = false
}: {
  source: string;
  isChatting?: boolean;
  isStream?: boolean;
}) => {
  const className = useClassName();
  const [visibleContent, setVisibleContent] = useState('');
  const currentPositionRef = useRef(0);
  const sourceRef = useRef('');

  // Reset logic when source changes completely
  useEffect(() => {
    if (!isStream) {
      return;
    }

    if (!isChatting) {
      setVisibleContent(source);
      return;
    }

    // If new source is shorter than what we have, it's a new message
    if (source.length < sourceRef.current.length) {
      currentPositionRef.current = 0;
      setVisibleContent('');
    }

    sourceRef.current = source;
  }, [source, isChatting, isStream]);

  // Progressive rendering logic
  useEffect(() => {
    if (!isStream) {
      return;
    }

    let timerId: NodeJS.Timeout | null = null;

    const renderNextChunk = () => {
      if (currentPositionRef.current < source.length) {
        setVisibleContent(source.slice(0, currentPositionRef.current + CHUNK_SIZE));
        currentPositionRef.current += CHUNK_SIZE;
        timerId = setTimeout(renderNextChunk, RENDER_INTERVAL);
      }
    };

    renderNextChunk();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [source, isChatting, isStream]);

  const components = useMemo<any>(
    () => ({
      pre: 'div',
      p: (pProps: any) => <p {...pProps} dir="auto" />,
      code: Code
    }),
    []
  );

  return (
    <div className={className}>
      <ReactMarkdown
        className={`markdown ${
          isChatting ? `${visibleContent ? 'waitingAnimation' : 'animation'}` : ''
        }`}
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[RehypeKatex]}
        components={components}
        linkTarget={'_blank'}
      >
        {isStream ? visibleContent : source}
      </ReactMarkdown>
    </div>
  );
};

export default memo(Markdown);

const Code = memo(
  function Code(e: any) {
    const { inline, className, children } = e;

    const match = useMemo(() => /language-(\w+)/.exec(className || ''), [className]);

    return (
      <CodeLight className={className} inline={inline} match={match}>
        {children}
      </CodeLight>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.children, nextProps.children);
  }
);
