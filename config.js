// config.js

// --- 1. GITHUB CONFIGURATION ---
const REPO_OWNER = "Sumarpit";
const REPO_NAME = "SEBI-Mock-Test-Tool";

// --- 2. EXAM PROFILES ---
const EXAM_PROFILES = {
    'SEBI': { 
        name: 'SEBI Grade A', 
        folder: 'tests/sebi',   
        marks: 1.25,            
        neg: 0.3125,            
        time: [1, 0, 0]         
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
        time: [1, 0, 0],
        shuffle: false // Options will NOT shuffle for UPSC
    }
};
