import serviceApi from '../../services/request'
import { mockDatas } from '../../utils/mock.js';
import { drawBar, drawHorizontalArrow, drawValueText, renderCanvasToImg, indexLists, getTodayStr } from '../../utils/index'

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
    
    arrow_up_image:'/assets/image/arrow/arrow_up.png',
    arrow_down_image:'/assets/image/arrow/arrow_down.png',

    section3Datas:{
      texts:[
        {
          desc:`Services show robust growth, offsetting slower iPhone sales, while wearables face challenges.`
        },
        {
          desc:`High margins in services bolster overall profitability despite pressure on hardware segments.`
        }
      ]
    },

    section4:`Apple trades at a premium compared to peers, justified by superior profitability and brand strength.`,
    section5Text:`Strong free cash flow generation driven by services segment expansion.`,
    section5Text1:`Risks include regulatory pressures, supply chain disruptions, and competition intensifying.`,
    section5:[
      {
        icon:'phone',
        title:'phone Steady decline',
        status:'down',
        percent:1,
        name:'YoY'
      },
      {
        icon:'set',
        title:'Services Continued growth',
        status:'up',
        percent:12,
        name:'YoY'
      },
      {
        icon:'watch',
        title:'Wearables, Home, and Accessories oderate recovery',
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
        desc:''
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
    ringCanvasImgs:[],
    ringCanvasImg:null,
    columnChartImg:null,
    columnChartImg2:null,
    valuationChartImg:null,
    showsCavans:[true,true,true],
    showCavans1:true,
    showCavans2:true,
    showCavans3:true,
    pageTitle: '',
    pageId: '',
    pageName:'',
    detailLogo:'',
    currentPercent: 0 // 当前百分比
  },

  async onLoad(options){

    // options 就是路径参数对象
    const { title, id } = options;
    console.log('页面参数:', title, id);

    // 可以将参数保存到 data 或用于后续逻辑
    this.setData({
      pageTitle: title,
      pageId: id,
      detailLogo:indexLists.find(item => item.id === id).image
    });

    await this.initDatas()

    // 初始化加载动画
    this.initBars()
    this.initBars2()
    this.initBars3()
  },


  async onReady() {
    await this.initDatas()
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

  handleCatchDatas(res){
    wx.hideLoading();

    console.log('res==',res)

    const markName = indexLists.find(item => item.id === this.data.pageId).markName || this.data.pageId
    
    console.log('markName==',markName)
    this.setData({
      pageName: markName,
    })

    const columnData2Datas = [...res.cash_flow_forecasts]?.map(item=>{
      return{
        value: item.numeric_value,
        color: '#DC2A31',
        label: `Year ${item.year}`,
        valueText: item.amount,
      }
    })

    const market_comparisons = [
      {
        title: 'current_market_cap',
        desc: 'final_valuation',
        status: res.market_comparison.final_valuation_trend,
        value: res.market_comparison.current_market_cap,
        percent: res.market_comparison.final_valuation,
      },
      {
        title: 'value_per_share',
        desc: 'final_valuation',
        status: res.market_comparison.value_per_share_trend,
        value: res.market_comparison.current_price,
        percent: res.market_comparison.value_per_share,
      }
    ]

    console.log('columnData2Datas==',columnData2Datas)

    const section7SummarysData = this.data.section7Summarys.map((item,index)=>{
      return {
        title:item.title,
        desc:index == 0 ? `Investment Recommendation: ${res.recommendation.action}` : res.final_summary
      }
    })

    const columnDatas = [
      {
        value:Number(res.peer_comparison.valuation_comparison.current_company.peer_comparisons[0].metrics.p_e_ratio.replace('x','')),
        color: '#cccccc',
        type: 'gray',
        label: res.peer_comparison.valuation_comparison.current_company.peer_comparisons[0].metrics.p_e_ratio,
      },
      {
        value:Number(res.peer_comparison.valuation_comparison.current_company.metrics.p_e_ratio.replace('x','')),
        color: '#e63946',
        type: 'red',
        label: res.peer_comparison.valuation_comparison.current_company.metrics.p_e_ratio,
      }
    ]

    console.log('columnDatas00',columnDatas)


    this.setData({
      mockDatas:res,
      columnData2:columnData2Datas,
      section5Text1:res.risk_factors.join(','),
      section7Summarys:section7SummarysData,
      columnData:columnDatas,
      section7:market_comparisons
    })

  },

  async initDatas(){
    wx.showLoading({
      title: '加载中', // 可自定义提示文字
      mask: true         // 是否显示透明蒙层，防止触摸穿透
    });
    const today = getTodayStr()// 例如 "2025-05-26"
    console.log('today==',today)
    const res = await serviceApi(`/api/v1/stock/analysis/query?ticker_name=${this.data.pageId}&date=${today}`).catch(err=>{
      console.log('err==',err)
      wx.hideLoading();
      this.handleCatchDatas(mockDatas)
    })

    this.handleCatchDatas(res.analysis_data)
    
  },

  initRings() {

    const width = 75;  // 画布宽度（单位 px，和 wxml 保持一致，150rpx≈75px，建议用 px 单位）
    const height = 75;

    const ringCanvasImgs = [];
    const showsCavans = [true,true,true]
    const { mockDatas } = this.data


    mockDatas.business_segments.forEach((segment,index)=>{
      const ctx = wx.createCanvasContext(`ringCanvas${index}`,this);
      console.log('segment.margin:', segment.margin);
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = width / 2 - 20;
      const lineWidth = 10;
      const target = parseFloat(segment.margin)//segment.margin; // 当前业务板块的百分比
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

        // 虚线指引（从圆环起始向外延伸）
        // 固定虚线起点为圆的起始位置，并整体向下偏移10px
        // const angle = start;
        const x0 = centerX + (radius + lineWidth / 2) * Math.cos(start) + 20; // 圆环最外边缘顶部
        const y0 = centerY + (radius + lineWidth / 2) * Math.sin(start);  

        // 钝角夹角（如120°），每边与竖直方向夹角为30°
        const theta = Math.PI / 3; // 30°
        const len = 18; // 虚线长度

        // 左边虚线
        const x1 = x0 - len * Math.sin(theta);
        const y1 = y0 + len * Math.cos(theta);
        // 右边虚线
        const x2 = x0 + len * Math.sin(theta);
        const y2 = y0 + len * Math.cos(theta);

        // 绘制左边虚线
        drawDashedLine(ctx, x0, y0, x1, y1);
        // 绘制右边虚线
        drawDashedLine(ctx, x0, y0, x2, y2);

        ctx.draw(false,async()=>{
          setTimeout(()=>{
            wx.canvasToTempFilePath({
              canvasId:`ringCanvas${index}`,
              success: res => {
                ringCanvasImgs[index] = res.tempFilePath
                showsCavans[index] = false
                this.setData({
                  ringCanvasImgs
                },()=>{
                  setTimeout(() => {
                    this.setData({
                      showsCavans
                    });
                  }, 400); // 400ms延迟，确保image src已渲染
                })
              }
            });
          },2500)
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


    })
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

            setTimeout(()=>{
              wx.canvasToTempFilePath({
                canvasId:'columnChart',
                success: res => {
                  this.setData({
                    columnChartImg:res.tempFilePath
                  },()=>{
                    setTimeout(() => {
                      this.setData({
                        showCavans1: false
                      });
                    }, 400); // 400ms延迟，确保image src已渲染
                  })
                }
              });
            },2500)
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
        this.drawDataLabel(ctx, x, y, `${columnData2[i].valueText}`,'bar2');

        // 绘制底部类别标签
        this.drawCategoryLabel(ctx, x, canvasHeight + 10, columnData2[i].label,'bar2');
      }

      const newProgress = animationProgress + 0.02;
      if (newProgress <= 1) {
        this.setData({ animationProgress: newProgress }, () => {
          ctx.draw(false, () => {
            this.data.animationTimer = setTimeout(animate, 30);

            setTimeout(()=>{
              wx.canvasToTempFilePath({
                canvasId:'columnChart2',
                success: res => {
                  this.setData({
                    columnChartImg2:res.tempFilePath
                  },()=>{
                    setTimeout(() => {
                      this.setData({
                        showCavans2: false
                      });
                    }, 400); // 400ms延迟，确保image src已渲染
                  })
                }
              });
            },2500)

          });
        });
      } else {
        clearTimeout(this.data.animationTimer);
      }
    };
    
    this.data.animationTimer = setTimeout(animate, 30);
  },

  async initBars3(){
    const ctx = wx.createCanvasContext('valuationChart')

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
      const {mockDatas} = this.data
      for (let i = 0; i < 3; i++) {
        drawBar(ctx, i, currentHeights[i], barWidth, barGap, canvasHeight, colors[i], offsetX,mockDatas.valuation_metrics.Weighted_valuation_range.split('-')[0]);
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
                              canvasHeight - 100, barGap - 30)
                        
                            
        const { mockDatas } = this.data

        
        // 绘制柱子顶部数值
        drawValueText(ctx, 0, barWidth, barGap, mockDatas.valuation_metrics.initial_valuation, canvasHeight, targetHeights[0]);
        drawValueText(ctx, 1, barWidth, barGap, mockDatas.valuation_metrics.Weighted_valuation_range.split('-')[1], canvasHeight, targetHeights[1]);
        drawValueText(ctx, 2, barWidth, barGap, mockDatas.valuation_metrics.final_valuation, canvasHeight, targetHeights[2]);
      }

      ctx.draw(false, () => {

        setTimeout(()=>{
          wx.canvasToTempFilePath({
            canvasId:'valuationChart',
            success: res => {
              this.setData({
                valuationChartImg:res.tempFilePath
              },()=>{
                setTimeout(() => {
                  this.setData({
                    showCavans3: false
                  });
                }, 400); // 400ms延迟，确保image src已渲染
              })
            }
          });
        },2500)
      })

      if (!finished) {
        setTimeout(animate, 16); // 约60fps
      }
    }
    animate();
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
      const sideWidth = 16; // 侧面宽度

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
  },

  // 分享给微信好友
  onShareAppMessage: function () {
    return {
      title: '公司财报报告',
      path: `/pages/feature/index?title=${this.data.pageTitle}&id=${this.data.pageId}`, // 分享后打开的页面路径
      imageUrl: '/assets/image/share.png' // 可选，自定义分享图片
    }
  },
  // 保存长图到相册

  async onSaveImage() {
    wx.showLoading({ title: '保存中', mask: true });

    const canvas = this.selectComponent('#wxml2canvas');
    console.log('canvas:', canvas);
    await canvas.draw(); // 等待绘制完成

    // 延迟确保安卓端渲染完成
    setTimeout(async () => {
      const filePath = await canvas.toTempFilePath();
      console.log('filePath:', filePath);

      wx.saveImageToPhotosAlbum({
        filePath,
        success() {
          wx.showToast({ title: '保存成功', icon: 'success' });
          wx.hideLoading();
        },
        fail(err) {
          wx.hideLoading();
          if (err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
            wx.showModal({
              title: '提示',
              content: '需要授权保存到相册，请到设置中开启权限',
              success(res) {
                if (res.confirm) wx.openSetting();
              }
            });
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
          console.error('保存失败', err);
        }
      });
    }, 800); // 安卓建议延迟800ms以上
  }
});