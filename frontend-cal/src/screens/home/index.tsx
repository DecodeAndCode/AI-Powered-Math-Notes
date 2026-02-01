import { useEffect, useRef, useState } from "react";
import { ColorSwatch, Group, Slider, Stack, Text } from "@mantine/core";
import axios from "axios";
import { SWATCHES } from "@/constants";
import { Button } from "@/components/ui/button";
import Draggable from "react-draggable";
import { Pencil, Eraser as EraserIcon, RotateCcw, Play, Palette } from "lucide-react";

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

interface GeneratedResult {
  expression: string;
  answer: string;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgb(255, 255, 255)");
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [result, setResult] = useState<GeneratedResult>();
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser">("pencil");
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset(); // Trigger MathJax rendering
    } else {
      console.error('MathJax not loaded');
    }
  }, []);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.background = "black";
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
      }
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.background = "black";
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.lineCap = "round";
          ctx.lineWidth = 3;
        }
      }
    };
    window.addEventListener("resize", handleResize);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      });
    };

    return () => {
      document.head.removeChild(script);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = "black";
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();

        let x, y;
        if ('touches' in e.nativeEvent) {
          // Touch event
          const touch = e.nativeEvent.touches[0];
          const rect = canvas.getBoundingClientRect();
          x = touch.clientX - rect.left;
          y = touch.clientY - rect.top;
        } else {
          // Mouse event
          x = e.nativeEvent.offsetX;
          y = e.nativeEvent.offsetY;
        }

        ctx.moveTo(x, y);
        setIsDrawing(true);
      }
    }
  };

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
    setLatexExpression([...latexExpression, latex]);

    // Clear the main canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = activeTool === "eraser" ? "black" : color;
        ctx.lineWidth = lineWidth;

        let x, y;
        if ('touches' in e.nativeEvent) {
          // Touch event
          e.preventDefault(); // Stop scrolling on touch
          const touch = e.nativeEvent.touches[0];
          const rect = canvas.getBoundingClientRect();
          x = touch.clientX - rect.left;
          y = touch.clientY - rect.top;
        } else {
          // Mouse event
          x = e.nativeEvent.offsetX;
          y = e.nativeEvent.offsetY;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setLatexExpression([]);
    setResult(undefined);
    setDictOfVars({});
  };

  const sendData = async () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/calculate`,
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictOfVars,
        },
      });

      const resp = await response.data;
      console.log("Response", resp);
      resp.data.forEach((data: Response) => {
        if (data.assign === true) {
          // dict_of_vars[resp.result] = resp.answer;
          setDictOfVars({
            ...dictOfVars,
            [data.expr]: data.result,
          });
        }
      });
      const ctx = canvas.getContext("2d");
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 0) {
            // If pixel is not transparent
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setLatexPosition({ x: centerX, y: centerY });
      resp.data.forEach((data: Response) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 1000);
      });
    }
  };

  return (
    <>
      <div className="fixed bottom-6 xl:top-4 xl:bottom-auto left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 items-center">
        {/* Main Toolbar */}
        <div className="flex items-center gap-4 bg-zinc-900/90 backdrop-blur-xl border border-white/10 px-4 py-2 xl:px-6 xl:py-3 rounded-full shadow-2xl scale-90 xl:scale-100 origin-bottom xl:origin-top transition-all">
          <Button
            onClick={() => setReset(true)}
            className="p-2 h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white border-0"
            variant="ghost"
          >
            <RotateCcw className="w-4 h-4 xl:w-5 xl:h-5" />
          </Button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <Button
            onClick={() => setActiveTool("pencil")}
            className={`p-2 h-8 w-8 xl:h-10 xl:w-10 rounded-full border-0 transition-all ${activeTool === "pencil" ? "bg-white text-black hover:bg-white/90" : "bg-transparent text-white hover:bg-zinc-800"}`}
            variant="ghost"
          >
            <Pencil className="w-4 h-4 xl:w-5 xl:h-5" />
          </Button>

          <Button
            onClick={() => setActiveTool("eraser")}
            className={`p-2 h-8 w-8 xl:h-10 xl:w-10 rounded-full border-0 transition-all ${activeTool === "eraser" ? "bg-white text-black hover:bg-white/90" : "bg-transparent text-white hover:bg-zinc-800"}`}
            variant="ghost"
          >
            <EraserIcon className="w-4 h-4 xl:w-5 xl:h-5" />
          </Button>

          <div className="w-px h-6 bg-white/10 mx-2 hidden xl:block" />

          {/* Desktop: Color & Size inline */}
          <div className="items-center gap-2 xl:gap-4 hidden xl:flex">
            <Stack gap={2} align="center">
              <Text size="xs" c="dimmed" style={{ fontSize: '0.65rem' }}>Size</Text>
              <Slider
                color="white"
                min={1}
                max={20}
                step={1}
                value={lineWidth}
                onChange={setLineWidth}
                className="w-24"
                size="sm"
                thumbSize={14}
              />
            </Stack>

            <Group gap={6}>
              {SWATCHES.map((swatch) => (
                <ColorSwatch
                  key={swatch}
                  color={swatch}
                  onClick={() => {
                    setColor(swatch);
                    setActiveTool("pencil");
                  }}
                  className="cursor-pointer transition-transform hover:scale-110"
                  size={20}
                  withShadow
                  style={color === swatch && activeTool === "pencil" ? { border: '2px solid white', transform: 'scale(1.2)' } : {}}
                />
              ))}
            </Group>
          </div>

          {/* Mobile: Style Button */}
          <Button
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className={`xl:hidden p-2 h-8 w-8 rounded-full border-0 transition-all ${showStyleMenu ? "bg-white text-black" : "bg-transparent text-white hover:bg-zinc-800"}`}
            variant="ghost"
          >
            <Palette className="w-4 h-4" />
          </Button>

          {/* Mobile: Style Menu Popover */}
          {showStyleMenu && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-4 w-64 shadow-2xl z-50 xl:hidden animate-in fade-in slide-in-from-bottom-5">
              <Stack gap={2} align="center">
                <Text size="xs" c="dimmed">Brush Size: {lineWidth}px</Text>
                <Slider
                  color="white"
                  min={1}
                  max={20}
                  step={1}
                  value={lineWidth}
                  onChange={setLineWidth}
                  className="w-full"
                  size="sm"
                  thumbSize={14}
                />
              </Stack>
              <Group gap={8} justify="center" wrap="wrap">
                {SWATCHES.map((swatch) => (
                  <ColorSwatch
                    key={swatch}
                    color={swatch}
                    onClick={() => {
                      setColor(swatch);
                      setActiveTool("pencil");
                      // Optional: close menu on pick? setShowStyleMenu(false);
                    }}
                    className="cursor-pointer"
                    size={24}
                    withShadow
                    style={color === swatch && activeTool === "pencil" ? { border: '2px solid white', transform: 'scale(1.2)' } : {}}
                  />
                ))}
              </Group>
            </div>
          )}

          <div className="w-px h-6 bg-white/10 mx-2" />

          <Button
            onClick={sendData}
            className="p-2 h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg shadow-green-500/20"
            variant="default"
          >
            <Play className="w-4 h-4 xl:w-5 xl:h-5 fill-current" />
          </Button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {latexExpression &&
        latexExpression.map((latex, index) => (
          <Draggable
            key={index}
            defaultPosition={latexPosition}
            onStop={(_e, data) => setLatexPosition({ x: data.x, y: data.y })}
          >
            <div className="absolute p-2 text-white rounded shadow-md">
              <div className="latex-content">{latex}</div>
            </div>
          </Draggable>
        ))}
    </>
  );
}
