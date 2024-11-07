import { useEmotionCss } from '@ant-design/use-emotion-css';

export const useClassName = () => {
  const className = useEmotionCss(({}) => {
    return {
      '.h-80vh': {
        height: '70vh'
      }
    };
  });
  return className;
};
