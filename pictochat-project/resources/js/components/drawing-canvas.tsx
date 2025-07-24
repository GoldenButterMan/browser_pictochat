import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { router, useForm } from '@inertiajs/react';

export default function DrawingCanvas() {
    const [strokeColor, setStrokeColor] = useState<string>('black');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const oldColor = useRef<string>('black');

    const { data, setData, post, processing, errors, reset } = useForm({
        image: '',
        caption: '',
        chatroom_id: null,
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
            context.strokeStyle = strokeColor;
            context.lineWidth = 4;
            contextRef.current = context;
        }
    }, []);

    const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(offsetX, offsetY);

        //Drawing mode
        if (nativeEvent.button === 0) {
            setStrokeColor(oldColor.current);
        }
        //Use eraser
        else if (nativeEvent.button === 2) {
            oldColor.current = strokeColor;
            console.log(oldColor);
            changeStrokeColor('white');

        }

        setIsDrawing(true);

    };

    const finishDrawing = () => {
        contextRef.current?.closePath();
        setIsDrawing(false);
        //restore stroke color to previous color before erasing
        if (strokeColor == 'white') {
            setStrokeColor(oldColor.current);
        }
    };

    const draw = ({ nativeEvent }: React.MouseEvent) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.lineTo(offsetX, offsetY);
        contextRef.current?.stroke();
    };
    //change color of brush stroke. Below useEffect refreshes canvas accordingly
    const changeStrokeColor = (color: string) => {
        setStrokeColor(color);
        console.log(strokeColor);
    };

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = strokeColor;
        }
    }, [strokeColor]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        reset();
        contextRef.current?.clearRect(0, 0, canvas!.width, canvas!.height);
    }

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        //Convert image to base64
        const dataURL = canvas.toDataURL('image/png');

        console.log('Submitting base64 image:', dataURL);

        if (!dataURL.startsWith('data:image')) {
            alert('Canvas is empty or image data in invalid.');
            return;
        }

        router.post('/save-drawing', {
            image: dataURL,
            caption: data.caption,
            chatroom_id: data.chatroom_id,
        }, {
            onSuccess: () => {
                alert('Drawing submitted!');
                reset();
                contextRef.current?.clearRect(0, 0, canvas.width, canvas.height);
            },
            onError: (err) => {
                console.error(err);
                alert('There was an error submitting drawing');
            },
        });

    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                onContextMenu={(e) => e.preventDefault()}
            />
            {/*Choose color you want to draw in*/}
            <span className="flex gap-2 mt-4">
                <Button className = "bg-green-500" onClick={() => { changeStrokeColor('green'); oldColor.current = 'green' }}>Green</Button>
                <Button className = "bg-red-500" onClick={() => { changeStrokeColor('red'); oldColor.current = 'red' }}>Red</Button>
                <Button className = "bg-blue-500" onClick={() => { changeStrokeColor('blue'); oldColor.current = 'blue' }}>Blue</Button>
                <Button onClick={() => { changeStrokeColor('black'); oldColor.current = 'black' }}>Black</Button></span>
            <div className="mt-4">
                <span className="flex gap-2 mt-4">
                    <Button onClick={handleSubmit} disabled={processing}> {processing ? 'Sending...' : 'Send'}</Button>
                    <Button onClick={clearCanvas} disabled={processing}>Clear</Button>
                </span>
            </div>
            {errors.caption && <p className="text-red-500">{errors.caption}</p>}
        </div>

    );
}