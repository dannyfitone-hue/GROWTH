export const auditSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['executive_summary','brand','strengths','priority_findings','competitors','seo','local_search','reputation','website_conversion','paid_search','service_opportunities','ninety_day_plan','sources'],
  properties: {
    executive_summary: { type: 'string' },
    brand: {
      type: 'object', additionalProperties: false,
      required: ['positioning','primary_color','accent_color','portal_headline'],
      properties: {
        positioning: { type: 'string' }, primary_color: { type: 'string' }, accent_color: { type: 'string' }, portal_headline: { type: 'string' }
      }
    },
    strengths: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title','detail','evidence'], properties: { title:{type:'string'}, detail:{type:'string'}, evidence:{type:'string'} } } },
    priority_findings: { type:'array', items:{ type:'object', additionalProperties:false, required:['severity','area','finding','why_it_matters','recommended_action','evidence'], properties:{ severity:{type:'string',enum:['critical','high','medium','low']}, area:{type:'string'}, finding:{type:'string'}, why_it_matters:{type:'string'}, recommended_action:{type:'string'}, evidence:{type:'string'} } } },
    competitors: { type:'array', items:{ type:'object', additionalProperties:false, required:['name','market','rating','reviews','strength','gap'], properties:{ name:{type:'string'}, market:{type:'string'}, rating:{type:['number','null']}, reviews:{type:['integer','null']}, strength:{type:'string'}, gap:{type:'string'} } } },
    seo: { type:'object', additionalProperties:false, required:['summary','issues','opportunities'], properties:{ summary:{type:'string'}, issues:{type:'array',items:{type:'string'}}, opportunities:{type:'array',items:{type:'string'}} } },
    local_search: { type:'object', additionalProperties:false, required:['summary','issues','opportunities'], properties:{ summary:{type:'string'}, issues:{type:'array',items:{type:'string'}}, opportunities:{type:'array',items:{type:'string'}} } },
    reputation: { type:'object', additionalProperties:false, required:['summary','rating','review_count','issues','opportunities'], properties:{ summary:{type:'string'}, rating:{type:['number','null']}, review_count:{type:['integer','null']}, issues:{type:'array',items:{type:'string'}}, opportunities:{type:'array',items:{type:'string'}} } },
    website_conversion: { type:'object', additionalProperties:false, required:['summary','issues','opportunities'], properties:{ summary:{type:'string'}, issues:{type:'array',items:{type:'string'}}, opportunities:{type:'array',items:{type:'string'}} } },
    paid_search: { type:'object', additionalProperties:false, required:['summary','recommended_campaigns','waste_controls'], properties:{ summary:{type:'string'}, recommended_campaigns:{type:'array',items:{type:'string'}}, waste_controls:{type:'array',items:{type:'string'}} } },
    service_opportunities: { type:'array', items:{type:'object', additionalProperties:false, required:['service','priority','reason','search_intent'], properties:{service:{type:'string'},priority:{type:'string',enum:['high','medium','low']},reason:{type:'string'},search_intent:{type:'string'}}} },
    ninety_day_plan: { type:'array', items:{type:'object', additionalProperties:false, required:['phase','days','objective','actions','expected_effect','kpis'], properties:{phase:{type:'string'},days:{type:'string'},objective:{type:'string'},actions:{type:'array',items:{type:'string'}},expected_effect:{type:'string'},kpis:{type:'array',items:{type:'string'}}} } },
    sources: { type:'array', items:{type:'object',additionalProperties:false,required:['title','url','used_for'],properties:{title:{type:'string'},url:{type:'string'},used_for:{type:'string'}}} }
  }
} as const;
