import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {useForm} from '@inertiajs/react';

export default function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const {data, setData, post, processing, errors, reset} = useForm({
        image: '',
        caption: '',
        chatroom_id: 'general',
    })

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

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const dataURL = canvas.toDataURL('image/png');
        
        if (!dataURL.startsWith('data:image')) {
            alert('Canvas is empty or image data in invalid.');
            return;
        }

        setData('image', dataURL);

        post('/save-drawing', {
            onSuccess: () => {
                alert('Drawing submitted!');
                reset(); //clear the form
                contextRef.current?.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
            },
            onError: (err) => {
                console.error(err);
                alert('There was an error submitting the drawing');
            },
        })
    }

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
                <Button onClick={handleSubmit} disabled = {processing}> {processing ? 'Sending...' : 'Send'}</Button>
            </div>
            {errors.caption && <p className= "text-red-500">{errors.caption}</p>}
            {errors.image && <p className="text-red-500">{errors.image}</p>}
        </div>

    );
}