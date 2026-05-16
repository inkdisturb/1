// ==================== MAIN LOOP ====================
function loop(){
  X.save();
  if(shakeT>0){shakeT--;X.translate((Math.random()-0.5)*shakeI,(Math.random()-0.5)*shakeI)}
  drawBG(state==='fighting'||state==='paused'?curStage:0);

  if(state==='fighting'&&!paused){
    // Hit-pause (impact freeze frame)
    if(hitPauseT>0){hitPauseT--;X.restore();requestAnimationFrame(loop);return}
    if(slowT>0){slowT--}else{
      handleInput();
      player.update(boss);boss.update(player);ai.update(player);
      checkHit(player,boss);checkHit(boss,player);
      if(player.hurtT===10)stageScore.dmgTaken++;
      if(boss.spCD>0)boss.spCD--;
      if(beamOn){beamT--;if(beamT<=0)beamOn=false;else if(Math.abs(player.x-beamX)<35&&!player.blocking&&player.counterWindow<=0)player.takeHit(Math.floor(3*DIFF[diff].dmg),{kb:player.x>beamX?-3:3})}
      if(player.hp<=0)endStage('lose');else if(boss.hp<=0)endStage('win');
    }
    vignetteAlpha=Math.max(0,(1-player.hp/player.maxHp)*0.5);
    comboGlow=player.combo>3?Math.min(1,(player.combo-3)*0.15):0;
  }

  updateParticles();drawParticles();
  if(player&&(state==='fighting'||state==='paused')){player.draw();boss.draw()}
  if(beamOn){X.globalAlpha=0.25+Math.sin(Date.now()*0.02)*0.15;X.fillStyle='#c4f';X.fillRect(beamX-18,0,36,GROUND);X.globalAlpha=1}
  drawVignette();drawComboBorder();

  if(flashT>0){flashT--;X.globalAlpha=flashT/20*0.5;X.fillStyle=flashCol;X.fillRect(0,0,W,H);X.globalAlpha=1}

  if(player&&state==='fighting'){
    document.getElementById('pHP').style.width=(player.hp/player.maxHp*100)+'%';
    document.getElementById('pHPT').textContent=Math.max(0,Math.ceil(player.hp));
    document.getElementById('pUlt').style.width=(player.ult/player.maxUlt*100)+'%';
    document.getElementById('pUltP').textContent=Math.floor(player.ult/player.maxUlt*100)+'%';
    document.getElementById('eHP').style.width=(boss.hp/boss.bMax*100)+'%';
    document.getElementById('eHPT').textContent=Math.max(0,Math.ceil(boss.hp));
    document.getElementById('bossHP').style.width=(boss.hp/boss.bMax*100)+'%';
  }

  if(paused){X.fillStyle='rgba(0,0,0,0.65)';X.fillRect(0,0,W,H);X.fillStyle='#fff';X.font='bold 44px monospace';X.textAlign='center';X.shadowColor='#fff';X.shadowBlur=20;X.fillText('⏸ 暂停',W/2,H/2);X.shadowBlur=0;X.font='14px monospace';X.fillStyle='#666';X.fillText('按 P 继续',W/2,H/2+35);X.textAlign='left'}

  X.restore();
  requestAnimationFrame(loop);
}
loop();