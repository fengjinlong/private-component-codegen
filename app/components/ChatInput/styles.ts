import { useEmotionCss } from '@ant-design/use-emotion-css';

export const useClassName = ({
  loading,
  notActions
}: {
  loading: boolean;
  notActions: boolean;
}) => {
  const className = useEmotionCss(() => {
    return {
      position: 'relative',
      width: '100%',
      background: loading
        ? 'repeating-linear-gradient(101.79deg, rgb(255, 0, 0) 0%, rgb(128, 0, 128) 33%, rgb(0, 0, 255) 66%, rgb(0, 128, 0) 100%) 0% 0% / 200% 200%'
        : '#1f1f1f',
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
        background: '#2b2b2b',
        color: '#e0e0e0',
        border: '1px solid #383838',
        '&::placeholder': {
          color: '#666666'
        },
        '&:hover': {
          borderColor: '#505050',
          background: '#333333'
        },
        '&:focus': {
          borderColor: '#606060',
          background: '#333333',
          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)'
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
        alignItems: 'center'
      },
      '.image-wrapper': {
        marginTop: '5px'
      }
    };
  });
  return className;
};
