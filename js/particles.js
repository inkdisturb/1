// ==================== PARTICLES ====================
function burst(x,y,col,n,o={}){
  for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-0.5)*(o.spread||10),vy:-(Math.random()*(o.upward||8))-1,life:o.life||(20+Math.random()*20),maxLife:o.life||(20+Math.random()*20),color:col,size:o.size||(2+Math.random()*3),grav:o.grav||0.2,type:o.type||'circle'});
}
function addDmgNum(x,y,d,col,crit){dmgNums.push({x:x+(Math.random()-0.5)*20,y,dmg:d,col,life:50,maxLife:50,vy:-3.5,crit:!!crit})}
function addHitFx(x,y,big){hitFx.push({x,y,t:0,maxT:big?20:12,big})}
function addTrail(x,y,col){trails.push({x,y,life:10,maxLife:10,col,size:3+Math.random()*2})}
function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=p.grav;p.life--;if(p.life<=0)particles.splice(i,1)}
  for(let i=dmgNums.length-1;i>=0;i--){const d=dmgNums[i];d.y+=d.vy;d.vy-=0.05;d.life--;if(d.life<=0)dmgNums.splice(i,1)}
  for(let i=hitFx.length-1;i>=0;i--){hitFx[i].t++;if(hitFx[i].t>=hitFx[i].maxT)hitFx.splice(i,1)}
  for(let i=trails.length-1;i>=0;i--){trails[i].life--;if(trails[i].life<=0)trails.splice(i,1)}
}
function drawParticles(){
  trails.forEach(t=>{X.globalAlpha=t.life/t.maxLife*0.6;X.fillStyle=t.col;X.beginPath();X.arc(t.x,t.y,t.size*(t.life/t.maxLife),0,Math.PI*2);X.fill()});
  particles.forEach(p=>{X.globalAlpha=Math.min(1,p.life/(p.maxLife*0.5));X.fillStyle=p.color;X.beginPath();X.arc(p.x,p.y,p.size*Math.min(1,p.life/(p.maxLife*0.4)),0,Math.PI*2);X.fill();if(p.type==='spark'){X.globalAlpha*=0.3;X.beginPath();X.arc(p.x,p.y,p.size*2*(p.life/p.maxLife),0,Math.PI*2);X.fill()}});
  hitFx.forEach(e=>{const p=e.t/e.maxT;X.globalAlpha=(1-p)*0.7;X.strokeStyle=e.big?'#ff0':'#fa0';X.lineWidth=e.big?4:2;X.beginPath();X.arc(e.x,e.y,p*(e.big?50:30),0,Math.PI*2);X.stroke();const ln=e.big?8:4;for(let i=0;i<ln;i++){const a=i*Math.PI/ln+p*0.5;X.beginPath();X.moveTo(e.x+Math.cos(a)*p*(e.big?15:8),e.y+Math.sin(a)*p*(e.big?15:8));X.lineTo(e.x+Math.cos(a)*p*(e.big?45:25),e.y+Math.sin(a)*p*(e.big?45:25));X.stroke()}});
  dmgNums.forEach(d=>{const p=d.life/d.maxLife;X.globalAlpha=p;X.fillStyle=d.col;const sz=d.crit?22:16;X.font=`bold ${sz+d.dmg*0.3}px monospace`;X.textAlign='center';X.shadowColor=d.col;X.shadowBlur=d.crit?20:10;X.fillText((d.crit?'💥 ':'')+d.dmg,d.x,d.y);X.shadowBlur=0;X.textAlign='left'});
  X.globalAlpha=1;
}