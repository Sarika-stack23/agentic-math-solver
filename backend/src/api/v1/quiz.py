import re
from fastapi import APIRouter
from backend.src.math.knowledge_indexer import KnowledgeIndexer

router = APIRouter()

# Global cache for the quiz structure to avoid parsing markdown on every request
_QUIZ_STRUCTURE_CACHE = None

def build_quiz_structure():
    global _QUIZ_STRUCTURE_CACHE
    if _QUIZ_STRUCTURE_CACHE is not None:
        return _QUIZ_STRUCTURE_CACHE

    indexer = KnowledgeIndexer()
    docs = indexer.load_markdown_files()
    
    quiz_tree = {}
    
    for doc in docs:
        m = doc.metadata
        cl = m.get("class_level", "")
        ch = m.get("chapter", "")
        ex = m.get("exercise", "")
        
        if not (cl and ch and ex):
            continue
            
        # The exact same regex used in the original Streamlit app to extract Q1, Q2, etc.
        qs = re.findall(r'Q\d+[^\n]*(?:\n(?!Q\d+)[^\n]*)*', doc.page_content)
        
        if qs:
            if cl not in quiz_tree:
                quiz_tree[cl] = {}
            if ch not in quiz_tree[cl]:
                quiz_tree[cl][ch] = {}
            quiz_tree[cl][ch][ex] = qs
            
    _QUIZ_STRUCTURE_CACHE = quiz_tree
    return quiz_tree

@router.get("/structure")
def get_quiz_structure():
    """Returns the nested tree of Classes -> Chapters -> Exercises -> Questions"""
    return build_quiz_structure()
