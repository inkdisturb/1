// ==================== GAME FLOW ====================
let player=null,boss=null,ai=null;
let _stageIntroTO=null,_bossIntroTO=null;

function hideAll(){document.querySelectorAll('.overlay').forEach(el=>el.classList.remove('show'))}
function showDiff(){snd('select');hideAll();document.getElementById('diffScreen').classList.add('show')}
function pickDiff(d){snd('select');diff=d;totalScores=[];curStage=0;showStory()}
function showStory(){hideAll();state='story';const st=STAGES[curStage];document.getElementById('storyChapter').textContent=st.story.ch+' · '+st.story.title;document.getElementById('storyText').innerHTML=st.story.text;document.getElementById('storyScreen').classList.add('show')}
function nextFromStory(){snd('select');showStageIntro()}
function showStageIntro(){hideAll();state='stageIntro';const st=STAGES[curStage];document.getElementById('siNum').textContent='— 第'+st.num+'关 —';document.getElementById('siName').textContent=st.emoji+' '+st.name;document.getElementById('siSub').textContent=st.sub;document.getElementById('stageIntro').classList.add('show');_stageIntroTO=setTimeout(()=>showBossIntro(),2000)}
function showBossIntro(){hideAll();state='bossIntro';const st=STAGES[curStage];document.getElementById('biEmoji').textContent=st.emoji;document.getElementById('biName').textContent=st.boss;document.getElementById('biSub').textContent='"来吧，暗影的余孽"';document.getElementById('bossIntro').classList.add('show');_bossIntroTO=setTimeout(()=>startFight(),2200)}
function startFight(){
  hideAll();state='fighting';paused=false;
  player=new Fighter(200,true,'暗影武士');player.maxHp=300+curStage*30;player.hp=player.maxHp;player.colors=COLORS.player;
  boss=createBoss(curStage);ai=new BossAI(boss);
  stageScore={combo:0,maxCombo:0,hits:0,dmgTaken:0,time:0,parries:0};roundStart=Date.now();stageTimer=150;beamOn=false;vignetteAlpha=0;comboGlow=0;
  document.getElementById('enemyName').textContent=STAGES[curStage].emoji+' '+STAGES[curStage].boss;
  document.getElementById('bossBar').classList.add('show');document.getElementById('bossName').textContent=STAGES[curStage].boss;
  document.getElementById('hud').classList.add('show');document.getElementById('pHPM').textContent=player.maxHp;document.getElementById('eHPM').textContent=boss.bMax;
  startBGM();
  if(timerInterval)clearInterval(timerInterval);timerInterval=setInterval(()=>{if(state!=='fighting'||paused)return;stageTimer--;document.getElementById('timerDisplay').textContent=stageTimer;if(stageTimer<=0)endStage(player.hp>boss.hp?'win':'lose')},1000);
}
function endStage(result){stopBGM();if(timerInterval)clearInterval(timerInterval);stageScore.time=Math.floor((Date.now()-roundStart)/1000);if(result==='win'){snd('victory');flashT=20;flashCol='#ff0';const sc=calcScore();totalScores.push(sc);setTimeout(()=>showStageSelect(),1200)}else{snd('death');setTimeout(()=>showGameOver(),800)}}
function calcScore(){const s=stageScore;return Math.max(0,s.maxCombo*100+s.hits*50+s.parries*200+Math.max(0,stageTimer*10)-s.dmgTaken*5)}
function showStageSelect(){state='stageSelect';hideAll();document.getElementById('bossBar').classList.remove('show');document.getElementById('hud').classList.remove('show');const st=STAGES[curStage];document.getElementById('ssTitle').textContent='✅ '+st.boss+' 已击败！';document.getElementById('ssSub').textContent='得分: '+totalScores[totalScores.length-1];if(curStage<STAGES.length-1){document.getElementById('ssNextBtn').style.display='block';document.getElementById('ssNextBtn').textContent='▶ 前往: '+STAGES[curStage+1].name}else{document.getElementById('ssNextBtn').style.display='none'}document.getElementById('stageSelect').classList.add('show')}
function goNextStage(){snd('select');curStage++;showStory()}
function showGameOver(){state='gameOver';hideAll();document.getElementById('bossBar').classList.remove('show');document.getElementById('hud').classList.remove('show');const st=STAGES[curStage];document.getElementById('goTitle').textContent='💀 战败';document.getElementById('goTitle').style.color='#f55';document.getElementById('goDetail').textContent='倒在了'+st.boss+'面前...';document.getElementById('goStats').innerHTML=`连击数: ${stageScore.maxCombo}<br>命中: ${stageScore.hits}<br>完美格挡: ${stageScore.parries}<br>受伤: ${stageScore.dmgTaken}<br>用时: ${stageScore.time}秒`;document.getElementById('gameOverScreen').classList.add('show')}
function retryStage(){snd('select');showStageIntro()}
function showVictory(){state='victory';hideAll();document.getElementById('bossBar').classList.remove('show');document.getElementById('hud').classList.remove('show');let html='';let total=0;totalScores.forEach((s,i)=>{html+=`<div class="score-line">第${i+1}关 ${STAGES[i].boss}: ${s}分</div>`;total+=s});document.getElementById('vScores').innerHTML=html;document.getElementById('vTotal').textContent='总分: '+total;document.getElementById('victoryScreen').classList.add('show');saveScore(total)}
function goTitle(){snd('select');stopBGM();if(timerInterval)clearInterval(timerInterval);if(_stageIntroTO)clearTimeout(_stageIntroTO);if(_bossIntroTO)clearTimeout(_bossIntroTO);state='title';hideAll();document.getElementById('hud').classList.remove('show');document.getElementById('bossBar').classList.remove('show');document.getElementById('titleScreen').classList.add('show')}
function saveScore(sc){const lb=JSON.parse(localStorage.getItem('sf_lb')||'[]');lb.push({score:sc,date:new Date().toLocaleDateString(),diff:DIFF_N[diff]});lb.sort((a,b)=>b.score-a.score);if(lb.length>10)lb.length=10;localStorage.setItem('sf_lb',JSON.stringify(lb))}
function showLb(){snd('select');hideAll();state='leaderboard';const lb=JSON.parse(localStorage.getItem('sf_lb')||'[]');let html='';if(!lb.length)html='<div style="color:#444;padding:30px;text-align:center">暂无记录</div>';else lb.forEach((e,i)=>{html+=`<div class="lb-row${i===0?' top':''}"><span class="lb-rank">#${i+1}</span><span>${e.diff} · ${e.date}</span><span class="lb-score">${e.score}</span></div>`});document.getElementById('lbTable').innerHTML=html;document.getElementById('lbScreen').classList.add('show')}