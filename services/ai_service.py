import google.generativeai as genai
from sentence_transformers import SentenceTransformer

from config import config
from database.chromadb import chroma_db

class AIService:
    model = SentenceTransformer("all-MiniLM-L6-v2")
    genai.configure(api_key=config.GEMINI_API_KEY)

    gemini = genai.GenerativeModel("gemini-2.5-flash")

    @staticmethod
    def ask_question(
        user_id,
        document_id,
        question
    ):
        query_embedding = AIService.model.encode(
            question,
            convert_to_numpy=True
        ).tolist()

        results = chroma_db.similarity_search(
            user_id=user_id,
            document_id=document_id,
            query_embedding=query_embedding,
            top_k=5
        )
        documents = results["documents"][0]
        context = "\n\n".join(documents)

        prompt = f"""
You are AI PDF Assistant.
Answer ONLY using the information below.
If the answer is not available, replay:
'I couldn't find that information in the uploaded PDF.'
Context:{context}
Question:{question}
"""
        try:
            response = AIService.gemini.generate_content(prompt)
            return response.text
        except Exception:
            return {
                "Gemini API Quote Exceeded."
                "Please wait and try again."
            }