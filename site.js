const SVG_NS = "http://www.w3.org/2000/svg";
const yearNodes = document.querySelectorAll("[data-year]");
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("main section[id]");
const metricNodes = document.querySelectorAll("[data-metric]");
const pageLang = document.body.dataset.pageLang || "en";
const papersRoot = document.getElementById("papers");
const newsRoot = document.getElementById("news-feed");
const mapRoot = document.getElementById("impact-map-svg");
const mapStage = mapRoot ? mapRoot.closest(".map-stage") : null;
const regionControlsRoot = document.getElementById("map-region-controls");
const mapTooltip = document.getElementById("map-tooltip");
const regionTitleNode = document.getElementById("map-region-title");
const regionSummaryNode = document.getElementById("map-region-summary");
const regionCitiesNode = document.getElementById("map-region-cities");
const nodeTitleNode = document.getElementById("map-node-title");
const nodeSummaryNode = document.getElementById("map-node-summary");
const nodeMetaNode = document.getElementById("map-node-meta");
const toolbarNoteNode = document.getElementById("map-toolbar-note");
const visibleNodesNode = document.getElementById("map-visible-nodes");
const nodeInstitutionsNode = document.getElementById("map-node-institutions");
const institutionNetworkRoot = document.getElementById("institution-network");
const scholarStatusNode = document.getElementById("scholar-sync-status");
const scholarUpdatedNode = document.getElementById("scholar-updated");
const collaborationGraphRoot = document.getElementById("collaboration-graph");
const collaborationMapRoot = document.getElementById("collaboration-map");
const citationNetworkRoot = document.getElementById("citation-network-svg");
const citationNetworkDetailNode = document.getElementById("citation-network-detail");
const collaborationTitleNode = document.getElementById("collaboration-node-title");
const collaborationSummaryNode = document.getElementById("collaboration-node-summary");
const collaborationMetaNode = document.getElementById("collaboration-node-meta");

const scholarProfileUrl = "https://scholar.google.com/citations?user=CcOsCzwAAAAJ&hl=en";
const dataVersion = "20260502a";

const defaultMapData = {
  center: {
    id: "beijing",
    label: "Beijing",
    region: "east-asia",
    roleEn: "Primary research base and strongest visible source node.",
    roleZh: "主要研究基地，也是当前可见传播网络中的核心源点。",
    x: 1148,
    y: 268,
    r: 10,
    labelX: 1168,
    labelY: 224,
  },
  regions: [
    {
      id: "all",
      labelEn: "Global",
      labelZh: "全球",
      summaryEn: "A global overview of scholarly diffusion anchored in Beijing and extending across major research hubs.",
      summaryZh: "以北京为核心、向全球主要研究城市扩散的整体学术传播视图。",
      citiesEn: "Beijing, Madrid, Cambridge, Richland, Brisbane",
      citiesZh: "北京、马德里、剑桥、Richland、布里斯班",
      color: "#b97cff",
    },
    {
      id: "east-asia",
      labelEn: "East Asia",
      labelZh: "东亚",
      summaryEn: "Your academic origin and strongest visibility cluster, centered on Beijing and nearby research cities.",
      summaryZh: "你的学术起点与最强可见度区域，以北京为核心并延伸到周边研究城市。",
      citiesEn: "Beijing, Harbin, Shanghai, Shenzhen, Hong Kong",
      citiesZh: "北京、哈尔滨、上海、深圳、香港",
      color: "#c085ff",
      halo: { cx: 1160, cy: 306, rx: 190, ry: 130 },
    },
    {
      id: "asia-pacific",
      labelEn: "Asia-Pacific",
      labelZh: "亚太",
      summaryEn: "An extended Asia-Pacific network spanning Singapore, South Asia, and Australia.",
      summaryZh: "从新加坡、南亚到澳大利亚延展出的亚太学术网络。",
      citiesEn: "Singapore, Bangalore, Jakarta, Brisbane, Sydney, Melbourne, Perth",
      citiesZh: "新加坡、班加罗尔、雅加达、布里斯班、悉尼、墨尔本、珀斯",
      color: "#79b4ff",
      halo: { cx: 1140, cy: 470, rx: 250, ry: 150 },
    },
    {
      id: "europe",
      labelEn: "Europe",
      labelZh: "欧洲",
      summaryEn: "A visible European scholarly corridor with strong academic city nodes and conference-style visibility.",
      summaryZh: "在欧洲形成了较清晰的学术传播走廊，覆盖多个高可见度研究城市。",
      citiesEn: "Cambridge, Paris, Zurich, Madrid, Riga, Yekaterinburg, Milan",
      citiesZh: "剑桥、巴黎、苏黎世、马德里、里加、叶卡捷琳堡、米兰",
      color: "#e2c084",
      halo: { cx: 712, cy: 238, rx: 270, ry: 110 },
    },
    {
      id: "north-america",
      labelEn: "North America",
      labelZh: "北美",
      summaryEn: "North American reach across national labs, universities, and chemistry research audiences.",
      summaryZh: "北美区域覆盖国家实验室、高校和化学相关研究社群。",
      citiesEn: "Richland, Berkeley, Houston, Toronto, Varennes, Boston",
      citiesZh: "Richland、伯克利、休斯敦、多伦多、Varennes、波士顿",
      color: "#ff9d80",
      halo: { cx: 230, cy: 264, rx: 210, ry: 150 },
    },
    {
      id: "middle-east-africa",
      labelEn: "Middle East & Africa",
      labelZh: "中东与非洲",
      summaryEn: "A smaller but meaningful visibility band through the Gulf and southern Africa.",
      summaryZh: "在海湾地区与南部非洲形成了较小但明确的传播可见度。",
      citiesEn: "Al Ain, Abu Dhabi, Pretoria",
      citiesZh: "阿莱茵、阿布扎比、比勒陀利亚",
      color: "#6fe0c6",
      halo: { cx: 870, cy: 410, rx: 120, ry: 150 },
    },
    {
      id: "latin-america",
      labelEn: "Latin America",
      labelZh: "拉丁美洲",
      summaryEn: "A lighter but globally important extension into Latin America.",
      summaryZh: "在拉丁美洲也形成了较轻但重要的全球传播延展。",
      citiesEn: "Lima, Sao Paulo",
      citiesZh: "利马、圣保罗",
      color: "#ffd36f",
      halo: { cx: 420, cy: 548, rx: 120, ry: 110 },
    },
  ],
  nodes: [
    { id: "harbin", label: "Harbin", region: "east-asia", roleEn: "Northern China research visibility node.", roleZh: "中国北方研究可见度节点。", x: 1212, y: 228, r: 6, labelX: 1194, labelY: 176 },
    { id: "shanghai", label: "Shanghai", region: "east-asia", roleEn: "Eastern China research and collaboration node.", roleZh: "中国东部研究与合作节点。", x: 1186, y: 298, r: 5 },
    { id: "shenzhen", label: "Shenzhen", region: "east-asia", roleEn: "Southern China and Shenzhen Bay Lab linkage.", roleZh: "中国南方与深圳湾实验室相关节点。", x: 1128, y: 334, r: 5 },
    { id: "hong-kong", label: "Hong Kong", region: "east-asia", roleEn: "Regional scholarly visibility corridor.", roleZh: "区域性学术传播节点。", x: 1144, y: 348, r: 5 },
    { id: "seoul", label: "Seoul", region: "east-asia", roleEn: "East Asian research audience node.", roleZh: "东亚研究受众节点。", x: 1232, y: 274, r: 5 },
    { id: "tokyo", label: "Tokyo", region: "east-asia", roleEn: "East Asian materials research node.", roleZh: "东亚材料研究节点。", x: 1270, y: 282, r: 5 },
    { id: "singapore", label: "Singapore", region: "asia-pacific", roleEn: "Southeast Asian battery and materials visibility node.", roleZh: "东南亚电池与材料研究节点。", x: 1048, y: 422, r: 6 },
    { id: "bangalore", label: "Bangalore", region: "asia-pacific", roleEn: "South Asian computational and materials science node.", roleZh: "南亚计算与材料科学节点。", x: 962, y: 354, r: 6, labelX: 900, labelY: 310 },
    { id: "jakarta", label: "Jakarta", region: "asia-pacific", roleEn: "Southeast Asian visibility extension.", roleZh: "东南亚传播延展节点。", x: 1188, y: 430, r: 6, labelX: 1114, labelY: 390 },
    { id: "brisbane", label: "Brisbane", region: "asia-pacific", roleEn: "Oceania conference and scholar visibility node.", roleZh: "大洋洲会议与学者传播节点。", x: 1332, y: 534, r: 7, labelX: 1272, labelY: 492 },
    { id: "sydney", label: "Sydney", region: "asia-pacific", roleEn: "Australian academic visibility node.", roleZh: "澳大利亚学术传播节点。", x: 1314, y: 566, r: 6 },
    { id: "melbourne", label: "Melbourne", region: "asia-pacific", roleEn: "University of Melbourne research linkage.", roleZh: "墨尔本大学相关研究节点。", x: 1284, y: 590, r: 6, labelX: 1200, labelY: 632 },
    { id: "perth", label: "Perth", region: "asia-pacific", roleEn: "Curtin-linked research visibility node.", roleZh: "与 Curtin University 相关的研究节点。", x: 1172, y: 548, r: 6, labelX: 1120, labelY: 596 },
    { id: "madrid", label: "Madrid", region: "europe", roleEn: "A major European visibility node.", roleZh: "欧洲重要传播节点。", x: 716, y: 258, r: 7, labelX: 658, labelY: 216 },
    { id: "riga", label: "Riga", region: "europe", roleEn: "Northern Europe visibility node.", roleZh: "北欧传播节点。", x: 792, y: 208, r: 6, labelX: 756, labelY: 156 },
    { id: "yekaterinburg", label: "Yekaterinburg", region: "europe", roleEn: "Eurasian scientific visibility node.", roleZh: "欧亚科研传播节点。", x: 888, y: 202, r: 6, labelX: 826, labelY: 146 },
    { id: "cambridge", label: "Cambridge", region: "europe", roleEn: "Top-institution scholarly attention node.", roleZh: "顶尖学术机构关注节点。", x: 544, y: 198, r: 6, labelX: 466, labelY: 150 },
    { id: "paris", label: "Paris", region: "europe", roleEn: "Western Europe visibility node.", roleZh: "西欧传播节点。", x: 632, y: 236, r: 5 },
    { id: "zurich", label: "Zurich", region: "europe", roleEn: "Continental Europe research node.", roleZh: "欧洲大陆研究节点。", x: 688, y: 236, r: 5 },
    { id: "milan", label: "Milan", region: "europe", roleEn: "Southern Europe visibility node.", roleZh: "南欧传播节点。", x: 718, y: 280, r: 5 },
    { id: "richland", label: "Richland", region: "north-america", roleEn: "A highly visible North American node.", roleZh: "北美高可见度节点。", x: 160, y: 252, r: 7, labelX: 96, labelY: 206 },
    { id: "berkeley", label: "Berkeley", region: "north-america", roleEn: "US West Coast research node.", roleZh: "美国西海岸研究节点。", x: 122, y: 286, r: 5 },
    { id: "houston", label: "Houston", region: "north-america", roleEn: "US energy research visibility node.", roleZh: "美国能源研究传播节点。", x: 238, y: 308, r: 5 },
    { id: "toronto", label: "Toronto", region: "north-america", roleEn: "Canadian academic visibility node.", roleZh: "加拿大高校传播节点。", x: 248, y: 206, r: 5 },
    { id: "varennes", label: "Varennes", region: "north-america", roleEn: "Canadian research visibility node.", roleZh: "加拿大研究传播节点。", x: 270, y: 224, r: 6, labelX: 232, labelY: 178 },
    { id: "boston", label: "Boston", region: "north-america", roleEn: "Elite university attention corridor.", roleZh: "顶尖大学关注带。", x: 302, y: 220, r: 5 },
    { id: "al-ain", label: "Al Ain", region: "middle-east-africa", roleEn: "UAE conference visibility node.", roleZh: "阿联酋会议传播节点。", x: 882, y: 332, r: 6 },
    { id: "abu-dhabi", label: "Abu Dhabi", region: "middle-east-africa", roleEn: "Gulf research visibility node.", roleZh: "海湾地区研究传播节点。", x: 866, y: 350, r: 5 },
    { id: "pretoria", label: "Pretoria", region: "middle-east-africa", roleEn: "Southern Africa visibility extension.", roleZh: "南部非洲传播延展节点。", x: 820, y: 500, r: 6, labelX: 774, labelY: 450 },
    { id: "lima", label: "Lima", region: "latin-america", roleEn: "Latin American visibility node.", roleZh: "拉丁美洲传播节点。", x: 368, y: 536, r: 6, labelX: 330, labelY: 492 },
    { id: "sao-paulo", label: "Sao Paulo", region: "latin-america", roleEn: "South American research visibility node.", roleZh: "南美研究传播节点。", x: 468, y: 594, r: 5 },
  ],
};

const defaultPapers = [
  {
    title: "Curvature-Gated Li/Na-S Redox Chemistry on C60: Stage-Selective Sulfur Regulation and Divergent Terminal Sulfide Kinetics",
    authors: "Hengyue Xu*",
    journal: "J. Phys. Chem. Lett.",
    year: 2026,
    doi: "https://doi.org/10.1021/acs.jpclett.6c00898",
    url: "https://pubs.acs.org/doi/10.1021/acs.jpclett.6c00898",
    image: "./assets/papers/jpclett-6c00898.jpg",
    badge: "C60",
    fallback: "radial-gradient(circle at 24% 26%, rgba(186, 230, 255, 0.34), transparent 18%), radial-gradient(circle at 72% 58%, rgba(255, 214, 153, 0.28), transparent 22%), linear-gradient(135deg, #102a43, #1d4f6d 56%, #5c7c8a 120%)",
    summaryEn: "A JPC Letters study revealing how curvature-gated C60 surfaces regulate Li/Na-S redox chemistry through stage-selective sulfur conversion and divergent terminal sulfide kinetics.",
    summaryZh: "一篇 JPC Letters 论文，揭示曲率门控的 C60 表面如何通过阶段选择性的硫转化与分化的末端硫化物动力学调控 Li/Na-S 氧化还原化学。",
  },
  {
    title: "Electronegativity-Induced Jahn-Teller Distortion Boosts Li-S Conversion on Asymmetric Cu Single-Atom Catalysts",
    authors: "Hengyue Xu*",
    journal: "J. Phys. Chem. A",
    year: 2025,
    doi: "https://doi.org/10.1021/acs.jpca.5c03527",
    url: "https://pubs.acs.org/doi/10.1021/acs.jpca.5c03527",
    image: "./assets/papers/jpca-5c03527.jpg",
    badge: "Li-S",
    fallback: "radial-gradient(circle at 24% 26%, rgba(141, 208, 255, 0.46), transparent 18%), radial-gradient(circle at 72% 58%, rgba(225, 194, 133, 0.34), transparent 22%), linear-gradient(135deg, #12304f, #1c4c78 56%, #77542d 120%)",
    summaryEn: "A descriptor-driven Li-S catalysis study centered on Jahn-Teller distortion and asymmetric single-atom active sites.",
    summaryZh: "围绕 Jahn-Teller 畸变与不对称单原子活性位点展开的锂硫催化描述符研究。",
  },
  {
    title: "Bio-Inspired Curvature Engineering across the Periodic Table Tunes Hydrogen Adsorption in Single-Atom Catalysts",
    authors: "Hengyue Xu*",
    journal: "J. Phys. Chem. Lett.",
    year: 2026,
    doi: "https://doi.org/10.1021/acs.jpclett.5c03434",
    url: "https://pubs.acs.org/doi/10.1021/acs.jpclett.5c03434",
    image: "./assets/papers/jpclett-5c03434.jpg",
    badge: "SAC",
    fallback: "radial-gradient(circle at 24% 26%, rgba(188, 255, 201, 0.28), transparent 18%), radial-gradient(circle at 72% 58%, rgba(130, 172, 255, 0.32), transparent 22%), linear-gradient(135deg, #123040, #1f665e 56%, #3e8e85 120%)",
    summaryEn: "A compact theoretical study showing how bio-inspired curvature engineering tunes hydrogen adsorption across single-atom catalysts.",
    summaryZh: "一项简洁的理论研究，展示受生物启发的曲率工程如何在单原子催化剂中调控氢吸附。",
  },
  {
    title: "High-dimensional strain unlocks fast polysulfide redox kinetics for lithium-sulfur batteries",
    authors: "J.-L. Yang†; Hengyue Xu†; T. Xiao et al.",
    journal: "Nature Communications",
    year: 2025,
    doi: "https://doi.org/10.1038/s41467-025-63969-z",
    url: "https://www.nature.com/articles/s41467-025-63969-z",
    image: "./assets/papers/ncomms-63969-fig1.png",
    badge: "NC",
    fallback: "radial-gradient(circle at 24% 26%, rgba(255, 174, 132, 0.3), transparent 18%), radial-gradient(circle at 72% 58%, rgba(181, 122, 255, 0.34), transparent 22%), linear-gradient(135deg, #2a2448, #2c4975 56%, #7764c3 120%)",
    summaryEn: "A collaborative high-profile contribution showing how strain engineering accelerates Li-S redox kinetics.",
    summaryZh: "展示高维应变如何提升锂硫体系氧化还原动力学的高影响力合作成果。",
  },
  {
    title: "Balanced d-Band Model: A Framework for Balancing Redox Reactions in Lithium-Sulfur Batteries",
    authors: "Wei Xiao; Kisoo Yoo; Jonghoon Kim; Hengyue Xu*",
    journal: "ACS Nano",
    year: 2024,
    doi: "https://doi.org/10.1021/acsnano.4c10348",
    url: "https://pubs.acs.org/doi/10.1021/acsnano.4c10348",
    image: "./assets/papers/acsnano-4c10348.jpg",
    badge: "Nano",
    fallback: "radial-gradient(circle at 24% 26%, rgba(201, 220, 255, 0.28), transparent 18%), radial-gradient(circle at 72% 58%, rgba(145, 114, 255, 0.28), transparent 22%), linear-gradient(135deg, #18253c, #30486a 56%, #60769c 120%)",
    summaryEn: "An ACS Nano corresponding-author paper proposing a balanced d-band framework for regulating lithium-sulfur battery redox chemistry.",
    summaryZh: "一篇 ACS Nano 通讯论文，提出 balanced d-band framework 用于调控锂硫电池中的氧化还原反应。",
  },
  {
    title: "Operando Studies Redirect Spatiotemporal Restructuration of Model Coordinated Oxides in Electrochemical Oxidation",
    authors: "D. Guan†; Hengyue Xu†; Y. C. Huang† et al.",
    journal: "Advanced Materials",
    year: 2024,
    doi: "https://doi.org/10.1002/adma.202413073",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/adma.202413073",
    image: "./assets/papers/adma-202413073.svg",
    badge: "AM",
    fallback: "radial-gradient(circle at 24% 26%, rgba(179, 233, 255, 0.3), transparent 18%), radial-gradient(circle at 72% 58%, rgba(255, 140, 188, 0.24), transparent 22%), linear-gradient(135deg, #16273f, #2a5973 56%, #5e809e 120%)",
    summaryEn: "A high-impact operando study on spatiotemporal restructuring in electrochemical oxidation systems.",
    summaryZh: "围绕电化学氧化过程中时空动态重构展开的高影响力 operando 研究。",
  },
];

const landShapes = [
  { cx: 150, cy: 180, rx: 90, ry: 58 },
  { cx: 260, cy: 145, rx: 75, ry: 56 },
  { cx: 334, cy: 195, rx: 54, ry: 118 },
  { cx: 454, cy: 120, rx: 86, ry: 58 },
  { cx: 532, cy: 134, rx: 122, ry: 60 },
  { cx: 546, cy: 254, rx: 94, ry: 128 },
  { cx: 734, cy: 154, rx: 160, ry: 80 },
  { cx: 864, cy: 164, rx: 120, ry: 74 },
  { cx: 956, cy: 196, rx: 104, ry: 88 },
  { cx: 1078, cy: 180, rx: 118, ry: 74 },
  { cx: 1200, cy: 200, rx: 140, ry: 78 },
  { cx: 1288, cy: 192, rx: 92, ry: 60 },
  { cx: 1030, cy: 320, rx: 92, ry: 124 },
  { cx: 1262, cy: 474, rx: 78, ry: 48 },
  { cx: 360, cy: 470, rx: 104, ry: 154 },
];

const cutouts = [
  { cx: 485, cy: 188, rx: 36, ry: 22 },
  { cx: 605, cy: 150, rx: 34, ry: 22 },
  { cx: 794, cy: 174, rx: 30, ry: 18 },
  { cx: 901, cy: 220, rx: 30, ry: 24 },
  { cx: 1130, cy: 215, rx: 30, ry: 16 },
  { cx: 1200, cy: 244, rx: 36, ry: 20 },
  { cx: 344, cy: 338, rx: 26, ry: 22 },
];

const staticMetrics = {
  citations: 3175,
  hIndex: 30,
  citingScholars: 1319,
  institutions: 1180,
  countries: 42,
  lastUpdated: "2026-04-28",
};

const scholarMessages = {
  loading: pageLang === "zh" ? "正在同步 Scholar" : "Syncing Scholar",
  live: pageLang === "zh" ? "已在线同步 Scholar" : "Scholar synced online",
  local: pageLang === "zh" ? "使用本地 Scholar 记录" : "Using local Scholar record",
  blocked: pageLang === "zh" ? "Scholar 在线同步受限，已使用本地记录" : "Scholar sync limited; local record shown",
  failed: pageLang === "zh" ? "数据暂不可用" : "Metrics temporarily unavailable",
  updatedPrefix: pageLang === "zh" ? "最近检查" : "Last checked",
};

const mapState = {
  data: defaultMapData,
  activeRegion: "all",
  hoverNodeId: null,
  nodeEls: new Map(),
  pathEls: new Map(),
  labelEls: new Map(),
  haloEls: new Map(),
};

const collaborationState = {
  data: null,
  activeNodeId: null,
  nodeEls: new Map(),
  edgeEls: [],
};

let worldLandData = null;

yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const formatMetric = (key, value) => {
  if (value === undefined || value === null) {
    return "";
  }

  if (key === "lastUpdated") {
    return String(value);
  }

  return new Intl.NumberFormat("en-US").format(value);
};

const updateMetricNodes = (data) => {
  metricNodes.forEach((node) => {
    const key = node.dataset.metric;
    if (key in data) {
      node.textContent = formatMetric(key, data[key]);
    }
  });
};

const scholarMetricSubset = (data) => ({
  citations: data.citations,
  hIndex: data.hIndex,
  citingScholars: data.citingScholars,
  institutions: data.institutions,
  lastUpdated: data.lastUpdated,
});

const setScholarStatus = (messageKey, data = {}) => {
  const message = scholarMessages[messageKey] || scholarMessages.local;
  if (scholarStatusNode) {
    scholarStatusNode.textContent = message;
  }
  if (scholarUpdatedNode) {
    const checkedAt = data.checkedAt || data.lastUpdated || new Date().toISOString().slice(0, 10);
    scholarUpdatedNode.textContent = `${scholarMessages.updatedPrefix}: ${checkedAt}`;
  }
};

updateMetricNodes(staticMetrics);
setScholarStatus("loading", staticMetrics);

const parseScholarMetricsFromHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const citationCells = Array.from(doc.querySelectorAll("#gsc_rsb_st td.gsc_rsb_std"));
  const values = citationCells
    .map((cell) => Number(cell.textContent.replace(/[^\d]/g, "")))
    .filter((value) => Number.isFinite(value));

  if (values.length < 3) {
    throw new Error("Scholar metrics were not visible in the fetched profile.");
  }

  return {
    citations: values[0],
    hIndex: values[2],
    lastUpdated: new Date().toISOString().slice(0, 10),
    checkedAt: new Date().toLocaleString(pageLang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const fetchLocalScholarMetrics = () =>
  fetch(`./data/scholar.json?v=${dataVersion}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load scholar metrics.");
      }
      return response.json();
    });

const fetchLiveScholarMetrics = () =>
  fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(scholarProfileUrl)}`, {
    cache: "no-store",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch live Scholar profile.");
      }
      return response.text();
    })
    .then(parseScholarMetricsFromHtml);

fetchLocalScholarMetrics()
  .then((response) => {
    updateMetricNodes(scholarMetricSubset(response));
    setScholarStatus("local", response);
    return fetchLiveScholarMetrics()
      .then((liveMetrics) => {
        const merged = { ...response, ...liveMetrics };
        updateMetricNodes(scholarMetricSubset(merged));
        setScholarStatus("live", merged);
      })
      .catch(() => {
        setScholarStatus("blocked", response);
      });
  })
  .catch(() => {
    setScholarStatus("failed", staticMetrics);
  });

const insideEllipse = (x, y, ellipse) => {
  const nx = (x - ellipse.cx) / ellipse.rx;
  const ny = (y - ellipse.cy) / ellipse.ry;
  return nx * nx + ny * ny <= 1;
};

const isLandPoint = (x, y) => {
  const inShape = landShapes.some((shape) => insideEllipse(x, y, shape));
  const inCutout = cutouts.some((shape) => insideEllipse(x, y, shape));
  return inShape && !inCutout;
};

const createSvgNode = (tag, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
};

const appendWorldLand = (root) => {
  if (!root || !worldLandData?.paths?.length) {
    return false;
  }

  const landLayer = createSvgNode("g", { class: "world-land-layer" });
  worldLandData.paths.forEach((d) => {
    landLayer.appendChild(createSvgNode("path", { d, class: "world-land" }));
  });
  root.appendChild(landLayer);
  return true;
};

const regionLabel = (region) => (pageLang === "zh" ? region.labelZh : region.labelEn);
const regionSummary = (region) => (pageLang === "zh" ? region.summaryZh : region.summaryEn);
const regionCities = (region) => (pageLang === "zh" ? region.citiesZh : region.citiesEn);
const citationTopRegions = (mapData, region) => {
  if (!mapData?.network?.nodes?.length || region?.id !== "all") {
    return regionCities(region);
  }

  const aggregate = new Map();
  mapData.network.nodes.forEach((node) => {
    const key = node.region === "europe" ? "eu" : node.id;
    const count = Number(node.citations || 0);
    const label = node.region === "europe"
      ? pageLang === "zh"
        ? "欧盟"
        : "European Union"
      : pageLang === "zh"
        ? node.labelZh || node.labelEn || node.label
        : node.labelEn || node.labelZh || node.label;
    const current = aggregate.get(key) || { label, citations: 0 };
    current.citations += count;
    current.label = label;
    aggregate.set(key, current);
  });

  const separator = pageLang === "zh" ? "、" : ", ";
  return [...aggregate.values()]
    .sort((left, right) => right.citations - left.citations)
    .slice(0, 6)
    .map((item) => item.label)
    .join(separator);
};
const nodeRole = (node) => (pageLang === "zh" ? node.roleZh : node.roleEn);
const nodeLabel = (node) => (pageLang === "zh" ? node.labelZh || node.label : node.labelEn || node.label);
const nodeInstitutions = (node) => node.institutions || [];
const institutionName = (item) => (pageLang === "zh" ? item.nameZh || item.nameEn : item.nameEn || item.nameZh);
const institutionType = (item) => (pageLang === "zh" ? item.typeZh || item.typeEn : item.typeEn || item.typeZh);
const institutionCountry = (item) => (pageLang === "zh" ? item.countryZh || item.country : item.country || item.countryZh);
const citationInstitutionName = (item) => (pageLang === "zh" ? item.nameZh || item.nameEn || item.name : item.nameEn || item.nameZh || item.name);
const paperLabel = (paper) => {
  if (!paper) {
    return "";
  }
  if (typeof paper === "string") {
    return paper;
  }
  const title = paper.title || paper.doi || paper.id || "";
  return paper.year ? `${title} (${paper.year})` : title;
};

const formatList = (items, limit = 4) => {
  const visible = items.slice(0, limit);
  const joined = visible.join(pageLang === "zh" ? "、" : ", ");
  const rest = items.length - visible.length;
  if (rest <= 0) {
    return joined;
  }
  return pageLang === "zh" ? `${joined} 等 ${items.length} 项` : `${joined}, and ${rest} more`;
};

const setTooltipPosition = (event) => {
  if (!mapTooltip || !mapStage) {
    return;
  }

  const rect = mapStage.getBoundingClientRect();
  const x = Math.min(event.clientX - rect.left, rect.width - 220);
  const y = Math.min(event.clientY - rect.top, rect.height - 96);
  mapTooltip.style.left = `${Math.max(12, x)}px`;
  mapTooltip.style.top = `${Math.max(12, y)}px`;
};

const showTooltip = (node, event) => {
  if (!mapTooltip) {
    return;
  }

  const region = mapState.data.regions.find((item) => item.id === node.region) || mapState.data.regions[0];
  mapTooltip.innerHTML = `
    <strong>${nodeLabel(node)}</strong>
    <span>${regionLabel(region)}</span>
    <span>${node.citations ? `${new Intl.NumberFormat("en-US").format(node.citations)} ${pageLang === "zh" ? "条引用地区关联" : "citation geography links"}` : nodeRole(node)}</span>
  `;
  mapTooltip.hidden = false;
  setTooltipPosition(event);
};

const hideTooltip = () => {
  if (mapTooltip) {
    mapTooltip.hidden = true;
  }
};

const visibleNodeCount = () => {
  const allNodes = [mapState.data.center, ...mapState.data.nodes];
  if (mapState.activeRegion === "all") {
    return allNodes.length;
  }
  return allNodes.filter((node) => node.id === mapState.data.center.id || node.region === mapState.activeRegion).length;
};

const updateMapInfo = () => {
  const region = mapState.data.regions.find((item) => item.id === mapState.activeRegion) || mapState.data.regions[0];
  const hoverNode =
    mapState.hoverNodeId === mapState.data.center.id
      ? mapState.data.center
      : mapState.data.nodes.find((node) => node.id === mapState.hoverNodeId) || mapState.data.center;
  const hoverRegion =
    mapState.data.regions.find((item) => item.id === hoverNode.region) || region;

  if (regionTitleNode) {
    regionTitleNode.textContent = pageLang === "zh" ? `${regionLabel(region)}视图` : `${regionLabel(region)} View`;
  }
  if (regionSummaryNode) {
    regionSummaryNode.textContent = regionSummary(region);
  }
  if (regionCitiesNode) {
    regionCitiesNode.textContent =
      pageLang === "zh"
        ? `高频引用地区：${citationTopRegions(mapState.data, region)}`
        : `Top citing regions: ${citationTopRegions(mapState.data, region)}`;
  }
  if (nodeTitleNode) {
    nodeTitleNode.textContent = nodeLabel(hoverNode);
  }
  if (nodeSummaryNode) {
    nodeSummaryNode.textContent = nodeRole(hoverNode);
  }
  if (nodeMetaNode) {
    nodeMetaNode.textContent =
      pageLang === "zh"
        ? `${regionLabel(hoverRegion)} · 引用分布节点`
        : `${regionLabel(hoverRegion)} · Citation geography node`;
  }
  if (nodeInstitutionsNode) {
    nodeInstitutionsNode.innerHTML = "";
  }
  if (toolbarNoteNode) {
    toolbarNoteNode.textContent =
      pageLang === "zh"
        ? `${regionLabel(region)} · ${visibleNodeCount()} 个可见节点`
        : `${regionLabel(region)} · ${visibleNodeCount()} visible nodes`;
  }
  if (visibleNodesNode) {
    visibleNodesNode.textContent = String(visibleNodeCount());
  }
};

const focusMapNode = (nodeId) => {
  const node =
    nodeId === mapState.data.center.id
      ? mapState.data.center
      : mapState.data.nodes.find((item) => item.id === nodeId);
  if (!node) {
    return;
  }
  mapState.activeRegion = node.region || "all";
  mapState.hoverNodeId = node.id;
  updateMapStyles();
  document.querySelectorAll(".institution-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.nodeId === nodeId);
  });
};

const regionColorById = (regionId) => {
  const region = mapState.data.regions.find((item) => item.id === regionId);
  return region ? region.color : "#97b4ff";
};

const initialsFor = (name) =>
  String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const shortInstitutionLabel = (name) =>
  String(name || "")
    .replace(/^The University of /, "U. ")
    .replace(/University/g, "U.")
    .replace(/Institute/g, "Inst.")
    .replace(/National /g, "Natl. ")
    .slice(0, 36);

const edgePath = (source, target) => {
  const mx = (source.x + target.x) / 2;
  const my = (source.y + target.y) / 2 - Math.min(90, Math.abs(source.x - target.x) * 0.08 + 20);
  return `M ${source.x} ${source.y} Q ${mx} ${my} ${target.x} ${target.y}`;
};

const collaborationActiveNodePriority = [
  "Tsinghua University",
  "Peking University",
  "Lawrence Berkeley National Laboratory",
  "University of Oxford",
  "University of Pennsylvania",
  "Massachusetts Institute of Technology",
  "Brown University",
  "Oak Ridge National Laboratory",
  "The University of Melbourne",
  "Chinese Academy of Sciences",
  "Monash University",
  "University of California, Berkeley",
  "Western Sydney University",
  "University of Tennessee at Knoxville",
  "Molecular Foundry",
  "KU Leuven",
  "Max Planck Institute for Chemical Physics of Solids",
  "Nanyang Technological University",
  "RMIT University",
  "University of Science and Technology of China",
  "Queensland University of Technology",
  "Science Oxford",
  "Humboldt-Universität zu Berlin",
  "University of Washington",
  "Canadian Light Source (Canada)",
  "Pennsylvania State University",
  "Technische Universität Darmstadt",
  "University of Technology Sydney",
  "University of Hong Kong",
  "Hong Kong Polytechnic University",
  "Curtin University",
  "The University of Queensland",
  "Centre National de la Recherche Scientifique",
  "Shanghai Jiao Tong University",
  "University of Chinese Academy of Sciences",
  "Shenzhen Bay Laboratory",
  "Nanjing University",
  "Department of Mines and Petroleum",
  "Hong Kong University of Science and Technology",
  "Shenzhen University",
  "Fudan University",
  "Wuhan University",
  "City University of Hong Kong",
  "Tamkang University",
  "Shanghai Institute of Applied Physics",
  "Hong Kong Baptist University",
  "Zhejiang University",
  "École Nationale Supérieure d'Ingénieurs de Caen",
  "Laboratoire Catalyse et Spectrochimie",
  "Normandie Université",
  "Université de Caen Normandie",
  "University of Nottingham Ningbo China",
  "Aalborg University",
  "Institute of Oceanology",
  "State Key Laboratory of Rare Earth Materials Chemistry and Application",
  "Jilin University",
  "China University of Mining and Technology",
  "University of Saskatchewan",
  "Shanghai Advanced Research Institute",
  "Adaptive Biotechnologies (United States)",
  "National Institute of Fashion Technology",
  "National Engineering Research Center for Nanotechnology",
  "Georgi Nadjakov Institute of Solid State Physics",
  "Institute of Process Engineering",
  "Rolls-Royce (United Kingdom)",
  "University of Seoul",
  "Yonsei University",
  "Chongqing University",
  "Korea University",
  "Hokkaido University",
  "Southern University of Science and Technology",
  "Fraunhofer Research Institution for Materials Recycling and Resource Strategies IWKShe Czech Republic",
  "Institute of Construction and Architecture of the Slovak Academy of Sciences",
];

const normalizeCollaborationName = (value) =>
  (value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const buildCollaborationInstitutionCards = (nodes) => {
  const orderByName = new Map(
    collaborationActiveNodePriority.map((name, index) => [normalizeCollaborationName(name), index])
  );
  const prioritized = [];
  const other = [];

  nodes.forEach((node) => {
    const key = normalizeCollaborationName(institutionName(node));
    if (orderByName.has(key)) {
      prioritized.push({ node, order: orderByName.get(key) });
    } else {
      other.push(node);
    }
  });

  prioritized.sort((a, b) => a.order - b.order);

  const displayNodes = prioritized.map(({ node }) => node);
  if (other.length) {
    displayNodes.push({
      id: "__collaboration_other__",
      nameEn: "Other",
      nameZh: "其他",
      isOtherBucket: true,
      hiddenNodes: other,
      paperCount: other.reduce((sum, node) => sum + (node.paperCount || 0), 0),
      authors: [...new Set(other.flatMap((node) => node.authors || []))].slice(0, 4),
      city: "",
      country: "",
      countryZh: "",
      region: "",
    });
  }

  return displayNodes;
};

const setCollaborationActiveNode = (nodeId) => {
  if (!collaborationState.data) {
    return;
  }

  const node = collaborationState.data.institutions.find((item) => item.id === nodeId) || collaborationState.data.institutions[0];
  if (!node) {
    return;
  }

  collaborationState.activeNodeId = node.id;
  const connected = new Set([node.id]);
  collaborationState.data.edges.forEach((edge) => {
    if (edge.source === node.id) connected.add(edge.target);
    if (edge.target === node.id) connected.add(edge.source);
  });

  collaborationState.nodeEls.forEach(({ group, circle }, id) => {
    group.classList.toggle("is-muted", !connected.has(id));
    circle.classList.toggle("is-active", id === node.id);
  });
  collaborationState.edgeEls.forEach(({ path, edge }) => {
    const active = edge.source === node.id || edge.target === node.id;
    path.classList.toggle("is-active", active);
    path.classList.toggle("is-faded", !active);
  });
  document.querySelectorAll(".institution-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.nodeId === node.id);
  });

  if (collaborationTitleNode) {
    collaborationTitleNode.textContent = institutionName(node);
  }
  if (collaborationSummaryNode) {
    const authors = node.authors.slice(0, 5).join(pageLang === "zh" ? "、" : ", ");
    collaborationSummaryNode.textContent =
      pageLang === "zh"
        ? `${institutionCountry(node)}${node.city ? ` · ${node.city}` : ""}。相关作者：${authors || "暂无作者元数据"}。`
        : `${institutionCountry(node)}${node.city ? ` · ${node.city}` : ""}. Associated authors: ${authors || "No author metadata available"}.`;
  }
  if (collaborationMetaNode) {
    const paperTitles = (node.papers || []).slice(0, 2).map(paperLabel).filter(Boolean);
    collaborationMetaNode.textContent =
      pageLang === "zh"
        ? `${node.paperCount} 篇相关论文${paperTitles.length ? ` · ${paperTitles.join("；")}` : ""}`
        : `${node.paperCount} linked papers${paperTitles.length ? ` · ${paperTitles.join("; ")}` : ""}`;
  }
};

const renderInstitutionNetwork = (networkData) => {
  if (!institutionNetworkRoot) {
    return;
  }

  const nodes = buildCollaborationInstitutionCards(networkData.institutions || []);

  institutionNetworkRoot.innerHTML = "";
  nodes.forEach((node) => {
    const card = document.createElement("article");
    card.className = "institution-card";
    card.dataset.nodeId = node.id;
    card.style.setProperty("--card-color", node.isOtherBucket ? "#8a8f98" : regionColorById(node.region));
    card.tabIndex = 0;

    const logo = document.createElement("span");
    logo.className = "institution-logo";
    if (node.isOtherBucket) {
      logo.textContent = pageLang === "zh" ? "其" : "OT";
    } else if (node.logoUrl) {
      const image = document.createElement("img");
      image.src = node.logoUrl;
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        logo.textContent = initialsFor(institutionName(node));
      });
      logo.appendChild(image);
    } else {
      logo.textContent = initialsFor(institutionName(node));
    }

    const type = document.createElement("p");
    type.className = "institution-type";
    type.textContent = node.isOtherBucket
      ? pageLang === "zh"
        ? `其他 · ${node.hiddenNodes.length} 个机构`
        : `Other · ${node.hiddenNodes.length} institutions`
      : pageLang === "zh"
        ? `${regionLabel(mapState.data.regions.find((item) => item.id === node.region) || mapState.data.regions[0])} · ${institutionCountry(node)}`
        : `${regionLabel(mapState.data.regions.find((item) => item.id === node.region) || mapState.data.regions[0])} · ${institutionCountry(node)}`;

    const title = document.createElement("h3");
    title.textContent = institutionName(node);

    const list = document.createElement("ul");
    const listItems = node.isOtherBucket
      ? node.hiddenNodes.slice(0, 4).map((item) => institutionName(item))
      : (node.authors || []).slice(0, 4);
    listItems.forEach((author) => {
      const item = document.createElement("li");
      item.textContent = author;
      list.appendChild(item);
    });

    const meta = document.createElement("p");
    meta.className = "institution-meta";
    meta.textContent = node.isOtherBucket
      ? pageLang === "zh"
        ? `${node.paperCount} 篇论文 · 已合并为其他项`
        : `${node.paperCount} papers · merged into Other`
      : pageLang === "zh"
        ? `${node.paperCount} 篇论文 · 点击聚焦网络`
        : `${node.paperCount} papers · click to focus network`;

    card.append(logo, type, title, list, meta);
    if (!node.isOtherBucket) {
      card.addEventListener("click", () => setCollaborationActiveNode(node.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setCollaborationActiveNode(node.id);
        }
      });
    }
    institutionNetworkRoot.appendChild(card);
  });
};

const updateCitationNetworkDetail = (payload) => {
  if (!citationNetworkDetailNode) {
    return;
  }

  const kicker = citationNetworkDetailNode.querySelector(".stat-label");
  const title = citationNetworkDetailNode.querySelector("h3");
  const body = citationNetworkDetailNode.querySelector("p");
  if (!title || !body) {
    return;
  }

  if (kicker) {
    kicker.textContent = payload.kicker;
  }
  title.textContent = payload.title;
  body.textContent = payload.body;
};

const renderCollaborationNetwork = (networkData) => {
  if (!collaborationGraphRoot || !networkData) {
    return;
  }

  collaborationState.data = networkData;
  collaborationState.nodeEls.clear();
  collaborationState.edgeEls = [];
  collaborationGraphRoot.innerHTML = "";

  const edgeLayer = createSvgNode("g");
  const nodeLayer = createSvgNode("g");
  const labelLayer = createSvgNode("g");
  const institutions = networkData.graphInstitutions || networkData.institutions || [];
  const institutionById = new Map(institutions.map((item) => [item.id, item]));
  const primaryInstitution = institutions[0];
  const orbitNodes = institutions.filter((item) => item.id !== primaryInstitution?.id);
  
  // Multi-ring radial layout: sort by paperCount and arrange in concentric circles
  const sortedOrbitNodes = orbitNodes.slice().sort((a, b) => (b.paperCount || 0) - (a.paperCount || 0));
  const layoutById = new Map();
  const centerX = 720;
  const centerY = 360;
  
  if (primaryInstitution) {
    layoutById.set(primaryInstitution.id, { ...primaryInstitution, x: centerX, y: centerY, angle: 0 });
  }
  
  // Distribute nodes across concentric circles based on paper count
  let nodeIndex = 0;
  const ringsConfig = [
    { maxCount: 8, radius: 220, startAngle: -Math.PI * 0.5 },   // Inner ring
    { maxCount: 12, radius: 380, startAngle: -Math.PI * 0.5 },  // Middle ring
    { maxCount: 20, radius: 520, startAngle: -Math.PI * 0.5 },  // Outer ring
  ];
  
  let ringIndex = 0;
  let ringNodeCount = 0;
  
  sortedOrbitNodes.forEach((node, idx) => {
    // Move to next ring if current ring is full
    while (ringNodeCount >= ringsConfig[ringIndex].maxCount && ringIndex < ringsConfig.length - 1) {
      ringIndex++;
      ringNodeCount = 0;
    }
    
    const config = ringsConfig[ringIndex];
    const angle = config.startAngle + (ringNodeCount / Math.max(1, config.maxCount)) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * config.radius;
    const y = centerY + Math.sin(angle) * config.radius;
    
    layoutById.set(node.id, {
      ...node,
      x: Math.round(x),
      y: Math.round(y),
      angle: angle,
    });
    
    ringNodeCount++;
  });

  const center = createSvgNode("circle", {
    cx: 720,
    cy: 350,
    r: 28,
    class: "collab-center",
  });
  nodeLayer.appendChild(center);

  (networkData.graphEdges || networkData.edges || []).forEach((edge) => {
    const source = layoutById.get(edge.source);
    const target = layoutById.get(edge.target);
    if (!source || !target) {
      return;
    }
    const path = createSvgNode("path", {
      d: edgePath(source, target),
      class: "collab-edge",
      "data-source": edge.source,
      "data-target": edge.target,
      "stroke-width": Math.min(4, 1 + edge.weight * 0.7),
    });
    edgeLayer.appendChild(path);
    collaborationState.edgeEls.push({ path, edge });
  });

  institutions.forEach((node) => {
    const plottedNode = layoutById.get(node.id) || node;
    const group = createSvgNode("g", {
      class: "collab-node-shell",
      transform: `translate(${plottedNode.x} ${plottedNode.y})`,
      tabindex: "0",
    });
    const radius = Math.min(28, 14 + node.paperCount * 5);
    const circle = createSvgNode("circle", {
      cx: 0,
      cy: 0,
      r: radius,
      class: "collab-node",
    });
    const logoBg = createSvgNode("circle", {
      cx: 0,
      cy: 0,
      r: Math.max(11, radius - 7),
      class: "collab-node-logo-bg",
    });
    const text = createSvgNode("text", {
      x: 0,
      y: 1,
      class: "collab-node-initials",
    });
    text.textContent = initialsFor(institutionName(node));
    group.append(circle, logoBg, text);
    if (node.logoUrl) {
      const image = createSvgNode("image", {
        href: node.logoUrl,
        x: -Math.max(10, radius - 9),
        y: -Math.max(10, radius - 9),
        width: Math.max(20, (radius - 9) * 2),
        height: Math.max(20, (radius - 9) * 2),
      });
      group.appendChild(image);
    }
    group.addEventListener("mouseenter", () => setCollaborationActiveNode(node.id));
    group.addEventListener("click", () => setCollaborationActiveNode(node.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setCollaborationActiveNode(node.id);
      }
    });
    nodeLayer.appendChild(group);
    collaborationState.nodeEls.set(node.id, { group, circle, node });

    if (node.paperCount > 1 || institutions.length < 16) {
      // Position labels radially based on node angle
      const radius = Math.min(28, 14 + node.paperCount * 5);
      const ang = plottedNode.angle || 0;
      const labelDist = radius + 24;
      const lx = plottedNode.x + Math.cos(ang) * labelDist;
      const ly = plottedNode.y + Math.sin(ang) * labelDist;
      
      const label = createSvgNode("text", {
        x: Math.round(lx),
        y: Math.round(ly),
        class: "collab-node-label",
      });
      label.textContent = shortInstitutionLabel(institutionName(node));
      
      // Dynamic text anchor based on angle
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      
      if (Math.abs(cosA) < 0.2) {
        label.setAttribute("text-anchor", "middle");
      } else if (cosA > 0) {
        label.setAttribute("text-anchor", "start");
      } else {
        label.setAttribute("text-anchor", "end");
      }
      
      label.setAttribute("dominant-baseline", Math.abs(sinA) < 0.3 ? "middle" : "auto");
      label.setAttribute("pointer-events", "none");
      labelLayer.appendChild(label);
    }
  });

  collaborationGraphRoot.append(edgeLayer, nodeLayer, labelLayer);
  renderInstitutionNetwork(networkData);
  setCollaborationActiveNode(institutions[0]?.id);
};

const renderCollaborationMap = (networkData) => {
  if (!collaborationMapRoot || !networkData?.institutions?.length) {
    return;
  }

  collaborationMapRoot.innerHTML = "";
  const routeLayer = createSvgNode("g");
  const nodeLayer = createSvgNode("g");
  appendWorldLand(collaborationMapRoot);

  const institutions = networkData.institutions || [];
  const primary = institutions[0] || networkData.center;
  institutions.slice(1, 90).forEach((node, index) => {
    const controlX = primary.x * 0.55 + node.x * 0.45;
    const controlY = Math.min(primary.y, node.y) - Math.max(50, Math.abs(primary.x - node.x) * 0.12);
    routeLayer.appendChild(
      createSvgNode("path", {
        d: `M ${primary.x} ${primary.y} Q ${controlX} ${controlY} ${node.x} ${node.y}`,
        class: `map-connection ${index % 2 ? "alt" : "slow"}`,
      })
    );
  });

  institutions.forEach((node) => {
    const group = createSvgNode("g", { transform: `translate(${node.x} ${node.y})` });
    group.appendChild(
      createSvgNode("circle", {
        cx: 0,
        cy: 0,
        r: Math.min(13, 5 + node.paperCount * 2.2),
        class: `map-node ${node.id === primary.id ? "center" : ""}`.trim(),
      })
    );
    nodeLayer.appendChild(group);
  });

  collaborationMapRoot.append(routeLayer, nodeLayer);
};

const updateMapStyles = () => {
  const allowRegion = (regionId, nodeId) =>
    mapState.activeRegion === "all" || nodeId === mapState.data.center.id || regionId === mapState.activeRegion;

  mapState.haloEls.forEach((halo, regionId) => {
    halo.classList.toggle("is-faded", mapState.activeRegion !== "all" && regionId !== mapState.activeRegion);
  });

  mapState.pathEls.forEach(({ path, node }) => {
    const active = allowRegion(node.region, node.id);
    path.classList.toggle("is-faded", !active);
    path.classList.toggle("is-active", node.id === mapState.hoverNodeId);
  });

  mapState.nodeEls.forEach(({ element, node }) => {
    const active = allowRegion(node.region, node.id);
    element.classList.toggle("is-faded", !active);
    element.classList.toggle("is-active", node.id === mapState.hoverNodeId || (!mapState.hoverNodeId && node.id === mapState.data.center.id));
  });

  mapState.labelEls.forEach(({ element, node }) => {
    const active = allowRegion(node.region, node.id);
    element.classList.toggle("is-faded", !active);
  });

  const buttons = regionControlsRoot ? regionControlsRoot.querySelectorAll(".map-region-button") : [];
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.region === mapState.activeRegion);
  });

  updateMapInfo();
};

const attachNodeHover = (target, node) => {
  target.addEventListener("mouseenter", (event) => {
    mapState.hoverNodeId = node.id;
    showTooltip(node, event);
    updateMapStyles();
  });
  target.addEventListener("mousemove", (event) => {
    showTooltip(node, event);
  });
  target.addEventListener("mouseleave", () => {
    mapState.hoverNodeId = null;
    hideTooltip();
    updateMapStyles();
  });
};

const renderRegionControls = () => {
  if (!regionControlsRoot) {
    return;
  }

  regionControlsRoot.innerHTML = "";
  mapState.data.regions.forEach((region) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-region-button";
    button.dataset.region = region.id;
    button.textContent = regionLabel(region);
    button.addEventListener("click", () => {
      mapState.activeRegion = region.id;
      mapState.hoverNodeId = null;
      hideTooltip();
      updateMapStyles();
    });
    regionControlsRoot.appendChild(button);
  });
};

const renderImpactMap = (mapData) => {
  if (!mapRoot) {
    return;
  }

  mapState.data = mapData;
  mapState.nodeEls.clear();
  mapState.pathEls.clear();
  mapState.labelEls.clear();
  mapState.haloEls.clear();
  mapState.hoverNodeId = mapData.nodes.find((node) => node.id === "us")?.id || mapData.nodes[0]?.id || mapData.center.id;
  mapRoot.innerHTML = "";
  updateMetricNodes({
    citations: mapData.author?.citedByCount || staticMetrics.citations,
    countries: mapData.nodes?.length || staticMetrics.countries,
  });

  const dotLayer = createSvgNode("g");
  const haloLayer = createSvgNode("g");
  const routeLayer = createSvgNode("g");
  const nodeLayer = createSvgNode("g");
  const labelLayer = createSvgNode("g");

  if (!appendWorldLand(mapRoot)) {
    for (let y = 68; y <= 632; y += 12) {
      for (let x = 28; x <= 1408; x += 12) {
        if (!isLandPoint(x, y)) {
          continue;
        }

        dotLayer.appendChild(
          createSvgNode("circle", {
            cx: x,
            cy: y,
            r: 2.2,
            class: "map-dot",
          })
        );
      }
    }
    mapRoot.appendChild(dotLayer);
  }

  mapData.regions
    .filter((region) => region.halo)
    .forEach((region) => {
      const halo = createSvgNode("ellipse", {
        cx: region.halo.cx,
        cy: region.halo.cy,
        rx: region.halo.rx,
        ry: region.halo.ry,
        fill: region.color,
        class: "map-region-halo",
      });
      haloLayer.appendChild(halo);
      mapState.haloEls.set(region.id, halo);
    });

  mapData.nodes.forEach((node, index) => {
    const controlX = mapData.center.x * 0.55 + node.x * 0.45;
    const lift = Math.max(70, Math.abs(mapData.center.x - node.x) * 0.18);
    const controlY = Math.min(mapData.center.y, node.y) - lift;
    const path = createSvgNode("path", {
      d: `M ${mapData.center.x} ${mapData.center.y} Q ${controlX} ${controlY} ${node.x} ${node.y}`,
      class: `map-connection ${index % 2 === 0 ? "alt" : ""} ${index % 3 === 0 ? "slow" : ""}`.trim(),
    });
    routeLayer.appendChild(path);
    mapState.pathEls.set(node.id, { path, node });
  });

  const allNodes = [mapData.center, ...mapData.nodes];
  allNodes.forEach((node) => {
    const circle = createSvgNode("circle", {
      cx: node.x,
      cy: node.y,
      r: node.r || 6,
      class: `map-node ${node.id === mapData.center.id ? "center" : ""}`.trim(),
    });
    attachNodeHover(circle, node);
    nodeLayer.appendChild(circle);
    mapState.nodeEls.set(node.id, { element: circle, node });
  });

  allNodes
    .filter((node) => node.labelX && node.labelY)
    .forEach((node) => {
      const group = createSvgNode("g", {
        class: "map-label-group",
        transform: `translate(${node.labelX} ${node.labelY})`,
      });
      const width = Math.max(92, node.label.length * 11 + 28);
      const rect = createSvgNode("rect", {
        x: 0,
        y: 0,
        width,
        height: 40,
      });
      const text = createSvgNode("text", {
        x: 16,
        y: 26,
      });
      text.textContent = node.label;
      group.append(rect, text);
      attachNodeHover(group, node);
      labelLayer.appendChild(group);
      mapState.labelEls.set(node.id, { element: group, node });
    });

  mapRoot.append(haloLayer, routeLayer, nodeLayer, labelLayer);
  renderRegionControls();
  updateMapStyles();
};

const renderCitationNetwork = (mapData) => {
  if (!citationNetworkRoot || !mapData?.network?.nodes?.length) {
    return;
  }

  citationNetworkRoot.innerHTML = "";
  const nodes = mapData.network.nodes.slice(0, 34);
  const nodeById = new Map();
  const edgeLayer = createSvgNode("g");
  const nodeLayer = createSvgNode("g");
  const labelLayer = createSvgNode("g");
  const nodeElements = new Map();
  const edgeElements = [];
  const cx = 360;
  const cy = 360;
  const radius = 255;

  const describeNode = (node) => {
    updateCitationNetworkDetail({
      kicker: pageLang === "zh" ? "引用地区节点" : "Citation Region",
      title: `${nodeLabel(node)} · ${new Intl.NumberFormat("en-US").format(node.citations)} ${pageLang === "zh" ? "篇引用作品" : "citing works"}`,
      body: pageLang === "zh"
        ? "该节点代表引用作品作者机构所在国家/地区。"
        : "This node represents author-institution geography in citing works.",
    });
  };

  const describeEdge = (edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) {
      return;
    }
    updateCitationNetworkDetail({
      kicker: pageLang === "zh" ? "跨地区引用共现" : "Cross-Region Link",
      title: `${nodeLabel(source)} ↔ ${nodeLabel(target)}`,
      body: pageLang === "zh"
        ? `${edge.weight} 篇引用作品同时连接这两个地区。`
        : `${edge.weight} citing works connect these regions.`,
    });
  };

  const setActiveCitation = (nodeId, edgeRef) => {
    nodeElements.forEach(({ circle }, id) => {
      circle.classList.toggle("is-active", id === nodeId || edgeRef?.source === id || edgeRef?.target === id);
    });
    edgeElements.forEach(({ path, edge }) => {
      const active = edgeRef
        ? edge === edgeRef
        : edge.source === nodeId || edge.target === nodeId;
      path.classList.toggle("is-active", active);
      path.classList.toggle("is-muted", !active);
    });
  };

  nodes.forEach((node, index) => {
    const angle = -Math.PI / 2 + (index / nodes.length) * Math.PI * 2;
    const plotted = {
      ...node,
      px: cx + Math.cos(angle) * radius,
      py: cy + Math.sin(angle) * radius,
      angle,
    };
    nodeById.set(node.id, plotted);
  });

  (mapData.network.edges || []).slice(0, 90).forEach((edge, index) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) {
      return;
    }
    const path = createSvgNode("path", {
      d: `M ${source.px} ${source.py} Q ${cx} ${cy} ${target.px} ${target.py}`,
      class: `citation-ring-edge ${index < 24 ? "is-strong" : ""}`.trim(),
      "stroke-width": Math.min(4.5, 0.6 + Math.sqrt(edge.weight) * 0.36),
    });
    path.addEventListener("mouseenter", () => {
      setActiveCitation(null, edge);
      describeEdge(edge);
    });
    path.addEventListener("click", () => {
      setActiveCitation(null, edge);
      describeEdge(edge);
    });
    edgeLayer.appendChild(path);
    edgeElements.push({ path, edge });
  });

  nodes.forEach((node) => {
    const plotted = nodeById.get(node.id) || node;
    const group = createSvgNode("g", { transform: `translate(${plotted.px} ${plotted.py})` });
    const circle = createSvgNode("circle", {
      cx: 0,
      cy: 0,
      r: Math.max(5, Math.min(15, 4 + Math.sqrt(plotted.citations || node.citations || 0))),
      class: "citation-ring-node",
    });
    group.appendChild(circle);
    const label = createSvgNode("text", {
      x: Math.cos(plotted.angle || 0) * 28,
      y: Math.sin(plotted.angle || 0) * 28 + 4,
      class: "citation-ring-label",
    });
    label.textContent = node.label;
    group.appendChild(label);
    group.addEventListener("mouseenter", () => {
      setActiveCitation(node.id);
      describeNode(node);
    });
    group.addEventListener("click", () => {
      setActiveCitation(node.id);
      describeNode(node);
    });
    nodeLayer.appendChild(group);
    nodeElements.set(node.id, { circle, node: plotted });
  });

  const core = createSvgNode("circle", {
    cx,
    cy,
    r: 44,
    fill: "rgba(225, 194, 133, 0.1)",
    stroke: "rgba(225, 194, 133, 0.58)",
    "stroke-width": 2,
  });
  const coreText = createSvgNode("text", {
    x: cx,
    y: cy + 5,
    class: "citation-ring-label",
  });
  coreText.textContent = pageLang === "zh" ? "引用网络" : "Citations";
  citationNetworkRoot.append(edgeLayer, core, coreText, nodeLayer, labelLayer);
  const defaultCitationId = nodeById.has("us") ? "us" : nodes[0].id;
  describeNode(nodeById.get(defaultCitationId) || nodes[0]);
  setActiveCitation(defaultCitationId);
};

const renderPapers = (paperData) => {
  if (!papersRoot) {
    return;
  }

  const appendHighlightedAuthorText = (element, text) => {
    const pattern = /Hengyue Xu[†*]*/g;
    let lastIndex = 0;
    let match = pattern.exec(text);

    while (match) {
      if (match.index > lastIndex) {
        element.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const strong = document.createElement("strong");
      strong.textContent = match[0];
      element.appendChild(strong);
      lastIndex = pattern.lastIndex;
      match = pattern.exec(text);
    }

    if (lastIndex < text.length) {
      element.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  };

  papersRoot.innerHTML = "";
  paperData.forEach((paper) => {
    const card = document.createElement("article");
    card.className = "paper-card";

    const cover = document.createElement("div");
    cover.className = "paper-cover";

    if (paper.image) {
      const image = document.createElement("img");
      image.src = paper.image;
      image.alt = `${paper.title} cover`;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        cover.style.background = paper.fallback;
        const label = document.createElement("span");
        label.className = "paper-fallback-label";
        label.textContent = paper.badge;
        cover.appendChild(label);
      });
      cover.appendChild(image);
    } else {
      cover.style.background = paper.fallback;
      const label = document.createElement("span");
      label.className = "paper-fallback-label";
      label.textContent = paper.badge;
      cover.appendChild(label);
    }

    const tag = document.createElement("span");
    tag.className = "paper-tag";
    tag.textContent = `${paper.journal}, ${paper.year}`;

    const title = document.createElement("h3");
    title.textContent = paper.title;

    const meta = document.createElement("p");
    meta.className = "paper-meta";
    appendHighlightedAuthorText(meta, paper.authors);

    const contributionText = pageLang === "zh" ? paper.contributionZh : paper.contributionEn;
    const contribution = document.createElement("p");
    contribution.className = "paper-contribution";
    contribution.textContent = contributionText;

    const summary = document.createElement("p");
    summary.textContent = pageLang === "zh" ? paper.summaryZh : paper.summaryEn;

    const links = document.createElement("div");
    links.className = "paper-links";

    [
      { href: paper.doi, label: "DOI" },
      { href: paper.url, label: pageLang === "zh" ? "论文页" : "Paper" },
    ]
      .filter((item) => item.href)
      .forEach((item) => {
        const link = document.createElement("a");
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = item.label;
        links.appendChild(link);
      });

    card.append(cover, tag, title, meta);
    if (contributionText) {
      card.appendChild(contribution);
    }
    card.append(summary, links);
    papersRoot.appendChild(card);
  });
};

const renderNews = (items) => {
  if (!newsRoot) {
    return;
  }

  newsRoot.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = `news-card ${item.featured ? "featured" : ""}`.trim();

    const imageWrap = document.createElement("div");
    imageWrap.className = "news-image";
    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = pageLang === "zh" ? item.titleZh : item.titleEn;
      image.loading = "lazy";
      imageWrap.appendChild(image);
    }

    const body = document.createElement("div");
    body.className = "news-body";

    const date = document.createElement("p");
    date.className = "news-date";
    date.textContent = `${item.date} · ${pageLang === "zh" ? item.tagZh : item.tagEn}`;

    const title = document.createElement("h3");
    title.textContent = pageLang === "zh" ? item.titleZh : item.titleEn;

    const summary = document.createElement("p");
    summary.textContent = pageLang === "zh" ? item.summaryZh : item.summaryEn;

    body.append(date, title, summary);
    if (item.url) {
      const links = document.createElement("div");
      links.className = "paper-links";
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = pageLang === "zh" ? "查看" : "View";
      links.appendChild(link);
      body.appendChild(links);
    }

    card.append(imageWrap, body);
    newsRoot.appendChild(card);
  });
};

Promise.allSettled([
  fetch(`./data/world-land-paths.json?v=${dataVersion}`).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load world land paths.");
    }
    return response.json();
  }),
  fetch(`./data/citation-map.json?v=${dataVersion}`).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load citation map data.");
    }
    return response.json();
  }),
  fetch(`./data/papers.json?v=${dataVersion}`).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load paper metadata.");
    }
    return response.json();
  }),
  fetch(`./data/news.json?v=${dataVersion}`).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load news metadata.");
    }
    return response.json();
  }),
  fetch(`./data/collaboration-network.json?v=${dataVersion}`).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load collaboration network data.");
    }
    return response.json();
  }),
]).then(([worldResult, mapResult, paperResult, newsResult, collaborationResult]) => {
  if (worldResult.status === "fulfilled") {
    worldLandData = worldResult.value;
  }
  renderImpactMap(mapResult.status === "fulfilled" ? mapResult.value : defaultMapData);
  if (mapResult.status === "fulfilled") {
    renderCitationNetwork(mapResult.value);
  }
  renderPapers(paperResult.status === "fulfilled" ? paperResult.value : defaultPapers);
  if (newsResult.status === "fulfilled") {
    renderNews(newsResult.value);
  }
  if (collaborationResult.status === "fulfilled") {
    renderCollaborationMap(collaborationResult.value);
    renderCollaborationNetwork(collaborationResult.value);
  }
});

if (mapStage) {
  mapStage.addEventListener("mouseleave", () => {
    mapState.hoverNodeId = null;
    hideTooltip();
    updateMapStyles();
  });
}

if (sections.length > 0 && navLinks.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}
