// ==================== FIGHTER ====================
class Fighter{
  constructor(x,isP,name){
    this.x=x;this.y=GROUND;this.vx=0;this.vy=0;
    this.w=42;this.h=74;this.isP=isP;this.name=name;
    this.face=isP?1:-1;
    this.hp=100;this.maxHp=100;this.ult=0;this.maxUlt=100;
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
    // Dash
    if(this.dashing){this.dashT--;this.vx=this.dashDir*12;if(this.dashT<=0)this.dashing=false}
    // Gravity — FIXED: use grounded flag properly
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
  punch(){if(this.st!=='idle'&&this.st!=='walk')return;this.st='punch';this.stT=12;this.hitCD=7;snd('punch');this.atkType='punch';this.atk={x:this.x+this.face*25,y:this.y-48,w:58,h:36,dmg:8,kb:this.face*6}}
  kick(){if(this.st!=='idle'&&this.st!=='walk')return;this.st='kick';this.stT=16;this.hitCD=10;snd('kick');this.atkType='kick';this.atk={x:this.x+this.face*25,y:this.y-32,w:68,h:40,dmg:12,kb:this.face*10}}
  heavy(){if(this.st!=='idle'&&this.st!=='walk')return;this.st='heavy';this.stT=26;this.hitCD=20;snd('heavy');this.atkType='heavy';this.atk={x:this.x+this.face*20,y:this.y-58,w:78,h:62,dmg:22,kb:this.face*18}}
  sweep(){if(this.st!=='idle'&&this.st!=='walk')return;this.st='sweep';this.stT=18;this.hitCD=14;snd('kick');this.atkType='sweep';this.atk={x:this.x+this.face*20,y:this.y-10,w:70,h:25,dmg:10,kb:this.face*8}}
  uppercut(){if(this.st!=='idle'&&this.st!=='walk')return;this.st='uppercut';this.stT=20;this.hitCD=14;snd('heavy');this.atkType='uppercut';this.atk={x:this.x+this.face*20,y:this.y-65,w:55,h:55,dmg:16,kb:this.face*6};this.vy=-6}
  spinKick(){if(this.st!=='idle'&&this.st!=='walk')return;this.st='spinKick';this.stT=22;this.hitCD=16;snd('kick');this.atkType='spinKick';this.atk={x:this.x+this.face*10,y:this.y-40,w:80,h:60,dmg:18,kb:this.face*14}}
  aerial(){
    if(this.grounded||this.st==='aerial')return;this.st='aerial';this.stT=15;this.hitCD=10;snd('whoosh');this.atkType='aerial';
    this.atk={x:this.x+this.face*15,y:this.y-55,w:55,h:50,dmg:14,kb:this.face*10};
    this.vy=5;
  }
  // NEW: Dash strike — attack during dash
  dashStrike(tgt){
    if(this.dashStrikeCD>0||!this.dashing)return;
    this.dashStrikeCD=40;this.st='dashStrike';this.stT=18;this.hitCD=12;snd('crit');
    this.atkType='dashStrike';this.atk={x:this.x+this.face*20,y:this.y-50,w:70,h:50,dmg:20,kb:this.face*16};
    burst(this.x+this.face*30,this.y-40,'#4cf',12,{type:'spark',spread:8});
  }
  // NEW: Counter — block within 5 frames of attack = parry + counter
  counter(tgt){
    if(this.st!=='idle'&&this.st!=='walk')return;
    this.st='counter';this.stT=20;this.hitCD=15;this.counterWindow=5;snd('parry');
    this.atkType='counter';this.atk={x:this.x+this.face*20,y:this.y-50,w:60,h:50,dmg:24,kb:this.face*20};
  }
  dash(dir){
    if(this.dashCD>0||this.dashing)return;
    this.dashing=true;this.dashT=8;this.dashDir=dir;this.dashCD=30;snd('dash');
  }
  dodge(dir){
    if(this.dashCD>0)return;
    this.dashCD=25;this.kb=dir*15;snd('dash');
    burst(this.x,this.y-40,'#fff',5,{spread:4});
  }
  ultimate(tgt){
    if(this.ult<this.maxUlt)return;if(this.st!=='idle'&&this.st!=='walk')return;
    this.ult=0;this.st='ultimate';this.stT=32;this.hitCD=28;snd('ultimate');
    this.x=tgt.x-this.face*65;
    this.atkType='ultimate';this.atk={x:this.x+this.face*10,y:this.y-68,w:90,h:82,dmg:35,kb:this.face*25};
    flashT=15;shakeT=20;shakeI=14;slowT=18;
    burst(this.x,this.y-40,this.isP?'#4cf':'#f55',30,{spread:14,upward:10,type:'spark'});snd('slam');
  }
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
    // Counter window check
    if(this.counterWindow>0){
      dmg=Math.floor(d*0.3);kb*=0.2;snd('parry');
      burst(this.x+this.face*28,this.y-40,'#ff0',15,{spread:6,type:'spark'});
      addHitFx(this.x,this.y-40,true);
      this.counterWindow=0;
      stageScore.parries++;
      this.hp=Math.max(0,this.hp-dmg);this.kb=kb;
      addDmgNum(this.x,this.y-70,dmg,'#ff0',false);
      return dmg;
    }
    if(this.blocking){dmg=Math.floor(d*0.1);kb*=0.1;burst(this.x+this.face*28,this.y-40,'#fff',3,{spread:4});snd('block')}
    else{this.hurtT=10;snd('hit');burst(this.x,this.y-40,'#fa0',10,{type:'spark'});addHitFx(this.x,this.y-40,atk.dmg>=20)}
    this.hp=Math.max(0,this.hp-dmg);this.kb=kb;this.ult=Math.min(this.maxUlt,this.ult+dmg*0.4);
    addDmgNum(this.x,this.y-70,dmg,this.isP?'#f55':'#4cf',false);
    return dmg;
  }
  draw(){
    drawCharacter(this.x,this.y,this.hp,this.maxHp,this.isP,this.st,this.combo,this.face,this.af,this.hurtT,this.blocking,this.atkType,this.colors);
  }
}