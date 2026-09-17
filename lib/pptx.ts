import PptxGenJS from 'pptxgenjs';
import { getCompanyLogoData } from './report-brand';

const C = { navy:'071827', navy2:'0E2A42', blue:'1D9AD6', cyan:'36C6DB', gold:'D6A33A', green:'34B37A', white:'FFFFFF', light:'EEF4F8', text:'152638', muted:'708399', red:'DF5A5A' };

function safeHex(v?: string, fallback='1D9AD6') {
  const x = (v || '').replace('#','').toUpperCase();
  return /^[0-9A-F]{6}$/.test(x) ? x : fallback;
}
function baseDeck(title: string, client: any, data: any) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Growth Intelligence LLC';
  pptx.subject = title;
  pptx.title = `${client.business_name} — ${title}`;
  pptx.company = 'Growth Intelligence LLC';
  pptx.theme = { headFontFace:'Aptos Display', bodyFontFace:'Aptos', lang:'en-US' } as any;
  (pptx as any)._clientAccent = safeHex(data?.brand?.accent_color, C.blue);
  return pptx;
}
function addTop(slide:any, title:string, sub?:string, accent=C.blue) {
  slide.background = { color:C.navy };
  slide.addShape('rect',{x:0,y:0,w:13.333,h:.08,fill:{color:accent},line:{color:accent}});
  slide.addText(title,{x:.65,y:.4,w:12,h:.5,fontFace:'Aptos Display',fontSize:25,bold:true,color:C.white,margin:0});
  if(sub) slide.addText(sub,{x:.67,y:1.0,w:11.9,h:.35,fontSize:10.5,color:'B8CBDA',margin:0});
}
function footer(slide:any, n:number) {
  slide.addText(`GROWTH INTELLIGENCE LLC  •  BUSINESS GROWTH INTELLIGENCE     ${n}`,{x:.65,y:7.12,w:10.4,h:.18,fontSize:6.5,color:'6E879B',margin:0});
  slide.addImage({data:getCompanyLogoData(),x:11.48,y:6.52,w:1.2,h:.8,altText:'Growth Intelligence LLC'});
}
function card(slide:any,x:number,y:number,w:number,h:number,title:string,body:string,accent:string) {
  slide.addShape('roundRect',{x,y,w,h,rectRadius:.08,fill:{color:'FFFFFF',transparency:2},line:{color:'D5E1E9',transparency:20}});
  slide.addShape('rect',{x,y,w:.07,h,fill:{color:accent},line:{color:accent}});
  slide.addText(title,{x:x+.22,y:y+.18,w:w-.42,h:.35,fontSize:12.5,bold:true,color:C.text,margin:0});
  slide.addText(body,{x:x+.22,y:y+.68,w:w-.42,h:h-.82,fontSize:9.5,color:'536778',breakLine:false,margin:0.02,fit:'shrink'} as any);
}
function bullets(items:string[]) { return items.slice(0,6).map(x=>`• ${x}`).join('\n'); }

export async function buildAuditPptx(client:any, data:any) {
  const pptx=baseDeck('Digital Growth Intelligence Audit',client,data); const accent=safeHex(data?.brand?.accent_color,C.blue); let n=1;
  let s=pptx.addSlide(); s.background={color:C.navy};
  s.addShape('rect',{x:0,y:0,w:13.333,h:7.5,fill:{color:C.navy},line:{color:C.navy}});
  s.addShape('arc',{x:8.4,y:-1.0,w:5.5,h:5.5,adjustPoint:.35,rotate:25,fill:{color:accent,transparency:25},line:{color:accent,transparency:100}} as any);
  s.addText('PRIVATE DIGITAL GROWTH INTELLIGENCE',{x:.7,y:.75,w:5.8,h:.25,fontSize:9,bold:true,charSpacing:1.5,color:accent,margin:0});
  s.addText(`${client.business_name}\nDigital Growth Intelligence Audit`,{x:.7,y:1.45,w:7.1,h:1.55,fontSize:31,bold:true,color:C.white,margin:0,breakLine:false,fit:'shrink'} as any);
  s.addText(data.executive_summary,{x:.72,y:3.35,w:6.6,h:1.5,fontSize:13,color:'BFD0DD',margin:0.01,fit:'shrink'} as any);
  s.addText('Prepared exclusively by Growth Intelligence LLC',{x:.72,y:6.45,w:6.6,h:.3,fontSize:10,color:C.gold,margin:0}); footer(s,n++);

  s=pptx.addSlide(); addTop(s,'Executive Intelligence Summary','What public evidence suggests is working, weak, and most important to fix first.',accent);
  card(s,.65,1.55,5.95,4.85,'CURRENT POSITION',data.executive_summary,accent);
  card(s,6.82,1.55,5.85,2.28,'WHAT IS WORKING',bullets((data.strengths||[]).map((x:any)=>`${x.title}: ${x.detail}`)),C.green);
  card(s,6.82,4.02,5.85,2.38,'TOP PRIORITIES',bullets((data.priority_findings||[]).slice(0,5).map((x:any)=>`${x.area}: ${x.finding}`)),C.gold); footer(s,n++);

  s=pptx.addSlide(); addTop(s,'Priority Findings','The highest-impact issues and why they matter.',accent);
  (data.priority_findings||[]).slice(0,6).forEach((f:any,i:number)=>card(s,.65+(i%2)*6.1,1.5+Math.floor(i/2)*1.75,5.8,1.48,`${String(f.severity).toUpperCase()} • ${f.area}`,`${f.finding}\n\nAction: ${f.recommended_action}`,f.severity==='critical'?C.red:f.severity==='high'?C.gold:accent)); footer(s,n++);

  s=pptx.addSlide(); addTop(s,'Google Local & Reputation Position','Review strength, local trust and visibility opportunity.',accent);
  card(s,.65,1.55,5.8,2.15,'REPUTATION SNAPSHOT',`${data.reputation?.summary||''}\n\nPublic rating: ${data.reputation?.rating ?? 'Not verified'}\nPublic review count: ${data.reputation?.review_count ?? 'Not verified'}`,C.gold);
  card(s,.65,3.95,5.8,2.25,'LOCAL SEARCH',`${data.local_search?.summary||''}\n\n${bullets(data.local_search?.opportunities||[])}`,accent);
  const comps=(data.competitors||[]).slice(0,6);
  if(comps.length){ const cd:any={}; cd.name='Reviews'; cd.labels=comps.map((x:any)=>x.name); cd.values=comps.map((x:any)=>x.reviews||0); s.addChart(pptx.ChartType.bar,[cd],{x:6.75,y:1.65,w:5.7,h:4.6,catAxisLabelFontSize:8,valAxisLabelFontSize:8,showLegend:false,showTitle:true,title:'Public review volume — sampled competitors',chartColors:[accent],showValue:true,dataLabelPosition:'outEnd',showCatName:false,showValAxisTitle:false,showCatAxisTitle:false} as any); }
  footer(s,n++);

  s=pptx.addSlide(); addTop(s,'SEO & Website Conversion','How search relevance and the on-site conversion path can improve.',accent);
  card(s,.65,1.55,5.8,2.2,'SEO',`${data.seo?.summary||''}\n\nIssues\n${bullets(data.seo?.issues||[])}`,accent);
  card(s,.65,3.98,5.8,2.25,'SEO OPPORTUNITIES',bullets(data.seo?.opportunities||[]),C.green);
  card(s,6.72,1.55,5.95,2.2,'CONVERSION',`${data.website_conversion?.summary||''}\n\nIssues\n${bullets(data.website_conversion?.issues||[])}`,C.gold);
  card(s,6.72,3.98,5.95,2.25,'CONVERSION OPPORTUNITIES',bullets(data.website_conversion?.opportunities||[]),C.green); footer(s,n++);

  s=pptx.addSlide(); addTop(s,'Paid Search Opportunity','How paid demand should be structured around high-intent services and waste control.',accent);
  card(s,.65,1.55,5.9,4.85,'GOOGLE ADS DIRECTION',`${data.paid_search?.summary||''}\n\nRecommended campaign groups\n${bullets(data.paid_search?.recommended_campaigns||[])}`,accent);
  card(s,6.82,1.55,5.85,4.85,'WASTE CONTROL',`Search-term discipline and measurement matter as much as bidding.\n\n${bullets(data.paid_search?.waste_controls||[])}`,C.gold); footer(s,n++);

  s=pptx.addSlide(); addTop(s,'Priority Service Opportunities','Where search intent appears most strategically valuable based on public evidence.',accent);
  (data.service_opportunities||[]).slice(0,8).forEach((x:any,i:number)=>card(s,.65+(i%2)*6.1,1.5+Math.floor(i/2)*1.28,5.8,1.05,`${x.priority.toUpperCase()} • ${x.service}`,`${x.reason}\nSearch intent: ${x.search_intent}`,x.priority==='high'?C.green:x.priority==='medium'?C.gold:accent)); footer(s,n++);

  s=pptx.addSlide(); addTop(s,'90-Day Treatment Logic','The roadmap is caused by the audit findings — not a generic SEO checklist.',accent);
  (data.ninety_day_plan||[]).slice(0,4).forEach((p:any,i:number)=>card(s,.65+i*3.08,1.6,2.78,4.75,`${p.days}\n${p.phase}`,`${p.objective}\n\nActions\n${bullets(p.actions||[])}\n\nExpected effect\n${p.expected_effect}`, [accent,C.cyan,C.gold,C.green][i])); footer(s,n++);

  s=pptx.addSlide(); addTop(s,'Evidence & Sources','Key public sources used to support the audit. Internal account data will deepen the analysis after onboarding.',accent);
  const src=(data.sources||[]).slice(0,12); src.forEach((x:any,i:number)=>{ const y=1.45+i*.43; s.addText(`${i+1}. ${x.title}`,{x:.7,y,w:4.3,h:.22,fontSize:8.5,bold:true,color:C.white,margin:0}); s.addText(x.url,{x:4.9,y,w:4.35,h:.22,fontSize:7.5,color:'9ECBE5',margin:0,hyperlink:{url:x.url}} as any); s.addText(x.used_for,{x:9.35,y,w:3.2,h:.22,fontSize:7.5,color:'B8C9D5',margin:0,fit:'shrink'} as any); }); footer(s,n++);
  return Buffer.from(await pptx.write({ outputType:'arraybuffer' }) as ArrayBuffer);
}

export async function buildRoadmapPptx(client:any, data:any) {
  const pptx=baseDeck('90-Day Execution & Results Roadmap',client,data); const accent=safeHex(data?.brand?.accent_color,C.blue); let n=1;
  let s=pptx.addSlide(); s.background={color:C.navy};
  s.addText('90-DAY EXECUTION ROADMAP',{x:.7,y:.8,w:5.8,h:.28,fontSize:9,bold:true,charSpacing:1.5,color:accent,margin:0});
  s.addText(`${client.business_name}\nFrom Findings → Treatment → Measured Improvement`,{x:.7,y:1.55,w:8.2,h:1.45,fontSize:29,bold:true,color:C.white,margin:0,fit:'shrink'} as any);
  s.addText('Every phase below is tied to issues identified in the business audit. The goal is not “more marketing activity.” The goal is a measurable system that improves visibility, qualified lead capture and budget efficiency.',{x:.72,y:3.4,w:7.3,h:1.2,fontSize:13,color:'BFD0DD',margin:0,fit:'shrink'} as any); footer(s,n++);
  s=pptx.addSlide(); addTop(s,'Cause → Action → Result','The operating logic behind the 90-day program.',accent);
  const phases=data.ninety_day_plan||[]; phases.slice(0,4).forEach((p:any,i:number)=>card(s,.65+i*3.08,1.7,2.78,4.6,`${p.days}\n${p.phase}`,`${p.objective}\n\nWHY\n${p.expected_effect}\n\nKPIs\n${bullets(p.kpis||[])}`,[accent,C.cyan,C.gold,C.green][i])); footer(s,n++);
  phases.slice(0,6).forEach((p:any,i:number)=>{ s=pptx.addSlide(); addTop(s,`${p.days} | ${p.phase}`,p.objective,accent); card(s,.7,1.55,5.8,4.9,'WHAT WE WILL DO',bullets(p.actions||[]),accent); card(s,6.82,1.55,5.8,2.2,'WHY THIS SHOULD IMPROVE RESULTS',p.expected_effect,C.green); card(s,6.82,4.0,5.8,2.45,'HOW WE WILL MEASURE IT',bullets(p.kpis||[]),C.gold); footer(s,n++); });
  s=pptx.addSlide(); addTop(s,'Day 90: What Should Be Different','A stronger, measurable operating system — not a promise of a particular Google rank.',accent);
  const outcomes=['Cleaner and more complete Google/local signals','Search architecture tied to priority services and markets','Better conversion paths from search to call or form','Paid campaigns segmented by service and lead quality','A repeatable review/reputation workflow','A next-quarter plan based on actual evidence and economics']; outcomes.forEach((x,i)=>card(s,.7+(i%3)*4.15,1.7+Math.floor(i/3)*2.15,3.75,1.7,`OUTCOME ${i+1}`,x,[accent,C.cyan,C.gold,C.green,accent,C.cyan][i])); footer(s,n++);
  return Buffer.from(await pptx.write({ outputType:'arraybuffer' }) as ArrayBuffer);
}
