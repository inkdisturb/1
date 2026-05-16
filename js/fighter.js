// ==================== FIGHTER ====================
class Fighter{
  constructor(x,isP,name){
    this.x=x;this.y=GROUND;this.vx=0;this.vy=0;
    this.w=42;this.h=74;this.isP=isP;this.name=name;
    this.face=isP?1:-1;
    this.hp=200;this.maxHp=200;this.ult=0;this.maxUlt=100;
    this.st='idle';this.stT=0;this.atk=null;this.atkType=null;this.hitCD=0;
    this.combo=0;this.comboT=0;this.blocking=false;this.blockT=0;
    this.hurtT=0;this.kb=0;this.af=0;this.at=0;
    this.dashCD=0;this.dashing=false;this.dashT=0;this.dashDir=0;
    this.grounded=true;this.colors=COLORS.player;
    this.chainJ=0;this.chainK=0;this.chainJTimer=null;this.chainKTimer=null;
    this.dashStrikeCD=0;this.counterWindow=0;
  }
  reset(x){
    this.x=x;this.y=GROUND;this.vx=0;this.vy=0;
    this.hp=this.maxHp;this.ult=0;this.st='idle';this.stT=0;
    this.atk=null;this.atkType=null;this.hitCD=0;this.combo=0;this.comboT=0;
    this.blocking=false;this.blockT=0;this.hurtT=0;this.kb=0;
    this.dashing=false;this.dashT=0;this.grounded=true;
    this.chainJ=0;this.chainK=0;this.dashStrikeCD=0;this.counterWindow=0;
  }
  get onG(){return this.grounded}
  update(tgt){
    this.at++;if(this.at>7){this.at=0;this.af=(this.af+1)%4}
    if(this.comboT>0){this.comboT--;if(this.comboT<=0)this.combo=0}
    if(this.hitCD>0)this.hitCD--;
    if(this.hurtT>0)this.hurtT--;
    if(this.dashCD>0)this.dashCD--;
    if(this.dashStrikeCD>0)this.dashStrikeCD--;
    if(this.counterWindow>0)this.counterWindow--;
    if(this.dashing){this.dashT--;this.vx=this.dashDir*12;if(this.dashT<=0)this.dashing=false}
    if(!this.grounded){this.vy+=GRAV;this.y+=this.vy;if(this.y>=GROUND){this.y=GROUND;this.vy=0;this.grounded=true}}
    if(this.kb!==0){this.x+=this.kb;this.kb*=0.82;if(Math.abs(this.kb)<0.3)this.kb=0}
    if(!this.dashing)this.x+=this.vx;
    this.x=Math.max(35,Math.min(W-35,this.x));
    if(this.grounded&&this.st!=='walk'&&!this.dashing)this.vx*=0.82;
    if(tgt)this.face=tgt.x>this.x?1:-1;
    if(this.stT>0){this.stT--;if(this.stT<=0){this.st='idle';this.atk=null;this.atkType=null;this.counterWindow=0}}
    this.blocking=this.st==='block'&&this.blockT>0;
    if(this.blockT>0)this.blockT--;if(this.blockT<=0&&this.st==='block')this.st='idle';
  }

  // ── 拳击系 ──
  punch(){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='punch';this.stT=10;this.hitCD=6;snd('punch');this.atkType='punch';
    // 快速轻拳: 低伤害、短前摇、小范围
    this.atk={x:this.x+this.face*22,y:this.y-48,w:50,h:32,dmg:6,kb:this.face*5,fxColor:'#fa0',fxCount:4}
  }
  uppercut(){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='uppercut';this.stT=18;this.hitCD=12;snd('heavy');this.atkType='uppercut';
    // 上勾拳: 中等伤害、击飞、带升空
    this.atk={x:this.x+this.face*18,y:this.y-65,w:50,h:55,dmg:14,kb:this.face*5,fxColor:'#f80',fxCount:8,lift:-8};
    this.vy=-8;
  }

  // ── 踢击系 ──
  kick(){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='kick';this.stT=14;this.hitCD=8;snd('kick');this.atkType='kick';
    // 中段踢: 中等伤害、中等击退
    this.atk={x:this.x+this.face*24,y:this.y-32,w:62,h:36,dmg:10,kb:this.face*12,fxColor:'#fff',fxCount:6}
  }
  sweep(){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='sweep';this.stT=16;this.hitCD=12;snd('kick');this.atkType='sweep';
    // 扫腿: 低伤害、大范围地面、击倒
    this.atk={x:this.x+this.face*18,y:this.y-12,w:75,h:22,dmg:8,kb:this.face*14,fxColor:'#f80',fxCount:5,groundFx:true}
  }
  spinKick(){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='spinKick';this.stT=20;this.hitCD=14;snd('kick');this.atkType='spinKick';
    // 旋风踢: 高伤害、360°范围、大击退
    this.atk={x:this.x+this.face*8,y:this.y-42,w:85,h:60,dmg:16,kb:this.face*18,fxColor:'#ff0',fxCount:10}
  }

  // ── 重击系 ──
  heavy(){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='heavy';this.stT=24;this.hitCD=18;snd('heavy');this.atkType='heavy';
    // 蓄力重击: 最高单次伤害、大击退、长前摇
    this.atk={x:this.x+this.face*18,y:this.y-58,w:72,h:58,dmg:26,kb:this.face*22,fxColor:'#f44',fxCount:15,crit:true}
  }

  // ── 空中 ──
  aerial(){
    if(this.grounded||this.st==='aerial')return;
    this.st='aerial';this.stT=14;this.hitCD=8;snd('whoosh');this.atkType='aerial';
    // 空中下劈: 中等伤害、快速下落
    this.atk={x:this.x+this.face*14,y:this.y-55,w:50,h:48,dmg:12,kb:this.face*8,fxColor:'#4cf',fxCount:6};
    this.vy=6;
  }

  // ── 特殊技 ──
  dashStrike(){
    if(this.dashStrikeCD>0||!this.dashing)return;
    this.dashStrikeCD=35;this.st='dashStrike';this.stT=16;this.hitCD=10;snd('crit');this.atkType='dashStrike';
    // 冲刺斩: 高伤害、长突进、带残影
    this.atk={x:this.x+this.face*18,y:this.y-50,w:65,h:48,dmg:20,kb:this.face*20,fxColor:'#4cf',fxCount:12};
    burst(this.x+this.face*30,this.y-40,'#4cf',15,{type:'spark',spread:10});
  }
  counter(){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='counter';this.stT=18;this.hitCD=12;this.counterWindow=6;snd('parry');this.atkType='counter';
    // 反击: 高伤害、大击退、需要精准时机
    this.atk={x:this.x+this.face*18,y:this.y-50,w:55,h:48,dmg:28,kb:this.face*24,fxColor:'#ff0',fxCount:14,crit:true};
  }
  ultimate(tgt){
    if(this.ult<this.maxUlt)return;if(this.st!=='idle'&&this.st!=='walk')return;
    this.ult=0;this.st='ultimate';this.stT=30;this.hitCD=24;snd('ultimate');
    this.x=tgt.x-this.face*60;
    // 终极技: 最高伤害、全屏闪白、长时间停顿
    this.atkType='ultimate';this.atk={x:this.x+this.face*10,y:this.y-68,w:90,h:82,dmg:45,kb:this.face*28,fxColor:this.isP?'#4cf':'#f55',fxCount:30,crit:true};
    flashT=18;shakeT=24;shakeI=16;slowT=20;
    burst(this.x,this.y-40,this.isP?'#4cf':'#f55',35,{spread:16,upward:12,type:'spark'});snd('slam');
  }

  dash(dir){if(this.dashCD>0||this.dashing)return;this.dashing=true;this.dashT=8;this.dashDir=dir;this.dashCD=28;snd('dash')}
  dodge(dir){if(this.dashCD>0)return;this.dashCD=22;this.kb=dir*15;snd('dash');burst(this.x,this.y-40,'#fff',5,{spread:4})}
  block(){if(this.st!=='idle'&&this.st!=='walk')return;this.st='block';this.blockT=22;snd('block')}
  jump(){
    if(!this.grounded||this.dashing)return;
    this.vy=-14;this.grounded=false;
    if(this.st!=='idle'&&this.st!=='walk'){this.st='idle';this.stT=0;this.atk=null;this.atkType=null}
    snd('whoosh')
  }
  move(dir){if(this.st==='heavy'||this.st==='ultimate'||this.dashing)return;this.vx=dir*5.5}

  takeHit(d,atk){
    let dmg=d,kb=atk.kb;
    if(this.counterWindow>0){
      dmg=Math.floor(d*0.25);kb*=0.15;snd('parry');
      burst(this.x+this.face*28,this.y-40,'#ff0',20,{spread:8,type:'spark'});
      addHitFx(this.x,this.y-40,true);this.counterWindow=0;stageScore.parries++;
      this.hp=Math.max(0,this.hp-dmg);this.kb=kb;
      addDmgNum(this.x,this.y-70,dmg,'#ff0',false);
      return dmg;
    }
    if(this.blocking){dmg=Math.floor(d*0.1);kb*=0.1;burst(this.x+this.face*28,this.y-40,'#fff',4,{spread:4});snd('block')}
    else{
      this.hurtT=10;snd('hit');
      // 每种攻击不同的受击特效
      const fxCol=atk.fxColor||'#fa0';
      const fxN=atk.fxCount||8;
      burst(this.x,this.y-40,fxCol,fxN,{type:'spark',spread:atk.dmg>=18?12:6});
      if(atk.groundFx)burst(this.x,this.y-10,'#f80',6,{spread:10,upward:2});
      addHitFx(this.x,this.y-40,atk.dmg>=18);
      if(atk.lift)this.vy=atk.lift;
    }
    this.hp=Math.max(0,this.hp-dmg);this.kb=kb;
    // 终极技充能: 受击也能积攒（被打反击欲望）
    this.ult=Math.min(this.maxUlt,this.ult+dmg*0.5);
    addDmgNum(this.x,this.y-70,dmg,this.isP?'#f55':'#4cf',atk.crit||false);
    return dmg;
  }
  draw(){
    drawCharacter(this.x,this.y,this.hp,this.maxHp,this.isP,this.st,this.combo,this.face,this.af,this.hurtT,this.blocking,this.atkType,this.colors);
  }
}
