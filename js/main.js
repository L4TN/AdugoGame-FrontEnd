import { checkGameOver, getCell, getCoordinates } from "./getcheck.js";
import {
    highlightCells,
    highlightOccupiedCells,
    isCellHighlighted,
    removeHighlight,
} from "./highlight.js";
import {
    isJaguar,
    isPiece,
    isValidMove,
    jaguarEat,
    movePiece,
    selectPiece,
} from "./pieces.js";
import { cells, selectedPiece } from "./variables.js";
/*



*/
function onInitGame() {
    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            if (isPiece(cell)) {
                selectPiece(cell);
                highlightCells();
                highlightOccupiedCells();
            } else if (selectedPiece) {
                const [selectedX, selectedY] = getCoordinates(selectedPiece);
                const [currentX, currentY] = getCoordinates(cell);

                var cellAtual = getCell(currentX, currentY);
                var cellProx = getCell(selectedX, selectedY);

                if (
                    isJaguar(selectedPiece) &&
                    !isValidMove(cellAtual, cellProx)
                ) {
                    jaguarEat(selectedPiece,cellAtual);
                    removeHighlight();
                }

                if (
                    isValidMove(cellAtual, cellProx) &&
                    !isPiece(cell) &&
                    isCellHighlighted(cell)
                ) {
                    movePiece(cell);
                    removeHighlight();
                }
            }
        });
    });
}

onInitGame();

window.addEventListener("load", function () {
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    // Animação de desaparecimento
    loadingScreen.style.transition = "opacity 1s ease-in-out";

    // Após 5 segundos, comece a animação de desaparecimento
    setTimeout(() => {
        loadingScreen.style.opacity = "0";
    }, 2000);

    // Após a animação de desaparecimento, remova a tela de carregamento e mostre o conteúdo principal
    setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
    }, 3000); // Este tempo deve ser a soma do tempo de espera antes da animação iniciar e a duração da animação
});

setInterval(function () {
    checkGameOver();
}, 1000);

var audio = new Audio("music.mp3");
audio.volume = 0.3;

document.getElementById("play-button").addEventListener("click", function () {
    audio.play();
});

document.getElementById("mute-Button").addEventListener("click", function () {
    if (audio.muted) {
        audio.muted = false;
    } else {
        audio.muted = true;
    }
});

document.querySelectorAll(".piece-jaguar").forEach((element) => {
    element.addEventListener("click", () => {
        const gif = document.getElementById("myGif");
        gif.style.display = "block";

        setTimeout(() => {
            gif.style.display = "none";
        }, 2000);
    });
});

// Função para verificar novo movimento
function checkForNewMove() {
    fetch('https://adugo-game-backend-01.onrender.com/api/check', {
        headers: {
            'Content-Type': 'application/json',
            'Allow-Control-Allow-Origin': '*',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'move available') {
            console.log('Novo movimento disponível:', data.move);
            // Atualizar o tabuleiro aqui com o novo movimento recebido
            updateBoard(data.move);
        } else {
            console.log('Nenhum novo movimento disponível');
            //print o status do erro
            
        }
    })
    .catch(error => {
        console.error('Ocorreu um erro ao verificar o novo movimento:', error);
        //print o status do erro
    });
}

  function updateBoard(newMove) {
    Array.from(cells).forEach((cell) => {
      const cellX = parseInt(cell.getAttribute("data-x"));
      const cellY = parseInt(cell.getAttribute("data-y"));
  
      const move = newMove.find((move) => {
        const x = parseInt(move.x);
        const y = parseInt(move.y);
        return x === cellX && y === cellY;
      });
  
      if (move) {
        const classNames = move.classList.join(" ");
        cell.className = "cell " + classNames;
      }
    });

    highlightCells();
  }
    
// Chamar a função checkForNewMove a cada 1 segundo
setInterval(checkForNewMove, 1000); // 1 segundo
