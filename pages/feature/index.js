import serviceApi from '../../services/request'
import { mockDatas } from '../../utils/mock.js';
import { initGraphCanvas } from '../../utils/index'

Page({
  data: {
    filePath:'',
    mockDatas:{},
    // 柱状图数据
    columnData: [
      { value: 22, color: '#cccccc', type: 'gray', label: '22x' },
      { value: 25, color: '#e63946', type: 'red', label: '25x' },
      { value: 18, color: '#cccccc', type: 'gray', label: '18x' },
      { value: 20, color: '#e63946', type: 'red', label: '20x' }
    ],
    barWidth: 40, // 柱子宽度
    barWidth2: 35,
    animationFrame: null, // 动画帧
    animationProgress: 0, // 动画进度
    categoryLabels: ['P/E Ratio', 'EV/EBITDA'], // 新增底部类别标签数据
    
    animationData: {},

    section5:[
      {
        icon:'phone',
        title:'phone',
        desc:'Steady decline',
        status:'down',
        percent:1,
        name:'YoY'
      },
      {
        icon:'set',
        title:'Services',
        desc:'Continued growth',
        status:'up',
        percent:12,
        name:'YoY'
      },
      {
        icon:'watch',
        title:'Wearables, Home, and Accessories',
        desc:'Moderate recovery',
        status:'up',
        percent:3,
        name:'YoY'
      }
    ],
    section7:[
      {
        title:'Current Market Cap',
        desc:'Final Valuation',
        status:'up',
        value:2.08,
        percent:3.15,
      },
      {
        title:'Current Share Price',
        desc:'Per Share Valuation',
        status:'up',
        value:198.15,
        percent:206.77,
      },
    ],
    section7Summarys:[
      {
        title:'Recommendations',
        desc:'Investment Recommendation: Buy'
      },
      {
        title:'Summary',
        desc:`Apple Inc. demonstrates resilience through

        diversified revenue streams and strong profitability. While 
        hardware growth slows, services provide sustainable 
        margins.A DCF-based valuation
        
        suggests slight undervaluation ($3.15T vs.$2.98T market cap), 
        supported by qualitative strengths like brand loyalty and 
        innovation leadership.With a current share price of $198.15 
        and fair value at$206.77, AAPL presents a compelling buying 
        opportunity`
      }
    ],
    columnData2:[
      { value: 98.3, color: '#DC2A31', label: 'Year 1' },
      { value: 102.0, color: '#DC2A31', label: 'Year 2' },
      { value: 106.0, color: '#DC2A31', label: 'Year 3' },
      { value: 110.0, color: '#DC2A31', label: 'Year 4' },
      { value: 114.0, color: '#DC2A31', label: 'Year 5' }
    ],
    ringCanvasImg:null,
    showCavans:true,
    currentPercent: 0 // 当前百分比
  },

  onLoad(){
    // 初始化加载动画
    this.initBars()
    this.initBars2()
    this.initBars3()
  },


  onReady() {
    this.initRings();
    this.initBars()
    this.initBars2()
    this.initBars3()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await this.initDatas()
    this.initRings()
    this.initBars()
    this.initBars2()
    this.initBars3()
  },

  async generateSharingCard(){
    // 等 image 加载完成后再截图
    this.setData({ showCavans: false });

    const canvas = this.selectComponent('#wxml2canvas');
    await canvas.draw();
    const filePath = await canvas.toTempFilePath();

    const fs = wx.getFileSystemManager()
    const that = this
    fs.readFile({
      filePath, // 这里可以直接使用 temp 路径
      encoding: 'base64',
      success(res) {
        const base64Data = 'data:image/png;base64,' + res.data
        console.log('base64Data==',base64Data)
      that.setData({
        filePath:base64Data
      })
        // 你可以将 base64Data 用作 image src，或上传
      },
      fail(err) {
        console.error('读取文件失败', err)
      }
    })

    console.log('filePath==',filePath)
    
    wx.previewImage({
      urls: [filePath],
    });

  },

  async initDatas(){
    // const res = await serviceApi(`/api/v1/stock/analysis/query/ticker_name=AAPL&date=2025-05-07`)

    this.setData({
      mockDatas
    })
  },

  initRings() {

    const ctx = wx.createCanvasContext('ringCanvas');
    const width = 75;  // 画布宽度（单位 px，和 wxml 保持一致，150rpx≈75px，建议用 px 单位）
    const height = 75;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 20;
    const lineWidth = 10;
    const target = 39.3; // 目标百分比
    let current = 0;

    function drawDashedLine(ctx, x1, y1, x2, y2, dashLen = 4, gapLen = 3) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const dashCount = Math.floor(len / (dashLen + gapLen));
      const dashX = dx / dashCount;
      const dashY = dy / dashCount;
      for (let i = 0; i < dashCount; i++) {
        const startX = x1 + dashX * i;
        const startY = y1 + dashY * i;
        const endX = startX + (dashX * dashLen) / (dashLen + gapLen);
        const endY = startY + (dashY * dashLen) / (dashLen + gapLen);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.setStrokeStyle('#DC2A31');
        ctx.setLineWidth(1);
        ctx.stroke();
      }
    }

    const draw = (percent) => {
    ctx.clearRect(0, 0, width, height);

    // 背景圆环
    ctx.beginPath();
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#888');
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // 红色环
    const start = -Math.PI / 2;
    const end = start + (2 * Math.PI * percent / 100);
    ctx.beginPath();
    ctx.setStrokeStyle('#DC2A31');
    ctx.setLineWidth(lineWidth);
    ctx.arc(centerX, centerY, radius, start, end);
    ctx.stroke();

    // 虚线指引（从圆环终点向外延伸）
    const angle = end;
    const x1 = centerX + radius * Math.cos(angle) + 5;
    const y1 = centerY + radius * Math.sin(angle) - 10;

    // 第一段：沿圆弧方向延伸 18px
    const len1 = 18;
    const x2 = x1 + len1 * Math.cos(angle);
    const y2 = y1 + len1 * Math.sin(angle);

    // 第二段：水平向右 30px
    const len2 = 30;
    const x3 = x2 + len2;
    const y3 = y2;

    // 绘制第一段虚线
    drawDashedLine(ctx, x1, y1, x2, y2);

    // 绘制拐弯后的水平虚线
    drawDashedLine(ctx, x2, y2, x3, y3);

    ctx.draw(false,()=>{
      wx.canvasToTempFilePath({
        canvasId: 'ringCanvas',
        success: res => {
          this.setData({ ringCanvasImg: res.tempFilePath });
        }
      });
    });
  };

  const animate = () => {
    if (current >= target) {
      this.setData({ currentPercent: target.toFixed(2) });
      draw(target);
      return;
    }
    current += 0.5;
    this.setData({ currentPercent: current.toFixed(2) });
    draw(current);
    setTimeout(animate, 16);
  };

  animate();
  },

  initBars(){
    const { columnData, barWidth, categoryLabels } = this.data;
    const ctx = wx.createCanvasContext('columnChart');
    const canvasWidth = 300;
    const canvasHeight = 300;
    const maxValue = Math.max(...columnData.map(item => item.value));
    const scale = (canvasHeight * 0.8) / maxValue; // 缩放因子 0.8，减少柱子高度

    const groupCount = Math.ceil(columnData.length / 2); // 计算组数
    const groupWidth = canvasWidth / groupCount; // 每组的宽度（平分容器宽度）
    const groupSpacing = (groupWidth - barWidth * 2) / 2; // 每组内的间距

    // 使用setTimeout替代requestAnimationFrame
    const animate = ()=>{
      const { animationProgress } = this.data;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      
      // 绘制柱状图
      for (let i = 0; i < columnData.length; i++) {
        const groupIndex = Math.floor(i / 2); // 每组两个柱子

        const x =
        groupIndex * groupWidth + // 每组的起始位置
        groupSpacing + // 每组内的间距
        (i % 2) * (barWidth + 41); // 每组内两个柱子的紧贴位置
        
        const y = canvasHeight - columnData[i].value * scale * animationProgress;

        const height = columnData[i].value * scale * animationProgress;

        // 绘制柱子
        this.drawColumn(ctx, x, y, height, columnData[i].color);

        // 绘制倒影
        this.drawReflection(ctx, x, y, height, columnData[i].color);

        // 绘制顶部数据标签
        this.drawDataLabel(ctx, x, y, columnData[i].label);
      }

      // 绘制底部类别标签
      for (let i = 0; i < categoryLabels.length; i++) {
        const x = i * groupWidth + groupWidth / 2; // 每组的中心位置
        const y = canvasHeight + 30; // 放在阴影下方
        this.drawCategoryLabel(ctx, x, y, categoryLabels[i]);
      }


      const newProgress = animationProgress + 0.02;
      if (newProgress <= 1) {
        this.setData({ animationProgress: newProgress }, () => {
          ctx.draw(false, () => {
            this.data.animationTimer = setTimeout(animate, 30);
          });
        });
      } else {
        clearTimeout(this.data.animationTimer);
      }
    };
    
    this.data.animationTimer = setTimeout(animate, 30);

  },

  initBars2(){
    const { columnData2, barWidth2 } = this.data;
    const ctx = wx.createCanvasContext('columnChart2');
    const canvasWidth = 300;
    const canvasHeight = 300;
    const maxValue = Math.max(...columnData2.map(item => item.value));
    const scale = (canvasHeight * 0.9) / maxValue; // 缩放因子 0.8，减少柱子高度


    const groupCount = columnData2.length; // 柱子组数
    const groupWidth = canvasWidth / groupCount; // 每组的宽度
    const groupSpacing = groupWidth - barWidth2; // 每组内的间距


    // 使用setTimeout替代requestAnimationFrame
    const animate = ()=>{
      const { animationProgress } = this.data;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // 绘制柱状图
      for (let i = 0; i < columnData2.length; i++) {
        const x = i * groupWidth + groupSpacing; // 每组的起始位置
        const y = canvasHeight - columnData2[i].value * scale * animationProgress;

        const height = columnData2[i].value * scale * animationProgress;

        // 绘制柱子
        this.drawColumn(ctx, x, y, height, columnData2[i].color,'bar2');

        // 绘制倒影
        this.drawReflection(ctx, x, y, height, columnData2[i].color,'bar2');

        // 绘制顶部数据标签
        this.drawDataLabel(ctx, x, y, `$${columnData2[i].value.toFixed(1)}B`,'bar2');

        // 绘制底部类别标签
        this.drawCategoryLabel(ctx, x, canvasHeight + 10, columnData2[i].label,'bar2');
      }

      const newProgress = animationProgress + 0.02;
      if (newProgress <= 1) {
        this.setData({ animationProgress: newProgress }, () => {
          ctx.draw(false, () => {
            this.data.animationTimer = setTimeout(animate, 30);
          });
        });
      } else {
        clearTimeout(this.data.animationTimer);
      }
    };
    
    this.data.animationTimer = setTimeout(animate, 30);
  },

  initBars3(){
    const ctx = wx.createCanvasContext('valuationChart')
    initGraphCanvas(ctx)
  },

  draw3DBar(ctx, x, y, height, color){
    const w = 40;
    const h = height;
    const depth = 10;

    // 顶部
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + depth, y - h - depth);
    ctx.lineTo(x + w + depth, y - h - depth);
    ctx.lineTo(x + w, y - h);
    ctx.closePath();
    ctx.setFillStyle(this.shadeColor(color, -10));
    ctx.fill();

    // 前面
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - h);
    ctx.lineTo(x + w, y - h);
    ctx.lineTo(x + w, y);
    ctx.closePath();
    ctx.setFillStyle(color);
    ctx.fill();

    // 右侧
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w, y - h);
    ctx.lineTo(x + w + depth, y - h - depth);
    ctx.lineTo(x + w + depth, y - depth);
    ctx.closePath();
    ctx.setFillStyle(this.shadeColor(color, -20));
    ctx.fill();

  },
  
  // 用于颜色加深
  shadeColor(){
    let f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;

    return (
      '#' +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    )

  },

  // 绘制单个柱子
  drawColumn(ctx, x, y, height, color,type='bar1') {
    if(type === 'bar2'){
      const barWidth = this.data.barWidth2;
      const sideWidth = 18; // 侧面宽度

      // 绘制正面
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + barWidth, y);
      ctx.lineTo(x + barWidth, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // 绘制右侧面
      ctx.beginPath();
      ctx.moveTo(x + barWidth, y);
      ctx.lineTo(x + barWidth + sideWidth, y - sideWidth);
      ctx.lineTo(x + barWidth + sideWidth, y + height - sideWidth);
      ctx.lineTo(x + barWidth, y + height);
      ctx.closePath();
      ctx.fillStyle = this.getSideColor(color);
      ctx.fill();

      // 绘制顶部
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + barWidth, y);
      ctx.lineTo(x + barWidth + sideWidth, y - sideWidth);
      ctx.lineTo(x + sideWidth, y - sideWidth);
      ctx.closePath();
      ctx.fillStyle = this.getTopColor(color);
      ctx.fill();

    }else{
      const sideWidth = 20; // 侧面宽度
      const barWidth = this.data.barWidth; // 从 data 中获取 barWidth

      // 根据柱子颜色调整倾斜角度
      const isLeft = color === '#cccccc'; // 白色柱子（灰色）左倾，红色柱子右倾

      // 绘制正面
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + barWidth, y); // 顶部水平
      ctx.lineTo(x + barWidth, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // 绘制右侧面
      if (isLeft) {
        ctx.beginPath();
        ctx.moveTo(x + barWidth, y);
        ctx.lineTo(x + barWidth + sideWidth, y - sideWidth);
        ctx.lineTo(x + barWidth + sideWidth, y + height - sideWidth);
        ctx.lineTo(x + barWidth, y + height);
        ctx.closePath();
        ctx.fillStyle = this.getSideColor(color);
        ctx.fill();
      }

      // 绘制左侧面
      if (!isLeft) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - sideWidth, y - sideWidth);
        ctx.lineTo(x - sideWidth, y + height - sideWidth);
        ctx.lineTo(x, y + height);
        ctx.closePath();
        ctx.fillStyle = this.getSideColor(color);
        ctx.fill();
      }

      // 绘制顶部
      ctx.beginPath();
      if (isLeft) {
        // 白色柱子顶部向右倾斜
        ctx.moveTo(x, y);
        ctx.lineTo(x + barWidth, y);
        ctx.lineTo(x + barWidth + sideWidth, y - sideWidth);
        ctx.lineTo(x + sideWidth, y - sideWidth);
      } else {
        // 红色柱子顶部向左倾斜
        ctx.moveTo(x, y);
        ctx.lineTo(x + barWidth, y);
        ctx.lineTo(x + barWidth - sideWidth, y - sideWidth);
        ctx.lineTo(x - sideWidth, y - sideWidth);
      }
      ctx.closePath();
      ctx.fillStyle = this.getTopColor(color);
      ctx.fill();

      // 添加柱子之间的阴影
      ctx.beginPath();
      ctx.moveTo(x + this.data.barWidth, y + height);
      ctx.lineTo(x + this.data.barWidth + sideWidth, y + height - sideWidth);
      ctx.lineTo(x + this.data.barWidth + sideWidth, y + height + 10);
      ctx.lineTo(x + this.data.barWidth, y + height + 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // 阴影颜色
      ctx.fill();
    }

  },

  // 绘制倒影
  drawReflection(ctx, x, y, height, color,type = 'bar1') {
    if(type === 'bar2'){
      const barWidth = this.data.barWidth2; // 柱子的宽度
      const reflectionHeight = height * 0.5; // 倒影高度为柱子高度的 50%
      const reflectionY = y + height - 16; // 倒影起点上移 10 像素
      const reflectionExtraWidth = 20; // 倒影额外增加的宽度

      // 创建渐变效果
      const gradient = ctx.createLinearGradient(x, reflectionY, x, reflectionY + reflectionHeight);
      gradient.addColorStop(0, this.getReflectionColor(color,'bar2')); // 倒影颜色
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // 渐变到透明

      // 绘制倒影
      ctx.beginPath();
      ctx.moveTo(x - reflectionExtraWidth / 2 + 10, reflectionY); // 倒影左下角，向左扩展
      ctx.lineTo(x + barWidth + reflectionExtraWidth / 2 + 10, reflectionY); // 倒影右下角，向右扩展
      ctx.lineTo(x + barWidth + reflectionExtraWidth / 2 + 10, reflectionY + reflectionHeight); // 倒影右上角
      ctx.lineTo(x - reflectionExtraWidth / 2 + 10, reflectionY + reflectionHeight); // 倒影左上角
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

    }else{
      const barWidth = this.data.barWidth; // 柱子的宽度
      const reflectionHeight = height + 16; // 倒影高度增加 10 像素，填满间隙
      const reflectionY = y + height - 16; // 倒影起点上移 10 像素
      const reflectionExtraWidth = 20; // 倒影额外增加的宽度

      // 根据颜色调整倒影的水平偏移
      const isWhite = color === '#cccccc'; // 判断是否为白色柱子
      const offset = isWhite ? 10 : -10; // 白色柱子向右偏移，红色柱子向左偏移

      // 创建渐变效果
      const gradient = ctx.createLinearGradient(x, reflectionY, x, reflectionY + reflectionHeight);
      gradient.addColorStop(0, this.getReflectionColor(color)); // 倒影颜色
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // 渐变到透明

      
      // 绘制倒影
      ctx.beginPath();
      ctx.moveTo(x - reflectionExtraWidth / 2 + offset, reflectionY); // 倒影左下角，向左扩展
      ctx.lineTo(x + barWidth + reflectionExtraWidth / 2 + offset, reflectionY); // 倒影右下角，向右扩展
      ctx.lineTo(x + barWidth + reflectionExtraWidth / 2 + offset, reflectionY + reflectionHeight); // 倒影右上角
      ctx.lineTo(x - reflectionExtraWidth / 2 + offset, reflectionY + reflectionHeight); // 倒影左上角
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

  },

  // 获取侧面颜色（加深）
  getSideColor(color) {
    if (color.startsWith('#')) {
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      const darkerR = Math.max(0, r - 50);
      const darkerG = Math.max(0, g - 50);
      const darkerB = Math.max(0, b - 50);
      return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
    }
    return color;
  },

  // 获取顶面颜色（加亮）
  getTopColor(color) {
    if (color.startsWith('#')) {
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      const lighterR = Math.min(255, r + 50);
      const lighterG = Math.min(255, g + 50);
      const lighterB = Math.min(255, b + 50);
      return `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
    }
    return color;
  },

  // 获取倒影颜色（添加透明度）
  getReflectionColor(color,type='bar1') {
    if (color.startsWith('#') && color.length === 7) {
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);

      // 确保 r, g, b 都是有效数字
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        if(type == 'bar1'){
          return `rgba(${r}, ${g}, ${b}, 0.1)`; // 添加透明度
        }else{
          return `rgba(${r}, ${g}, ${b}, 0.2)`; // 添加透明度
        }
      }
    }

    // 如果颜色格式不正确，返回一个默认值
    return 'rgba(0, 0, 0, 0.3)'; // 默认倒影颜色

  },
  // 绘制数据标签
  drawDataLabel(ctx, x, y, label, type='bar1') {
    const barWidth = this.data.barWidth;
    ctx.font = "14px Arial";
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    ctx.fillText(label, x + barWidth / 2, y - 30); // 向上偏移 30 像素，确保文字清晰可见

  },
  // 绘制底部类别标签
  drawCategoryLabel(ctx, x, y, label,type='bar1') {
    ctx.font = "14px Arial";
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    if(type == 'bar2'){
      const barWidth = this.data.barWidth;
      ctx.fillText(label, x + barWidth / 2 + 8, y + 40); // 向下偏移 10 像素
    }else{
      ctx.fillText(label, x + 15, y + 15); // 放在阴影下方，向下偏移 15 像素
    }
  }

});