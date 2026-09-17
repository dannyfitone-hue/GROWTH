import OpenAI from 'openai';
import { auditSchema } from './analysis-schema';

export function openaiClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not configured.');
  return new OpenAI({ apiKey: key });
}

export function modelName() { return process.env.OPENAI_MODEL || 'gpt-5.2'; }

export function buildAuditPrompt(client: any, website: any) {
  return `You are the senior business growth intelligence engine for Growth Intelligence LLC.

CLIENT
Business: ${client.business_name}
Website: ${client.website || 'not supplied'}
Industry: ${client.industry || 'local service business'}
Location/address: ${client.address || 'not supplied'}
Client-provided start date: ${client.start_date || 'not supplied'}
Website metadata discovered by our system: ${JSON.stringify(website)}

MISSION
Perform a deep, evidence-based pre-consultation audit comparable to a senior SEO/local-search/Google Ads agency audit. Use web search extensively. Research the exact business, its website, service pages, public review/reputation footprint, important directories/citations, local competitors, public Google/local signals that can be verified, SEO structure, conversion quality, and paid-search opportunity.

RESEARCH EXPECTATIONS
- Search the business name, domain, branded queries, service + city queries, review platforms, directory listings, and competitors.
- Find concrete strengths AND weaknesses. Do not manufacture problems to make the report look dramatic.
- For competitor review/rating numbers, only provide numbers that are supported by a source you actually found. Use null when unavailable.
- Distinguish public evidence from recommendations.
- Note uncertainty when a Google Business Profile or ad account cannot be directly inspected from public data.
- Look for inconsistent business name/phone/address/domain references, thin or overlapping location/service pages, missing conversion elements, weak trust proof, and opportunities around high-intent services.
- Recommendations must focus on qualified lead generation, not vanity traffic.
- Do not promise rankings, lead counts, or revenue.
- Include the URLs of the most useful sources you relied on.

OUTPUT
Return a detailed structured audit using the required JSON schema. The ninety_day_plan must be CAUSED BY the findings: each phase should address concrete issues found in this audit and explain the expected effect and KPIs. Keep language client-facing and professional.`;
}

export async function startAudit(client: any, website: any) {
  const openai = openaiClient();
  return await openai.responses.create({
    model: modelName(),
    background: true,
    tools: [{ type: 'web_search_preview' }],
    include: ['web_search_call.action.sources'],
    reasoning: { effort: 'high' },
    text: {
      verbosity: 'medium',
      format: {
        type: 'json_schema',
        name: 'business_growth_audit',
        strict: true,
        schema: auditSchema as any
      }
    },
    input: buildAuditPrompt(client, website)
  } as any);
}
