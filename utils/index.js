 export const initGraphCanvas = (ctx)=>{

  const canvasHeight = 550;
  // 图表参数
  const barWidth = 40; // 柱子宽度增加
  const barGap = 80; // 柱子间距增加  

  const offsetX = -50; // 向左靠近画布边缘，数值越小越靠左

  const targetHeights = [380, 350, 370]; // 目标高度数组
  const colors = ['#bfc2cb', '#bfc2cb', '#e63946']; // 颜色数组
  const currentHeights = [0, 0, 0]; // 当前高度数组
  const step = 18

  const animate = ()=>{
    let finished = true;
    for (let i = 0; i < 3; i++) {
      if (currentHeights[i] < targetHeights[i]) {
        currentHeights[i] = Math.min(currentHeights[i] + step, targetHeights[i]);
        finished = false;
      }
    }
    ctx.clearRect(0, 0, 1000, 1000); // 清空画布

    // 绘制柱子
    for (let i = 0; i < 3; i++) {
      drawBar(ctx, i, currentHeights[i], barWidth, barGap, canvasHeight, colors[i], offsetX);
    }

    // 只在动画结束后绘制箭头和文字
    if(finished){
      // 绘制中间柱子虚盖部分
      const side = 15;
      const barX = barGap + (barWidth + barGap) * 1;
      const arrowStartX = barX + barWidth + side;

      const barX0 = barGap + (barWidth + barGap) * 0; // 第一个柱子的x
      const arrowStartX0 = barX0 + barWidth + side;   // 第一个柱子右侧立体面
      const arrowY = canvasHeight - targetHeights[0] / 2 + 110;   // 箭头大致居中
      
      // 绘制水平箭头和文字（调整位置和样式）
      drawHorizontalArrow(ctx, barWidth, barGap, canvasHeight, 
                            'Sensitivity and Scenario Analysis',
                            arrowStartX0,arrowY,barGap - 30);
      drawHorizontalArrow(ctx, barWidth, barGap, canvasHeight, 
                            'Incorporate Qualitative Factors and Validate',
                            arrowStartX, 
                            canvasHeight - 100, barGap - 30);
      
      // 绘制柱子顶部数值
      drawValueText(ctx, 0, barWidth, barGap, '$3.1T', canvasHeight, targetHeights[0]);
      drawValueText(ctx, 1, barWidth, barGap, '$3.3T', canvasHeight, targetHeights[1]);
      drawValueText(ctx, 2, barWidth, barGap, '$3.15T', canvasHeight, targetHeights[2]);
    }

    ctx.draw();

    if (!finished) {
      setTimeout(animate, 16); // 约60fps
    }
  }
  animate();
 }
// 绘制柱子（增强立体效果）
 const drawBar = (ctx, index, height, barWidth, barGap, canvasHeight, color, drawBar)=>{
  const x = drawBar + barGap + (barWidth + barGap) * index;
  const gradientHeight = height * 0.7; // 渐变高度
  
  // 绘制阴影
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fill();

  if(index==1){
    const side = 15;
    // const x = drawBar + barGap + (barWidth + barGap) * 1
    const y = canvasHeight - height
    const width = barWidth
    const solidHeight = canvasHeight - y
    const hollowHeight = 80

    // 柱体顶面四个点
    const pA = [x, y]; // 左前
    const pB = [x + width, y]; // 右前
    const pC = [x + width + side, y + side]; // 右后
    const pD = [x - side, y + side]; // 左后

    // 虚线框顶面四个点（在柱体顶面基础上再往上偏移hollowHeight）
    const pE = [pA[0], pA[1] - hollowHeight]; // 左前上
    const pF = [pB[0], pB[1] - hollowHeight]; // 右前上
    const pG = [pC[0], pC[1] - hollowHeight]; // 右后上
    const pH = [pD[0], pD[1] - hollowHeight]; // 左后上


    // 1. 实心部分
    // 柱身
    ctx.beginPath();
    ctx.moveTo(pA[0], pA[1]);
    ctx.lineTo(pB[0], pB[1]);
    ctx.lineTo(pB[0], canvasHeight);
    ctx.lineTo(pA[0], canvasHeight);
    ctx.closePath();
    ctx.fillStyle = '#bfc2cb';
    ctx.fill();

    // 左侧
    ctx.beginPath();
    ctx.moveTo(pA[0], pA[1]);
    ctx.lineTo(pD[0], pD[1]);
    ctx.lineTo(pD[0], canvasHeight);
    ctx.lineTo(pA[0], canvasHeight);
    ctx.closePath();
    ctx.fillStyle = '#b0b2be';
    ctx.fill();

    // 右侧
    ctx.beginPath();
    ctx.moveTo(pB[0], pB[1]);
    ctx.lineTo(pC[0], pC[1]);
    ctx.lineTo(pC[0], canvasHeight);
    ctx.lineTo(pB[0], canvasHeight);
    ctx.closePath();
    ctx.fillStyle = '#a3a5b0';
    ctx.fill();

    // 2. 顶部深色盖（梯形）
    ctx.beginPath();
    ctx.moveTo(pA[0], pA[1]);
    ctx.lineTo(pB[0], pB[1]);
    ctx.lineTo(pC[0], pC[1]);
    ctx.lineTo(pD[0], pD[1]);
    ctx.closePath();
    const topGradient = ctx.createLinearGradient(pD[0], pD[1], pC[0], pC[1]);
    topGradient.addColorStop(0, '#666');
    topGradient.addColorStop(0.4, '#444');
    topGradient.addColorStop(1, '#222');
    ctx.fillStyle = topGradient;
    ctx.fill();

    // 3. 虚线空心部分（立体虚线框）
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#bfc2cb';
    ctx.lineWidth = 2;

    // 前面
    ctx.beginPath();
    ctx.moveTo(pA[0], pA[1]);
    ctx.lineTo(pE[0], pE[1]);
    ctx.lineTo(pF[0], pF[1]);
    ctx.lineTo(pB[0], pB[1]);
    ctx.stroke();

    // 左侧
    ctx.beginPath();
    ctx.moveTo(pE[0], pE[1]);
    ctx.lineTo(pH[0], pH[1]);
    ctx.lineTo(pD[0], pD[1]);
    ctx.lineTo(pA[0], pA[1]);
    ctx.stroke();

    // 右侧
    ctx.beginPath();
    ctx.moveTo(pF[0], pF[1]);
    ctx.lineTo(pG[0], pG[1]);
    ctx.lineTo(pC[0], pC[1]);
    ctx.lineTo(pB[0], pB[1]);
    ctx.stroke();

    // 顶部虚线盖
    ctx.beginPath();
    ctx.moveTo(pE[0], pE[1]);
    ctx.lineTo(pF[0], pF[1]);
    ctx.lineTo(pG[0], pG[1]);
    ctx.lineTo(pH[0], pH[1]);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 4. $2.9T 居中显示
    ctx.save();
    ctx.font = '16px Univers Next for HSBC';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText('$2.9T', x + width / 2, y + solidHeight / 2 - 130);
    ctx.restore();

  }else{
    // 绘制柱子正面（带渐变）
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(x, canvasHeight - height, x, canvasHeight - height + gradientHeight);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, lightenColor(color, 30));
    ctx.rect(x, canvasHeight - height, barWidth, height);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 绘制柱子左侧面（蓝色调）
    ctx.beginPath();
    const leftSideColor = lightenColor(color, 15);
    ctx.moveTo(x, canvasHeight - height);
    ctx.lineTo(x, canvasHeight);
    ctx.lineTo(x - 15, canvasHeight);
    ctx.lineTo(x - 15, canvasHeight - height + 15);
    ctx.closePath();
    ctx.fillStyle = leftSideColor;
    ctx.fill();
    
    // 绘制柱子右侧面（更亮的蓝色调）
    ctx.beginPath();
    const rightSideColor = lightenColor(color, 30);
    ctx.moveTo(x + barWidth, canvasHeight - height);
    ctx.lineTo(x + barWidth, canvasHeight);
    ctx.lineTo(x + barWidth + 15, canvasHeight);
    ctx.lineTo(x + barWidth + 15, canvasHeight - height + 15);
    ctx.closePath();
    ctx.fillStyle = rightSideColor;
    ctx.fill();
    
    // 绘制柱子顶部
    ctx.beginPath();
    const topColor = lightenColor(color, 40);
    ctx.moveTo(x, canvasHeight - height);
    ctx.lineTo(x + barWidth, canvasHeight - height);
    ctx.lineTo(x + barWidth + 15, canvasHeight - height + 15);
    ctx.lineTo(x + 15, canvasHeight - height + 15);
    ctx.closePath();
    ctx.fillStyle = topColor;
    ctx.fill();
  }
  
  // 绘制倒影
  drawReflection(ctx, x, canvasHeight - height, barWidth + 30, height, index);
 }

 // 绘制倒影
 const drawReflection = (ctx, x, y, width, height,index)=>{
  const reflectionHeight = 35; // 固定倒影高度
    const reflectionOffset = 0; // 紧贴柱子底部
    const reflectionShift = -15; // 向左偏移10像素，可调整

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + reflectionShift, y + height + reflectionOffset);
    ctx.lineTo(x + width + reflectionShift, y + height + reflectionOffset);
    ctx.lineTo(x + width + reflectionShift, y + height + reflectionOffset + reflectionHeight);
    ctx.lineTo(x + reflectionShift, y + height + reflectionOffset + reflectionHeight);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(x + reflectionShift, y + height + reflectionOffset, x + reflectionShift, y + height + reflectionOffset + reflectionHeight);
    if(index == 2){
      // 第三根柱子，阴影要是红色开始
      gradient.addColorStop(0, '#e63946');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
    }else{
      gradient.addColorStop(0, '#b0b2be');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
    }

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
 }

 // 绘制水平箭头和文字
 const drawHorizontalArrow = (ctx, barWidth, barGap, canvasHeight, text, startX, startY, arrowLength)=>{
    const arrowHeadSize = 7; // 箭头头部大小
    const arrowYOffset = -40; // 上移40像素，可根据需要调整
    
    // 绘制箭头线
    ctx.beginPath();
    ctx.moveTo(startX - 50, startY + arrowYOffset);
    ctx.lineTo(startX + arrowLength - 50, startY + arrowYOffset);
    ctx.strokeStyle = '#bfc2cb';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 绘制箭头头部
    ctx.beginPath();
    ctx.moveTo(startX + arrowLength - 50, startY + arrowYOffset);
    ctx.lineTo(startX + arrowLength - arrowHeadSize - 50, startY + arrowYOffset - arrowHeadSize / 2);
    ctx.lineTo(startX + arrowLength - arrowHeadSize - 50, startY + arrowYOffset + arrowHeadSize / 2);
    ctx.closePath();
    ctx.fillStyle = '#bfc2cb';
    ctx.fill();

    // 自动换行文字
    ctx.font = '12px Univers Next for HSBC';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    const maxWidth = arrowLength - 10; // 最大宽度为箭头长度减去两端空隙
    const lines = [];
    let line = '';
    for (let word of text.split(' ')) {
      let testLine = line ? line + ' ' + word : word;
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);

    // 绘制多行文字
    const lineHeight = 22;
    const textY = startY + arrowYOffset + 30;
    lines.forEach((l, i) => {
      // 文字放在箭头上方
      ctx.fillText(l, startX + arrowLength / 2 - 50, textY + i * lineHeight - 150);
    });
 }

 //绘制柱子顶部数值
 const drawValueText = (ctx, index, barWidth, barGap, value, canvasHeight, barHeight)=>{
  const x = barGap + (barWidth + barGap) * index + barWidth / 2;
  const y = canvasHeight - barHeight - 35; // 上移
  ctx.font = '16px Univers Next for HSBC';
  ctx.fillStyle = '#b0b2be';
  ctx.textAlign = 'center';
  ctx.fillText(value, x - 50, y);
 }

 // 辅助函数：颜色亮度调整
 const lightenColor = (hex, percent)=>{
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const newR = Math.min(255, Math.round(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.round(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.round(b + (255 - b) * percent / 100));
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
 }

 // 辅助函数：数值转十六进制
 const toHex = (num)=>{
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
 }