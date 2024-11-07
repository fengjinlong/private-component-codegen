import { useEmotionCss } from '@ant-design/use-emotion-css';

export const useClassName = ({
  loading,
  notActions
}: {
  loading: boolean;
  notActions: boolean;
}) => {
  const className = useEmotionCss(({ token }) => {
    return {
      position: 'relative',
      width: '100%',
      background: loading
        ? 'repeating-linear-gradient(101.79deg, rgb(255, 0, 0) 0%, rgb(128, 0, 128) 33%, rgb(0, 0, 255) 66%, rgb(0, 128, 0) 100%) 0% 0% / 200% 200%'
        : 'transparent',
      animation: `${loading ? 'gradient' : ''} 6s linear infinite`,
      backgroundSize: '200%, 200%',
      borderRadius: '8px',
      padding: '2px',
      '@keyframes gradient': {
        '0%': {
          'background-position': '0px 0'
        },
        '100%': {
          'background-position': '100em 0'
        }
      },
      textarea: {
        position: 'relative',
        transition: '0.3s',
        paddingRight: '50px',
        paddingTop: notActions ? '10px' : '45px',
        paddingBottom: '10px',
        '&:hover': {
          borderColor: '#d9d9d9'
        },
        '&:focus': {
          borderColor: '#d9d9d9',
          boxShadow: '0 0 0 2px transparent'
        }
      },
      '.generate-btn': {
        position: 'absolute',
        right: '12px',
        bottom: '12px'
      },
      '.action-wrapper': {
        position: 'absolute',
        top: '3px',
        height: '45px',
        left: '12px',
        right: '12px',
        display: notActions ? 'none' : 'flex',
        alignItems: 'center',
        background: token.colorBgBase
      },
      '.image-wrapper': {
        marginTop: '5px'
      }
    };
  });
  return className;
};
