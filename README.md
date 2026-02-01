# Math Notes AI 🧮✨

A powerful, Apple Notes-inspired application that allows you to draw mathematical equations on a digital canvas and get instant solutions using the power of Google's Gemini AI.

<img width="1470" height="956" alt="Screenshot 2026-01-31 at 11 03 29 PM" src="https://github.com/user-attachments/assets/ceff17c6-ebd3-4c6f-97a7-a231e1ee97d6" />

## 🌟 Features

- **Infinite Canvas**: Draw freely on a responsive, black canvas.
- **AI-Powered Solutions**: Recognized handwriting and solves math problems instantly using Gemini 3.0.
- **Responsive Design**:
    - **Desktop**: Full toolbar with inline color/size controls.
    - **iPad/Tablet**: Adaptive layout with bottom toolbar and palette menu for mobile-friendly usage.
    - **Mobile**: Compact bottom toolbar with "Style" popover to maximize screen space.
- **Touch Support**: Native touch event handling for smooth drawing on iPads and phones.
- **Apple-Style UI**: Glassmorphic, floating toolbars and smooth transitions.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, TypeScript, Mantine UI
- **Backend**: Python, FastAPI, Google GenAI SDK (Gemini 3.0)
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

## ☁️ Deployment (Vercel)
This project is configured for seamless deployment on Vercel, hosting both the React Frontend and Python FastAPI Backend in a single repository.

### 1. Configuration Overview
- **`frontend-cal` as Root**: The Vercel project Root Directory must be set to `frontend-cal`.
- **`vercel.json`**: Located in `frontend-cal/vercel.json`, this file handles:
  - **Rewrites**: Directs `/calculate` API requests to the Python backend.
  - **Builds**: Configures `@vercel/static-build` for Vite and `@vercel/python` for FastAPI.
- **Serverless Backend**: The Python backend runs as a Serverless Function, meaning no separate server is required!

### 2. Steps to Deploy
1.  **Push to GitHub**: Ensure your latest code is on the default branch.
2.  **Import to Vercel**: Select the repository.
3.  **Project Settings**:
    - **Root Directory**: `frontend-cal`
    - **Environment Variables**: Add `GEMINI_API_KEY` with your Google Cloud API Key.
4.  **Deploy**: Click deploy!

### 🔧 Troubleshooting & Lessons Learned
During development, we encountered and resolved several critical issues:

- **Root Directory Mismatch**: Vercel initially failed to build because it looked for the app in the repo root.
  - *Fix*: Set `frontend-cal` as the Root Directory in Vercel settings.
- **Backend 404 / Missing Build**: The backend was building but the frontend wasn't (or vice versa).
  - *Fix*: Updated `vercel.json` to explicitly include **both** builds:
    ```json
    "builds": [
      { "src": "package.json", "use": "@vercel/static-build", ... },
      { "src": "backend-cal/main.py", "use": "@vercel/python" }
    ]
    ```
- **ModuleNotFoundError (Python)**: The backend crashed on Vercel because it couldn't find local modules like `apps` or `constants`.
  - *Fix*: Added `sys.path.append(...)` in `main.py` to ensure the runtime finds the correct folder.
- **500 Server Error (Gemini API)**: The backend would crash if the AI model returned markdown or encountered an error.
  - *Fix*: Implemented robust error handling and Regex-based JSON parsing in `utils.py` to safely extract answers.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.
