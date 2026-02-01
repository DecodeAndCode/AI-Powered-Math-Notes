import google.generativeai as genai
from constants import GEMINI_API_KEY
import os

# Ensure API Key is available
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in constants.py")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)

print("Listing available models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)
