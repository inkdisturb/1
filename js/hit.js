// ==================== HIT DETECTION ====================
function checkHit(atk,def){
  if(!atk.atk||atk.hitCD>0)return;
  const ab=atk.atk,ax=atk.face>0?ab.x:ab.x-ab.w;
  const db={x:def.x-def.w/2,y:def.y-def.h,w:def.w,h:def.h};
  if(ax<db.x+db.w&&ax+ab.w>db.x&&ab.y<db.y+db.h&&ab.y+ab.h>db.y){
    // Critical hit: combo > 4 or heavy/ultimate
    const crit=atk.combo>4||ab.dmg>=22;
    let finalDmg=ab.dmg;
    if(crit&&atk.isP){finalDmg=Math.floor(ab.dmg*1.5);snd('crit')}
    const dmg=def.takeHit(finalDmg,ab);
    atk.hitCD=ab.dmg>=22?22:ab.dmg>=35?28:15;
    atk.combo++;atk.comboT=50;atk.ult=Math.min(atk.maxUlt,atk.ult+ab.dmg*0.3);
    // Hit-stop for impact feel
    hitPauseT=crit?8:ab.dmg>=22?5:3;
    slowT=Math.max(slowT,ab.dmg>=22?10:ab.dmg>=35?16:5);
    shakeT=Math.max(shakeT,ab.dmg>=22?12:ab.dmg>=35?18:6);
    shakeI=Math.max(shakeI,ab.dmg>=22?8:ab.dmg>=35?14:4);
    stageScore.hits++;stageScore.combo++;if(stageScore.combo>stageScore.maxCombo)stageScore.maxCombo=stageScore.combo;
    if(atk.combo>1){const el=document.getElementById('comboDisplay');el.textContent=(crit?'💥 ':'')+atk.combo+' HIT COMBO';el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),600)}
    burst((ax+ab.w/2+def.x)/2,def.y-40,crit?'#ff0':'#fff',crit?12:5,{type:'spark'});
  }
}