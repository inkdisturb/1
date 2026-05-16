// ==================== SPRITE SHEET SYSTEM ====================
const SPRITE_W=160, SPRITE_H=200;
const POSES=['idle','walk','punch','kick','heavy','sweep','uppercut','spinKick','aerial','block','ultimate','hurt','dash','dashStrike','counter'];
const POSE_DATA={
  idle:[20,-20,4,-4,0],
  walk:[40,-40,20,-20,0],
  punch:[-135,25,-8,8,10],
  kick:[-35,95,-12,85,0],
  heavy:[-155,-45,8,-12,14],
  sweep:[15,45,3,105,-12],
  uppercut:[-165,-95,-8,12,-8],
  spinKick:[65,-65,55,-55,0],
  aerial:[-55,55,-28,28,0],
  block:[65,-65,12,-12,0],
  ultimate:[-165,-115,-4,4,0],
  hurt:[45,35,-8,12,-15],
  dash:[-75,-75,-18,18,18],
  dashStrike:[-145,25,-12,8,22],
  counter:[85,-85,8,-8,0]
};

function buildSpriteSheet(cs, isPlayer){
  const n=POSES.length;
  const cv=document.createElement('canvas');
  cv.width=SPRITE_W*n; cv.height=SPRITE_H;
  const c=cv.getContext('2d');
  const R=d=>d*Math.PI/180;

  for(let i=0;i<n;i++){
    const pose=POSES[i];
    const pd=POSE_DATA[pose];
    const ox=i*SPRITE_W+SPRITE_W/2;
    const oy=SPRITE_H-25;
    c.save();c.translate(ox,oy);
    const hurt=(pose==='hurt');

    // Shadow
    c.fillStyle='rgba(0,0,0,0.3)';
    c.beginPath();c.ellipse(0,4,28,8,0,0,Math.PI*2);c.fill();

    // ===== LEGS =====
    const drawLeg=(tx,angle,len)=>{
      c.save();c.translate(tx,2);c.rotate(R(angle));
      // Thigh
      const tg=c.createLinearGradient(-7,0,7,0);
      tg.addColorStop(0,hurt?'#fff':cs.pants);
      tg.addColorStop(0.5,hurt?'#fff':lighten(cs.pants,20));
      tg.addColorStop(1,hurt?'#fff':cs.pants);
      c.fillStyle=tg;
      c.fillRect(-7,0,14,len*0.55);
      // Knee joint
      c.fillStyle=hurt?'#fff':cs.armorDark;
      c.beginPath();c.arc(0,len*0.55,5,0,Math.PI*2);c.fill();
      // Shin
      c.fillStyle=hurt?'#fff':cs.pants;
      c.fillRect(-6,len*0.55,12,len*0.35);
      // Boot
      const bg=c.createLinearGradient(-8,len*0.88,8,len);
      bg.addColorStop(0,hurt?'#fff':cs.boot);
      bg.addColorStop(1,hurt?'#fff':darken(cs.boot,20));
      c.fillStyle=bg;
      c.fillRect(-8,len*0.88,16,12);
      // Boot strap
      c.fillStyle=hurt?'#fff':cs.accent;c.globalAlpha=0.5;
      c.fillRect(-8,len*0.92,16,2);c.globalAlpha=1;
      c.restore();
    };
    drawLeg(-10,pd[2],42);
    drawLeg(10,pd[3],42);

    // ===== TORSO =====
    c.save();c.rotate(R(pd[4]));
    const ty=-48;

    // Back armor plate
    c.fillStyle=hurt?'#fff':darken(cs.armor,15);
    c.beginPath();
    c.moveTo(-20,ty+34);c.lineTo(-24,ty+6);c.lineTo(-18,ty-4);
    c.lineTo(18,ty-4);c.lineTo(24,ty+6);c.lineTo(20,ty+34);
    c.closePath();c.fill();

    // Main chest armor
    const ag=c.createLinearGradient(-22,ty-6,22,ty+34);
    ag.addColorStop(0,hurt?'#fff':lighten(cs.armor,10));
    ag.addColorStop(0.3,hurt?'#fff':cs.armor);
    ag.addColorStop(0.7,hurt?'#fff':cs.armorDark);
    ag.addColorStop(1,hurt?'#fff':cs.armor);
    c.fillStyle=ag;
    c.beginPath();
    c.moveTo(-20,ty+34);c.lineTo(-24,ty+6);c.lineTo(-18,ty-6);
    c.quadraticCurveTo(0,ty-10,18,ty-6);
    c.lineTo(24,ty+6);c.lineTo(20,ty+34);
    c.quadraticCurveTo(0,ty+38,-20,ty+34);
    c.closePath();c.fill();

    // Chest plate line
    c.strokeStyle=hurt?'#fff':cs.accent;c.lineWidth=1;c.globalAlpha=0.3;
    c.beginPath();c.moveTo(0,ty-6);c.lineTo(0,ty+20);c.stroke();
    c.beginPath();c.moveTo(-12,ty+4);c.lineTo(12,ty+4);c.stroke();c.globalAlpha=1;

    // Belt
    const beltG=c.createLinearGradient(-18,ty+20,18,ty+26);
    beltG.addColorStop(0,hurt?'#fff':cs.armorDark);
    beltG.addColorStop(0.5,hurt?'#fff':lighten(cs.armorDark,15));
    beltG.addColorStop(1,hurt?'#fff':cs.armorDark);
    c.fillStyle=beltG;c.fillRect(-18,ty+20,36,6);
    // Belt buckle
    c.fillStyle=hurt?'#fff':cs.accent;
    c.fillRect(-4,ty+20,8,6);

    // Center gem with glow
    c.fillStyle=hurt?'#fff':cs.accent;
    c.shadowColor=cs.accent;c.shadowBlur=10;
    c.beginPath();c.arc(0,ty+1,5,0,Math.PI*2);c.fill();c.shadowBlur=0;
    // Gem highlight
    c.fillStyle='rgba(255,255,255,0.6)';
    c.beginPath();c.arc(-1.5,ty-0.5,2,0,Math.PI*2);c.fill();

    // Shoulder pads (layered)
    for(const sx of[-22,22]){
      // Outer pad
      const sp=c.createRadialGradient(sx,ty-2,0,sx,ty-2,12);
      sp.addColorStop(0,hurt?'#fff':lighten(cs.armor,15));
      sp.addColorStop(0.6,hurt?'#fff':cs.armor);
      sp.addColorStop(1,hurt?'#fff':cs.armorDark);
      c.fillStyle=sp;
      c.beginPath();c.ellipse(sx,ty-2,12,8,0,0,Math.PI*2);c.fill();
      // Pad rim
      c.strokeStyle=hurt?'#fff':cs.accent;c.lineWidth=1;c.globalAlpha=0.4;
      c.beginPath();c.ellipse(sx,ty-2,12,8,0,0,Math.PI*2);c.stroke();c.globalAlpha=1;
      // Inner detail
      c.fillStyle=hurt?'#fff':cs.accent;c.globalAlpha=0.2;
      c.beginPath();c.ellipse(sx,ty-2,6,4,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
    }

    // ===== CAPE =====
    const cg=c.createLinearGradient(-20,ty,-35,ty+55);
    cg.addColorStop(0,hurt?'#fff':cs.cape);
    cg.addColorStop(0.5,hurt?'#fff':lighten(cs.cape,10));
    cg.addColorStop(1,'rgba(0,0,0,0.15)');
    c.fillStyle=cg;c.globalAlpha=0.6;
    c.beginPath();
    c.moveTo(-16,ty+2);
    c.quadraticCurveTo(-30,ty+20,-28,ty+50);
    c.quadraticCurveTo(-22,ty+55,-15,ty+48);
    c.lineTo(-8,ty+30);
    c.quadraticCurveTo(-4,ty+15,10,ty+2);
    c.closePath();c.fill();c.globalAlpha=1;

    // ===== ARMS =====
    const drawArm=(tx,ty2,angle,flip)=>{
      c.save();c.translate(tx,ty2);c.rotate(R(angle));
      // Upper arm
      const uaG=c.createLinearGradient(-5,0,5,0);
      uaG.addColorStop(0,hurt?'#fff':cs.skin);
      uaG.addColorStop(1,hurt?'#fff':darken(cs.skin,15));
      c.fillStyle=uaG;
      c.fillRect(-5,0,10,20);
      // Elbow
      c.fillStyle=hurt?'#fff':cs.armorDark;
      c.beginPath();c.arc(0,20,4,0,Math.PI*2);c.fill();
      // Forearm + gauntlet
      const gaG=c.createLinearGradient(-6,22,6,22);
      gaG.addColorStop(0,hurt?'#fff':cs.gauntlet);
      gaG.addColorStop(0.5,hurt?'#fff':lighten(cs.gauntlet,12));
      gaG.addColorStop(1,hurt?'#fff':cs.gauntlet);
      c.fillStyle=gaG;
      c.fillRect(-6,22,12,14);
      // Gauntlet accent lines
      c.strokeStyle=hurt?'#fff':cs.accent;c.lineWidth=0.6;c.globalAlpha=0.35;
      c.beginPath();c.moveTo(-6,28);c.lineTo(6,28);c.stroke();
      c.beginPath();c.moveTo(-6,32);c.lineTo(6,32);c.stroke();c.globalAlpha=1;
      // Hand
      c.fillStyle=hurt?'#fff':cs.skin;
      c.fillRect(-4,36,8,6);
      c.restore();
    };
    c.save();c.rotate(R(pd[4]));
    drawArm(-22,ty+4,pd[0],false);
    drawArm(22,ty+4,pd[1],true);

    // ===== WEAPON (Katana) =====
    if(isPlayer){
      c.save();c.translate(-22,ty+4);c.rotate(R(pd[0]));
      // Handle wrapping
      c.fillStyle='#4a2a1a';
      for(let w=0;w<5;w++){c.fillRect(-3,20+w*3,6,2)}
      // Hand guard (tsuba) - diamond shape
      c.fillStyle='#c8a030';
      c.beginPath();c.moveTo(0,38);c.lineTo(5,42);c.lineTo(0,46);c.lineTo(-5,42);c.closePath();c.fill();
      c.strokeStyle='#e8c050';c.lineWidth=0.5;c.stroke();
      // Blade
      const blG=c.createLinearGradient(0,46,0,82);
      blG.addColorStop(0,'#ccd');blG.addColorStop(0.2,'#eef');
      blG.addColorStop(0.5,'#f8f8f8');blG.addColorStop(0.8,'#dde');blG.addColorStop(1,'#aab');
      c.fillStyle=blG;
      c.beginPath();
      c.moveTo(-2,46);c.lineTo(2,46);c.lineTo(1.5,76);c.lineTo(0,82);c.lineTo(-1.5,76);
      c.closePath();c.fill();
      // Edge line (hamon)
      c.strokeStyle='rgba(255,255,255,0.6)';c.lineWidth=0.8;
      c.beginPath();c.moveTo(0,46);c.lineTo(0,78);c.stroke();
      // Blade glow at tip
      c.fillStyle='#8cf';c.shadowColor='#8cf';c.shadowBlur=6;
      c.beginPath();c.arc(0,82,2.5,0,Math.PI*2);c.fill();c.shadowBlur=0;
      c.restore();
    }
    c.restore(); // end arms+weapon rotation

    // ===== HEAD =====
    c.save();c.rotate(R(pd[4]));
    const hy=ty-24;

    // Neck (visible)
    c.fillStyle=hurt?'#fff':cs.skin;
    c.fillRect(-5,hy+14,10,10);

    // Head shape - more oval/natural
    const headG=c.createRadialGradient(-3,hy-3,3,0,hy+2,16);
    headG.addColorStop(0,hurt?'#fff':lighten(cs.skin,12));
    headG.addColorStop(0.7,hurt?'#fff':cs.skin);
    headG.addColorStop(1,hurt?'#eee':darken(cs.skin,20));
    c.fillStyle=headG;
    c.beginPath();
    c.ellipse(0,hy,14,16,0,0,Math.PI*2);
    c.fill();

    // Ears
    c.fillStyle=hurt?'#fff':darken(cs.skin,10);
    c.beginPath();c.ellipse(-14,hy,4,6,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(14,hy,4,6,0,0,Math.PI*2);c.fill();
    c.fillStyle=hurt?'#fff':cs.skin;
    c.beginPath();c.ellipse(-14,hy,2.5,4,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(14,hy,2.5,4,0,0,Math.PI*2);c.fill();

    // Hair / Helmet
    const hG=c.createLinearGradient(0,hy-18,0,hy-2);
    hG.addColorStop(0,hurt?'#fff':lighten(cs.hair,15));
    hG.addColorStop(0.5,hurt?'#fff':cs.hair);
    hG.addColorStop(1,hurt?'#fff':cs.armorDark);
    c.fillStyle=hG;
    c.beginPath();
    c.moveTo(-14,hy-2);
    c.quadraticCurveTo(-16,hy-18,-8,hy-20);
    c.quadraticCurveTo(0,hy-22,8,hy-20);
    c.quadraticCurveTo(16,hy-18,14,hy-2);
    c.closePath();c.fill();

    // Helmet crest/ridge
    c.strokeStyle=hurt?'#fff':cs.accent;c.lineWidth=2;c.globalAlpha=0.6;
    c.beginPath();c.moveTo(0,hy-22);c.lineTo(0,hy-8);c.stroke();c.globalAlpha=1;

    // Headband
    c.fillStyle=hurt?'#fff':cs.accent;
    c.fillRect(-15,hy-5,30,4);
    // Trailing band tails
    c.fillStyle=hurt?'#fff':cs.accent;c.globalAlpha=0.7;
    c.beginPath();
    c.moveTo(12,hy-5);c.lineTo(24,hy-3);c.lineTo(22,hy+2);c.lineTo(12,hy-1);
    c.closePath();c.fill();c.globalAlpha=1;

    // ===== FACE =====
    // Eyebrows (angular, determined)
    c.strokeStyle=hurt?'#fff':darken(cs.skin,30);c.lineWidth=2;c.lineCap='round';
    // Left eyebrow
    c.beginPath();c.moveTo(-9,hy-8);c.lineTo(-3,hy-9);c.stroke();
    // Right eyebrow
    c.beginPath();c.moveTo(3,hy-9);c.lineTo(9,hy-8);c.stroke();

    // Eyes - white sclera
    c.fillStyle=hurt?'#fff':'#eee';
    c.beginPath();c.ellipse(-5,hy-4,4.5,3,0,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(5,hy-4,4.5,3,0,0,Math.PI*2);c.fill();

    // Iris
    c.fillStyle=hurt?'#fff':cs.eye;
    c.beginPath();c.arc(-4.5,hy-4,2.2,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(5.5,hy-4,2.2,0,Math.PI*2);c.fill();

    // Pupil
    c.fillStyle='#000';
    c.beginPath();c.arc(-4.2,hy-4,1,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(5.8,hy-4,1,0,Math.PI*2);c.fill();

    // Eye glow
    c.fillStyle=cs.eye;c.shadowColor=cs.eye;c.shadowBlur=5;
    c.beginPath();c.arc(-4.5,hy-4,1.5,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(5.5,hy-4,1.5,0,Math.PI*2);c.fill();c.shadowBlur=0;

    // Eye highlight
    c.fillStyle='rgba(255,255,255,0.7)';
    c.beginPath();c.arc(-3.8,hy-5,0.8,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(6.2,hy-5,0.8,0,Math.PI*2);c.fill();

    // Nose
    c.strokeStyle=hurt?'#fff':darken(cs.skin,20);c.lineWidth=1;c.lineCap='round';
    c.beginPath();c.moveTo(0,hy-1);c.lineTo(-2,hy+4);c.stroke();
    c.beginPath();c.moveTo(-2,hy+4);c.quadraticCurveTo(0,hy+5,2,hy+4);c.stroke();

    // Mouth
    if(pose==='heavy'||pose==='ultimate'||pose==='punch'){
      // Open mouth (effort)
      c.fillStyle=hurt?'#fff':'#3a2020';
      c.beginPath();c.ellipse(0,hy+9,4,2.5,0,0,Math.PI*2);c.fill();
      c.fillStyle=hurt?'#fff':'#d88';
      c.beginPath();c.ellipse(0,hy+8.5,3,1,0,0,Math.PI);c.fill();
    }else if(pose==='hurt'){
      // Grimace
      c.strokeStyle=hurt?'#fff':'#855';c.lineWidth=1.5;
      c.beginPath();c.moveTo(-4,hy+9);c.quadraticCurveTo(0,hy+7,4,hy+9);c.stroke();
    }else if(pose==='block'||pose==='counter'){
      // Determined clench
      c.strokeStyle=hurt?'#fff':darken(cs.skin,25);c.lineWidth=1.5;
      c.beginPath();c.moveTo(-3,hy+9);c.lineTo(3,hy+9);c.stroke();
    }else{
      // Neutral/slight smirk
      c.strokeStyle=hurt?'#fff':darken(cs.skin,20);c.lineWidth=1;
      c.beginPath();c.moveTo(-3,hy+8);c.quadraticCurveTo(0,hy+10,3,hy+8);c.stroke();
    }

    // Face shadow (cheekbone)
    c.fillStyle=hurt?'#fff':'rgba(0,0,0,0.05)';
    c.beginPath();c.ellipse(-8,hy+2,4,6,-0.2,0,Math.PI*2);c.fill();
    c.beginPath();c.ellipse(8,hy+2,4,6,0.2,0,Math.PI*2);c.fill();

    c.restore(); // end head

    // ===== POSE EFFECTS =====
    if(pose==='ultimate'){
      c.globalAlpha=0.25;
      for(let r=0;r<4;r++){c.fillStyle=cs.accent;c.beginPath();c.arc(0,-40,18+r*14,0,Math.PI*2);c.fill()}
      c.globalAlpha=0.5;c.strokeStyle=cs.accent;c.lineWidth=2.5;
      for(let a=0;a<8;a++){const ag2=a*Math.PI/4;c.beginPath();c.moveTo(0,-40);c.lineTo(Math.cos(ag2)*50,-40+Math.sin(ag2)*50);c.stroke()}
      c.globalAlpha=1;
    }
    if(pose==='block'){
      c.globalAlpha=0.25;c.strokeStyle='#ff0';c.lineWidth=2.5;
      c.beginPath();c.arc(10,-40,30,0,Math.PI*2);c.stroke();
      c.globalAlpha=0.06;c.fillStyle='#ff0';c.beginPath();c.arc(10,-40,30,0,Math.PI*2);c.fill();
      // Hex pattern
      c.globalAlpha=0.12;c.strokeStyle='#ff0';c.lineWidth=0.8;
      for(let h=0;h<6;h++){const ha=h*Math.PI/3;c.beginPath();c.moveTo(10+Math.cos(ha)*15,-40+Math.sin(ha)*15);c.lineTo(10+Math.cos(ha)*30,-40+Math.sin(ha)*30);c.stroke()}
      c.globalAlpha=1;
    }
    if(pose==='counter'){
      c.globalAlpha=0.5;c.strokeStyle='#ff0';c.lineWidth=2.5;
      c.beginPath();c.arc(15,-42,22,0,Math.PI*2);c.stroke();
      c.globalAlpha=0.15;c.fillStyle='#ff0';c.beginPath();c.arc(15,-42,22,0,Math.PI*2);c.fill();
      c.globalAlpha=1;
    }
    if(pose==='hurt'){
      c.globalAlpha=0.1;c.fillStyle='#fff';c.beginPath();c.arc(0,-30,35,0,Math.PI*2);c.fill();c.globalAlpha=1;
    }
    if(pose==='dashStrike'){
      c.globalAlpha=0.25;c.fillStyle='#4cf';c.beginPath();c.arc(30,-45,15,0,Math.PI*2);c.fill();
      c.globalAlpha=0.08;c.beginPath();c.arc(30,-45,25,0,Math.PI*2);c.fill();c.globalAlpha=1;
    }

    c.restore();
  }
  return cv;
}

// Color utility helpers
function lighten(hex,pct){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return'#'+[r,g,b].map(v=>Math.min(255,v+pct).toString(16).padStart(2,'0')).join('');
}
function darken(hex,pct){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return'#'+[r,g,b].map(v=>Math.max(0,v-pct).toString(16).padStart(2,'0')).join('');
}

const spriteCache={};
function getSpriteSheet(key,colors,isP){
  if(!spriteCache[key])spriteCache[key]=buildSpriteSheet(colors,isP);
  return spriteCache[key];
}

function drawCharacter(cx,cy,hp,maxHp,isP,state,combo,face,animFrame,hurtT,blocking,atkType,colorSet){
  let pose='idle';
  if(hurtT>0)pose='hurt';
  else if(blocking)pose='block';
  else if(state==='walk')pose='walk';
  else if(state==='punch')pose='punch';
  else if(state==='kick')pose='kick';
  else if(state==='heavy')pose='heavy';
  else if(state==='sweep')pose='sweep';
  else if(state==='uppercut')pose='uppercut';
  else if(state==='spinKick')pose='spinKick';
  else if(state==='aerial')pose='aerial';
  else if(state==='ultimate')pose='ultimate';
  else if(state==='dash')pose='dash';
  else if(state==='dashStrike')pose='dashStrike';
  else if(state==='counter')pose='counter';

  const key=(isP?'p_':'b_')+colorSet.armor;
  const sheet=getSpriteSheet(key,colorSet,isP);
  const pi=POSES.indexOf(pose);
  if(pi<0)return;

  X.save();X.translate(cx,cy);X.scale(face,1);
  const bob=(state==='idle')?Math.sin(Date.now()*0.004)*3:0;
  X.translate(0,bob);

  // Combo aura
  if(combo>2){
    X.globalAlpha=Math.min(0.2,combo*0.02);
    X.fillStyle=colorSet.accent;
    X.beginPath();X.arc(0,-40,40+Math.sin(Date.now()*0.01)*5,0,Math.PI*2);X.fill();
    X.globalAlpha=1;
  }

  // Blit from sprite sheet
  X.drawImage(sheet, pi*SPRITE_W,0,SPRITE_W,SPRITE_H, -SPRITE_W/2,-SPRITE_H+20,SPRITE_W,SPRITE_H);
  X.restore();
}
const COLORS={
  player:{armor:'#2a3a5a',armorDark:'#1a2540',accent:'#4cf',skin:'#d4a574',pants:'#1a1a2a',boot:'#333',gauntlet:'#3a4a6a',hair:'#1a1a2a',eye:'#0ef',cape:'#1a2a4a'},
  fire:{armor:'#5a2a1a',armorDark:'#3a1a0a',accent:'#f64',skin:'#8a5a3a',pants:'#3a1a0a',boot:'#2a1a0a',gauntlet:'#6a3a1a',hair:'#f40',eye:'#f00',cape:'#a30'},
  ice:{armor:'#2a3a5a',armorDark:'#1a2a4a',accent:'#6cf',skin:'#b0c4d8',pants:'#1a2a3a',boot:'#2a3a4a',gauntlet:'#3a5a7a',hair:'#8cf',eye:'#4df',cape:'#2a4a6a'},
  thunder:{armor:'#4a4a2a',armorDark:'#3a3a1a',accent:'#ff0',skin:'#c4a060',pants:'#2a2a1a',boot:'#3a3a2a',gauntlet:'#5a5a3a',hair:'#ff0',eye:'#ff0',cape:'#4a4a0a'},
  poison:{armor:'#2a4a2a',armorDark:'#1a3a1a',accent:'#8f4',skin:'#7a9a5a',pants:'#1a3a1a',boot:'#2a3a2a',gauntlet:'#3a5a3a',hair:'#4f8',eye:'#8f4',cape:'#2a5a2a'},
  blood:{armor:'#4a1a2a',armorDark:'#3a0a1a',accent:'#f0a',skin:'#9a5a6a',pants:'#2a0a1a',boot:'#3a1a2a',gauntlet:'#5a2a3a',hair:'#a06',eye:'#f0a',cape:'#5a1a2a'},
  void:{armor:'#3a2a5a',armorDark:'#2a1a4a',accent:'#c4f',skin:'#8a6aaa',pants:'#2a1a3a',boot:'#3a2a4a',gauntlet:'#4a3a6a',hair:'#c4f',eye:'#c4f',cape:'#3a2a5a'}
};