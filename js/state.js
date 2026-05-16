// ==================== STATE ====================
let state='title',diff=1,curStage=0,stageTimer=0,paused=false;
let stageScore={combo:0,maxCombo:0,hits:0,dmgTaken:0,time:0,parries:0};
let totalScores=[];
let particles=[],dmgNums=[],hitFx=[],trails=[];
let shakeT=0,shakeI=0,flashT=0,flashCol='#fff',slowT=0;
let hitPauseT=0; // hit-stop for impact feel
let vignetteAlpha=0,comboGlow=0;
let roundStart=0,beamOn=false,beamX=0,beamT=0;
let timerInterval=null;

const keys={};
const justPressed={};
document.addEventListener('keydown',e=>{
  initAudio();
  if(!keys[e.code])justPressed[e.code]=true;
  keys[e.code]=true;
  e.preventDefault();
  // Skip story / intro screens
  if(state==='story'){nextFromStory();return}
  if(state==='stageIntro'){clearTimeout(_stageIntroTO);showBossIntro();return}
  if(state==='bossIntro'){clearTimeout(_bossIntroTO);startFight();return}
});
document.addEventListener('keyup',e=>{keys[e.code]=false;e.preventDefault()});
function clearJustPressed(){for(const k in justPressed)delete justPressed[k]}