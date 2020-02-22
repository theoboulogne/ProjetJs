let test =  (function(){
    function ligne(grid) 
        {
            for(let j=0; j<3; j++){
                let val = grid[0][j];
                if(val != undefined) for(let i=1; i<3; i++){
                    if(val != grid[i][j]) break; // pas alligné
                    else if(i==2) return val// alligné
                }
            }
            return 2;
        }

    function colonne(grid)
        {
            for(let j=0; j<3; j++){
                let val = grid[j][0];
                if(val != undefined) for(let i=1; i<3; i++){
                    if(val != grid[j][i]) break; // pas alligné
                    else if(i==2) return val; // alligné
                }
            }
            return 2;
        }

    function diagonale (grid) 
        {
            let val = grid[0][0];
            if(val != undefined) for(let i=1; i<3; i++){
                if(val != grid[i][i]){
                    break; // pas alligné
                }
                else if(i==2){ // alligné
                    return val
                }
            }

            val = grid[0][2];
            if(val != undefined) for(let i=1; i<3; i++){
                if(val != grid[i][2-i]){
                    break; // pas alligné
                }
                else if(i==2){ // alligné
                    return val
                }
            }

            return 2; // si pas alligné
        }

    return{
        Fin : (grid) =>
        {   // On enregistre en mémoire pour réduire le nombre d'appel de fonction en cas de renvoi
            let tmp = diagonale(grid); 
            if(tmp == 2) tmp = ligne(grid);
            if(tmp == 2) tmp = colonne(grid);

            if(tmp !=2) return tmp;
            return undefined;
        },
        
        CaseLibre : (grid) => {
            for(let i=0; i<3; i++) for(let j=0; j<3; j++){
                if(grid[i][j]==undefined) return false; // si case libre
            }
            return true; // si terrain plein
        },
    }
})();