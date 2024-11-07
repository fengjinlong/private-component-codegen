import { useState, FC } from 'react';
import { Drawer, Button, Tooltip } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import '@tldraw/tldraw/tldraw.css';
import { getSvgAsImage } from './lib/getSvgAsImage';
import { blobToBase64 } from './lib/blobToBase64';
import { TldrawEditProps } from './interface';
import { useClassName } from './styles';

const Tldraw = (await import('@tldraw/tldraw')).Tldraw;
const useEditor = (await import('@tldraw/tldraw')).useEditor;

const TldrawEdit: FC<TldrawEditProps> = ({ onSubmit }) => {
  const classNames = useClassName();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Tooltip key="Draw A Image" title="Draw A Image">
        <Button size="small" onClick={showDrawer} icon={<PictureOutlined />} />
      </Tooltip>
      <Drawer
        title={
          <div className="flex justify-between items-center w-full">
            <span>Draw UI</span>
          </div>
        }
        placement="right"
        closable={true}
        onClose={handleCancel}
        open={visible}
        width="100%"
        styles={{
          body: { padding: 0, height: '100vh' }
        }}
      >
        <div className={`w-full h-full ${classNames}`}>
          <Tldraw persistenceKey="tldraw">
            <div className="fixed top-0 right-0 m-2">
              <ExportButton
                onSubmit={(dataUrl) => {
                  onSubmit(dataUrl);
                  setVisible(false);
                }}
              />
            </div>
          </Tldraw>
        </div>
      </Drawer>
    </>
  );
};

function ExportButton({ onSubmit }: { onSubmit: (dataUrl: string) => void }) {
  const editor = useEditor();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      type="primary"
      onClick={async (e) => {
        setLoading(true);
        try {
          e.preventDefault();
          console.log('editor.currentPageShapeIds', editor.currentPageShapeIds);

          const svg = await editor.getSvg(Array.from(editor.currentPageShapeIds));
          if (!svg) {
            return;
          }
          const png = await getSvgAsImage(svg, {
            type: 'png',
            quality: 1,
            scale: 1
          });
          const dataUrl = (await blobToBase64(png!)) as string;
          onSubmit(dataUrl);
        } finally {
          setLoading(false);
        }
      }}
      className="ml-2"
      loading={loading}
    >
      Confirm
    </Button>
  );
}

export default TldrawEdit;
