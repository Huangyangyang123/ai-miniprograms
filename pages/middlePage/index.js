// pages/middlePage/index.js

import * as marked from '../../utils/marked.js'; // 引入 marked 库
import serviceApi from '../../services/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    id:'',
    showBtn:false,
    fullText: "### Stock Valuation and Investment Analysis Report for PDD Holdings Inc. (PDD)\n\n---\n\n#### Part One: Preparation\n\n**1. Understand the Business**\n\nPDD Holdings Inc. (PDD) is a leading e-commerce platform in China, operating under the brand name \"Pinduoduo.\" The company's business model focuses on social commerce, where users can buy products at discounted prices by forming groups with friends and family. PDD's primary revenue drivers include transaction fees, marketing services, and commissions from merchants. The company targets a broad range of consumers, particularly in lower-tier cities, and has been expanding its reach through various initiatives, including grocery delivery and community group buying.\n\n**2. Industry and Competition Analysis**\n\nThe e-commerce industry in China is highly competitive, with key players such as Alibaba, JD.com, and Meituan. Porter's Five Forces analysis reveals high competitive rivalry, moderate buyer power due to the availability of alternatives, and low supplier power. Growth is driven by increasing internet penetration and the rise of social commerce. PDD maintains a strong position through its innovative social shopping model and aggressive marketing strategies. However, the company faces challenges from regulatory scrutiny and the need to sustain growth in a maturing market.\n\n**Recent News:**\n1. **Thornburg Investment Management Inc. reduced its stake in PDD by 25.3% during the 4th quarter.**  \n   - **Link:** [MarketBeat](https://www.marketbeat.com/instant-alerts/filing-thornburg-investment-management-inc-has-610-million-position-in-pdd-holdings-inc-nasdaqpdd-2025-05-18/)\n   - **Impact:** This could indicate a lack of confidence in PDD's short-term prospects, potentially affecting the stock price.\n   \n2. **PDD announces Q1 2025 earnings call on May 27.**  \n   - **Link:** [StockTitan](https://www.stocktitan.net/news/PDD/pdd-holdings-to-report-first-quarter-2025-unaudited-financial-v4pkmp9buo0f.html)\n   - **Impact:** The upcoming earnings call will provide insights into the company's financial performance and strategic updates, which could influence investor sentiment.\n   \n3. **Options trading for PDD shows a notable upswing.**  \n   - **Link:** [GuruFocus](https://www.gurufocus.com/news/2884179/pdd-stock-sees-increased-call-activity-and-rising-implied-volatility-pdd-stock-news)\n   - **Impact:** Increased call activity suggests bullish sentiment among traders, which could drive the stock price higher.\n   \n4. **Shell Asset Management Co. increased its holdings in PDD by 11.0% during the 4th quarter.**  \n   - **Link:** [MarketBeat](https://www.marketbeat.com/instant-alerts/shell-asset-management-co-raises-stock-holdings-in-pdd-holdings-inc-nasdaqpdd-2025-05-17/)\n   - **Impact:** This indicates institutional support and could be a positive signal for the stock.\n   \n5. **Raiffeisen Bank International AG purchased a new stake in PDD.**  \n   - **Link:** [MarketBeat](https://www.marketbeat.com/instant-alerts/filing-4700-shares-in-pdd-holdings-inc-nasdaqpdd-acquired-by-raiffeisen-bank-international-ag-2025-05-18/)\n   - **Impact:** New institutional investment suggests growing confidence in PDD's long-term potential.\n\n---\n\n#### Part Two: Analysis\n\n**3. Business Segment Analysis**\n\nThe latest quarterly report (Dec 2024) shows the following revenue breakdown:\n- **Online Marketplace Services and Other:** $27.35B\n- **Transaction Services:** $27.07B\n\nOver the past three years, the Online Marketplace Services segment has shown consistent growth, with a CAGR of 30.5%. The Transaction Services segment has also grown significantly, with a CAGR of 108.19%. Both segments have contributed to the company's overall profitability, with improving margins and operational efficiency.\n\n**4. Profitability Analysis**\n\nGross profit margins for the Online Marketplace Services segment are approximately 60%, while the Transaction Services segment has a margin of around 27%. These margins reflect the company's ability to scale its operations and maintain cost efficiencies. The trend indicates improving profitability, especially in the Transaction Services segment, driven by higher transaction volumes and better monetization strategies.\n\n**5. Balance Sheet and Capital Allocation Analysis**\n\nPDD's financial health remains strong, with significant free cash flow ($120.96B TTM). The company has not engaged in major mergers and acquisitions recently, focusing instead on organic growth and R&D investments. This capital allocation strategy supports the company's long-term growth and innovation.\n\n**6. Peer Comparison**\n\nPDD\u2019s current P/E ratio (11.51x) is below peers like Alibaba (16.63x) and JD.com (30x). This suggests undervaluation relative to industry averages, potentially reflecting concerns about the company's ability to sustain its growth rate and navigate regulatory challenges.\n\n---\n\n#### Part Three: Forecasting\n\n**7. Revenue Forecasting**\n\nBased on historical trends and market data, the revenue forecast for PDD over the next five years is as follows:\n- **Online Marketplace Services and Other:**\n  - Year 1: $30.1B\n  - Year 2: $33.1B\n  - Year 3: $36.4B\n  - Year 4: $39.9B\n  - Year 5: $43.9B\n- **Transaction Services:**\n  - Year 1: $29.8B\n  - Year 2: $32.7B\n  - Year 3: $35.9B\n  - Year 4: $39.5B\n  - Year 5: $43.5B\n\nGrowth drivers include continued expansion in lower-tier cities, increasing adoption of social commerce, and the introduction of new services and features.\n\n**8. Cash Flow Forecasting**\n\nFree Cash Flow projections for the next five years:\n- **Year 1: $130B**\n- **Year 2: $140B**\n- **Year 3: $150B**\n- **Year 4: $160B**\n- **Year 5: $170B**\n\nStable free cash flow supports ongoing investments in technology and market expansion, driven by margin expansion and disciplined spending.\n\n**9. Estimate the Cost of Capital**\n\nWACC estimated at 8.5%, reflecting a risk-free rate of 4%, equity risk premium of 6%, and beta of 1.2.\n\n**10. Risk Assessment**\n\nKey risks include regulatory scrutiny, intense competition, and macroeconomic slowdowns. The company must continue to innovate and adapt to changing market conditions to sustain its growth.\n\n---\n\n#### Part Four: Valuation\n\n**11. Initial Valuation**\n\nUsing the Discounted Free Cash Flow (DCF) method, the initial valuation stands at $200B, based on projected FCF and WACC assumptions.\n\n**12. Sensitivity and Scenario Analysis**\n\nWeighted valuation range: $180B-$220B, accounting for growth rate variations (\u00b12%) and discount rate changes (\u00b11%).\n\n**13. Final Valuation**\n\nThe final valuation has been adjusted to $210 billion, taking into account qualitative factors such as the company's strong market position, robust growth in the Transaction Services segment, and the potential for further innovation in social commerce. The latest news regarding PDD's strong financial performance and increasing institutional support further supports this higher valuation.\n\nOn May 20, 2025, PDD announced its Q1 2025 financial results, showing strong growth in both revenue and profitability. The company's focus on expanding its user base and enhancing its platform features has been well-received by investors. Additionally, the increase in institutional investment and the upcoming earnings call suggest that the market is optimistic about PDD's future prospects.\n\nDespite the competitive landscape and regulatory challenges, PDD's innovative business model and strong execution capabilities position it well for long-term success. The company's ability to leverage social commerce and expand into new markets, coupled with its financial strength, makes it a compelling investment opportunity.\n\n---\n\n#### Part Five: Conclusion and Recommendations\n\n**14. Compare with Market Price**\n\n- **Final Valuation:** $210B\n- **Current Market Cap:** $170.07B\n- **Per-Share Valuation:** $90.00\n- **Current Per-Share Price:** $119.80\n\nThe stock is undervalued, with a 21.6% upside.\n\n**15. Recommendations**\n\n**Buy:** Undervaluation presents a compelling opportunity for long-term growth.\n\n---\n\n#### Part Six: Summary\n\nThis report evaluates PDD Holdings Inc. using a structured framework. Key findings include robust segment performance, particularly in the Transaction Services segment, supported by the company's innovative social commerce model. Despite regulatory and competitive challenges, PDD's valuation suggests significant upside. With a final valuation of $210B versus a current market cap of $170.07B, the stock is undervalued. A buy recommendation is warranted given its growth prospects and discounted valuation.",
    displayedText: "",
    currentIndex: 0,
    typingInterval: 10 // ms
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options 就是路径参数对象
    const { title, id } = options;
    console.log('页面参数:', title, id);

    // 可以将参数保存到 data 或用于后续逻辑
    this.setData({
      title,
      id
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {

    wx.showLoading({
      title: 'Loading',
      mask: true
    });

    const res = await serviceApi(`/api/v1/stock/analysis/query?ticker_name=${this.data.id}&date=2025-05-23`).catch(err => {
      console.error('请求失败:', err);
    })

    console.log('res:', res);

    if(res.analysis_txt){
      this.setData({
        fullText:res.analysis_txt
      })
    }else{
      console.log('res:zheli jinlaimlema');
      wx.showToast({
        title: '文本分析加载失败',
        duration: 3000
      });
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/index/index`,
        });
      }, 3000); // 等待toast显示完再跳转
      return;
    }


    wx.hideLoading();


    this.typewriterTimes = 0; // 初始化为实例属性
    // 先清空内容
    this.setData({ displayedText: "", currentIndex: 0 }, () => {
      this.typewriter(); // 启动打字机动画
    });

    // 只在 onShow 启动一次定时器
    if (this.showAllTimer) clearTimeout(this.showAllTimer);
    this.showAllTimer = setTimeout(() => {
      const { fullText } = this.data;
      const html = marked.marked ? marked.marked(fullText) : marked(fullText);
      this.setData({
        displayedText: html,
        currentIndex: fullText.length,
        showBtn:true
      }, () => {
        wx.pageScrollTo({
          scrollTop: 99999,
          duration: 100
        });
      });
      // 阻止 typewriter 继续递归
      this.typewriterTimes = 9999;

    }, 5 * 1000); // 5秒

  },

  typewriter() {
    // 不要在这里设置定时器！
    const { fullText, currentIndex, typingInterval } = this.data;
    if (typeof this.typewriterTimes !== 'number') this.typewriterTimes = 0;
    if (this.typewriterTimes >= 9999) return; // 被强制终止
    if (currentIndex < fullText.length) {
      const md = fullText.slice(0, currentIndex + 1);
      const html = marked.marked ? marked.marked(md) : marked(md);
      this.setData({
        displayedText: html,
        currentIndex: currentIndex + 1
      }, () => {
        wx.pageScrollTo({
          scrollTop: 99999,
          duration: 100
        });
      });
      setTimeout(() => this.typewriter(), typingInterval);
    }
  },

  onButtonClick(){
    console.log("Button clicked",title,id);
    const {title,id} = this.data;
    wx.redirectTo({
      url: `/pages/feature/index?title=${title}&id=${id}`,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})