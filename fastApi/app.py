from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uvicorn, torch, os

app = FastAPI(title="Post-Classifier")

class PostText(BaseModel):
    title: str
    desc:  str

# load once at boot
LABELS = [
    "technology", "science", "gaming", "business",
    "sports", "health", "entertainment", "politics"
]
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
    device=0 if torch.cuda.is_available() else -1
)  # model-loading pattern shown in HF+FastAPI guides[3][5]

@app.get("/")
def home():
    return {"message": "FastAPI Post Classifier is running!"}

@app.post("/classify")
async def classify(post: PostText):
    try:
        text   = f"{post.title} {post.desc}"
        out    = classifier(text, LABELS, multi_label=False)
        return {"category": out["labels"][0], "score": out["scores"][0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
@app.get("/health")
async def health():
    return {"ok": True}
    
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
