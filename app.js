// Fresh Tic Tac Toe implementation
(function(){
  const WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  // Elements
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const newRoundBtn = document.getElementById('newRound');
  const resetScoresBtn = document.getElementById('resetScores');
  const scoreX = document.getElementById('scoreX');
  const scoreO = document.getElementById('scoreO');
  const scoreD = document.getElementById('scoreD');
  const difficultySel = document.getElementById('difficulty');
  const playerSymbolSel = document.getElementById('playerSymbol');

  // State
  let board = Array(9).fill('');
  let current = 'X';
  let mode = 'pvp';
  let playerSymbol = 'X';
  let difficulty = 'easy';
  let scores = {X:0,O:0,D:0};

  const SCORE_KEY = 'ttt:fresh:scores';
  const SETTINGS_KEY = 'ttt:fresh:settings';

  // init
  function init(){
    // wire controls
    document.querySelectorAll('input[name="mode"]').forEach(r=>{
      r.addEventListener('change', e=>{ mode = e.target.value; saveSettings(); resetBoard(); });
    });
    difficultySel.addEventListener('change', e=>{ difficulty = e.target.value; saveSettings(); });
    playerSymbolSel.addEventListener('change', e=>{ playerSymbol = e.target.value; saveSettings(); resetBoard(); });
    newRoundBtn.addEventListener('click', resetBoard);
    resetScoresBtn.addEventListener('click', ()=>{ scores={X:0,O:0,D:0}; saveScores(); renderScores(); });

    loadSettings();
    loadScores();
    buildBoard();
    resetBoard();
  }

  function saveScores(){ try{ localStorage.setItem(SCORE_KEY, JSON.stringify(scores)); }catch(e){} }
  function loadScores(){ try{ const raw = localStorage.getItem(SCORE_KEY); if(raw) scores = JSON.parse(raw); }catch(e){} renderScores(); }
  function saveSettings(){ try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify({mode,difficulty,playerSymbol})); }catch(e){} }
  function loadSettings(){ try{ const raw = localStorage.getItem(SETTINGS_KEY); if(raw){ const s = JSON.parse(raw); mode = s.mode||mode; difficulty = s.difficulty||difficulty; playerSymbol = s.playerSymbol||playerSymbol; // reflect UI
      document.querySelectorAll('input[name="mode"]').forEach(r=> r.checked = r.value===mode);
      difficultySel.value = difficulty; playerSymbolSel.value = playerSymbol;
    }}catch(e){} }

  function buildBoard(){ boardEl.innerHTML=''; for(let i=0;i<9;i++){ const b = document.createElement('button'); b.className='cell'; b.dataset.index = i; b.setAttribute('aria-label', `Square ${i+1}`); b.addEventListener('click', onCellClick); b.addEventListener('keydown', onCellKeydown); boardEl.appendChild(b);} }
  function onCellKeydown(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.currentTarget.click(); } }

  function onCellClick(e){ const i = Number(e.currentTarget.dataset.index); if(board[i] || isRoundOver()) return; playerMove(i); }

  function isRoundOver(){ return WIN_COMBOS.some(c=> board[c[0]] && board[c[0]]===board[c[1]] && board[c[1]]===board[c[2]]) || board.every(x=>x); }

  function playerMove(i){ const player = current; makeMove(i, player); if(!isRoundOver() && mode==='pvc' && current !== player){ // computer turn
    setTimeout(()=> computerMove(), 250); } }

  function makeMove(i, player){ if(board[i]) return false; board[i]=player; renderCell(i); const win = checkWin(player); if(win){ statusEl.innerText = `${player} wins!`; scores[player]++; saveScores(); renderScores(); highlight(win); return true;} if(board.every(x=>x)){ statusEl.innerText = `Draw.`; scores.D++; saveScores(); renderScores(); return true;} current = (player==='X')?'O':'X'; statusEl.innerText = `Turn: ${current}`; return true; }

  function checkWin(player){ for(const c of WIN_COMBOS){ if(board[c[0]]===player && board[c[1]]===player && board[c[2]]===player) return c; } return null; }
  function highlight(combo){ combo.forEach(i=>{ const el = boardEl.querySelector(`[data-index='${i}']`); if(el) el.classList.add('highlight'); }); }

  function renderCell(i){ const el = boardEl.querySelector(`[data-index='${i}']`); if(!el) return; el.textContent = board[i]||''; el.classList.toggle('x', board[i]==='X'); el.classList.toggle('o', board[i]==='O'); if(board[i]) el.setAttribute('aria-disabled','true'); else el.removeAttribute('aria-disabled'); }
  function renderScores(){ scoreX.textContent = scores.X||0; scoreO.textContent = scores.O||0; scoreD.textContent = scores.D||0; }

  function resetBoard(){ board = Array(9).fill(''); current = 'X'; // default start is X; if player chosen O then human is O but X still starts unless we swap
    // For PvC, if playerSymbol==='O' and we want human to play O, the computer (X) should start
    // We'll keep X starts; if human selected O they will be second.
    boardEl.querySelectorAll('.cell').forEach(c=>{ c.classList.remove('highlight','x','o'); c.textContent=''; c.removeAttribute('aria-disabled'); });
    statusEl.innerText = `Turn: ${current}`;
    // If PvC and computer is starting (player chose O so computer is X), let computer move
    if(mode==='pvc'){ const computer = playerSymbol==='X' ? 'O' : 'X'; if(computer === current){ setTimeout(()=> computerMove(), 300); } }
  }

  function computerMove(){ if(isRoundOver()) return; const comp = playerSymbol === 'X' ? 'O' : 'X'; let idx = null; if(difficulty==='easy'){ const empties = board.map((v,i)=>v?null:i).filter(v=>v!==null); idx = empties[Math.floor(Math.random()*empties.length)]; }
    else if(difficulty==='medium'){ idx = mediumChoice(comp); if(idx===null){ const empties = board.map((v,i)=>v?null:i).filter(v=>v!==null); idx = empties[Math.floor(Math.random()*empties.length)]; } }
    else { idx = bestMove(board.slice(), comp); }
    if(typeof idx === 'number') makeMove(idx, comp);
  }

  function mediumChoice(comp){ const opp = comp==='X'?'O':'X'; // win
    for(let i=0;i<9;i++) if(!board[i]){ board[i]=comp; if(checkWin(comp)){ board[i]=''; return i } board[i]=''; }
    // block
    for(let i=0;i<9;i++) if(!board[i]){ board[i]=opp; if(checkWin(opp)){ board[i]=''; return i } board[i]=''; }
    if(!board[4]) return 4; const corners=[0,2,6,8].filter(i=>!board[i]); if(corners.length) return corners[Math.floor(Math.random()*corners.length)]; return null; }

  // minimax
  function bestMove(bd, player){ let bestScore = -Infinity; let move = null; for(let i=0;i<9;i++){ if(!bd[i]){ bd[i]=player; const score = minimax(bd, false, player); bd[i]=''; if(score>bestScore){ bestScore=score; move=i; } } } return move; }
  function minimax(bd, isMax, player){ const opponent = player==='X'?'O':'X'; if(checkArrayWin(bd, player)) return 10; if(checkArrayWin(bd, opponent)) return -10; if(bd.every(x=>x)) return 0; if(isMax){ let best=-Infinity; for(let i=0;i<9;i++) if(!bd[i]){ bd[i]=player; const val=minimax(bd,false,player); bd[i]=''; best = Math.max(best,val);} return best;} else { let best=Infinity; for(let i=0;i<9;i++) if(!bd[i]){ bd[i]=opponent; const val=minimax(bd,true,player); bd[i]=''; best = Math.min(best,val);} return best; } }
  function checkArrayWin(arr, player){ return WIN_COMBOS.some(c=> arr[c[0]]===player && arr[c[1]]===player && arr[c[2]]===player); }

  // expose for debugging
  window.tttFresh = { resetBoard, scores };

  init();
})();

