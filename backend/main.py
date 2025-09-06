import os
import tempfile
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from google import genai
from PIL import Image
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_ID = "gemini-2.5-flash-image-preview"
API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY:
    raise Exception("GEMINI_API_KEY environment variable is not set")

client = genai.Client(api_key=API_KEY)

EMOJI_PROMPTS = {
    "😄": "Convert the provided image to match the mood of 😄.",
    "😠": "Convert the provided image to match the mood of 😠.",
    "😭": "Convert the provided image to match the mood of 😭.",
    "🥳": "Convert the provided image to match the mood of 🥳."
}

def save_image(response, path):
    for part in response.parts:
        if image := part.as_image():
            image.save(path)
            return True
    return False

@app.get("/")
async def root():
    return {"message": "Emoji Profile Maker API"}

@app.get("/emojis")
async def get_available_emojis():
    return {"emojis": list(EMOJI_PROMPTS.keys())}

@app.post("/convert")
async def convert_image(emoji: str, file: UploadFile = File(...)):
    if emoji not in EMOJI_PROMPTS:
        raise HTTPException(status_code=400, detail="Invalid emoji")
    
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Create temporary files
        input_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        output_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        
        # Save uploaded file
        contents = await file.read()
        input_temp.write(contents)
        input_temp.close()
        
        # Open and process image
        image = Image.open(input_temp.name)
        
        # Generate converted image using Gemini
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=[
                EMOJI_PROMPTS[emoji],
                image
            ]
        )
        
        # Save converted image
        if save_image(response, output_temp.name):
            output_temp.close()
            return FileResponse(
                output_temp.name,
                media_type="image/png",
                filename=f"converted_{uuid.uuid4().hex}.png"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to generate converted image")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary files
        try:
            os.unlink(input_temp.name)
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)