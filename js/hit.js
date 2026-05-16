// ==================== HIT DETECTION ====================
function checkHit(atk,def){
  if(!atk.atk||atk.hitCD>0)return;
  const ab=atk.atk,ax=atk.face>0?ab.x:ab.x-ab.w;
  const db={x:def.x-def.w/2,y:def.y-def.h,w:def.w,h:def.h};
  if(ax<db.x+db.w&&ax+ab.w>db.x&&ab.y<db.y+db.h&&ab.y+ab.h>db.y){
    const crit=ab.crit||atk.combo>5;
    let finalDmg=ab.dmg;
    if(crit&&atk.isP){finalDmg=Math.floor(ab.dmg*1.4);snd('crit')}

    // 连击加成: 每hit +2% 伤害
    const comboBonus=1+atk.combo*0.02;
    finalDmg=Math.floor(finalDmg*comboBonus);

    const dmg=def.takeHit(finalDmg,ab);
    atk.hitCD=ab.dmg>=20?16:ab.dmg>=14?12:8;
    atk.combo++;atk.comboT=60;
    // 终极技充能: 造成伤害 + 连击奖励
    atk.ult=Math.min(atk.maxUlt,atk.ult+ab.dmg*0.4+atk.combo*1.5);

    // 每种攻击不同的命中反馈
    const fxColor=ab.fxColor||'#fff';
    const fxCount=ab.fxCount||6;
    const hitX=(ax+ab.w/2+def.x)/2;
    const hitY=def.y-40;

    // 基础命中粒子
    burst(hitX,hitY,fxColor,fxCount,{type:'spark',spread:crit?14:8});

    // 攻击类型专属特效
    switch(atk.atkType){
      case'punch':
        // 拳: 小型橙色火花
        burst(hitX,hitY,'#f80',4,{size:2,spread:5});
        break;
      case'kick':
        // 踢: 白色弧线残影
        burst(hitX,hitY,'#fff',6,{size:3,spread:8});
        addTrail(hitX,hitY,'#fff');
        break;
      case'heavy':
        // 重击: 大型红色冲击波 + 地面裂缝
        burst(hitX,hitY,'#f44',12,{size:4,spread:16,upward:6});
        burst(hitX,GROUND,'#a44',6,{spread:20,upward:2,size:2});
        break;
      case'sweep':
        // 扫腿: 地面尘土
        burst(hitX,GROUND,'#a86',8,{spread:15,upward:3,size:2});
        break;
      case'uppercut':
        // 上勾拳: 向上飞散的火星
        burst(hitX,hitY,'#f80',10,{spread:6,upward:14,size:3});
        break;
      case'spinKick':
        // 旋风踢: 环形冲击波
        burst(hitX,hitY,'#ff0',14,{spread:12,upward:8,size:3,type:'spark'});
        addTrail(hitX,hitY,'#ff0');
        break;
      case'aerial':
        // 空中攻击: 蓝色下落粒子
        burst(hitX,hitY,'#4cf',8,{spread:5,upward:2,size:2});
        break;
      case'dashStrike':
        // 冲刺斩: 蓝色残影拖尾
        for(let t=0;t<4;t++)addTrail(hitX-atk.face*t*15,hitY,'#4cf');
        burst(hitX,hitY,'#4cf',10,{spread:10,size:3});
        break;
      case'counter':
        // 反击: 金色爆发
        burst(hitX,hitY,'#ff0',18,{spread:12,upward:10,size:4,type:'spark'});
        addHitFx(hitX,hitY,true);
        break;
      case'ultimate':
        // 终极技: 全屏粒子爆发
        burst(hitX,hitY,fxColor,25,{spread:20,upward:12,size:5,type:'spark'});
        burst(hitX,hitY,'#fff',10,{spread:8,upward:6,size:2});
        break;
    }

    // 命中停顿 (打击感)
    hitPauseT=crit?10:ab.dmg>=20?6:ab.dmg>=14?4:2;
    // 慢动作
    slowT=Math.max(slowT,ab.dmg>=20?12:ab.dmg>=14?8:4);
    // 屏幕震动
    shakeT=Math.max(shakeT,ab.dmg>=20?14:ab.dmg>=10?8:4);
    shakeI=Math.max(shakeI,ab.dmg>=20?12:ab.dmg>=10?6:3);

    stageScore.hits++;stageScore.combo++;
    if(stageScore.combo>stageScore.maxCombo)stageScore.maxCombo=stageScore.combo;

    // 连击显示
    if(atk.combo>1){
      const el=document.getElementById('comboDisplay');
      const labels=['','DOUBLE','TRIPLE','QUAD','PENTA','HEXA','MEGA','ULTRA','GODLIKE'];
      const label=atk.combo>=9?'GODLIKE':labels[atk.combo]||atk.combo+' HIT';
      el.textContent=(crit?'💥 ':'')+label+' COMBO';
      el.classList.add('show');
      clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),800);
    }
  }
}
