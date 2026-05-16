// ==================== INPUT ====================
function handleInput(){
  if(!player||state!=='fighting'||paused)return;
  player.vx=0;

  // Dodge (Shift)
  if(justPressed['ShiftLeft']||justPressed['ShiftRight']){
    if(keys['KeyA']||keys['ArrowLeft'])player.dodge(1);
    else if(keys['KeyD']||keys['ArrowRight'])player.dodge(-1);
    else player.dodge(player.face*-1);
  }

  // Movement
  if(!player.dashing){
    if(keys['KeyA']||keys['ArrowLeft'])player.move(-1);
    if(keys['KeyD']||keys['ArrowRight'])player.move(1);
  }

  // Jump — FIXED: reliable single-trigger via justPressed
  if(justPressed['KeyW']||justPressed['ArrowUp']){
    player.jump();
  }

  // J combo chain: punch → uppercut → heavy
  if(justPressed['KeyJ']){
    if(keys['KeyS']||keys['ArrowDown']){
      if(!player.onG)player.aerial();
      else player.heavy();
    }else if(!player.onG){
      player.aerial();
    }else if(player.dashing){
      player.dashStrike(boss);
    }else{
      player.chainJ++;
      if(player.chainJ===1)player.punch();
      else if(player.chainJ===2)player.uppercut();
      else{player.heavy();player.chainJ=0}
      clearTimeout(player.chainJTimer);
      player.chainJTimer=setTimeout(()=>{player.chainJ=0},600);
    }
  }
  // K combo chain: kick → sweep → spinKick
  if(justPressed['KeyK']){
    if(!player.onG)player.aerial();
    else if(keys['KeyS']||keys['ArrowDown'])player.sweep();
    else if(player.dashing){
      player.dashStrike(boss);
    }else{
      player.chainK++;
      if(player.chainK===1)player.kick();
      else if(player.chainK===2)player.sweep();
      else{player.spinKick();player.chainK=0}
      clearTimeout(player.chainKTimer);
      player.chainKTimer=setTimeout(()=>{player.chainK=0},600);
    }
  }
  if(keys['KeyL'])player.block();
  // NEW: Q for counter/parry
  if(justPressed['KeyQ'])player.counter(boss);
  if(justPressed['Space'])player.ultimate(boss);

  // Pause
  if(justPressed['KeyP'])paused=!paused;

  clearJustPressed();
}