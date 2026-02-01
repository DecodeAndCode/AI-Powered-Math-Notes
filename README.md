# Math Notes AI 🧮✨

A powerful, Apple Notes-inspired application that allows you to draw mathematical equations on a digital canvas and get instant solutions using the power of Google's Gemini AI.

![Math Notes Demo](https://placehold.co/600x400/1a1a1a/ffffff?text=Math+Notes+Demo) *Add a screenshot/demo here*

## 🌟 Features

- **Infinite Canvas**: Draw freely on a responsive, black canvas.
- **AI-Powered Solutions**: Recognized handwriting and solves math problems instantly using Gemini 2.0 Flash.
- **Responsive Design**:
    - **Desktop**: Full toolbar with inline color/size controls.
    - **iPad/Tablet**: Adaptive layout with bottom toolbar and palette menu for mobile-friendly usage.
    - **Mobile**: Compact bottom toolbar with "Style" popover to maximize screen space.
- **Touch Support**: Native touch event handling for smooth drawing on iPads and phones.
- **Apple-Style UI**: Glassmorphic, floating toolbars and smooth transitions.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, TypeScript, Mantine UI
- **Backend**: Python, FastAPI, Google GenAI SDK (Gemini 2.0 Flash)
- **Tools**: Lucide React (Icons), Axios, Pillow (Image Processing)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Google Cloud API Key for Gemini

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/math-notes.git
cd math-notes
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend-cal

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in `backend-cal` and add your Gemini API key:
```env
GEMINI_API_KEY=your_google_api_key_here
```

**Run the Backend Server:**
```bash
python main.py
# Server will start on http://localhost:8900
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory.

```bash
cd frontend-cal

# Install dependencies
npm install
```

**Configure Environment Variables:**
Create a `.env.local` file in `frontend-cal` if it doesn't exist:
```env
VITE_API_URL=http://localhost:8900
```

**Run the Frontend Development Server:**
```bash
npm run dev
# App will run on http://localhost:5173 (or similiar port)
```

## 📱 Usage

1.  **Select a Tool**: Use the **Pencil** to draw or **Eraser** to correct mistakes.
2.  **Adjust Style**:
    - On **Desktop**: Use the slider and color dots in the top toolbar.
    - On **Mobile/iPad**: Tap the **Palette** button to open the sizing and color menu.
3.  **Draw**: Write a math problem (e.g., `2 + 2`, integrals, linear equations).
4.  **Solve**: Click the **Run (Play)** button. The AI will analyze your drawing and overlay the answer in LaTeX format.
5.  **Reset**: Click the **Reset** button to clear the canvas.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.
