import numpy as np
from sentence_transformers import SentenceTransformer

class AIService:
    def __init__(self):
        # Load a lightweight, high-performance local embedding model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Local in-memory vector workspace matrix storage
        self.vector_db = []

    def add_startup_to_vector_store(self, startup_id: int, text_content: str):
        """
        Converts startup summaries/pitches into a semantic embedding vector 
        and links it directly to its MySQL auto-incrementing table ID.
        """
        if not text_content or not text_content.strip():
            return

        clean_text = " ".join(text_content.split())
        embedding = self.model.encode(clean_text)
        
        # Avoid duplicate vector configurations for the same startup record
        self.vector_db = [item for item in self.vector_db if item["startup_id"] != startup_id]
        
        self.vector_db.append({
            "startup_id": startup_id,
            "vector": embedding
        })
        print(f"INFO: Successfully indexed vector properties for Startup ID: {startup_id}")

    def search_similar_startups(self, query_text: str, top_k: int = 6):
        """
        Computes cosine similarities between the search query vector and stored vectors, 
        returning a prioritized list of matching integer IDs.
        """
        if not self.vector_db or not query_text.strip():
            return []

        query_vector = self.model.encode(query_text)
        rankings = []

        for item in self.vector_db:
            dot_product = np.dot(query_vector, item["vector"])
            norm_q = np.linalg.norm(query_vector)
            norm_i = np.linalg.norm(item["vector"])
            
            similarity = float(dot_product / (norm_q * norm_i)) if (norm_q * norm_i) > 0 else 0.0
            
            rankings.append({
                "startup_id": item["startup_id"],
                "score": similarity
            })

        rankings.sort(key=lambda x: x["score"], reverse=True)
        return [item["startup_id"] for item in rankings[:top_k]]


# 🟢 CONNECTION 1: Instance used by search.py
ai_service = AIService()

# 🟢 CONNECTION 2: Legacy wrapper functions used by startups.py
def index_startup_application(startup_id: int, text_content: str):
    """Exposes embedding generator directly to the startup ingestion router."""
    return ai_service.add_startup_to_vector_store(startup_id, text_content)

def semantic_search_deals(query_text: str, top_k: int = 6):
    """Exposes vector calculations directly to the startup ingestion router."""
    return ai_service.search_similar_startups(query_text, top_k)