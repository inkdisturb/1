// ==================== BOSSES ====================
class Boss extends Fighter{
  constructor(x,name,col){super(x,false,name);this.colors=col;this.spCD=0;this.bMax=100}
  setup(si){const d=DIFF[diff];this.bMax=Math.floor((400+si*120)*d.hp);this.hp=this.bMax;this.maxHp=this.bMax}
}

class BossFire extends Boss{
  constructor(x){super(x,'炎魔·烬',COLORS.fire)}
  special(tgt){
    if(this.spCD>0)return;this.st='special';this.stT=25;this.spCD=80;snd('slam');
    for(let i=0;i<4;i++){setTimeout(()=>{if(state!=='fighting')return;const fx=tgt.x+(Math.random()-0.5)*120;burst(fx,GROUND,'#f64',12,{spread:6,upward:10,type:'spark'});burst(fx,GROUND,'#ff0',6,{spread:4,upward:8});shakeT=8;shakeI=5;if(Math.abs(tgt.x-fx)<50&&!tgt.blocking&&tgt.counterWindow<=0)tgt.takeHit(Math.floor(14*DIFF[diff].dmg),{kb:tgt.x>fx?-8:8})},i*300)}
  }
}
class BossIce extends Boss{
  constructor(x){super(x,'冰霜领主·凛',COLORS.ice)}
  special(tgt){
    if(this.spCD>0)return;this.st='special';this.stT=22;this.spCD=90;snd('slam');
    for(let i=0;i<6;i++){setTimeout(()=>{if(state!=='fighting')return;const sx=80+i*150;burst(sx,GROUND,'#6cf',8,{spread:3,upward:12,type:'spark'});burst(sx,GROUND,'#fff',4,{spread:2,upward:10});if(Math.abs(tgt.x-sx)<35&&!tgt.blocking&&tgt.counterWindow<=0){tgt.takeHit(Math.floor(12*DIFF[diff].dmg),{kb:tgt.x>sx?-7:7});tgt.vx*=0.3}},i*180)}
  }
}
class BossThunder extends Boss{
  constructor(x){super(x,'雷霆将军·轰',COLORS.thunder)}
  special(tgt){
    if(this.spCD>0)return;this.st='special';this.stT=18;this.spCD=70;
    this.x=tgt.x+(Math.random()>0.5?75:-75);flashT=10;flashCol='#ff0';shakeT=12;shakeI=10;snd('ultimate');
    burst(this.x,0,'#ff0',15,{spread:5,upward:3,type:'spark'});burst(this.x,this.y-40,'#ff0',10,{type:'spark'});
    if(Math.abs(this.x-tgt.x)<90&&!tgt.blocking&&tgt.counterWindow<=0)tgt.takeHit(Math.floor(18*DIFF[diff].dmg),{kb:tgt.x>this.x?-12:12});
  }
}
class BossPoison extends Boss{
  constructor(x){super(x,'蛊母·蚀',COLORS.poison)}
  special(tgt){
    if(this.spCD>0)return;this.st='special';this.stT=25;this.spCD=100;snd('whoosh');
    for(let i=0;i<15;i++)particles.push({x:this.x+(Math.random()-0.5)*200,y:this.y-30-Math.random()*50,vx:(Math.random()-0.5)*2,vy:-0.5-Math.random(),life:80+Math.random()*40,maxLife:120,color:'#8f4',size:3+Math.random()*4,grav:-0.01});
    let ticks=0;const iv=setInterval(()=>{if(state!=='fighting'||ticks>=4){clearInterval(iv);return}if(Math.abs(this.x-tgt.x)<140&&!tgt.blocking&&tgt.counterWindow<=0)tgt.takeHit(Math.floor(5*DIFF[diff].dmg),{kb:0});ticks++},400);
  }
}
class BossBlood extends Boss{
  constructor(x){super(x,'噬魂者·吞',COLORS.blood)}
  special(tgt){
    if(this.spCD>0)return;this.st='special';this.stT=22;this.spCD=85;snd('heavy');
    if(Math.abs(this.x-tgt.x)<120){const dealt=tgt.takeHit(Math.floor(20*DIFF[diff].dmg),{kb:tgt.x>this.x?-10:10});this.hp=Math.min(this.bMax,this.hp+Math.floor(dealt*0.5));burst(tgt.x,tgt.y-40,'#f0a',12,{type:'spark'});burst(this.x,this.y-40,'#a06',8,{type:'spark'});addHitFx(tgt.x,tgt.y-40,true)}
  }
}
class BossVoid extends Boss{
  constructor(x){super(x,'魔王·虚无',COLORS.void);this.phase=0}
  special(tgt){
    if(this.spCD>0)return;this.spCD=65;this.phase=(this.phase+1)%3;
    switch(this.phase){
      case 0:this.st='special';this.stT=28;snd('slam');for(let i=0;i<3;i++){const cx=this.x+(i-1)*110;burst(cx,GROUND-40,'#c4f',15,{type:'spark'});if(Math.abs(cx-tgt.x)<45&&!tgt.blocking&&tgt.counterWindow<=0)tgt.takeHit(Math.floor(10*DIFF[diff].dmg),{kb:tgt.x>cx?-8:8})}break;
      case 1:this.st='special';this.stT=35;beamOn=true;beamX=this.x;beamT=28;flashT=10;flashCol='#c4f';shakeT=15;shakeI=10;snd('ultimate');break;
      case 2:this.x=tgt.x+(Math.random()>0.5?55:-55);this.st='special';this.stT=18;burst(this.x,this.y-40,'#c4f',25,{type:'spark'});shakeT=18;shakeI=12;snd('slam');if(Math.abs(this.x-tgt.x)<80&&!tgt.blocking&&tgt.counterWindow<=0)tgt.takeHit(Math.floor(25*DIFF[diff].dmg),{kb:tgt.x>this.x?-14:14});break;
    }
  }
}
function createBoss(si){
  let b;switch(si){case 0:b=new BossFire(760);break;case 1:b=new BossIce(760);break;case 2:b=new BossThunder(760);break;case 3:b=new BossPoison(760);break;case 4:b=new BossBlood(760);break;case 5:b=new BossVoid(760);break;default:b=new BossFire(760)}
  b.setup(si);return b;
}