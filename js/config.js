// ==================== CONFIG ====================
const CV=document.getElementById('C'),X=CV.getContext('2d');
const W=960,H=540,GROUND=H-85,GRAV=0.55;
const DIFF=[{dmg:0.6,hp:0.7,ai:0.4,agg:0.3},{dmg:1.0,hp:1.0,ai:0.6,agg:0.5},{dmg:1.5,hp:1.3,ai:0.8,agg:0.7},{dmg:2.0,hp:1.6,ai:1.0,agg:0.9}];
const DIFF_N=['见习','武者','暗影','修罗'];
