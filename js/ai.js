// ==================== AI ====================
class BossAI{
  constructor(b){this.b=b;this.t=0;this.d=DIFF[diff]}
  update(tgt){
    const b=this.b;if(b.hp<=0)return;this.t--;if(this.t>0)return;
    const dist=Math.abs(b.x-tgt.x),r=Math.random(),s=this.d.ai,a=this.d.agg;
    if(b.spCD<=0&&r<0.22+a*0.15&&dist<260){b.special(tgt);this.t=25+Math.random()*20;return}
    if(dist>180){b.move(tgt.x>b.x?1:-1);if(r<0.15*a)b.jump();this.t=Math.floor((10+Math.random()*12)/s)}
    else if(dist>70){
      if(r<0.3*a)b.punch();else if(r<0.5*a)b.kick();else if(r<0.65)b.move(tgt.x>b.x?1:-1);else if(r<0.75)b.jump();else b.block();
      this.t=Math.floor((12+Math.random()*15)/s);
    }else{
      if(r<0.22)b.punch();else if(r<0.42)b.kick();else if(r<0.52+a*0.1)b.heavy();else if(r<0.65)b.block();else if(r<0.8)b.move(tgt.x>b.x?-1:1);else b.jump();
      this.t=Math.floor((8+Math.random()*12)/s);
    }
    if(b.ult>=b.maxUlt&&dist<180&&r<0.25){b.ultimate(tgt);this.t=30}
  }
}