// Long-form content for service pages, rendered by components/ServiceLongform.tsx.
// Each entry adds roughly 1,500 words of service-specific, question-led content.
import {coreA} from './longform/core-a';
import {coreB} from './longform/core-b';

export type Longform={
  why:string[];                       // 2-3 paragraphs: why this matters now
  audience:string[];                  // who it is for
  approach:[string,string][];         // how we approach it (6 steps)
  cost:string[];                      // what affects cost and timeline
  measure:{intro:string;metrics:string[]};
  local:string[];                     // Pakistan / USA notes (2 paragraphs)
  mistakes:string[];                  // common mistakes
  faq:[string,string][];              // extra questions (merged into the page FAQ)
};

export const serviceLongform:Record<string,Longform>={...coreA,...coreB};
