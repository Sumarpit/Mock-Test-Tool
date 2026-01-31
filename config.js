// config.js

// --- 1. GITHUB CONFIGURATION ---
const REPO_OWNER = "Sumarpit";
const REPO_NAME = "SEBI-Mock-Test-Tool";

// --- 2. EXAM PROFILES ---
const EXAM_PROFILES = {
    'SEBI': { 
        name: 'SEBI Grade A (Phase 1)', 
        folder: 'tests/sebi',   
        marks: 1.25,            
        neg: 0.3125,            
        time: [1, 0, 0]         
    },
    
    // --- NEW: PHASE 2 PROFILE ---
    'SEBI_P2': { 
        name: 'SEBI Grade A (Phase 2)', 
        folder: 'tests/sebi/p2', // Creates a separate subfolder for P2 tests
        marks: 1.0,              // 1 Marks per question (100 Qs = 100 Marks)
        neg: 0.25,               // 1/4th Negative Marking
        time: [0, 40, 0]         // STRICT 40 Minutes Timer
    },

    'NABARD_P1': {  
        name: 'NABARD Phase 1',  
        folder: 'tests/nabard/p1', 
        marks: 1.0,  
        neg: 0.25,    
        time: [2, 0, 0]          
    },
    
    'NABARD_P2': { 
        name: 'NABARD Phase 2 (Obj+Desc)', 
        folder: 'tests/nabard/p2', 
        marks: 1.0,              
        neg: 0.25,    
        time: [1, 30, 0]        
    },
    
    'RBI': { 
        name: 'RBI Grade B',  
        folder: 'tests/rbi',    
        marks: 1.0,  
        neg: 0.25,    
        time: [2, 0, 0] 
    },
    
    'SSC': { 
        name: 'SSC CGL',       
        folder: 'tests/ssc',    
        marks: 2.0,  
        neg: 0.50,    
        time: [1, 0, 0] 
    },
    
    'UPSC': { 
        name: 'UPSC CSE',      
        folder: 'tests/upsc',    
        marks: 2.0,  
        neg: 0.66,    
        time: [2, 0, 0], // Updated to standard 2 hours for UPSC GS
        shuffle: false 
    }
};
