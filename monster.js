// monster.js — 怪物 CSS 渲染

function monster_render(container, monsterData, progress) {
  if (!monsterData) return;

  const { bodyColor, eyeColor, accentColor, shape, name } = monsterData;
  const hp = 100 - progress; // 血量 = 100 - 進度%

  const shapeStyles = {
    round:   { borderRadius: '50%', width: '120px', height: '120px' },
    angular: { borderRadius: '12px', width: '130px', height: '110px', transform: 'rotate(5deg)' },
    blob:    { borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', width: '130px', height: '120px' },
    spike:   { borderRadius: '30% 70% 30% 70% / 70% 30% 70% 30%', width: '120px', height: '130px' }
  };

  const style = shapeStyles[shape] || shapeStyles.blob;

  container.innerHTML = `
    <div class="monster-wrap">
      <div class="monster-name">${name}</div>
      <div class="monster-hp-bar">
        <div class="monster-hp-fill" style="width:${hp}%; background: linear-gradient(90deg, ${accentColor}, ${bodyColor});"></div>
        <span class="monster-hp-text">${hp > 0 ? hp + '%' : ''}</span>
        ${hp <= 0 ? '<div class="monster-finish">FINISH!</div>' : ''}
      </div>
      <div class="monster-body ${shape}" style="
        background: radial-gradient(circle at 35% 35%, ${accentColor}88, ${bodyColor});
        box-shadow: 0 0 30px ${bodyColor}66, inset 0 0 20px rgba(0,0,0,0.3);
        border-radius: ${style.borderRadius};
        width: ${style.width};
        height: ${style.height};
        ${style.transform ? 'transform:' + style.transform : ''}
      ">
        <div class="monster-eyes">
          <div class="monster-eye" style="background:${eyeColor};"></div>
          <div class="monster-eye" style="background:${eyeColor};"></div>
        </div>
        <div class="monster-mouth" style="border-color:${eyeColor}55;"></div>
        <div class="monster-glow" style="background: radial-gradient(circle, ${accentColor}44, transparent 70%);"></div>
      </div>
      ${hp <= 0 ? '<div class="monster-dead-overlay">💀</div>' : ''}
    </div>
  `;

  // 浮動動畫
  const body = container.querySelector('.monster-body');
  if (body && hp > 0) {
    body.style.animation = 'monster-float 3s ease-in-out infinite';
  }
}

function monster_takeDamage(container, monsterData, newProgress) {
  const body = container.querySelector('.monster-body');
  if (body) {
    body.classList.add('monster-hit');
    setTimeout(() => body.classList.remove('monster-hit'), 600);
  }
  setTimeout(() => monster_render(container, monsterData, newProgress), 300);
}
