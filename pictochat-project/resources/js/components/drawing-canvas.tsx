import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = 800;
        canvas.height = 600;
        canvas.style.border = '1px solid #000';

        const context = canvas.getContext('2d');
        if (context) {
            context.lineCap = 'round';
            context.strokeStyle = 'black';
            context.lineWidth = 4;
            contextRef.current = context;
        }
    }, []);

    const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current?.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }: React.MouseEvent) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.lineTo(offsetX, offsetY);
        contextRef.current?.stroke();
    };

    const postImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const dataURL = canvas.toDataURL('image/png');

        await fetch('/api/save-drawing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({
                image: dataURL,
            }),
        });
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
            />
            <div className="mt-4">
                <Button onClick={postImage}>Send</Button>
            </div>
        </div>

    );
}